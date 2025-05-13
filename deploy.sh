#!/bin/bash
# script to deploy on Render

echo "Royal Restaurant Deployment Script"
echo "=================================="

# تثبيت التبعيات الأساسية
echo "Installing dependencies..."
npm install

# تثبيت التبعيات الإضافية المطلوبة للبناء
echo "Installing build dependencies..."
npm install --no-save vite @vitejs/plugin-react esbuild tailwindcss postcss autoprefixer @tailwindcss/typography @tailwindcss/vite

# بناء العميل باستخدام vite
echo "Building client..."
cd client
npx vite build --outDir ../dist/client
cd ..

# بناء الخادم باستخدام esbuild
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Deployment build completed!"
