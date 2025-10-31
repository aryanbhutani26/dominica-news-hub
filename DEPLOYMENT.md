# Dominica News CMS - Deployment Guide

## Docker Deployment (Recommended)

### Quick Start with Docker

1. **Prerequisites**:

   - Docker and Docker Compose installed
   - At least 2GB RAM available
   - Ports 3000, 5000, and 27017 available

2. **Setup Environment**:

   ```bash
   # Copy environment template
   cp .env.docker .env

   # Edit .env with your production values
   # Update JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.
   ```

3. **Deploy with Docker Compose**:

   ```bash
   # Linux/Mac
   ./deploy.sh deploy

   # Windows PowerShell
   .\deploy.ps1 -Command deploy
   ```

4. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

### Docker Commands

```bash
# Deploy application
./deploy.sh deploy

# Check service health
./deploy.sh health

# View logs
./deploy.sh logs

# Create database backup
./deploy.sh backup

# Stop services
./deploy.sh stop

# Clean up old images
./deploy.sh cleanup
```

### Docker Services

The Docker Compose setup includes:

- **MongoDB**: Database with automatic initialization
- **Backend API**: Node.js/Express API server
- **Frontend**: React application served by Nginx
- **Volumes**: Persistent storage for database and uploads

## Manual Deployment

### Backend Deployment

#### 1. Environment Setup

1. Copy the environment template:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Update the production environment variables:

   ```env
   # Database - Use MongoDB Atlas for production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dominica-news

   # JWT - Generate a strong secret
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   JWT_EXPIRES_IN=7d

   # Server
   PORT=5000
   NODE_ENV=production

   # CORS - Set to your frontend domain
   CORS_ORIGIN=https://yourdomain.com

   # Security
   BCRYPT_SALT_ROUNDS=12

   # Admin User
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=secure-admin-password
   ADMIN_NAME=Admin User
   ```

#### 2. Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your server's IP address
5. Get the connection string and update `MONGODB_URI`

#### 3. Build and Deploy

1. Install dependencies:

   ```bash
   cd backend
   npm install --production
   ```

2. Build the TypeScript code:

   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment

#### 1. Environment Setup

1. Copy the environment template:

   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Update the production environment variables:

   ```env
   # API Configuration
   VITE_API_URL=https://api.yourdomain.com/api

   # App Configuration
   VITE_APP_NAME=Dominica News
   VITE_SITE_URL=https://yourdomain.com

   # Feature Flags
   VITE_ENABLE_SEARCH=true
   VITE_ENABLE_SOCIAL_SHARING=true
   ```

#### 2. Build and Deploy

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Build for production:

   ```bash
   npm run build
   ```

3. The built files will be in the `dist` directory

## Security Checklist

- [ ] Use HTTPS for both frontend and backend
- [ ] Set strong JWT secret
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your domain
- [ ] Set up rate limiting
- [ ] Use strong admin password
- [ ] Keep dependencies updated
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules
- [ ] Regular database backups

## Monitoring and Maintenance

### Health Checks

The API includes comprehensive health check endpoints:

- `/api/health` - Full health status with database connectivity
- `/api/ready` - Readiness check for load balancers
- `/api/live` - Simple liveness check

### Logging

- Docker logs: `docker-compose logs [service]`
- Backend logs: Available through Docker or PM2
- Database logs: MongoDB Atlas dashboard

### Database Backups

For Docker deployment:

```bash
./deploy.sh backup
```

For MongoDB Atlas:

1. Enable automatic backups in Atlas dashboard
2. Set up backup retention policy
3. Test restore procedures

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `CORS_ORIGIN` environment variable
2. **Database Connection**: Verify MongoDB URI and network access
3. **JWT Errors**: Ensure JWT_SECRET is set and consistent
4. **File Upload Issues**: Check upload directory permissions
5. **Build Failures**: Clear node_modules and reinstall

### Health Check Commands

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend accessibility
curl http://localhost:3000

# Check Docker services
docker-compose ps
```

## Support

For deployment issues:

1. Check the logs first: `./deploy.sh logs` or `docker-compose logs`
2. Verify environment variables in `.env`
3. Test API endpoints manually: `curl http://localhost:5000/api/health`
4. Check Docker container status: `docker-compose ps`
5. Review security settings and firewall rules
