# Docker Setup Guide for PDMS

This guide provides instructions for running the PDMS (Product Deployment Management System) application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Git (for cloning the repository)

## Project Structure

```
pdms/
├── backend/              # Express.js API server
├── frontend/             # React + Vite application
├── docker-compose.yml    # Docker Compose configuration
├── .env.example         # Example environment variables
└── README-DOCKER.md     # This file
```

## Quick Start

### 1. Set Up Environment Variables

Copy the example environment file to create your `.env` file:

```bash
cd pdms
cp .env.example .env
```

Edit the `.env` file and add your configuration values:
- `JWT_SECRET`: A secure random string for JWT signing
- `GITHUB_TOKEN`: Your GitHub personal access token
- `GITHUB_OWNER`: Your GitHub username
- `VERCEL_TOKEN`: Your Vercel API token (if using Vercel)
- `VERCEL_TEAM_ID`: Your Vercel team ID (if using Vercel)

### 2. Build and Run Containers

```bash
# Navigate to the pdms directory
cd pdms

# Build and start all services
docker-compose up -d

# Or, to see logs in real-time
docker-compose up
```

This command will:
- Build the backend Docker image
- Build the frontend Docker image
- Start the MongoDB database
- Start the backend API server
- Start the frontend web application

### 3. Access the Application

Once all services are running:

- **Frontend**: Open your browser and navigate to `http://localhost:3000`
- **Backend API**: Available at `http://localhost:5000/api`
- **MongoDB**: Available at `mongodb://localhost:27017`

## Services

### Backend (Port 5000)
- Node.js/Express application
- Handles API requests
- Connects to MongoDB
- Environment: `production`

### Frontend (Port 3000)
- React + Vite application
- Served via Nginx
- Proxies API requests to backend
- Automatically built to production

### MongoDB (Port 27017)
- NoSQL database service
- Data persisted in Docker volumes
- Auto-initializes with database name `pdms`

## Docker Compose Commands

### Start Services
```bash
# Start all services in detached mode (background)
docker-compose up -d

# Start all services and view logs
docker-compose up

# Start specific service
docker-compose up -d backend
docker-compose up -d frontend
docker-compose up -d mongodb
```

### View Logs
```bash
# View all services logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# View last 100 lines of logs
docker-compose logs --tail=100
```

### Stop Services
```bash
# Stop all services but keep them
docker-compose stop

# Stop and remove containers (data persists)
docker-compose down

# Stop and remove everything including volumes
docker-compose down -v
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Images
```bash
# Rebuild without cache
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
```

## Common Issues and Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 27017 are already in use:

```bash
# Find the process using the port (Linux/Mac)
lsof -i :3000

# or on Windows (PowerShell)
netstat -ano | findstr :3000

# Modify the ports in docker-compose.yml
# Example: change "3000:3000" to "8080:3000"
```

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Reset MongoDB data
docker-compose down -v
docker-compose up -d mongodb
```

### Backend Not Connecting to MongoDB
```bash
# Ensure MongoDB is healthy first
docker-compose ps

# Check backend logs
docker-compose logs backend

# Rebuild backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Frontend Not Loading
```bash
# Check Nginx logs
docker-compose logs frontend

# Verify frontend is built
docker-compose exec frontend ls -la /usr/share/nginx/html

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Environment Variables Not Applied
1. Update the `.env` file
2. Rebuild the services: `docker-compose build --no-cache`
3. Restart the services: `docker-compose up -d`

## Development vs Production

### Development Mode
For local development without Docker:
```bash
# Backend
cd pdms/backend
npm install
npm run dev

# Frontend (in another terminal)
cd pdms/frontend
npm install
npm run dev
```

### Production Mode
Using Docker (recommended):
```bash
cd pdms
docker-compose up -d
```

## Health Checks

The services have built-in health checks:

```bash
# Check service health
docker-compose ps

# See detailed health status
docker inspect pdms-backend | grep -A 20 "Health"
docker inspect pdms-frontend | grep -A 20 "Health"
docker inspect pdms-mongodb | grep -A 20 "Health"
```

## Network Configuration

- Services communicate via the `pdms-network` bridge network
- Frontend can reach backend at `http://backend:5000`
- Backend can reach MongoDB at `mongodb://mongodb:27017`
- External access uses localhost ports: 3000, 5000, 27017

## Volumes

Persistent data is stored in Docker volumes:
- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration

To back up MongoDB data:
```bash
docker-compose exec mongodb mongodump --out /data/backup
```

## Cleaning Up

To completely remove all Docker resources:

```bash
# Stop all services
docker-compose down

# Remove all volumes (WARNING: Deletes data)
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Remove unused Docker resources
docker system prune -a
```

## Production Deployment

For production deployment:

1. **Update environment variables** in `.env` with production values
2. **Use a managed database** instead of MongoDB container
3. **Set up reverse proxy** (Nginx) for SSL/TLS
4. **Configure firewall** to allow only necessary ports
5. **Set up monitoring** and logging
6. **Use Docker registry** for image management
7. **Implement auto-restart policies** and health checks

### Example Production Configuration

Modify `docker-compose.yml`:
```yaml
services:
  backend:
    image: your-registry/pdms-backend:latest
    restart: always
    environment:
      NODE_ENV: production
      # Add production environment variables
```

## Useful Tips

```bash
# Run a command in a container
docker-compose exec backend npm list

# Scale services (not recommended for databases)
docker-compose up -d --scale frontend=2

# Access backend container shell
docker-compose exec backend sh

# Check resource usage
docker stats

# View container IP addresses
docker inspect -f '{{.Name}} -> {{.NetworkSettings.IPAddress}}' $(docker ps -aq)
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review service logs: `docker-compose logs -f`
3. Ensure all prerequisites are installed
4. Verify environment variables are set correctly

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
