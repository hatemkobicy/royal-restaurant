import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticate,
  requireAuth,
  requireAdmin,
  AuthenticatedRequest
} from "./authMiddleware";
import { insertCategorySchema, insertMenuItemSchema, insertSpecialDishSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/login', authenticate);
  
  app.get('/api/auth/check', requireAuth, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  });

  app.post('/api/categories', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Failed to create category' });
    }
  });

  app.put('/api/categories/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, categoryData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });

  // Menu item routes
  app.get('/api/menu-items', async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ message: 'Failed to fetch menu items' });
    }
  });

  app.get('/api/menu-items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid menu item ID' });
      }
      
      const menuItem = await storage.getMenuItemById(id);
      
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.json(menuItem);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      res.status(500).json({ message: 'Failed to fetch menu item' });
    }
  });

  app.get('/api/categories/:id/menu-items', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const category = await storage.getCategoryById(categoryId);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      const menuItems = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      res.status(500).json({ message: 'Failed to fetch menu items for category' });
    }
  });

  app.post('/api/menu-items', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const newMenuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(newMenuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error creating menu item:', error);
      res.status(500).json({ message: 'Failed to create menu item' });
    }
  });

  app.put('/api/menu-items/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid menu item ID' });
      }
      
      const menuItemData = insertMenuItemSchema.partial().parse(req.body);
      const updatedMenuItem = await storage.updateMenuItem(id, menuItemData);
      
      if (!updatedMenuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.json(updatedMenuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error updating menu item:', error);
      res.status(500).json({ message: 'Failed to update menu item' });
    }
  });

  app.delete('/api/menu-items/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid menu item ID' });
      }
      
      const deleted = await storage.deleteMenuItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ message: 'Failed to delete menu item' });
    }
  });
  
  // Site settings routes
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });
  
  app.get('/api/settings/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      
      if (!setting) {
        return res.status(404).json({ message: `Setting with key '${key}' not found` });
      }
      
      res.json(setting);
    } catch (error) {
      console.error(`Error fetching setting ${req.params.key}:`, error);
      res.status(500).json({ message: 'Failed to fetch setting' });
    }
  });
  
  app.post('/api/settings', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { key, value } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ message: 'Key and value are required' });
      }
      
      const setting = await storage.upsertSetting(key, value);
      res.status(201).json(setting);
    } catch (error) {
      console.error('Error creating/updating setting:', error);
      res.status(500).json({ message: 'Failed to create/update setting' });
    }
  });
  
  app.delete('/api/settings/:key', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { key } = req.params;
      const deleted = await storage.deleteSetting(key);
      
      if (!deleted) {
        return res.status(404).json({ message: `Setting with key '${key}' not found` });
      }
      
      res.json({ message: `Setting with key '${key}' deleted successfully` });
    } catch (error) {
      console.error('Error deleting setting:', error);
      res.status(500).json({ message: 'Failed to delete setting' });
    }
  });

  // Special dishes routes
  app.get('/api/special-dishes', async (req, res) => {
    try {
      const dishes = await storage.getAllSpecialDishes();
      res.json(dishes);
    } catch (error) {
      console.error('Error fetching special dishes:', error);
      res.status(500).json({ message: 'Failed to fetch special dishes' });
    }
  });

  app.get('/api/special-dishes/active', async (req, res) => {
    try {
      const dishes = await storage.getActiveSpecialDishes();
      res.json(dishes);
    } catch (error) {
      console.error('Error fetching active special dishes:', error);
      res.status(500).json({ message: 'Failed to fetch active special dishes' });
    }
  });

  app.get('/api/special-dishes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid special dish ID' });
      }
      
      const dish = await storage.getSpecialDishById(id);
      
      if (!dish) {
        return res.status(404).json({ message: 'Special dish not found' });
      }
      
      res.json(dish);
    } catch (error) {
      console.error('Error fetching special dish:', error);
      res.status(500).json({ message: 'Failed to fetch special dish' });
    }
  });

  app.post('/api/special-dishes', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const dishData = insertSpecialDishSchema.parse(req.body);
      const newDish = await storage.createSpecialDish(dishData);
      res.status(201).json(newDish);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error creating special dish:', error);
      res.status(500).json({ message: 'Failed to create special dish' });
    }
  });

  app.put('/api/special-dishes/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid special dish ID' });
      }
      
      const dishData = insertSpecialDishSchema.partial().parse(req.body);
      const updatedDish = await storage.updateSpecialDish(id, dishData);
      
      if (!updatedDish) {
        return res.status(404).json({ message: 'Special dish not found' });
      }
      
      res.json(updatedDish);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Error updating special dish:', error);
      res.status(500).json({ message: 'Failed to update special dish' });
    }
  });

  app.delete('/api/special-dishes/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid special dish ID' });
      }
      
      const deleted = await storage.deleteSpecialDish(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Special dish not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting special dish:', error);
      res.status(500).json({ message: 'Failed to delete special dish' });
    }
  });

  // Add API route to make a user admin (requires environment secret)
  app.post('/api/auth/set-admin', async (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin token' });
    }
    
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Extract only the properties we need to update
      await storage.upsertUser({
        id: user.id,
        email: user.email || undefined,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        profileImageUrl: user.profileImageUrl || undefined,
        isAdmin: true
      });
      
      return res.status(200).json({ message: 'User is now an admin' });
    } catch (error) {
      console.error('Error setting admin status:', error);
      return res.status(500).json({ message: 'Failed to set admin status' });
    }
  });

  // Seed initial categories if none exist
  try {
    const allCategories = await storage.getAllCategories();
    if (allCategories.length === 0) {
      const categories = [
        { nameAr: 'المقبلات', nameTr: 'Başlangıçlar', slug: 'appetizers' },
        { nameAr: 'الأطباق الرئيسية', nameTr: 'Ana Yemekler', slug: 'main-dishes' },
        { nameAr: 'المشروبات', nameTr: 'İçecekler', slug: 'drinks' },
        { nameAr: 'الحلويات', nameTr: 'Tatlılar', slug: 'desserts' }
      ];
      
      for (const category of categories) {
        await storage.createCategory(category);
      }
      console.log('Initial categories created');
    }
  } catch (error) {
    console.error('Error seeding initial categories:', error);
  }

  const httpServer = createServer(app);
  return httpServer;
}
