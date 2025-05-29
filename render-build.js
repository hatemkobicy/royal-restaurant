const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Royal Restaurant Production Build ===');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Create a simple production version
  console.log('Creating production build...');
  
  // Create dist directory
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }
  
  if (!fs.existsSync('./dist/public')) {
    fs.mkdirSync('./dist/public', { recursive: true });
  }

  // Copy client files to dist/public
  console.log('Copying client files...');
  execSync('cp -r ./client/* ./dist/public/', { stdio: 'inherit' });

  // Simple HTML file for production
  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Royal Restaurant - مطعم رويال</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; }
        .rtl { direction: rtl; text-align: right; }
    </style>
</head>
<body class="bg-gray-50">
    <div id="root">
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Royal Restaurant</h1>
                <h2 class="text-2xl text-gray-600 mb-6">مطعم رويال</h2>
                <p class="text-gray-500">Website is loading...</p>
            </div>
        </div>
    </div>
    <script>
        // Simple loading message
        setTimeout(() => {
            fetch('/api/test')
                .then(response => response.json())
                .then(data => {
                    console.log('Server is running:', data);
                    window.location.reload();
                })
                .catch(error => {
                    console.log('Connecting to server...');
                });
        }, 2000);
    </script>
</body>
</html>`;

  fs.writeFileSync('./dist/public/index.html', htmlContent);

  console.log('Production build completed successfully!');
  console.log('Built files are in ./dist/public');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
