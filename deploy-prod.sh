#!/bin/bash

# Production deployment script
# This script deploys to production with zero downtime

echo "🚀 Deploying Modern Notes App - Production Environment"
echo "===================================================="

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
npm ci --only=production
pm2 reload ecosystem.config.cjs --only modern-notes-app-prod

# Build the application for production
echo "🛠️ Building production application..."
npm run build

    pm2 start ecosystem.config.cjs --only modern-notes-app-prod

echo "🚧 Deploying to production with zero downtime..."
pm2 reload ecosystem.config.js --only modern-notes-app-prod

# If reload fails, start fresh
if [ $? -ne 0 ]; then
    echo "⚠️  Reload failed, starting fresh..."
    pm2 stop modern-notes-app-prod 2>/dev/null || true
    pm2 delete modern-notes-app-prod 2>/dev/null || true
    pm2 start ecosystem.config.js --only modern-notes-app-prod
fi

# Save PM2 configuration
echo "📁 Saving PM2 configuration..."
pm2 save

# Display status
echo ""
echo "📋 Production Environment Status:"
pm2 list | grep modern-notes-app-prod

echo ""
echo "✅ Production environment deployed successfully!"
echo "📱 Access your app at: http://167.172.236.171:3002"
echo ""
echo "📝 Useful commands:"
echo "  pm2 logs modern-notes-app-prod    # View production logs"
echo "  pm2 monit modern-notes-app-prod   # Monitor production process"
echo "  pm2 restart modern-notes-app-prod # Restart production server"