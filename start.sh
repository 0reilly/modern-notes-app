#!/bin/bash

# Modern Notes App Startup Script
# This script starts the production server on the VPS

echo "🚀 Starting Modern Notes App on VPS..."
echo "📡 Server IP: 167.172.236.171"
echo "🔌 Port: 3002"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Start the production server
echo "🌟 Starting production server..."
echo "🌐 Application will be available at: http://167.172.236.171:3002"
echo ""
echo "Press Ctrl+C to stop the server"

npm run serve