const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and serving static files
app.use(express.json());

// Set MIME types correctly
express.static.mime.define({
  'text/javascript': ['js', 'mjs'],
  'application/json': ['json'],
  'text/css': ['css']
});

// Determine client path
let clientPath = './client';
if (fs.existsSync('./dist/client')) {
  clientPath = './dist/client';
} else if (fs.existsSync('./dist')) {
  clientPath = './dist';
}

// Serve static files with correct MIME types
app.use(express.static(clientPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
    if (path.endsWith('.mjs') || (path.includes('index-') && path.endsWith('.js'))) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

// Simple auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // For development with mock token
    if (token === 'mock-admin-token') {
      req.user = { id: 1, username: 'admin', isAdmin: true };
      return next();
    }

    // Verify JWT token
    const secret = process.env.ADMIN_SECRET || 'admin_secret_key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Very basic authentication for demo purposes
    // In a real app, you would check against database credentials
    if (username === 'admin' && password === 'RoyalRestaurant2023') {
      const token = jwt.sign(
        { id: 1, username, isAdmin: true },
        process.env.ADMIN_SECRET || 'admin_secret_key',
        { expiresIn: '7d' }
      );
      
      return res.json({ 
        token, 
        user: { id: 1, username, isAdmin: true } 
      });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth check route
app.get('/api/auth/check', authMiddleware, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Categories API routes
app.get('/api/categories', async (req, res) => {
  try {
    // Mock data for categories
    const categories = [
      { id: 1, nameAr: 'المقبلات', nameTr: 'Başlangıçlar', imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435' },
      { id: 2, nameAr: 'الأطباق الرئيسية', nameTr: 'Ana Yemekler', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
      { id: 3, nameAr: 'الحلويات', nameTr: 'Tatlılar', imageUrl: 'https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg' },
      { id: 4, nameAr: 'المشروبات', nameTr: 'İçecekler', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574' }
    ];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create a new category
app.post('/api/categories', authMiddleware, async (req, res) => {
  try {
    console.log('Creating category with data:', req.body);
    
    // In a real app, this would save to a database
    // For now, we'll just return mock data
    const newCategory = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a category
app.put('/api/categories/:id', authMiddleware, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    console.log(`Updating category with ID ${categoryId}:`, req.body);
    
    // In a real app, this would update in the database
    const updatedCategory = {
      id: categoryId,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
app.delete('/api/categories/:id', authMiddleware, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    console.log(`Deleting category with ID ${categoryId}`);
    
    // In a real app, this would delete from the database
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Menu items API routes
app.get('/api/menu-items', async (req, res) => {
  try {
    // Mock data for menu items
    res.json([]);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Auth debug route
app.get('/api/auth-debug', (req, res) => {
  const authHeader = req.headers.authorization;
  
  res.json({
    authHeader: authHeader,
    hasToken: !!authHeader,
    tokenStartsWithBearer: authHeader?.startsWith('Bearer ') || false
  });
});

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), clientPath, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Serving files from: ${clientPath}`);
});
