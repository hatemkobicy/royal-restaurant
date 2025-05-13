// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// تقديم الملفات الثابتة
const clientPath = path.join(__dirname, 'client');
if (fs.existsSync(path.join(clientPath, 'dist'))) {
  app.use(express.static(path.join(clientPath, 'dist')));
} else {
  app.use(express.static(clientPath));
}

// إعداد API
app.use(express.json());

// مسارات API بسيطة
app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, nameAr: 'المقبلات', nameTr: 'Başlangıçlar', imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
    { id: 2, nameAr: 'الأطباق الرئيسية', nameTr: 'Ana Yemekler', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
    { id: 3, nameAr: 'الحلويات', nameTr: 'Tatlılar', imageUrl: 'https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg' },
    { id: 4, nameAr: 'المشروبات', nameTr: 'İçecekler', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' }
  ]);
});

app.get('/api/menu-items', (req, res) => {
  res.json([]);
});

// مسار "catch-all" للواجهة الأمامية
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(clientPath, 'dist', 'index.html'))) {
    res.sendFile(path.join(clientPath, 'dist', 'index.html'));
  } else if (fs.existsSync(path.join(clientPath, 'index.html'))) {
    res.sendFile(path.join(clientPath, 'index.html'));
  } else {
    res.status(404).send('File not found');
  }
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
