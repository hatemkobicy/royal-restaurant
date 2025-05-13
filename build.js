// build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// طباعة المعلومات الحالية
console.log('Current directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync('.'));

// التحقق من وجود مجلد client
if (fs.existsSync('./client')) {
  console.log('Client directory contents:', fs.readdirSync('./client'));
  
  // التحقق من وجود ملف index.html
  if (fs.existsSync('./client/index.html')) {
    console.log('Found client/index.html');
  } else {
    console.log('client/index.html not found');
  }
}

try {
  // بناء الجزء الخاص بالعميل
  console.log('Building client...');
  execSync('npx vite build ./client --outDir ../dist/client', {
    cwd: './client', // تنفيذ الأمر من داخل مجلد client
    stdio: 'inherit'
  });
  
  // بناء الجزء الخاص بالخادم
  console.log('Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
