# Environment Setup Guide

This guide explains how to set up and manage development and production environments for the Modern Notes App.

## 📋 Environment Overview

| Environment | Port | URL | Purpose |
|-------------|------|-----|---------|
| **Development** | 3003 | http://167.172.236.171:3003 | Feature development, testing, hot reloading |
| **Production** | 3002 | http://167.172.236.171:3002 | Live application, stable version |
| **HTTPS Production** | 443 | https://167.172.236.171/modern-notes-app/ | Secure production with automatic SSL |

## 🚀 Quick Start

### 1. Deploy Both Environments
```bash
./manage-environments.sh deploy-all
```

### 2. Check Status
```bash
./manage-environments.sh status
```

### 3. Access Your Apps
- **Development**: http://167.172.236.171:3003
- **Production**: http://167.172.236.171:3002
- **HTTPS Production**: https://167.172.236.171/modern-notes-app/
- **Health Check**: https://167.172.236.171/health

## 📝 Management Commands

### Using the Management Script
```bash
# Start development environment
./manage-environments.sh start-dev

# Start production environment  
./manage-environments.sh start-prod

# Stop development environment
./manage-environments.sh stop-dev

# Stop production environment
./manage-environments.sh stop-prod

# Restart development environment
./manage-environments.sh restart-dev

# Restart production environment
./manage-environments.sh restart-prod

# View status of all environments
./manage-environments.sh status

# View development logs
./manage-environments.sh logs-dev

# View production logs
./manage-environments.sh logs-prod

# Open PM2 monitor
./manage-environments.sh monitor
```

### Using NPM Scripts
```bash
# Deploy development environment
npm run deploy:dev

# Deploy production environment
npm run deploy:prod

# Check environment status
npm run env:status

# View development logs
npm run env:logs:dev

# View production logs
npm run env:logs:prod
```

## 🔧 HTTPS Configuration

The application is automatically served over HTTPS using Caddy reverse proxy with automatic SSL certificate management.

### HTTPS Endpoints
- **Main Application**: https://167.172.236.171/modern-notes-app/
- **Health Check**: https://167.172.236.171/health
- **Development (Internal)**: https://167.172.236.171/dev/

### Caddy Configuration
Caddy automatically:
- Obtains and renews SSL certificates
- Handles HTTP to HTTPS redirects
- Provides security headers
- Manages reverse proxy routing

### Manual Caddy Management
```bash
# Check Caddy status
systemctl status caddy

# Reload Caddy configuration
systemctl reload caddy

# View Caddy logs
journalctl -u caddy -f
```

## 🔧 Development Workflow

### 1. Start Development Environment
```bash
./manage-environments.sh start-dev
```

### 2. Develop Features
- Make changes to your code
- The development server supports hot reloading
- Changes will automatically refresh in the browser

### 3. Test Your Changes
- Access development environment: http://167.172.236.171:3003
- Test functionality and UI changes
- Verify no errors in the console

### 4. Deploy to Production
```bash
./manage-environments.sh deploy-prod
```

### 5. Verify Production
- Access production environment: https://167.172.236.171/modern-notes-app/
- Check health endpoint: https://167.172.236.171/health
- Monitor performance and errors

## 📋 Environment Configuration

### Development Environment (.env.development)
```
NODE_ENV=development
PORT=3003
VITE_API_URL=http://localhost:3003
```

### Production Environment (.env.production)
```
NODE_ENV=production
PORT=3002
VITE_API_URL=https://167.172.236.171/modern-notes-app/
```

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Production Health**: https://167.172.236.171/health
- **Direct Health**: http://167.172.236.171:3002/health

### Monitoring Dashboard
```bash
# Run monitoring dashboard
./monitoring-dashboard.sh

# Health monitoring script
./health-monitor.sh

# Error monitoring script
./error-monitor.sh
```

### PM2 Monitoring
```bash
# View all processes
pm2 status

# View production logs
pm2 logs modern-notes-app-prod

# View development logs
pm2 logs modern-notes-app-dev

# Monitor resource usage
pm2 monit
```

## ⚠️ Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process using port
lsof -i :3002

# Kill process if needed
kill -9 <PID>
```

**PM2 process not starting**
```bash
# Check PM2 logs
pm2 logs

# Restart PM2 daemon
pm2 resurrect
```

**Caddy not serving HTTPS**
```bash
# Check Caddy status
systemctl status caddy

# Reload Caddy
systemctl reload caddy

# Check Caddy logs
journalctl -u caddy -n 50
```

### Performance Issues
- Check system resources: `./monitoring-dashboard.sh`
- Monitor response times via health endpoint
- Review PM2 logs for errors

## 📖 Additional Resources

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Operations Guide](./OPERATIONS_GUIDE.md)
- [Production Readiness Summary](./PRODUCTION_READINESS_SUMMARY.md)

---

**Last Updated**: 2025-09-27  
**Environment Status**: ✅ All systems operational with HTTPS support