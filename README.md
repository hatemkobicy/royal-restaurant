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

## Free Deployment Options

### Render (Recommended)

For detailed step-by-step instructions on deploying to Render's free tier, see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

### Railway

Railway offers a good free tier option with:
- Integrated PostgreSQL database
- Automatic deployments from GitHub
- Simple environment variable management
- Free tier includes $5 of usage credits monthly

### Netlify + Supabase

For front-end focused deployments:
- Deploy the frontend to Netlify (free tier)
- Use Supabase for database (free tier with limitations)

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

## Environment Variables

See `.env.example` for the required environment variables:

```
# Database Connection
DATABASE_URL=postgres://username:password@localhost:5432/royal_restaurant

# Session Configuration
SESSION_SECRET=your_secure_session_secret

# Admin Configuration
ADMIN_SECRET=your_admin_secret_key

# Node Environment
NODE_ENV=development
```