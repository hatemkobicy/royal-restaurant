# Royal Restaurant Deployment

This folder contains the deployment-ready files for Royal Restaurant website.

## Database Information
- Database: u670813828_royal
- Username: u670813828_royal
- Password: :6rpOG31Y
- Domain: royal-restaurant-tr.com

## Deployment Steps
1. Upload all files to your Hostinger hosting
2. Set up Node.js environment in Hostinger
3. Run 'npm install --production' to install dependencies
4. Run 'npx drizzle-kit push:mysql' to set up the database
5. Start the application with 'node index.js'

## File Structure
- public_html/ - Contains frontend files
- server/ - Contains backend code
- index.js - Main entry point
- .env - Environment configuration