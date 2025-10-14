# 🚀 Tagelong Production Deployment Guide

## 📋 Deployment Status

✅ **Phase 1 Complete**: Code Preparation
- [x] Production environment configurations created
- [x] Strapi configured for PostgreSQL and Cloudinary
- [x] Next.js configured for production
- [x] Dependencies updated

## 🎯 Next Steps: Deploy to Production

### Step 1: Deploy Backend to Railway (5-10 minutes)

1. **Go to [railway.app](https://railway.app)** and sign up with GitHub
2. **Create New Project** → Deploy from GitHub repo → Select `tagelong`
3. **Configure Service:**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start`
4. **Add PostgreSQL Service** (Railway > Add Service > PostgreSQL)
5. **Set Environment Variables** (copy from `RAILWAY_SETUP.md`):
   ```bash
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=1337
   DATABASE_CLIENT=postgres
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   # + JWT secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   ```

### Step 2: Set Up Cloudinary (2-3 minutes)

1. **Create free account** at [cloudinary.com](https://cloudinary.com)
2. **Get API credentials** from Dashboard
3. **Add to Railway environment variables:**
   ```bash
   CLOUDINARY_NAME=your-cloud-name
   CLOUDINARY_KEY=your-api-key
   CLOUDINARY_SECRET=your-api-secret
   ```

### Step 3: Deploy Frontend to Vercel (3-5 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub
2. **Import Project** → Select `tagelong` repo
3. **Configure:**
   - Framework: Next.js
   - Root Directory: `frontend`
4. **Set Environment Variable:**
   ```bash
   NEXT_PUBLIC_STRAPI_URL=https://your-railway-app.railway.app
   ```

### Step 4: Configure Domain with GoDaddy (10-15 minutes)

1. **In Vercel**: Settings > Domains → Add `yourdomain.com`
2. **In GoDaddy DNS Management**, add these records:
   ```
   A Record: @ → 76.76.19.19
   CNAME: www → cname.vercel-dns.com
   CNAME: api → your-railway-app.railway.app
   ```
3. **Wait 24-48 hours** for DNS propagation

### Step 5: Migrate Your Data (5 minutes)

1. **Export local data:**
   ```bash
   cd backend
   npm run export:data
   ```
2. **Set production environment variables:**
   ```bash
   export PRODUCTION_STRAPI_URL=https://your-railway-app.railway.app
   export STRAPI_API_TOKEN=your-production-api-token
   ```
3. **Import to production:**
   ```bash
   npm run import:data
   ```

## 💰 Expected Monthly Costs

- **Railway (Strapi + PostgreSQL)**: $5-8/month
- **Vercel (Next.js)**: Free
- **Cloudinary (Images)**: Free tier
- **Total**: **$5-8/month**

## 🔧 Troubleshooting

### Common Issues:
1. **Build fails on Railway**: Check environment variables are set
2. **Images not loading**: Verify Cloudinary credentials
3. **API not accessible**: Check Railway service is running
4. **Domain not working**: Wait for DNS propagation (up to 48 hours)

### Support Files Created:
- `RAILWAY_SETUP.md` - Detailed Railway instructions
- `VERCEL_SETUP.md` - Detailed Vercel instructions
- `backend/scripts/data-migrator.js` - Data migration tool
- `backend/config/env/production/` - Production configs

## 🎉 What You'll Have After Deployment

- ✅ **Live website** at your GoDaddy domain
- ✅ **Strapi admin panel** at `api.yourdomain.com/admin`
- ✅ **Automatic deployments** from GitHub
- ✅ **SSL certificates** (HTTPS)
- ✅ **Production database** with your itinerary data
- ✅ **Cloud image storage** via Cloudinary

**Ready to deploy? Start with Step 1! 🚀**
