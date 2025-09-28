#!/bin/bash

# Setup cron job for Modern Notes App health monitoring

CRON_JOB="*/5 * * * * /root/sweettest/modern-notes-app/health-monitor.sh >/dev/null 2>&1"
CRON_FILE="/etc/cron.d/modern-notes-health"

# Remove existing cron job if it exists
if [ -f "$CRON_FILE" ]; then
    echo "Removing existing cron job..."
    rm "$CRON_FILE"
fi

# Create new cron job
echo "Setting up cron job for health monitoring..."
echo "# Modern Notes App Health Monitoring" > "$CRON_FILE"
echo "# Runs every 5 minutes" >> "$CRON_FILE"
echo "$CRON_JOB" >> "$CRON_FILE"

# Set proper permissions
chmod 644 "$CRON_FILE"

# Restart cron service
systemctl restart cron 2>/dev/null || systemctl restart crond 2>/dev/null || service cron restart 2>/dev/null

echo "Cron job setup complete!"
echo "Health monitoring will run every 5 minutes"
echo "Logs will be written to: /var/log/modern-notes-health.log"