import { db } from './server/db.js';
import * as schema from './shared/schema.js';
import { eq } from 'drizzle-orm';
import { exec } from 'child_process';
import { promisify } from 'util';
import bcrypt from 'bcrypt';

const execPromise = promisify(exec);

async function setupDatabase() {
  console.log('Starting database setup...');
  
  try {
    // Run the Drizzle migrations
    console.log('Running database migrations...');
    await execPromise('npm run db:push');
    
    console.log('Creating admin user...');
    
    // Check if admin user exists
    const existingAdmins = await db.select().from(schema.users).where(eq(schema.users.username, 'admin'));
    
    if (existingAdmins.length === 0) {
      // Create admin user if it doesn't exist
      const hashedPassword = await bcrypt.hash('RoyalRestaurant2023', 10);
      
      await db.insert(schema.users).values({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
      
      console.log('Admin user created successfully!');
    } else {
      console.log('Admin user already exists, skipping creation.');
    }
    
    // Add default categories if none exist
    const categories = await db.select().from(schema.categories);
    
    if (categories.length === 0) {
      console.log('Adding default categories...');
      
      await db.insert(schema.categories).values([
        { nameAr: 'المقبلات', nameTr: 'Başlangıçlar', imageUrl: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
        { nameAr: 'الأطباق الرئيسية', nameTr: 'Ana Yemekler', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' },
        { nameAr: 'الحلويات', nameTr: 'Tatlılar', imageUrl: 'https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg' },
        { nameAr: 'المشروبات', nameTr: 'İçecekler', imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80' }
      ]);
      
      console.log('Default categories added successfully!');
    } else {
      console.log('Categories already exist, skipping creation.');
    }
    
    // Add default settings if none exist
    const settings = await db.select().from(schema.siteSettings);
    
    if (settings.length === 0) {
      console.log('Adding default settings...');
      
      await db.insert(schema.siteSettings).values([
        { key: 'restaurantName', value: 'Royal Restaurant' },
        { key: 'restaurantAddress', value: 'İsmetpaşa, 53. Sk. NO:9A, 34270 Sultangazi/İstanbul' },
        { key: 'restaurantPhone', value: '+90 543 488 88 28' },
        { key: 'restaurantEmail', value: 'info@royalrestaurant.com' },
        { key: 'workingHours', value: JSON.stringify({
          monday: { open: '09:00', close: '22:00' },
          tuesday: { open: '09:00', close: '22:00' },
          wednesday: { open: '09:00', close: '22:00' },
          thursday: { open: '09:00', close: '22:00' },
          friday: { open: '09:00', close: '23:00' },
          saturday: { open: '10:00', close: '23:00' },
          sunday: { open: '10:00', close: '22:00' }
        })},
        { key: 'restaurantStory', value: 'Royal Restaurant has been serving traditional Turkish and Middle Eastern cuisine since 1995. Our recipes have been passed down through generations, offering an authentic taste of our heritage.' }
      ]);
      
      console.log('Default settings added successfully!');
    } else {
      console.log('Settings already exist, skipping creation.');
    }
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

setupDatabase();