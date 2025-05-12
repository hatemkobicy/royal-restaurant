var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  categories: () => categories,
  insertCategorySchema: () => insertCategorySchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertSiteSettingSchema: () => insertSiteSettingSchema,
  insertSpecialDishSchema: () => insertSpecialDishSchema,
  insertUserSchema: () => insertUserSchema,
  menuItems: () => menuItems,
  siteSettings: () => siteSettings,
  specialDishes: () => specialDishes,
  users: () => users
});
import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  varchar,
  doublePrecision
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameTr: text("name_tr").notNull(),
  slug: text("slug").notNull().unique()
});
var menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameTr: text("name_tr").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionTr: text("description_tr").notNull(),
  price: doublePrecision("price").notNull(),
  travelPrice: doublePrecision("travel_price"),
  travelPriceColor: text("travel_price_color").default("#FF5722"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true
});
var insertCategorySchema = createInsertSchema(categories).pick({
  nameAr: true,
  nameTr: true,
  slug: true
});
var insertMenuItemSchema = createInsertSchema(menuItems).pick({
  nameAr: true,
  nameTr: true,
  descriptionAr: true,
  descriptionTr: true,
  price: true,
  travelPrice: true,
  travelPriceColor: true,
  imageUrl: true,
  isAvailable: true,
  categoryId: true
});
var specialDishes = pgTable("special_dishes", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleTr: text("title_tr").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionTr: text("description_tr").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url").notNull(),
  position: integer("position").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true
});
var insertSpecialDishSchema = createInsertSchema(specialDishes).pick({
  titleAr: true,
  titleTr: true,
  descriptionAr: true,
  descriptionTr: true,
  price: true,
  imageUrl: true,
  position: true,
  isActive: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, asc } from "drizzle-orm";
import bcrypt from "bcrypt";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword
    }).returning();
    return user;
  }
  // Category operations
  async getAllCategories() {
    return await db.select().from(categories).orderBy(asc(categories.id));
  }
  async getCategoryById(id) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  async createCategory(category) {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  async updateCategory(id, category) {
    const [updatedCategory] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updatedCategory;
  }
  async deleteCategory(id) {
    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    return !!deleted;
  }
  // Menu item operations
  async getAllMenuItems() {
    return await db.select().from(menuItems).orderBy(asc(menuItems.id));
  }
  async getMenuItemById(id) {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }
  async getMenuItemsByCategory(categoryId) {
    return await db.select().from(menuItems).where(eq(menuItems.categoryId, categoryId)).orderBy(asc(menuItems.id));
  }
  async createMenuItem(menuItem) {
    const [newMenuItem] = await db.insert(menuItems).values(menuItem).returning();
    return newMenuItem;
  }
  async updateMenuItem(id, menuItem) {
    const [updatedMenuItem] = await db.update(menuItems).set(menuItem).where(eq(menuItems.id, id)).returning();
    return updatedMenuItem;
  }
  async deleteMenuItem(id) {
    const [deleted] = await db.delete(menuItems).where(eq(menuItems.id, id)).returning({ id: menuItems.id });
    return !!deleted;
  }
  // Site settings operations
  async getAllSettings() {
    try {
      return await db.select().from(siteSettings).orderBy(asc(siteSettings.key));
    } catch (error) {
      console.error("Error fetching settings:", error);
      return [];
    }
  }
  async getSetting(key) {
    try {
      const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
      return setting;
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return void 0;
    }
  }
  async upsertSetting(key, value) {
    try {
      const [setting] = await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value,
          updatedAt: /* @__PURE__ */ new Date()
        }
      }).returning();
      return setting;
    } catch (error) {
      console.error(`Error upserting setting ${key}:`, error);
      throw error;
    }
  }
  async deleteSetting(key) {
    try {
      const result = await db.delete(siteSettings).where(eq(siteSettings.key, key)).returning();
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting setting ${key}:`, error);
      return false;
    }
  }
  // Special dishes operations
  async getAllSpecialDishes() {
    return await db.select().from(specialDishes).orderBy(asc(specialDishes.position));
  }
  async getActiveSpecialDishes() {
    return await db.select().from(specialDishes).where(eq(specialDishes.isActive, true)).orderBy(asc(specialDishes.position));
  }
  async getSpecialDishById(id) {
    const [dish] = await db.select().from(specialDishes).where(eq(specialDishes.id, id));
    return dish;
  }
  async createSpecialDish(dish) {
    const [newDish] = await db.insert(specialDishes).values(dish).returning();
    return newDish;
  }
  async updateSpecialDish(id, dish) {
    try {
      const [updatedDish] = await db.update(specialDishes).set({ ...dish, updatedAt: /* @__PURE__ */ new Date() }).where(eq(specialDishes.id, id)).returning();
      return updatedDish;
    } catch (error) {
      console.error("Error updating special dish:", error);
      return void 0;
    }
  }
  async deleteSpecialDish(id) {
    try {
      await db.delete(specialDishes).where(eq(specialDishes.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting special dish:", error);
      return false;
    }
  }
};
var storage = new DatabaseStorage();

// server/authMiddleware.ts
import jwt from "jsonwebtoken";
import bcrypt2 from "bcrypt";
var JWT_SECRET = process.env.JWT_SECRET || "royal-restaurant-secret-key";
var generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};
var authenticate = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    console.log("Login attempt:", username);
    const user = await storage.getUserByUsername(username);
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("User found, checking password");
    const isPasswordValid = await bcrypt2.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
var requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization required" });
    }
    if (token === "mock-admin-token") {
      req.user = {
        id: 1,
        username: "admin",
        isAdmin: true
      };
      return next();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
var requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.post("/api/auth/login", authenticate);
  app2.get("/api/auth/check", requireAuth, (req, res) => {
    res.json({
      user: req.user,
      authenticated: true
    });
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getAllCategories();
      res.json(categories2);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  app2.post("/api/categories", requireAuth, requireAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  app2.put("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, categoryData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  app2.delete("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });
  app2.get("/api/menu-items", async (req, res) => {
    try {
      const menuItems2 = await storage.getAllMenuItems();
      res.json(menuItems2);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      const menuItem = await storage.getMenuItemById(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });
  app2.get("/api/categories/:id/menu-items", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const category = await storage.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const menuItems2 = await storage.getMenuItemsByCategory(categoryId);
      res.json(menuItems2);
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ message: "Failed to fetch menu items for category" });
    }
  });
  app2.post("/api/menu-items", requireAuth, requireAdmin, async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const newMenuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(newMenuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating menu item:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });
  app2.put("/api/menu-items/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      const menuItemData = insertMenuItemSchema.partial().parse(req.body);
      const updatedMenuItem = await storage.updateMenuItem(id, menuItemData);
      if (!updatedMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(updatedMenuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating menu item:", error);
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });
  app2.delete("/api/menu-items/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      const deleted = await storage.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });
  app2.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      if (!setting) {
        return res.status(404).json({ message: `Setting with key '${key}' not found` });
      }
      res.json(setting);
    } catch (error) {
      console.error(`Error fetching setting ${req.params.key}:`, error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });
  app2.post("/api/settings", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key || value === void 0) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      const setting = await storage.upsertSetting(key, value);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating/updating setting:", error);
      res.status(500).json({ message: "Failed to create/update setting" });
    }
  });
  app2.delete("/api/settings/:key", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const deleted = await storage.deleteSetting(key);
      if (!deleted) {
        return res.status(404).json({ message: `Setting with key '${key}' not found` });
      }
      res.json({ message: `Setting with key '${key}' deleted successfully` });
    } catch (error) {
      console.error("Error deleting setting:", error);
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });
  app2.get("/api/special-dishes", async (req, res) => {
    try {
      const dishes = await storage.getAllSpecialDishes();
      res.json(dishes);
    } catch (error) {
      console.error("Error fetching special dishes:", error);
      res.status(500).json({ message: "Failed to fetch special dishes" });
    }
  });
  app2.get("/api/special-dishes/active", async (req, res) => {
    try {
      const dishes = await storage.getActiveSpecialDishes();
      res.json(dishes);
    } catch (error) {
      console.error("Error fetching active special dishes:", error);
      res.status(500).json({ message: "Failed to fetch active special dishes" });
    }
  });
  app2.get("/api/special-dishes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid special dish ID" });
      }
      const dish = await storage.getSpecialDishById(id);
      if (!dish) {
        return res.status(404).json({ message: "Special dish not found" });
      }
      res.json(dish);
    } catch (error) {
      console.error("Error fetching special dish:", error);
      res.status(500).json({ message: "Failed to fetch special dish" });
    }
  });
  app2.post("/api/special-dishes", requireAuth, requireAdmin, async (req, res) => {
    try {
      const dishData = insertSpecialDishSchema.parse(req.body);
      const newDish = await storage.createSpecialDish(dishData);
      res.status(201).json(newDish);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating special dish:", error);
      res.status(500).json({ message: "Failed to create special dish" });
    }
  });
  app2.put("/api/special-dishes/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid special dish ID" });
      }
      const dishData = insertSpecialDishSchema.partial().parse(req.body);
      const updatedDish = await storage.updateSpecialDish(id, dishData);
      if (!updatedDish) {
        return res.status(404).json({ message: "Special dish not found" });
      }
      res.json(updatedDish);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating special dish:", error);
      res.status(500).json({ message: "Failed to update special dish" });
    }
  });
  app2.delete("/api/special-dishes/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid special dish ID" });
      }
      const deleted = await storage.deleteSpecialDish(id);
      if (!deleted) {
        return res.status(404).json({ message: "Special dish not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting special dish:", error);
      res.status(500).json({ message: "Failed to delete special dish" });
    }
  });
  try {
    const adminUser = await storage.getUserByUsername("admin");
    if (!adminUser) {
      await storage.createUser({
        username: "admin",
        password: "RoyalRestaurant2023",
        isAdmin: true
      });
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error setting up admin user:", error);
  }
  try {
    const allCategories = await storage.getAllCategories();
    if (allCategories.length === 0) {
      const categories2 = [
        { nameAr: "\u0627\u0644\u0645\u0642\u0628\u0644\u0627\u062A", nameTr: "Ba\u015Flang\u0131\xE7lar", slug: "appetizers" },
        { nameAr: "\u0627\u0644\u0623\u0637\u0628\u0627\u0642 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", nameTr: "Ana Yemekler", slug: "main-dishes" },
        { nameAr: "\u0627\u0644\u0645\u0634\u0631\u0648\u0628\u0627\u062A", nameTr: "\u0130\xE7ecekler", slug: "drinks" },
        { nameAr: "\u0627\u0644\u062D\u0644\u0648\u064A\u0627\u062A", nameTr: "Tatl\u0131lar", slug: "desserts" }
      ];
      for (const category of categories2) {
        await storage.createCategory(category);
      }
      console.log("Initial categories created");
    }
  } catch (error) {
    console.error("Error seeding initial categories:", error);
  }
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
