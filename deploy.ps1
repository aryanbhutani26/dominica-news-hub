# Dominica News CMS Deployment Script (PowerShell)
# This script handles the deployment of both frontend and backend

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("deploy", "backup", "health", "logs", "stop", "cleanup", "help")]
    [string]$Command
)

# Configuration
$DockerComposeFile = "docker-compose.yml"
$EnvFile = ".env"
$BackupDir = "backups"

# Functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker and Docker Compose are installed
function Test-Dependencies {
    Write-Info "Checking dependencies..."
    
    try {
        docker --version | Out-Null
    } catch {
        Write-Error "Docker is not installed or not in PATH. Please install Docker Desktop."
        exit 1
    }
    
    try {
        docker-compose --version | Out-Null
    } catch {
        Write-Error "Docker Compose is not installed or not in PATH."
        exit 1
    }
    
    Write-Success "Dependencies check passed"
}

# Check if environment file exists
function Test-Environment {
    Write-Info "Checking environment configuration..."
    
    if (-not (Test-Path $EnvFile)) {
        if (Test-Path ".env.docker") {
            Write-Warning "No .env file found. Copying from .env.docker template..."
            Copy-Item ".env.docker" $EnvFile
            Write-Warning "Please update the .env file with your production values before continuing."
            exit 1
        } else {
            Write-Error "No environment file found. Please create .env file with required variables."
            exit 1
        }
    }
    
    Write-Success "Environment configuration found"
}

# Create backup directory
function New-BackupDirectory {
    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir | Out-Null
        Write-Info "Created backup directory: $BackupDir"
    }
}

# Backup database
function Backup-Database {
    Write-Info "Creating database backup..."
    
    # Create timestamp for backup
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BackupFile = "$BackupDir/mongodb_backup_$Timestamp.tar.gz"
    
    # Check if MongoDB container is running
    $MongoStatus = docker-compose ps mongodb
    if ($MongoStatus -match "Up") {
        docker-compose exec -T mongodb mongodump --archive --gzip > $BackupFile
        Write-Success "Database backup created: $BackupFile"
    } else {
        Write-Warning "MongoDB container is not running. Skipping backup."
    }
}

# Build and deploy
function Start-Deployment {
    Write-Info "Starting deployment..."
    
    # Pull latest images and build
    Write-Info "Building Docker images..."
    docker-compose build --no-cache
    
    # Stop existing containers
    Write-Info "Stopping existing containers..."
    docker-compose down
    
    # Start services
    Write-Info "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    Write-Info "Waiting for services to be ready..."
    Start-Sleep -Seconds 30
    
    # Check health
    Test-ServiceHealth
}

# Check service health
function Test-ServiceHealth {
    Write-Info "Checking service health..."
    
    # Check backend health
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10
        if ($Response.StatusCode -eq 200) {
            Write-Success "Backend is healthy"
        } else {
            throw "Backend returned status code: $($Response.StatusCode)"
        }
    } catch {
        Write-Error "Backend health check failed: $($_.Exception.Message)"
        docker-compose logs backend
        exit 1
    }
    
    # Check frontend
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
        if ($Response.StatusCode -eq 200) {
            Write-Success "Frontend is accessible"
        } else {
            throw "Frontend returned status code: $($Response.StatusCode)"
        }
    } catch {
        Write-Error "Frontend accessibility check failed: $($_.Exception.Message)"
        docker-compose logs frontend
        exit 1
    }
    
    Write-Success "All services are healthy"
}

# Show logs
function Show-Logs {
    Write-Info "Showing service logs..."
    docker-compose logs -f
}

# Stop services
function Stop-Services {
    Write-Info "Stopping services..."
    docker-compose down
    Write-Success "Services stopped"
}

# Clean up old images and containers
function Start-Cleanup {
    Write-Info "Cleaning up old Docker images and containers..."
    docker system prune -f
    Write-Success "Cleanup completed"
}

# Show usage
function Show-Usage {
    Write-Host "Usage: .\deploy.ps1 -Command <command>"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  deploy   - Deploy the application (build and start services)"
    Write-Host "  backup   - Create database backup"
    Write-Host "  health   - Check service health"
    Write-Host "  logs     - Show service logs"
    Write-Host "  stop     - Stop all services"
    Write-Host "  cleanup  - Clean up old Docker images and containers"
    Write-Host "  help     - Show this help message"
}

# Main script logic
switch ($Command) {
    "deploy" {
        Test-Dependencies
        Test-Environment
        New-BackupDirectory
        Backup-Database
        Start-Deployment
        Write-Success "Deployment completed successfully!"
    }
    "backup" {
        New-BackupDirectory
        Backup-Database
    }
    "health" {
        Test-ServiceHealth
    }
    "logs" {
        Show-Logs
    }
    "stop" {
        Stop-Services
    }
    "cleanup" {
        Start-Cleanup
    }
    "help" {
        Show-Usage
    }
    default {
        Show-Usage
        exit 1
    }
}