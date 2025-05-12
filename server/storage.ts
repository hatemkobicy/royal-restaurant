import { 
  users, 
  categories, 
  menuItems,
  siteSettings,
  specialDishes,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type MenuItem,
  type InsertMenuItem,
  type SiteSetting,
  type InsertSiteSetting,
  type SpecialDish,
  type InsertSpecialDish
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Menu item operations
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Special dishes operations
  getAllSpecialDishes(): Promise<SpecialDish[]>;
  getActiveSpecialDishes(): Promise<SpecialDish[]>;
  getSpecialDishById(id: number): Promise<SpecialDish | undefined>;
  createSpecialDish(dish: InsertSpecialDish): Promise<SpecialDish>;
  updateSpecialDish(id: number, dish: Partial<InsertSpecialDish>): Promise<SpecialDish | undefined>;
  deleteSpecialDish(id: number): Promise<boolean>;
  
  // Site settings operations
  getAllSettings(): Promise<SiteSetting[]>;
  getSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSetting(key: string, value: string): Promise<SiteSetting>;
  deleteSetting(key: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.id));
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    return !!deleted;
  }

  // Menu item operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(asc(menuItems.id));
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId))
      .orderBy(asc(menuItems.id));
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db.insert(menuItems).values(menuItem).returning();
    return newMenuItem;
  }

  async updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set(menuItem)
      .where(eq(menuItems.id, id))
      .returning();
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning({ id: menuItems.id });
    return !!deleted;
  }
  
  // Site settings operations
  async getAllSettings(): Promise<SiteSetting[]> {
    try {
      return await db.select().from(siteSettings).orderBy(asc(siteSettings.key));
    } catch (error) {
      console.error('Error fetching settings:', error);
      return [];
    }
  }
  
  async getSetting(key: string): Promise<SiteSetting | undefined> {
    try {
      const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
      return setting;
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return undefined;
    }
  }
  
  async upsertSetting(key: string, value: string): Promise<SiteSetting> {
    try {
      const [setting] = await db
        .insert(siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { 
            value,
            updatedAt: new Date()
          },
        })
        .returning();
      return setting;
    } catch (error) {
      console.error(`Error upserting setting ${key}:`, error);
      throw error;
    }
  }
  
  async deleteSetting(key: string): Promise<boolean> {
    try {
      const result = await db.delete(siteSettings).where(eq(siteSettings.key, key)).returning();
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting setting ${key}:`, error);
      return false;
    }
  }

  // Special dishes operations
  async getAllSpecialDishes(): Promise<SpecialDish[]> {
    return await db.select().from(specialDishes).orderBy(asc(specialDishes.position));
  }

  async getActiveSpecialDishes(): Promise<SpecialDish[]> {
    return await db.select().from(specialDishes)
      .where(eq(specialDishes.isActive, true))
      .orderBy(asc(specialDishes.position));
  }

  async getSpecialDishById(id: number): Promise<SpecialDish | undefined> {
    const [dish] = await db.select().from(specialDishes).where(eq(specialDishes.id, id));
    return dish;
  }

  async createSpecialDish(dish: InsertSpecialDish): Promise<SpecialDish> {
    const [newDish] = await db.insert(specialDishes).values(dish).returning();
    return newDish;
  }

  async updateSpecialDish(id: number, dish: Partial<InsertSpecialDish>): Promise<SpecialDish | undefined> {
    try {
      const [updatedDish] = await db
        .update(specialDishes)
        .set({...dish, updatedAt: new Date()})
        .where(eq(specialDishes.id, id))
        .returning();
      return updatedDish;
    } catch (error) {
      console.error("Error updating special dish:", error);
      return undefined;
    }
  }

  async deleteSpecialDish(id: number): Promise<boolean> {
    try {
      await db.delete(specialDishes).where(eq(specialDishes.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting special dish:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
