// vite.prod.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: './client', // تحديد مجلد client كمجلد رئيسي
  build: {
    outDir: '../dist/client',
    emptyOutDir: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@shared': resolve(__dirname, './shared'),
      '@assets': resolve(__dirname, './client/assets')
    }
  }
});
