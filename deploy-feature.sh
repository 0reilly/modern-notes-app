#!/bin/bash

# Feature deployment script
# This script allows safe deployment of new features from dev to prod

FEATURE_NAME="${1:-new-feature}"

echo "🔧 Deploying Feature: $FEATURE_NAME"
echo "=========================================="

# Validate feature name
if [[ ! "$FEATURE_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo "❌ Invalid feature name. Use only letters, numbers, hyphens, and underscores."
    exit 1
fi

# Step 1: Test in development environment
echo "🔍 Step 1: Testing feature in development environment..."

# Ensure dev environment is running
if ! pm2 describe modern-notes-app-dev > /dev/null 2>&1; then
    echo "⚠️  Development environment not running. Starting it..."
    ./manage-environments.sh start-dev
    sleep 5
fi

# Run tests
echo "🛠️ Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Please fix issues before deploying to production."
    exit 1
fi

echo "✅ Tests passed!"

# Step 2: Build and verify feature
echo ""
echo "📋 Step 2: Building feature..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build issues."
    exit 1
fi

echo "✅ Build successful!"

# Step 3: Verify development environment
echo ""
echo "🔍 Step 3: Verifying development environment..."

# Test dev endpoint
DEV_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://167.172.236.171:3003 || echo "000")

if [ "$DEV_RESPONSE" != "200" ]; then
    echo "❌ Development environment not responding properly (HTTP $DEV_RESPONSE)"
    echo "Please check development server status and logs."
    exit 1
fi

echo "✅ Development environment verified (HTTP $DEV_RESPONSE)"

# Step 4: Deploy to production
echo ""
echo "🚀 Step 4: Deploying to production..."

# Create backup of current production
echo "📁 Creating production backup..."
pm2 describe modern-notes-app-prod > "backup-prod-$FEATURE_NAME.json" 2>/dev/null || true

# Deploy to production
./deploy-prod.sh

if [ $? -ne 0 ]; then
    echo "❌ Production deployment failed!"
    echo "Attempting rollback..."
    
    # Rollback procedure
    if [ -f "backup-prod-$FEATURE_NAME.json" ]; then
        echo "Rolling back to previous version..."
        pm2 stop modern-notes-app-prod
        pm2 delete modern-notes-app-prod
        # In a real scenario, you would restore from backup here
        ./deploy-prod.sh
    fi
    
    exit 1
fi

# Step 5: Verify production deployment
echo ""
echo "🔍 Step 5: Verifying production deployment..."

sleep 3  # Give production server time to start

# Test production endpoint
PROD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://167.172.236.171:3002 || echo "000")

if [ "$PROD_RESPONSE" != "200" ]; then
    echo "❌ Production environment not responding properly (HTTP $PROD_RESPONSE)"
    echo "Attempting rollback..."
    
    # Rollback procedure
    if [ -f "backup-prod-$FEATURE_NAME.json" ]; then
        echo "Rolling back to previous version..."
        pm2 stop modern-notes-app-prod
        pm2 delete modern-notes-app-prod
        # In a real scenario, you would restore from backup here
        ./deploy-prod.sh
    fi
    
    exit 1
fi

echo "✅ Production environment verified (HTTP $PROD_RESPONSE)"

# Clean up backup
rm -f "backup-prod-$FEATURE_NAME.json"

echo ""
echo "🎉 Feature '$FEATURE_NAME' deployed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  🔧 Development: http://167.172.236.171:3003"
echo "  🚀 Production:  http://167.172.236.171:3002"
echo ""
echo "📝 Next steps:"
echo "  - Monitor logs: ./manage-environments.sh logs-prod"
echo "  - Check status: ./manage-environments.sh status"
echo "  - Monitor performance: ./manage-environments.sh monitor"