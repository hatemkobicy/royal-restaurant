const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data store (will reset on server restart)
let categories = [
  { id: 1, nameAr: 'المقبلات', nameTr: 'Başlangıçlar', imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435', slug: 'appetizers' },
  { id: 2, nameAr: 'الأطباق الرئيسية', nameTr: 'Ana Yemekler', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947', slug: 'main-dishes' },
  { id: 3, nameAr: 'الحلويات', nameTr: 'Tatlılar', imageUrl: 'https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg', slug: 'desserts' },
  { id: 4, nameAr: 'المشروبات', nameTr: 'İçecekler', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574', slug: 'drinks' }
];
let menuItems = [];

// Try to load data from files if they exist
try {
  if (fs.existsSync('./data/categories.json')) {
    categories = JSON.parse(fs.readFileSync('./data/categories.json', 'utf8'));
    console.log('Loaded categories from file');
  }
  if (fs.existsSync('./data/menuItems.json')) {
    menuItems = JSON.parse(fs.readFileSync('./data/menuItems.json', 'utf8'));
    console.log('Loaded menu items from file');
  }
} catch (error) {
  console.error('Error loading data files:', error);
}

// Ensure data directory exists
if (!fs.existsSync('./data')) {
  try {
    fs.mkdirSync('./data');
    console.log('Created data directory');
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Function to save data to files
const saveData = () => {
  try {
    fs.writeFileSync('./data/categories.json', JSON.stringify(categories, null, 2));
    fs.writeFileSync('./data/menuItems.json', JSON.stringify(menuItems, null, 2));
    console.log('Data saved to files');
  } catch (error) {
    console.error('Error saving data files:', error);
  }
};

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
    environment: process.env.NODE_ENV,
    categories: categories.length,
    menuItems: menuItems.length
  });
});

// Categories API routes
app.get('/api/categories', async (req, res) => {
  try {
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
    
    // Generate a new ID
    const newId = categories.length > 0 
      ? Math.max(...categories.map(c => c.id)) + 1 
      : 1;
    
    const newCategory = {
      id: newId,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    // Add to our in-memory array
    categories.push(newCategory);
    
    // Save data to file
    saveData();
    
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
    
    // Find the category
    const index = categories.findIndex(c => c.id === categoryId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Update the category
    const updatedCategory = {
      ...categories[index],
      ...req.body,
      id: categoryId, // ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    categories[index] = updatedCategory;
    
    // Save data to file
    saveData();
    
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
    
    // Find and remove the category
    const initialLength = categories.length;
    categories = categories.filter(c => c.id !== categoryId);
    
    if (categories.length === initialLength) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Save data to file
    saveData();
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Menu items API routes
app.get('/api/menu-items', async (req, res) => {
  try {
    res.json(menuItems);
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

// Data status route
app.get('/api/data-status', (req, res) => {
  res.json({
    categories: categories.length,
    menuItems: menuItems.length,
    dataDirectory: fs.existsSync('./data'),
    categoriesFile: fs.existsSync('./data/categories.json'),
    menuItemsFile: fs.existsSync('./data/menuItems.json')
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
  console.log(`Currently have ${categories.length} categories and ${menuItems.length} menu items`);
});
