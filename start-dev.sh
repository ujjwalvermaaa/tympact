#!/bin/bash

echo "🚀 Starting Tympact Development Servers..."

# Start backend server in background
echo "📡 Starting backend server..."
cd client/server && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../ && npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 