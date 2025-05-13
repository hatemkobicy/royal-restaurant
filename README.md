# Royal Restaurant

A bilingual (Arabic/Turkish) restaurant website with an admin dashboard for content management.

## Features

- Responsive mobile-first design
- Bilingual support (Arabic/Turkish)
- Dynamic content presentation
- Admin dashboard for content management
- Menu categories and items management
- Site settings customization
- Working hours management

## Tech Stack

- React.js with TypeScript
- Express.js backend
- PostgreSQL database
- Tailwind CSS for styling
- JWT-based authentication
- Drizzle ORM

## Deployment Instructions for Render

### 1. Sign up for Render

Create an account at [render.com](https://render.com)

### 2. Create a New PostgreSQL Database

1. In the Render dashboard, click on "New" and select "PostgreSQL"
2. Configure your database:
   - Name: royal-restaurant-db
   - Database: royal_restaurant
   - User: royal_restaurant_user
3. Create the database and copy the "Internal Connection String"

### 3. Deploy the Web Service

1. In the Render dashboard, click on "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure your web service:
   - Name: royal-restaurant
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add the following environment variables:
   - `NODE_ENV`: production
   - `DATABASE_URL`: (the Internal Connection String from step 2)
   - `SESSION_SECRET`: (a random secure string)
   - `ADMIN_SECRET`: (a secure string for admin authentication)
5. Deploy the service

### 4. Apply Database Migrations

After deployment, connect to your service's shell via the Render dashboard and run:

```
npm run db:push
```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Admin Access

Access the admin dashboard at `/admin/login` with the default credentials:
- Username: admin
- Password: RoyalRestaurant2023

Change the admin password after first login for security.