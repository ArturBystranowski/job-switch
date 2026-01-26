#!/bin/bash

# Test script for GET /rest/v1/roles endpoint
# Usage: ./test-roles-endpoint.sh
# Requires: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables

# Load .env.local if exists
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Check required env vars
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "Error: Missing environment variables"
  echo "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  exit 1
fi

BASE_URL="${VITE_SUPABASE_URL}/rest/v1/roles"

echo "=========================================="
echo "Testing: GET /rest/v1/roles"
echo "Base URL: $BASE_URL"
echo "=========================================="

echo ""
echo "1. Fetch all roles (default)"
echo "------------------------------------------"
curl -s -X GET "$BASE_URL" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "2. Fetch roles sorted by name (ascending)"
echo "------------------------------------------"
curl -s -X GET "$BASE_URL?order=name.asc" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "3. Fetch roles sorted by name (descending)"
echo "------------------------------------------"
curl -s -X GET "$BASE_URL?order=name.desc" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "4. Fetch only id and name fields"
echo "------------------------------------------"
curl -s -X GET "$BASE_URL?select=id,name" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "5. Fetch with HTTP status code"
echo "------------------------------------------"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY")
echo "HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Endpoint working correctly!"
else
  echo "❌ Endpoint returned unexpected status code"
fi

echo ""
echo "=========================================="
echo "Tests completed"
echo "=========================================="
