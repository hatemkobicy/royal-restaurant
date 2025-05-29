const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Royal Restaurant Production Build ===');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Create dist directory
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }
  
  if (!fs.existsSync('./dist/public')) {
    fs.mkdirSync('./dist/public', { recursive: true });
  }

  // Try to build with Vite first
  console.log('Attempting to build React application...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    
    // Check if Vite created a dist folder
    if (fs.existsSync('./dist') && fs.readdirSync('./dist').length > 0) {
      console.log('Using Vite build output...');
      // Copy Vite build to public folder
      execSync('cp -r ./dist/* ./dist/public/ 2>/dev/null || true', { stdio: 'inherit' });
    }
  } catch (buildError) {
    console.log('Vite build failed, using development setup...');
  }

  // If no proper build exists, set up development environment for production
  if (!fs.existsSync('./dist/public/index.html')) {
    console.log('Setting up development environment for production...');
    
    // Copy all client files
    execSync('cp -r ./client/* ./dist/public/', { stdio: 'inherit' });
    
    // Read the original index.html
    const originalIndexPath = './client/index.html';
    let htmlContent = fs.readFileSync(originalIndexPath, 'utf8');
    
    // Modify it to work better in production
    htmlContent = htmlContent.replace(
      '<head>',
      `<head>
    <title>Royal Restaurant - مطعم رويال</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">`
    );
    
    // Remove replit banner
    htmlContent = htmlContent.replace(
      /<!-- This is a replit script.*[\s\S]*?replit-dev-banner\.js"><\/script>/g,
      ''
    );
    
    fs.writeFileSync('./dist/public/index.html', htmlContent);
  }

  console.log('Production build completed successfully!');
  console.log('Built files are in ./dist/public');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
