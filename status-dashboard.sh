#!/bin/bash

# Simple status dashboard for Modern Notes App

APP_URL="http://167.172.236.171:3002/"
PM2_APP_NAME="modern-notes-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Modern Notes App Status Dashboard ===${NC}"
echo "Generated: $(date)"
echo ""

# Check PM2 status
echo -e "${BLUE}PM2 Process Status:${NC}"
pm2_status=$(pm2 list | grep "$PM2_APP_NAME")
if echo "$pm2_status" | grep -q "online"; then
    echo -e "${GREEN}✓ Application is running under PM2${NC}"
    echo "$pm2_status"
else
    echo -e "${RED}✗ Application is NOT running in PM2${NC}"
fi
echo ""

# Check HTTP response
echo -e "${BLUE}HTTP Health Check:${NC}"
response_code=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" --connect-timeout 10)
if [ "$response_code" -eq 200 ]; then
    echo -e "${GREEN}✓ HTTP 200 OK - Application is responding${NC}"
else
    echo -e "${RED}✗ HTTP $response_code - Application may be down${NC}"
fi
echo ""

# Check response time
echo -e "${BLUE}Performance Metrics:${NC}"
response_time=$(curl -s -o /dev/null -w "%{time_total}s" "$APP_URL" --connect-timeout 10)
echo "Response time: ${response_time}s"
echo ""

# Check system resources
echo -e "${BLUE}System Resources:${NC}"
if command -v pm2 >/dev/null 2>&1; then
    pm2 show "$PM2_APP_NAME" | grep -E "(memory|cpu|uptime)" | head -3
fi
echo ""

# Check port status
echo -e "${BLUE}Network Status:${NC}"
if ss -tlnp | grep -q ":3002"; then
    echo -e "${GREEN}✓ Port 3002 is listening${NC}"
else
    echo -e "${RED}✗ Port 3002 is NOT listening${NC}"
fi
echo ""

# Overall status
if [ "$response_code" -eq 200 ] && echo "$pm2_status" | grep -q "online"; then
    echo -e "${GREEN}✅ MODERN NOTES APP IS HEALTHY AND OPERATIONAL${NC}"
    echo "Access your app at: $APP_URL"
else
    echo -e "${RED}❌ MODERN NOTES APP MAY NEED ATTENTION${NC}"
    echo "Please check the logs and restart if necessary"
fi