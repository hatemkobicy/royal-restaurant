const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Royal Restaurant Build Script ===');

try {
  // Clean dist folder
  if (fs.existsSync('./dist')) {
    console.log('Cleaning dist folder...');
    execSync('rm -rf ./dist', { stdio: 'inherit' });
  }

  // Check if client folder exists
  if (!fs.existsSync('./client')) {
    console.error('Client folder not found!');
    process.exit(1);
  }

  // Build frontend from client directory using local config
  console.log('Building frontend from client directory...');
  execSync('cd client && npx vite build', { stdio: 'inherit' });

  // Check if build was successful
  if (!fs.existsSync('./dist/public')) {
    console.error('Build output not found in dist/public!');
    process.exit(1);
  }

  console.log('Build completed successfully!');
  console.log('Built files are in ./dist/public');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
