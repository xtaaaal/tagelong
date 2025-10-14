# Environment Configuration for Deployment

## Backend Environment Variables (Strapi)

Add these environment variables to Railway:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# JWT Secrets (generate strong random strings)
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
JWT_SECRET=your-jwt-secret-here
API_TOKEN_SALT=your-api-token-salt-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
APP_KEYS=app-key-1,app-key-2,app-key-3,app-key-4

# Database (Railway will auto-provide DATABASE_URL)
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Cloudinary (for image uploads)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret

# CORS Configuration
CLIENT_URL=https://yourdomain.com
```

## Frontend Environment Variables (Next.js)

Add these environment variables to Vercel:

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-railway-app.railway.app
```

## How to Generate Secrets

Run these commands locally to generate secure secrets:

```bash
# Generate random strings for Strapi
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Railway Setup Steps

1. Connect your GitHub repository to Railway
2. Create a new project and select your repository
3. Add a PostgreSQL service
4. Configure environment variables in Railway dashboard
5. Deploy automatically triggers on git push

## Vercel Setup Steps

1. Import project from GitHub
2. Set Framework Preset to "Next.js"
3. Configure environment variables
4. Set up custom domain from GoDaddy
