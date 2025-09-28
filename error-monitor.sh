#!/bin/bash

# Error monitoring script for Modern Notes App
# Checks logs for error patterns and alerts on issues

LOG_DIR="/root/.pm2/logs"
HEALTH_LOG="/var/log/modern-notes-health.log"
ERROR_THRESHOLD=5  # Number of errors to trigger alert
CHECK_INTERVAL="1 hour ago"  # Check logs from last hour

# Function to check for error patterns in PM2 logs
check_pm2_errors() {
    local error_count=0
    local error_patterns=("Error:" "error:" "ERR!" "Exception" "Unhandled" "Crash" "Failed")
    
    echo "Checking PM2 logs for errors..."
    
    for pattern in "${error_patterns[@]}"; do
        local count=$(find "$LOG_DIR" -name "modern-notes-app-*.log" -type f -exec grep -i "$pattern" {} \; | wc -l)
        if [ "$count" -gt 0 ]; then
            echo "⚠️ Found $count occurrences of pattern: $pattern"
            error_count=$((error_count + count))
            
            # Show recent errors for this pattern
            find "$LOG_DIR" -name "modern-notes-app-*.log" -type f -exec grep -i "$pattern" {} \; | tail -3
        fi
    done
    
    echo "Total error patterns found: $error_count"
    return $error_count
}

# Function to check health log for failures
check_health_log() {
    echo "Checking health monitoring log..."
    
    if [ -f "$HEALTH_LOG" ]; then
        local failure_count=$(grep -c "ERROR\|CRITICAL\|failed" "$HEALTH_LOG" 2>/dev/null || echo 0)
        local recent_failures=$(grep "ERROR\|CRITICAL\|failed" "$HEALTH_LOG" | tail -3 2>/dev/null)
        
        if [ "$response_time" -gt 1000 ]; then
            echo "⚠️ Health check failures: $failure_count"
            echo "Recent failures:"
            echo "$recent_failures"
        else
            echo "✅ No health check failures found"
        fi
    else
        echo "ℹ️ Health log not found: $HEALTH_LOG"
    fi
}

# Function to check application performance
check_performance() {
    echo "Checking application performance..."
    
    # Check response time
    local start_time=$(date +%s%3N)
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" http://167.172.236.171:3002/ --connect-timeout 10)
    local end_time=$(date +%s%3N)
    local response_time=$((end_time - start_time))
    
    if [ "$response_code" -eq 200 ]; then
        echo "✅ HTTP 200 OK - Response time: ${response_time}ms"
        
        if [ "$response_time" -gt 1000 ]; then
            echo "⚠️ Warning: Slow response time (>1000ms)"
        fi
    else
        echo "❌ HTTP $response_code - Application may be down"
    fi
}

# Function to check system resources
check_system_resources() {
    echo "Checking system resources..."
    
    # Check memory usage of the app
    local mem_usage=$(pm2 show modern-notes-app 2>/dev/null | grep "memory" | awk '{print $4}' | head -1)
    if [ -n "$mem_usage" ]; then
        echo "ℹ️ Memory usage: $mem_usage"
        
        # Convert to MB if needed
        if echo "$mem_usage" | grep -q "GB"; then
            echo "⚠️ Warning: High memory usage detected"
        fi
    fi
    
    # Check CPU usage
    local cpu_usage=$(pm2 show modern-notes-app 2>/dev/null | grep "cpu" | awk '{print $4}' | head -1)
    if [ -n "$cpu_usage" ]; then
        echo "ℹ️ CPU usage: $cpu_usage"
    fi
}

# Main monitoring function
main() {
    echo "=== Modern Notes App Error Monitoring ==="
    echo "Timestamp: $(date)"
    echo ""
    
    # Run all checks
    check_pm2_errors
    local pm2_errors=$?
    echo ""
    
    check_health_log
    echo ""
    
    check_performance
    echo ""
    
    check_system_resources
    echo ""
    
    # Summary
    echo "=== Monitoring Summary ==="
    if [ "$pm2_errors" -ge "$ERROR_THRESHOLD" ]; then
        echo "❌ CRITICAL: High error count detected ($pm2_errors errors)"
        echo "   Please check application logs immediately"
    elif [ "$pm2_errors" -gt 0 ]; then
        echo "⚠️ WARNING: Some errors detected ($pm2_errors errors)"
        echo "   Monitor closely for increasing error rates"
    else
        echo "✅ OK: No significant errors detected"
    fi
    
    echo ""
    echo "Next steps:"
    echo "- Run './status-dashboard.sh' for detailed status"
    echo "- Check 'pm2 logs modern-notes-app' for detailed logs"
    echo "- Review '/var/log/modern-notes-health.log' for health history"
}

# Run the monitoring
main