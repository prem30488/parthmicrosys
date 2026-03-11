@echo off
REM PDMS Docker Quick Start Script for Windows
REM This script helps set up and start the Docker containers for PDMS

echo ================================
echo PDMS Docker Setup Script
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo Docker and Docker Compose are installed
echo.

REM Check if .env file exists
if not exist .env (
    echo .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo Created .env file. Please edit it with your configuration values.
        echo.
        echo Required environment variables:
        echo   - JWT_SECRET: A secure random string
        echo   - GITHUB_TOKEN: Your GitHub personal access token
        echo   - GITHUB_OWNER: Your GitHub username
        echo   - VERCEL_TOKEN: Your Vercel API token (optional^)
        echo   - VERCEL_TEAM_ID: Your Vercel team ID (optional^)
        echo.
        pause
    ) else (
        echo Error: .env.example not found. Please create .env file manually.
        pause
        exit /b 1
    )
)

echo.
echo Building Docker images...
call docker-compose build

if errorlevel 1 (
    echo Error building Docker images.
    pause
    exit /b 1
)

echo.
echo Starting PDMS services...
call docker-compose up -d

if errorlevel 1 (
    echo Error starting Docker services.
    pause
    exit /b 1
)

echo.
echo Waiting for services to be healthy...
timeout /t 10 /nobreak

echo.
echo Service Status:
docker-compose ps

echo.
echo PDMS is running!
echo.
echo Access your application:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000/api
echo   Database:  mongodb://localhost:27017
echo.
echo Useful commands:
echo   View logs:           docker-compose logs -f
echo   Stop services:       docker-compose stop
echo   Restart services:    docker-compose restart
echo   Remove everything:   docker-compose down -v
echo.
echo For more information, see README-DOCKER.md
echo.
pause
