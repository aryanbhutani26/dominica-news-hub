#!/bin/bash

# Dominica News CMS Deployment Script
# This script handles the deployment of both frontend and backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"
BACKUP_DIR="backups"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Check if environment file exists
check_environment() {
    log_info "Checking environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f ".env.docker" ]; then
            log_warning "No .env file found. Copying from .env.docker template..."
            cp .env.docker .env
            log_warning "Please update the .env file with your production values before continuing."
            exit 1
        else
            log_error "No environment file found. Please create .env file with required variables."
            exit 1
        fi
    fi
    
    log_success "Environment configuration found"
}

# Create backup directory
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

# Backup database
backup_database() {
    log_info "Creating database backup..."
    
    # Create timestamp for backup
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$TIMESTAMP.tar.gz"
    
    # Check if MongoDB container is running
    if docker-compose ps mongodb | grep -q "Up"; then
        docker-compose exec -T mongodb mongodump --archive --gzip > "$BACKUP_FILE"
        log_success "Database backup created: $BACKUP_FILE"
    else
        log_warning "MongoDB container is not running. Skipping backup."
    fi
}

# Build and deploy
deploy() {
    log_info "Starting deployment..."
    
    # Pull latest images and build
    log_info "Building Docker images..."
    docker-compose build --no-cache
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose down
    
    # Start services
    log_info "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check health
    check_health
}

# Check service health
check_health() {
    log_info "Checking service health..."
    
    # Check backend health
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        docker-compose logs backend
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend is accessible"
    else
        log_error "Frontend accessibility check failed"
        docker-compose logs frontend
        exit 1
    fi
    
    log_success "All services are healthy"
}

# Show logs
show_logs() {
    log_info "Showing service logs..."
    docker-compose logs -f
}

# Stop services
stop_services() {
    log_info "Stopping services..."
    docker-compose down
    log_success "Services stopped"
}

# Clean up old images and containers
cleanup() {
    log_info "Cleaning up old Docker images and containers..."
    docker system prune -f
    log_success "Cleanup completed"
}

# Show usage
usage() {
    echo "Usage: $0 {deploy|backup|health|logs|stop|cleanup|help}"
    echo ""
    echo "Commands:"
    echo "  deploy   - Deploy the application (build and start services)"
    echo "  backup   - Create database backup"
    echo "  health   - Check service health"
    echo "  logs     - Show service logs"
    echo "  stop     - Stop all services"
    echo "  cleanup  - Clean up old Docker images and containers"
    echo "  help     - Show this help message"
}

# Main script logic
case "$1" in
    deploy)
        check_dependencies
        check_environment
        create_backup_dir
        backup_database
        deploy
        log_success "Deployment completed successfully!"
        ;;
    backup)
        create_backup_dir
        backup_database
        ;;
    health)
        check_health
        ;;
    logs)
        show_logs
        ;;
    stop)
        stop_services
        ;;
    cleanup)
        cleanup
        ;;
    help|*)
        usage
        exit 1
        ;;
esac