#!/bin/bash

# Health monitoring script for Modern Notes App
# This script checks the health of the application and restarts if necessary

APP_URL="http://167.172.236.171:3002/"
LOG_FILE="/var/log/modern-notes-health.log"
MAX_RETRIES=3
RETRY_DELAY=5

# Function to log messages with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to check application health
check_health() {
    local response_code
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" --connect-timeout 10)
    echo "$response_code"
}

# Function to restart application
restart_app() {
    log_message "Restarting Modern Notes App..."
    cd /root/sweettest/modern-notes-app
    pm2 restart modern-notes-app
    sleep 5
}

# Main health check
log_message "Starting health check for Modern Notes App"

# Check if PM2 is running the app
pm2_status=$(pm2 list | grep "modern-notes-app" | awk '{print $10}')
if [ "$pm2_status" != "online" ]; then
    log_message "WARNING: App not running in PM2. Current status: $pm2_status"
    restart_app
fi

# Perform health check with retries
for i in $(seq 1 $MAX_RETRIES); do
    response_code=$(check_health)
    
    if [ "$response_code" -eq 200 ]; then
        log_message "SUCCESS: Application is healthy (HTTP $response_code)"
        exit 0
    else
        log_message "WARNING: Health check failed (HTTP $response_code) - Attempt $i/$MAX_RETRIES"
        
        if [ $i -lt $MAX_RETRIES ]; then
            sleep $RETRY_DELAY
        else
            log_message "ERROR: All retries failed. Restarting application..."
            restart_app
            
            # Final check after restart
            sleep 10
            final_response=$(check_health)
            if [ "$final_response" -eq 200 ]; then
                log_message "SUCCESS: Application restarted successfully (HTTP $final_response)"
            else
                log_message "CRITICAL: Application restart failed (HTTP $final_response)"
                exit 1
            fi
        fi
    fi
done