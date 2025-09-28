#!/bin/bash

# Development deployment script
# This script starts the development environment

echo "🔧 Deploying Modern Notes App - Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
fi

# Install dependencies
echo "📋 Installing dependencies..."
npm ci

# Build the application for development
echo "🛠️ Building application..."
npm run build

# Stop existing development instance if running
echo "🛑 Stopping existing development instance..."
pm2 stop modern-notes-app-dev 2>/dev/null || true
pm2 delete modern-notes-app-dev 2>/dev/null || true

# Start development environment
echo "🚀 Starting development environment..."
pm2 start ecosystem.config.js --only modern-notes-app-dev

# Save PM2 configuration
echo "📁 Saving PM2 configuration..."
pm2 save

# Display status
echo ""
echo "📋 Development Environment Status:"
pm2 list | grep modern-notes-app-dev

echo ""
echo "🎯 Development environment deployed successfully!"
echo "📱 Access your app at: http://167.172.236.171:3003"
echo "🔥 Hot reloading enabled - changes will auto-refresh"
echo ""
echo "📝 Useful commands:"
echo "  pm2 logs modern-notes-app-dev    # View development logs"
echo "  pm2 monit modern-notes-app-dev   # Monitor development process"
echo "  pm2 restart modern-notes-app-dev # Restart development server"