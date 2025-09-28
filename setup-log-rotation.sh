#!/bin/bash

# Setup log rotation for Modern Notes App

LOG_ROTATE_CONFIG="/etc/logrotate.d/modern-notes-app"

# Create logrotate configuration
echo "Setting up log rotation for Modern Notes App..."

cat > "$LOG_ROTATE_CONFIG" << EOF
/var/log/modern-notes-health.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
    postrotate
        # Optional: reload any services if needed
    endscript
}

/root/.pm2/logs/modern-notes-app-*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
    create 644 root root
}
EOF

echo "Log rotation configuration created at: $LOG_ROTATE_CONFIG"

# Test the configuration
echo "Testing logrotate configuration..."
logrotate -d "$LOG_ROTATE_CONFIG" 2>/dev/null && echo "✓ Configuration is valid" || echo "⚠️ Check configuration manually"

echo ""
echo "Log rotation setup complete!"
echo "- Health logs will be rotated daily, kept for 7 days"
echo "- PM2 application logs will be rotated daily, kept for 7 days"
echo "- Logs will be compressed after rotation"