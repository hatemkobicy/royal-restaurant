import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  varchar,
  doublePrecision,
  foreignKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameTr: text("name_tr").notNull(),
  slug: text("slug").notNull().unique(),
});

// Menu items table
export const menuItems = pgTable("menu_items", {
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
  categoryId: integer("category_id").notNull().references(() => categories.id),
});

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Schema for inserting categories
export const insertCategorySchema = createInsertSchema(categories).pick({
  nameAr: true,
  nameTr: true,
  slug: true,
});

// Schema for inserting menu items
export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  nameAr: true,
  nameTr: true,
  descriptionAr: true,
  descriptionTr: true,
  price: true,
  travelPrice: true,
  travelPriceColor: true,
  imageUrl: true,
  isAvailable: true,
  categoryId: true,
});

// Special dishes table for featured dishes on homepage
export const specialDishes = pgTable("special_dishes", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
// Site settings for global configuration
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
});

// Schema for inserting special dishes
export const insertSpecialDishSchema = createInsertSchema(specialDishes).pick({
  titleAr: true,
  titleTr: true,
  descriptionAr: true,
  descriptionTr: true,
  price: true,
  imageUrl: true,
  position: true,
  isActive: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type SpecialDish = typeof specialDishes.$inferSelect;
export type InsertSpecialDish = z.infer<typeof insertSpecialDishSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;


