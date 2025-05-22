const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ضبط أنواع MIME
express.static.mime.define({
  'text/javascript': ['js', 'mjs'],
  'application/json': ['json'],
  'text/css': ['css']
});

// تحديد مسار الملفات الثابتة
let clientPath = './client';
if (fs.existsSync('./dist/client')) {
  clientPath = './dist/client';
} else if (fs.existsSync('./dist')) {
  clientPath = './dist';
}

// تقديم الملفات الثابتة مع ضبط نوع MIME
app.use(express.static(clientPath, {
  setHeaders: (res, path) => {
    // ضبط نوع MIME لملفات JavaScript
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
    // ضبط نوع MIME لملفات JavaScript Module
    if (path.endsWith('.mjs') || path.includes('index-') && path.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

app.use(express.json());

// API المبسط
app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, nameAr: 'المقبلات', nameTr: 'Başlangıçlar', imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435' },
    { id: 2, nameAr: 'الأطباق الرئيسية', nameTr: 'Ana Yemekler', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947' }
  ]);
});

app.get('/api/menu-items', (req, res) => {
  res.json([]);
});

// مسار "catch-all" للواجهة الأمامية
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), clientPath, 'index.html'));
});

// الاستماع على جميع الواجهات
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
