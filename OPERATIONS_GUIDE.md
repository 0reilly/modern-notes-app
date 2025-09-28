# Modern Notes App - Operations Guide

## 🚀 Application Overview

- **Application**: Modern Notes App (Vercel-inspired React application)
- **URL**: http://167.172.236.171:3002/
- **Port**: 3002
- **Technology Stack**: React + Vite + Express.js
- **Process Manager**: PM2
- **Health Monitoring**: Automated every 5 minutes

## 📋 Quick Commands

### Status Check
```bash
cd /root/sweettest/modern-notes-app
./status-dashboard.sh
```

### Health Check
```bash
cd /root/sweettest/modern-notes-app
./health-monitor.sh
```

### PM2 Management
```bash
# View status
pm2 list

# View logs
pm2 logs modern-notes-app

# Restart application
pm2 restart modern-notes-app

# Stop application
pm2 stop modern-notes-app

# Start application
pm2 start modern-notes-app
```

## 🔧 Monitoring & Health Checks

### Automated Monitoring
- **Health checks**: Every 5 minutes via cron job
- **Log location**: `/var/log/modern-notes-health.log`
- **PM2 auto-restart**: Enabled via startup script

### Manual Health Verification
```bash
# Check HTTP response
curl -s -o /dev/null -w "%{http_code}" http://167.172.236.171:3002/

# Check port status
ss -tlnp | grep 3002

# Check process status
ps aux | grep "node server.js"
```

## 📁 File Structure

```
/root/sweettest/modern-notes-app/
├── server.js                 # Express server
├── ecosystem.config.js        # PM2 configuration
├── health-monitor.sh          # Health monitoring script
├── status-dashboard.sh        # Status dashboard
├── setup-cron.sh             # Cron job setup
├── OPERATIONS_GUIDE.md       # This guide
├── dist/                     # Built application
└── package.json              # Dependencies
```

## ⚠️ Troubleshooting Guide

### Application Not Responding

1. **Check PM2 Status**
   ```bash
   pm2 list
   ```
   - If status is not "online", restart: `pm2 restart modern-notes-app`

2. **Check Port Binding**
   ```bash
   ss -tlnp | grep 3002
   ```
   - Should show "LISTEN" state

3. **Check Application Logs**
   ```bash
   pm2 logs modern-notes-app --lines 50
   ```

4. **Manual Restart Procedure**
   ```bash
   cd /root/sweettest/modern-notes-app
   pm2 stop modern-notes-app
   pm2 start server.js --name "modern-notes-app"
   ```

### Health Check Failing

1. **Run Health Monitor Manually**
   ```bash
   cd /root/sweettest/modern-notes-app
   ./health-monitor.sh
   ```

2. **Check Health Logs**
   ```bash
   tail -f /var/log/modern-notes-health.log
   ```

3. **Verify Network Connectivity**
   ```bash
   # From external network
   curl -I http://167.172.236.171:3002/
   ```

### High Resource Usage

1. **Check Memory/CPU**
   ```bash
   pm2 show modern-notes-app
   ```

2. **Monitor System Resources**
   ```bash
   top -p $(pgrep -f "node server.js")
   ```

## 📊 Performance Monitoring

### Key Metrics to Monitor
- **Response Time**: Should be < 100ms
- **Memory Usage**: Should be < 100MB
- **Uptime**: Check via `pm2 list`
- **HTTP Status**: Should consistently return 200

### Performance Commands
```bash
# Response time check
curl -s -o /dev/null -w "Time: %{time_total}s\n" http://167.172.236.171:3002/

# Memory usage
pm2 show modern-notes-app | grep memory

# Process uptime
pm2 list | grep modern-notes-app | awk '{print $10}'
```

## 🛠️ Security Considerations

### Current Security Status
- ✅ Firewall: Inactive (no blocking rules)
- ✅ Process: Running as root (monitored environment)
- ✅ Network: Accessible on port 3002 only

### Security Best Practices
1. **Regular Updates**: Keep Node.js and dependencies updated
2. **Access Control**: Consider implementing authentication if needed
3. **Log Monitoring**: Monitor logs for suspicious activity
4. **Backup**: Regular backups of application code

## 📝 Maintenance Procedures

### Regular Maintenance Tasks
- [ ] Monthly: Review health logs for patterns
- [ ] Quarterly: Update Node.js dependencies
- [ ] As needed: Clear old log files

### Update Procedure
```bash
cd /root/sweettest/modern-notes-app
# Pull latest code if using git
git pull origin main
# Update dependencies
npm install
# Restart application
pm2 restart modern-notes-app
```

## 📩 Alerting & Notifications

### Current Alerting Setup
- **Health checks**: Automated via cron (logs to file)
- **PM2 monitoring**: Built-in process monitoring
- **Manual checks**: Use status dashboard script

### Recommended Enhancements
- Email notifications on health check failures
- Slack/Teams integration for alerts
- Monitoring dashboard with Grafana/Prometheus

## 📋 Emergency Contact & Escalation

### Immediate Actions for Critical Issues
1. **Service Down**: Restart via PM2
2. **Port Conflict**: Check for other processes on port 3002
3. **Resource Exhaustion**: Restart and monitor resource usage

### Escalation Path
1. Automated health check and restart
2. Manual intervention using this guide
3. Contact system administrator if unresolved

---

**Last Updated**: $(date)
**Maintainer**: SWEET CLI Agent
**Application Status**: ✅ OPERATIONAL