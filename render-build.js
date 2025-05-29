const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Royal Restaurant Production Build ===');

try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Creating production build...');
  
  // Create dist directory
  if (!fs.existsSync('./dist/public')) {
    fs.mkdirSync('./dist/public', { recursive: true });
  }
  
  // Don't copy client files - this creates conflicts
  // Instead, use the server.js to serve directly from ./client in production
  
  // Create a simple redirect page that ensures the server serves from the right location
  const redirectHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Royal Restaurant - مطعم رويال</title>
    <meta http-equiv="refresh" content="0;url=/">
</head>
<body style="background: #000; color: #C4A572; text-align: center; padding: 50px; font-family: Arial;">
    <h1>Royal Restaurant</h1>
    <p>تحويل...</p>
    <script>window.location.href = '/';</script>
</body>
</html>`;
  
  fs.writeFileSync('./dist/public/index.html', redirectHtml);
  
  console.log('Production build completed successfully!');
  console.log('Built files are in ./dist/public');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
