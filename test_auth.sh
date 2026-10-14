#!/bin/bash

# Auth & Admin Panel Validation Script
# Tests authentication flow and admin CRUD operations

API_URL="http://localhost:3000/api"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="admin123"
TOKEN=""

echo "======================================"
echo "AUTH & ADMIN PANEL VALIDATION"
echo "======================================"
echo ""

# Function to make API calls
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    
    if [ -n "$data" ]; then
        if [ -n "$headers" ]; then
            curl -s -X "$method" "$API_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "$headers" \
                -d "$data"
        else
            curl -s -X "$method" "$API_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data"
        fi
    else
        if [ -n "$headers" ]; then
            curl -s -X "$method" "$API_URL$endpoint" \
                -H "$headers"
        else
            curl -s -X "$method" "$API_URL$endpoint"
        fi
    fi
}

echo "1. Testing User Registration..."
REGISTER_RESPONSE=$(api_call POST "/auth/register" "{\"name\":\"Admin User\",\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"role\":\"admin\"}")
echo "Response: $REGISTER_RESPONSE"
echo ""

echo "2. Testing Admin Login..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
echo "Response: $LOGIN_RESPONSE"
echo ""

echo "3. Testing Protected Route (Create Project)..."
PROJECT_DATA='{"title":"Test Project","slug":"test-project","description":"Test Description","images":[],"tags":["test"],"featured":false}'
PROJECT_RESPONSE=$(curl -s -b cookies.txt -X POST "$API_URL/projects" \
    -H "Content-Type: application/json" \
    -d "$PROJECT_DATA")
echo "Response: $PROJECT_RESPONSE"
echo ""

echo "4. Testing GET Projects..."
GET_PROJECTS=$(curl -s "$API_URL/projects")
echo "Response: $GET_PROJECTS"
echo ""

echo "5. Testing Unauthorized Access (without login)..."
UNAUTH_RESPONSE=$(curl -s -X POST "$API_URL/services" \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","slug":"test"}')
echo "Response: $UNAUTH_RESPONSE"
echo ""

echo "6. Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -b cookies.txt -X POST "$API_URL/auth/logout")
echo "Response: $LOGOUT_RESPONSE"
echo ""

# Cleanup
rm -f cookies.txt

echo "======================================"
echo "VALIDATION COMPLETE"
echo "======================================"
