#!/bin/bash

# Configure the backend URL
BACKEND_URL="http://localhost:5001" # Change this URL to your backend address

# Ask for user details
read -p "Enter your name: " NAME
read -p "Enter your surname: " SURNAME
read -sp "Enter your password: " PASSWORD
echo
read -p "Enter your email: " EMAIL

# List of available roles
declare -a ROLES=("PLANNER" "DEVELOPER" "VISITOR" "RESIDENT")
echo "Select a role for the user:"
for i in "${!ROLES[@]}"; do
  echo "$i) ${ROLES[$i]}"
done

# Ask the user to choose a role
while true; do
  read -p "Enter the number corresponding to the role: " ROLE_INDEX
  if [[ "$ROLE_INDEX" =~ ^[0-9]+$ ]] && [ "$ROLE_INDEX" -ge 0 ] && [ "$ROLE_INDEX" -lt "${#ROLES[@]}" ]; then
    ROLE=${ROLES[$ROLE_INDEX]}
    break
  else
    echo "Invalid choice. Please try again."
  fi
done

# Call the backend endpoint
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/users/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'"$NAME"'",
    "surname": "'"$SURNAME"'",
    "password": "'"$PASSWORD"'",
    "email": "'"$EMAIL"'",
    "role": "'"$ROLE"'"
  }')

# Check the response
if [[ $RESPONSE == *"success"* ]]; then
  echo "User $SURNAME created successfully with role $ROLE."
else
  echo "Error creating user: $RESPONSE"
fi