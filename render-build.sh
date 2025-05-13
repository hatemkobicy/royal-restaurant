#!/usr/bin/env bash
# هذا الملف يساعد في حل مشكلة عدم وجود vite في عملية البناء

# تثبيت الحزم الضرورية بشكل صريح قبل البناء
npm install --no-save vite esbuild @vitejs/plugin-react

# تنفيذ عملية البناء باستخدام الحزم المثبتة حديثًا
NODE_ENV=production npx vite build
NODE_ENV=production npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
