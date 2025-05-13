#!/bin/bash
# deploy.sh - سكريبت لتبسيط عملية النشر على Render

echo "Royal Restaurant Deployment Script for Render"
echo "============================================"

# التحقق من هيكل المشروع
echo "Checking project structure..."
ls -la

# نسخ ملفات النشر المخصصة
echo "Preparing deployment files..."
cp package.prod.json package.json
cp vite.prod.config.js vite.config.js

# تثبيت التبعيات المطلوبة
echo "Installing dependencies..."
npm install --production
npm install --no-save vite @vitejs/plugin-react esbuild typescript ts-node

# بناء التطبيق
echo "Building application..."
echo "Client directory structure:"
ls -la ./client
echo "Building client..."
npx vite build --config vite.config.js
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# التحقق من نجاح عملية البناء
if [ -d "dist/client" ] && [ -f "dist/index.js" ]; then
  echo "Build successful!"
else
  echo "Build failed!"
  exit 1
fi

echo "Application is ready to run. Use 'npm start' to start the server."
