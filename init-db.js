// Initialize database schema
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './shared/schema.js';

neonConfig.webSocketConstructor = ws;

async function main() {
  console.log('Initializing database schema...');
  
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool, schema });

    // Execute schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_tr TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_tr TEXT NOT NULL,
        description_ar TEXT NOT NULL,
        description_tr TEXT NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        image_url TEXT,
        is_available BOOLEAN NOT NULL DEFAULT true,
        category_id INTEGER NOT NULL REFERENCES categories(id)
      );
    `);
    
    console.log('Database schema initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database schema:', error);
    process.exit(1);
  }
}

main();