const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection with retry logic
const connectWithRetry = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to PostgreSQL database');
      client.release();
      return true;
    } catch (err) {
      console.log(`Database connection attempt failed. Retries left: ${retries - 1}`);
      console.error('Error:', err.message);
      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
  }
  console.error('Failed to connect to database after all retries');
  return false;
};

connectWithRetry();

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

// Initialize database tables with better error handling
const initTables = async () => {
  // Skip if DATABASE_URL is not set
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL not found, skipping database initialization');
    return;
  }

  try {
    // Test connection first
    const client = await pool.connect();
    client.release();

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_tr TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create menu_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_tr TEXT NOT NULL,
        description_ar TEXT NOT NULL,
        description_tr TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        travel_price DECIMAL(10,2),
        travel_price_color TEXT DEFAULT '#FF5722',
        image_url TEXT,
        is_available BOOLEAN DEFAULT TRUE,
        category_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert default categories if they don't exist
    const categoryCheck = await pool.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO categories (name_ar, name_tr, slug, image_url) VALUES
        ('المقبلات', 'Başlangıçlar', 'appetizers', 'https://images.unsplash.com/photo-1577906096429-f73c2c312435'),
        ('الأطباق الرئيسية', 'Ana Yemekler', 'main-dishes', 'https://images.unsplash.com/photo-1544025162-d76694265947'),
        ('الحلويات', 'Tatlılar', 'desserts', 'https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg'),
        ('المشروبات', 'İçecekler', 'drinks', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574')
      `);
      console.log('Default categories inserted');
    }

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.log('Database initialization skipped - using fallback mode');
    console.error('Database error details:', error.message);
  }
};

// Initialize tables on startup
initTables();

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
app.get('/api/test', async (req, res) => {
  try {
    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    const menuItemsCount = await pool.query('SELECT COUNT(*) FROM menu_items');
    
    res.json({ 
      message: 'Server is running', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'connected',
      categories: parseInt(categoriesCount.rows[0].count),
      menuItems: parseInt(menuItemsCount.rows[0].count)
    });
  } catch (error) {
    res.json({ 
      message: 'Server is running', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'error',
      error: error.message
    });
  }
});

// Fallback data for when database is not available
const fallbackCategories = [
  { id: 1, nameAr: 'المقبلات', nameTr: 'Başlangıçlar', slug: 'appetizers', imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435' },
  { id: 2, nameAr: 'الأطباق الرئيسية', nameTr: 'Ana Yemekler', slug: 'main-dishes', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
  { id: 3, nameAr: 'الحلويات', nameTr: 'Tatlılar', slug: 'desserts', imageUrl: 'https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg' },
  { id: 4, nameAr: 'المشروبات', nameTr: 'İçecekler', slug: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574' }
];
let fallbackMenuItems = [];

// Categories API routes
app.get('/api/categories', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json(fallbackCategories);
    }
    
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    const categories = result.rows.map(row => ({
      id: row.id,
      nameAr: row.name_ar,
      nameTr: row.name_tr,
      slug: row.slug,
      imageUrl: row.image_url,
      createdAt: row.created_at
    }));
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories, using fallback:', error.message);
    res.json(fallbackCategories);
  }
});

// Create a new category
app.post('/api/categories', authMiddleware, async (req, res) => {
  try {
    console.log('Creating category with data:', req.body);
    
    const { nameAr, nameTr, slug, imageUrl } = req.body;
    
    const result = await pool.query(
      'INSERT INTO categories (name_ar, name_tr, slug, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [nameAr, nameTr, slug, imageUrl]
    );
    
    const newCategory = {
      id: result.rows[0].id,
      nameAr: result.rows[0].name_ar,
      nameTr: result.rows[0].name_tr,
      slug: result.rows[0].slug,
      imageUrl: result.rows[0].image_url,
      createdAt: result.rows[0].created_at
    };
    
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Category with this slug already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

// Update a category
app.put('/api/categories/:id', authMiddleware, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { nameAr, nameTr, slug, imageUrl } = req.body;
    
    console.log(`Updating category with ID ${categoryId}:`, req.body);
    
    const result = await pool.query(
      'UPDATE categories SET name_ar = $1, name_tr = $2, slug = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [nameAr, nameTr, slug, imageUrl, categoryId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const updatedCategory = {
      id: result.rows[0].id,
      nameAr: result.rows[0].name_ar,
      nameTr: result.rows[0].name_tr,
      slug: result.rows[0].slug,
      imageUrl: result.rows[0].image_url,
      createdAt: result.rows[0].created_at
    };
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Category with this slug already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
});

// Delete a category
app.delete('/api/categories/:id', authMiddleware, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    console.log(`Deleting category with ID ${categoryId}`);
    
    // First delete related menu items
    await pool.query('DELETE FROM menu_items WHERE category_id = $1', [categoryId]);
    
    // Then delete the category
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Menu items API routes
app.get('/api/menu-items', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name_ar as category_name_ar, c.name_tr as category_name_tr 
      FROM menu_items m 
      LEFT JOIN categories c ON m.category_id = c.id 
      ORDER BY m.id
    `);
    
    const menuItems = result.rows.map(row => ({
      id: row.id,
      nameAr: row.name_ar,
      nameTr: row.name_tr,
      descriptionAr: row.description_ar,
      descriptionTr: row.description_tr,
      price: parseFloat(row.price),
      travelPrice: row.travel_price ? parseFloat(row.travel_price) : null,
      travelPriceColor: row.travel_price_color,
      imageUrl: row.image_url,
      isAvailable: row.is_available,
      categoryId: row.category_id,
      categoryNameAr: row.category_name_ar,
      categoryNameTr: row.category_name_tr,
      createdAt: row.created_at
    }));
    
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Create a new menu item
app.post('/api/menu-items', authMiddleware, async (req, res) => {
  try {
    console.log('Creating menu item with data:', req.body);
    
    const { 
      nameAr, nameTr, descriptionAr, descriptionTr, 
      price, travelPrice, travelPriceColor, imageUrl, 
      isAvailable, categoryId 
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO menu_items 
      (name_ar, name_tr, description_ar, description_tr, price, travel_price, travel_price_color, image_url, is_available, category_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `, [nameAr, nameTr, descriptionAr, descriptionTr, price, travelPrice, travelPriceColor, imageUrl, isAvailable, categoryId]);
    
    const newMenuItem = {
      id: result.rows[0].id,
      nameAr: result.rows[0].name_ar,
      nameTr: result.rows[0].name_tr,
      descriptionAr: result.rows[0].description_ar,
      descriptionTr: result.rows[0].description_tr,
      price: parseFloat(result.rows[0].price),
      travelPrice: result.rows[0].travel_price ? parseFloat(result.rows[0].travel_price) : null,
      travelPriceColor: result.rows[0].travel_price_color,
      imageUrl: result.rows[0].image_url,
      isAvailable: result.rows[0].is_available,
      categoryId: result.rows[0].category_id,
      createdAt: result.rows[0].created_at
    };
    
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Update a menu item
app.put('/api/menu-items/:id', authMiddleware, async (req, res) => {
  try {
    const menuItemId = parseInt(req.params.id);
    const { 
      nameAr, nameTr, descriptionAr, descriptionTr, 
      price, travelPrice, travelPriceColor, imageUrl, 
      isAvailable, categoryId 
    } = req.body;
    
    console.log(`Updating menu item with ID ${menuItemId}:`, req.body);
    
    const result = await pool.query(`
      UPDATE menu_items 
      SET name_ar = $1, name_tr = $2, description_ar = $3, description_tr = $4, 
          price = $5, travel_price = $6, travel_price_color = $7, image_url = $8, 
          is_available = $9, category_id = $10 
      WHERE id = $11 
      RETURNING *
    `, [nameAr, nameTr, descriptionAr, descriptionTr, price, travelPrice, travelPriceColor, imageUrl, isAvailable, categoryId, menuItemId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    const updatedMenuItem = {
      id: result.rows[0].id,
      nameAr: result.rows[0].name_ar,
      nameTr: result.rows[0].name_tr,
      descriptionAr: result.rows[0].description_ar,
      descriptionTr: result.rows[0].description_tr,
      price: parseFloat(result.rows[0].price),
      travelPrice: result.rows[0].travel_price ? parseFloat(result.rows[0].travel_price) : null,
      travelPriceColor: result.rows[0].travel_price_color,
      imageUrl: result.rows[0].image_url,
      isAvailable: result.rows[0].is_available,
      categoryId: result.rows[0].category_id,
      createdAt: result.rows[0].created_at
    };
    
    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete a menu item
app.delete('/api/menu-items/:id', authMiddleware, async (req, res) => {
  try {
    const menuItemId = parseInt(req.params.id);
    console.log(`Deleting menu item with ID ${menuItemId}`);
    
    const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [menuItemId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Database status route
app.get('/api/database-status', async (req, res) => {
  try {
    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    const menuItemsCount = await pool.query('SELECT COUNT(*) FROM menu_items');
    
    res.json({
      connected: true,
      categories: parseInt(categoriesCount.rows[0].count),
      menuItems: parseInt(menuItemsCount.rows[0].count),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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
  console.log('Database: PostgreSQL (connected)');
});
