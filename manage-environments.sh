#!/bin/bash

# Environment management script
# This script helps manage development and production environments

case "$1" in
    "start-dev")
        echo "🔧 Starting Development Environment..."
        pm2 start ecosystem.config.js --only modern-notes-app-dev
        pm2 save
        echo "📱 Development server started on port 3003"
        ;;
    "stop-dev")
        echo "🛑 Stopping Development Environment..."
        pm2 stop modern-notes-app-dev
        echo "✅ Development server stopped"
        ;;
    "start-prod")
        echo "🚀 Starting Production Environment..."
        pm2 start ecosystem.config.js --only modern-notes-app-prod
        pm2 save
        echo "📱 Production server started on port 3002"
        ;;
    "stop-prod")
        echo "🛑 Stopping Production Environment..."
        pm2 stop modern-notes-app-prod
        echo "✅ Production server stopped"
        ;;
    "restart-dev")
        echo "🔄 Restarting Development Environment..."
        pm2 restart modern-notes-app-dev
        echo "✅ Development server restarted"
        ;;
    "restart-prod")
        echo "🔄 Restarting Production Environment..."
        pm2 restart modern-notes-app-prod
        echo "✅ Production server restarted"
        ;;
    "status")
        echo "📋 Environment Status:"
        echo ""
        pm2 list | grep modern-notes-app
        ;;
    "logs-dev")
        echo "📝 Development Logs:"
        pm2 logs modern-notes-app-dev
        ;;
    "logs-prod")
        echo "📝 Production Logs:"
        pm2 logs modern-notes-app-prod
        ;;
    "monitor")
        echo "📈 Starting PM2 Monitor..."
        pm2 monit
        ;;
    "deploy-all")
        echo "🚀 Deploying Both Environments..."
        ./deploy-dev.sh
        echo ""
        ./deploy-prod.sh
        ;;
    *)
        echo "Usage: $0 {start-dev|stop-dev|start-prod|stop-prod|restart-dev|restart-prod|status|logs-dev|logs-prod|monitor|deploy-all}"
        echo ""
        echo "Environment Management Commands:"
        echo "  start-dev     - Start development environment (port 3003)"
        echo "  stop-dev      - Stop development environment"
        echo "  start-prod    - Start production environment (port 3002)"
        echo "  stop-prod     - Stop production environment"
        echo "  restart-dev   - Restart development environment"
        echo "  restart-prod  - Restart production environment"
        echo "  status        - Show status of all environments"
        echo "  logs-dev      - View development logs"
        echo "  logs-prod     - View production logs"
        echo "  monitor       - Open PM2 monitor"
        echo "  deploy-all    - Deploy both environments"
        echo ""
        echo "Development URL: http://167.172.236.171:3003"
        echo "Production URL:  http://167.172.236.171:3002"
        ;;
esac