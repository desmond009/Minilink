#!/bin/bash

# First, register a test user
echo "=== Registering test user ==="
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }')

echo "$REGISTER_RESPONSE" | jq '.'

# Extract token from response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token // .token // empty')

if [ -z "$TOKEN" ]; then
  echo ""
  echo "=== Trying to login instead ==="
  LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "Test1234"
    }')
  
  echo "$LOGIN_RESPONSE" | jq '.'
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // .token // empty')
fi

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  exit 1
fi

echo ""
echo "=== Token obtained ==="
echo "$TOKEN"

# Test URL creation
echo ""
echo "=== Creating short URL ==="
curl -s -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "originalUrl": "https://www.google.com"
  }' | jq '.'

