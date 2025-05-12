#!/bin/bash

# Deployment script for Royal Restaurant

echo "Starting deployment process for Royal Restaurant..."

# Install production dependencies
echo "Installing dependencies..."
npm install --production

# Set up database
echo "Setting up database..."
npx drizzle-kit push:mysql

# Start the application
echo "Starting the application..."
node index.js

echo "Deployment complete!"