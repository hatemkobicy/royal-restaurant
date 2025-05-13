// start.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// تثبيت التبعيات المطلوبة إذا لم تكن متوفرة
try {
  require.resolve('express');
  console.log('Express is already installed.');
} catch (e) {
  console.log('Installing express and other dependencies...');
  execSync('npm install --production', { stdio: 'inherit' });
}

// تشغيل الخادم
console.log('Starting server...');
try {
  require('./dist/index.js');
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}
