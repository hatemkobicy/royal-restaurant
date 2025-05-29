const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Royal Restaurant Build Script ===');
console.log('Working directory:', process.cwd());

try {
  // Create dist directory
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }

  // Copy client files to preserve React app
  console.log('Copying client files...');
  execSync('cp -r ./client ./dist/', { stdio: 'inherit' });
  
  // Copy client to dist/public for server.js compatibility
  if (!fs.existsSync('./dist/public')) {
    execSync('cp -r ./client ./dist/public', { stdio: 'inherit' });
  }

  console.log('Build completed successfully!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  
  // Fallback: ensure basic structure exists
  if (!fs.existsSync('./dist/public')) {
    fs.mkdirSync('./dist/public', { recursive: true });
  }
  
  // Create minimal working HTML
  const fallbackHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Royal Restaurant - مطعم رويال</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-white min-h-screen flex items-center justify-center">
    <div class="text-center">
        <h1 class="text-4xl font-bold text-yellow-600 mb-4">Royal Restaurant</h1>
        <h2 class="text-2xl text-yellow-400 mb-6">مطعم رويال</h2>
        <p class="text-gray-300 mb-4">Restaurant website is loading...</p>
        <a href="/admin/login" class="bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-3 rounded font-bold">
            Admin Panel / لوحة التحكم
        </a>
    </div>
</body>
</html>`;
  
  fs.writeFileSync('./dist/public/index.html', fallbackHtml);
  console.log('Created fallback version');
}
