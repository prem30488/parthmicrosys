#!/bin/bash

# PDMS Docker Quick Start Script
# This script helps set up and start the Docker containers for PDMS

set -e

echo "================================"
echo "PDMS Docker Setup Script"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please edit it with your configuration values."
        echo ""
        echo "Required environment variables:"
        echo "  - JWT_SECRET: A secure random string"
        echo "  - GITHUB_TOKEN: Your GitHub personal access token"
        echo "  - GITHUB_OWNER: Your GitHub username"
        echo "  - VERCEL_TOKEN: Your Vercel API token (optional)"
        echo "  - VERCEL_TEAM_ID: Your Vercel team ID (optional)"
        echo ""
        read -p "Press Enter to continue after updating .env file..."
    else
        echo "❌ .env.example not found. Please create .env file manually."
        exit 1
    fi
fi

echo ""
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting PDMS services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ PDMS is running!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000/api"
echo "   Database:  mongodb://localhost:27017"
echo ""
echo "📋 Useful commands:"
echo "   View logs:           docker-compose logs -f"
echo "   Stop services:       docker-compose stop"
echo "   Restart services:    docker-compose restart"
echo "   Remove everything:   docker-compose down -v"
echo ""
echo "📖 For more information, see README-DOCKER.md"
