# Docker Setup Checklist

## Files Created

### Root Level (pdms/)
- ✅ `docker-compose.yml` - Orchestrates all three services (backend, frontend, MongoDB)
- ✅ `.env.example` - Template for environment variables
- ✅ `README-DOCKER.md` - Comprehensive Docker documentation
- ✅ `start-docker.sh` - Quick start script for Linux/macOS
- ✅ `start-docker.bat` - Quick start script for Windows

### Backend (pdms/backend/)
- ✅ `Dockerfile` - Multi-stage build for Node.js application
- ✅ `.dockerignore` - Files to exclude from Docker image
- ✅ `.env.example` - Backend environment variables template

### Frontend (pdms/frontend/)
- ✅ `Dockerfile` - Multi-stage build using Nginx for production
- ✅ `.dockerignore` - Files to exclude from Docker image
- ✅ `nginx.conf` - Nginx configuration for serving React app and proxying API
- ✅ `.env.example` - Frontend environment variables template

## Pre-Deployment Steps

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env` in the `pdms/` directory
- [ ] Update JWT_SECRET with a secure random string
- [ ] Add your GitHub token and owner username (if needed)
- [ ] Add Vercel credentials (if using Vercel deployment)

### 2. System Requirements
- [ ] Docker installed (version 20.10+)
- [ ] Docker Compose installed (version 1.29+)
- [ ] At least 4GB RAM available for containers
- [ ] Ports 3000, 5000, 27017 are not in use

### 3. Optional Configuration
- [ ] Review `docker-compose.yml` for any custom port changes
- [ ] Review `pdms/backend/Dockerfile` if you need to add dependencies
- [ ] Review `pdms/frontend/nginx.conf` if you need to modify proxy settings

## Quick Start

### Option 1: Using Quick Start Scripts
```bash
# On Windows (from pdms folder)
start-docker.bat

# On Linux/macOS (from pdms folder)
chmod +x start-docker.sh
./start-docker.sh
```

### Option 2: Manual Docker Compose Commands
```bash
cd pdms

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

## Verification

- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend API responding at http://localhost:5000/api/health
- [ ] MongoDB running and accessible
- [ ] Check service health: `docker-compose ps`

## What Each Container Does

### Frontend Container (pdms-frontend)
- **Image**: Built from `pdms/frontend/Dockerfile`
- **Port**: 3000
- **Stack**: nginx:alpine + React/Vite app
- **Function**: Serves the web UI, proxies API calls to backend

### Backend Container (pdms-backend)
- **Image**: Built from `pdms/backend/Dockerfile`
- **Port**: 5000
- **Stack**: Node.js 18 + Express.js
- **Function**: REST API server, handles business logic
- **Dependencies**: MongoDB, environment variables

### MongoDB Container (pdms-mongodb)
- **Image**: mongo:7-alpine
- **Port**: 27017
- **Function**: Data persistence
- **Volumes**: mongodb_data, mongodb_config

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Port already in use | Change ports in `docker-compose.yml` |
| Container fails to start | Check logs: `docker-compose logs [service-name]` |
| MongoDB connection error | Ensure MongoDB is healthy: `docker-compose ps` |
| Frontend shows API errors | Check backend logs and ensure CORS is configured |
| Changes not applied | Rebuild: `docker-compose build --no-cache` |

## Next Steps After Setup

1. Access the application: http://localhost:3000
2. Create an admin account if needed
3. Configure GitHub integration for your account
4. Test deployment features
5. For production: See README-DOCKER.md section on "Production Deployment"

## Support Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- See `README-DOCKER.md` for detailed commands and troubleshooting

## Notes

- Data in MongoDB persists between container restarts
- To reset everything: `docker-compose down -v`
- Logs are viewable with: `docker-compose logs -f [service]`
- Backend and Frontend communicate via internal Docker network
- All health checks are configured and running
