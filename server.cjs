// server.cjs - تحويل ملف ES Module إلى CommonJS
const path = require('path');
const express = require('express');
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const session = require('express-session');
const PgStore = require('connect-pg-simple')(session);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// قراءة المتغيرات البيئية
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET || 'royal_restaurant_secret_key';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin_secret_key';

// إنشاء التطبيق
const app = express();
app.use(express.json());

// قاعدة البيانات
const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

// إعداد جلسة المستخدم
app.use(session({
  store: new PgStore({ pool }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// تقديم الملفات الثابتة
app.use(express.static(path.join(__dirname, 'dist/client')));

// API للمصادقة
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // تنفيذ عملية المصادقة البسيطة للمسؤول
    if (username === 'admin') {
      const isValid = await bcrypt.compare(password, await bcrypt.hash('RoyalRestaurant2023', 10));
      
      if (isValid) {
        const token = jwt.sign(
          { id: 1, username, isAdmin: true },
          ADMIN_SECRET,
          { expiresIn: '7d' }
        );
        
        return res.json({ token, user: { id: 1, username, isAdmin: true } });
      }
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// مسار "catch-all" للواجهة الأمامية
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'));
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
