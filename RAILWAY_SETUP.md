# Railway Deployment Guide

## Step-by-Step Railway Deployment

### 1. Create Railway Account & Connect GitHub
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `tagelong` repository

### 2. Configure the Backend Service
1. Railway will detect your backend as a Node.js application
2. Set the **Root Directory** to: `backend`
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm run start`

### 3. Add PostgreSQL Database
1. In your Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway will automatically create a database
4. The `DATABASE_URL` will be auto-configured

### 4. Environment Variables Setup
Add these variables in Railway Dashboard > Variables:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Generate these secrets (use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
JWT_SECRET=your-jwt-secret-here
API_TOKEN_SALT=your-api-token-salt-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
APP_KEYS=your-app-key-1,your-app-key-2,your-app-key-3,your-app-key-4

# Database - Railway auto-provides this
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Cloudinary (get these from cloudinary.com)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret

# CORS
CLIENT_URL=https://yourdomain.com
```

### 5. Custom Domain (Optional)
1. In Railway > Settings > Domains
2. Add custom domain: `api.yourdomain.com`
3. Update DNS records in GoDaddy (instructions will follow)

## Next Steps
After Railway deployment is successful:
1. Deploy frontend to Vercel
2. Configure domain DNS
3. Migrate data to production database

## Troubleshooting
- Check Railway logs if deployment fails
- Ensure all environment variables are set
- Verify PostgreSQL service is running
