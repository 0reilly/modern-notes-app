#!/bin/bash

# Comprehensive Monitoring Dashboard for Modern Notes App
# Provides real-time status of both development and production environments

PROD_URL="http://localhost:3002"
DEV_URL="http://localhost:3003"
LOG_DIR="/root/.pm2/logs"
DASHBOARD_LOG="/var/log/modern-notes-dashboard.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log dashboard events
log_dashboard() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$DASHBOARD_LOG"
}

# Function to check service status
check_service() {
    local service_name=$1
    local service_url=$2
    
    echo -e "${BLUE}Checking $service_name...${NC}"
    
    # Check PM2 status using JSON output
    pm2_status=$(pm2 jlist | jq -r ".[] | select(.name == \"$service_name\") | .pm2_env.status" 2>/dev/null || echo "unknown")
    
    # Check HTTP response
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$service_url" --connect-timeout 5 2>/dev/null || echo "000")
    
    # Check response time
    start_time=$(date +%s%3N)
    curl -s -o /dev/null "$service_url" 2>/dev/null
    end_time=$(date +%s%3N)
    response_time=$((end_time - start_time))
    
    # Determine status
    if [ "$pm2_status" = "online" ] && ([ "$http_code" = "200" ] || [ "$http_code" = "302" ]); then
        echo -e "  ${GREEN}✅ ONLINE${NC}"
        echo "    PM2 Status: $pm2_status"
        echo "    HTTP Code: $http_code"
        echo "    Response Time: ${response_time}ms"
        return 0
    else
        echo -e "  ${RED}❌ OFFLINE${NC}"
        echo "    PM2 Status: $pm2_status"
        echo "    HTTP Code: $http_code"
        echo "    Response Time: ${response_time}ms"
        return 1
    fi
}

# Function to check system resources
check_resources() {
    echo -e "${BLUE}System Resources:${NC}"
    
    # CPU usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo "  CPU Usage: ${cpu_usage}%"
    
    # Memory usage
    mem_total=$(free -m | awk 'NR==2{print $2}')
    mem_used=$(free -m | awk 'NR==2{print $3}')
    mem_percent=$((mem_used * 100 / mem_total))
    echo "  Memory Usage: ${mem_used}MB / ${mem_total}MB (${mem_percent}%)"
    
    # Disk usage
    disk_usage=$(df -h / | awk 'NR==2{print $5}')
    echo "  Disk Usage: $disk_usage"
}

# Function to check recent logs
check_logs() {
    echo -e "${BLUE}Recent Log Activity:${NC}"
    
    # Check for errors in last 10 minutes
    error_count=$(find "$LOG_DIR" -name "modern-notes-app-*.log" -type f -mmin -10 -exec grep -i "error\|exception\|failed" {} \; | wc -l)
    
    if [ "$error_count" -gt 0 ]; then
        echo -e "  ${YELLOW}⚠️ $error_count errors in last 10 minutes${NC}"
        echo "  Recent errors:"
        find "$LOG_DIR" -name "modern-notes-app-*.log" -type f -mmin -10 -exec grep -i "error\|exception\|failed" {} \; | tail -3
    else
        echo -e "  ${GREEN}✅ No recent errors${NC}"
    fi
}

# Function to display environment summary
show_summary() {
    echo -e "\n${BLUE}=== Modern Notes App Monitoring Dashboard ===${NC}"
    echo "Timestamp: $(date)"
    echo "Server: $(hostname)"
    echo "IP: 167.172.236.171"
    echo ""
}

# Main dashboard function
main() {
    clear
    show_summary
    
    # Check production environment
    check_service "modern-notes-app-prod" "$PROD_URL"
    prod_status=$?
    echo ""
    
    # Check development environment
    check_service "modern-notes-app-dev" "$DEV_URL"
    dev_status=$?
    echo ""
    
    # Check system resources
    check_resources
    echo ""
    
    # Check logs
    check_logs
    echo ""
    
    # Overall status
    if [ "$prod_status" -eq 0 ] && [ "$dev_status" -eq 0 ]; then
        echo -e "${GREEN}✅ All systems operational${NC}"
    else
        echo -e "${YELLOW}⚠️ Some services require attention${NC}"
    fi
    
    echo ""
    echo "Access URLs:"
    echo "  Production: http://167.172.236.171:3002"
    echo "  Development: http://167.172.236.171:3003"
    echo ""
    echo "PM2 Commands:"
    echo "  pm2 status                    - View process status"
    echo "  pm2 logs modern-notes-app-prod - View production logs"
    echo "  pm2 logs modern-notes-app-dev  - View development logs"
    echo ""
}

# Run dashboard
main

# Log dashboard execution
log_dashboard "Dashboard executed - Prod: $prod_status, Dev: $dev_status"