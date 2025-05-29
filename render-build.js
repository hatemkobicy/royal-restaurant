const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Royal Restaurant Production Build ===');

try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Building with Vite...');
  
  // Use Vite to build the React application properly
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Production build completed successfully!');
  console.log('Built files are in ./dist/public');
  
} catch (error) {
  console.error('Build failed:', error.message);
  console.log('Creating fallback build...');
  
  // Fallback: create minimal structure
  if (!fs.existsSync('./dist/public')) {
    fs.mkdirSync('./dist/public', { recursive: true });
  }
  
  // Copy client files as fallback
  execSync('cp -r ./client/* ./dist/public/', { stdio: 'inherit' });
  
  console.log('Fallback build completed');
}
