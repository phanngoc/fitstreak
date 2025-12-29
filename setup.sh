#!/bin/bash

# FitStreak Development Setup Script

set -e

echo "🔥 FitStreak - Workout Tracker MVP"
echo "=================================="

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "📦 Starting services..."
docker-compose up -d

echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo "🗃️ Setting up database..."
docker-compose exec backend bundle install
docker-compose exec backend rails db:create db:migrate db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 Access the app:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:3000"
echo ""
echo "🔐 Demo account:"
echo "   Email: demo@fitstreak.app"
echo "   Password: demo123456"
echo ""
echo "💡 Commands:"
echo "   docker-compose logs -f     # View logs"
echo "   docker-compose down        # Stop services"
echo "   docker-compose restart     # Restart services"
