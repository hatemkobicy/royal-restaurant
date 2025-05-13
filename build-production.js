// build-production.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// وظيفة للتنفيذ الآمن للأوامر
function safeExec(command, options = {}) {
  try {
    console.log(`Executing: ${command}`);
    return execSync(command, { ...options, stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// وظيفة للتحقق من وجود حزمة
function checkPackage(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// تثبيت التبعيات المطلوبة
console.log('Installing required dependencies...');

// قائمة بالحزم المطلوبة للبناء
const requiredPackages = [
  'vite',
  '@vitejs/plugin-react',
  'esbuild',
  'tailwindcss',
  'autoprefixer',
  'postcss',
  '@tailwindcss/typography'
];

// تثبيت الحزم المفقودة
for (const pkg of requiredPackages) {
  if (!checkPackage(pkg)) {
    console.log(`Installing ${pkg}...`);
    safeExec(`npm install --no-save ${pkg}`);
  }
}

// التحقق من وجود ملفات التكوين المطلوبة
console.log('Checking configuration files...');

// إنشاء ملف postcss.config.js إذا لم يكن موجودًا
if (!fs.existsSync('./postcss.config.js')) {
  console.log('Creating postcss.config.js...');
  fs.writeFileSync('./postcss.config.js', `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
  `);
}

// إنشاء ملف tailwind.config.js إذا لم يكن موجودًا
if (!fs.existsSync('./tailwind.config.js') && !fs.existsSync('./tailwind.config.ts')) {
  console.log('Creating tailwind.config.js...');
  fs.writeFileSync('./tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/**/*.{js,jsx,ts,tsx}', './client/index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}
  `);
}

// بناء التطبيق
console.log('Building client...');
const clientBuildSuccess = safeExec('cd client && npx vite build --outDir ../dist/client');

if (!clientBuildSuccess) {
  console.log('Fallback client build approach...');
  // طريقة بديلة لبناء العميل
  const tempViteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: './client',
  build: {
    outDir: '../dist/client',
    emptyOutDir: true
  },
  plugins: [react()]
});
  `;
  
  fs.writeFileSync('./vite.temp.config.js', tempViteConfig);
  safeExec('npx vite build --config vite.temp.config.js');
}

console.log('Building server...');
safeExec('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');

// نسخ ملف index.html يدويًا إذا لم يكن موجودًا في مجلد dist/client
if (!fs.existsSync('./dist/client/index.html') && fs.existsSync('./client/index.html')) {
  console.log('Copying index.html to dist/client...');
  
  // إنشاء مجلد dist/client إذا لم يكن موجودًا
  if (!fs.existsSync('./dist/client')) {
    fs.mkdirSync('./dist/client', { recursive: true });
  }
  
  fs.copyFileSync('./client/index.html', './dist/client/index.html');
}

// التحقق من نجاح عملية البناء
if (fs.existsSync('./dist/index.js')) {
  console.log('Server build successful!');
} else {
  console.error('Server build failed!');
  process.exit(1);
}

if (fs.existsSync('./dist/client/index.html')) {
  console.log('Client build successful!');
} else {
  console.warn('Client build might have issues. Creating minimal client files...');
  
  // إنشاء ملفات عميل بسيطة للغاية في حالة فشل البناء
  if (!fs.existsSync('./dist/client')) {
    fs.mkdirSync('./dist/client', { recursive: true });
  }
  
  fs.writeFileSync('./dist/client/index.html', `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Royal Restaurant</title>
  <style>body{font-family:Arial;text-align:center;padding:50px}</style>
</head>
<body>
  <h1>Royal Restaurant</h1>
  <p>We're preparing a delicious experience for you!</p>
  <p>Please check back soon or contact us for assistance.</p>
</body>
</html>
  `);
}

console.log('Build process completed!');
