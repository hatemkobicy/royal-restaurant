# Deploying Royal Restaurant on Render

This guide provides step-by-step instructions for deploying the Royal Restaurant application on Render using the free tier.

## Prerequisites

- A [Render](https://render.com) account
- Your project code in a GitHub repository

## Step 1: Set Up the PostgreSQL Database

1. Log in to your Render account
2. Click on "New" and select "PostgreSQL"
3. Configure your database:
   - Name: `royal-restaurant-db`
   - Database: `royal_restaurant`
   - User: `royal_restaurant_user`
   - Region: Choose the closest to your users
   - PostgreSQL Version: 15 (or latest available)
   - Instance Type: Free
4. Click "Create Database"
5. Once created, note the "Internal Connection String" - you'll need this for the web service

## Step 2: Deploy the Web Service

1. In Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `royal-restaurant`
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: Free
   - Select "Auto-Deploy" if you want automatic deployments on repository changes

4. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (paste the Internal Connection String from your database)
   - `SESSION_SECRET`: (generate a random secure string)
   - `ADMIN_SECRET`: (generate a random secure string or use your preferred value)

5. Click "Create Web Service"

## Step 3: Set Up the Database Schema and Initial Data

After your web service is deployed, you'll need to set up your database schema:

1. In your Render dashboard, go to your web service
2. Click on "Shell" to access the terminal
3. Run the database migrations:
   ```
   NODE_ENV=production npx drizzle-kit push
   ```
4. Execute the database setup script to create the initial admin user and default data:
   ```
   NODE_ENV=production node -e "
   const { db } = require('./dist/db.js');
   const schema = require('./dist/schema.js');
   const { eq } = require('drizzle-orm');
   const bcrypt = require('bcrypt');

   async function setupDatabase() {
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
     }
   }

   setupDatabase().then(() => console.log('Setup complete')).catch(console.error);
   "
   ```

## Step 4: Access Your Deployed Application

Once deployment is complete, you can access your application at:
- `https://royal-restaurant.onrender.com`

## Admin Access

The default admin credentials are:
- Username: `admin`
- Password: `RoyalRestaurant2023`

Access the admin dashboard at `/admin/login`

**Important:** Change the default password after your first login for security reasons.

## Limitations of Free Tier on Render

- Your web service will spin down after 15 minutes of inactivity
- The service has a limited number of running hours per month
- The PostgreSQL database has a 1GB storage limit
- Free databases are deleted after 90 days of inactivity

These limitations are sufficient for smaller restaurants and demonstrations, but you may want to upgrade to a paid plan for production use with higher traffic.