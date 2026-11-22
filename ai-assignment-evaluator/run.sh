#!/bin/bash
# ================================================================
# AI Assignment Evaluator - Complete Quick Startup Script
# ================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "      AI ASSIGNMENT EVALUATOR - STARTUP LAUNCHER"
echo "=========================================================="

# Check Java Runtime
JAVA_CMD="java"
if [ -d "$DIR/../.tools/jdk-21/21.0.13.1/libexec/openjdk.jdk/Contents/Home/bin" ]; then
    export JAVA_HOME="$DIR/../.tools/jdk-21/21.0.13.1/libexec/openjdk.jdk/Contents/Home"
    JAVA_CMD="$JAVA_HOME/bin/java"
fi

echo ">> Checking Java Version..."
$JAVA_CMD -version

# Launch Backend
echo ">> Starting Spring Boot Backend on http://localhost:8080..."
SPRING_PROFILE=${1:-dev}
$JAVA_CMD -Dspring.profiles.active=$SPRING_PROFILE -jar backend/target/ai-assignment-evaluator-backend-1.0.0.jar &
BACKEND_PID=$!
echo "Backend running with PID: $BACKEND_PID"

# Launch Frontend
echo ">> Starting React Vite Frontend on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend running with PID: $FRONTEND_PID"

echo ""
echo "=========================================================="
echo "  AI Assignment Evaluator is live and ready!"
echo "  Frontend Portal:  http://localhost:5173"
echo "  Backend REST API: http://localhost:8080/api"
echo "  Default Teacher:  teacher@evaluator.edu / Password@123"
echo "  Default Student:  sarah@student.edu   / Password@123"
echo "=========================================================="
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
