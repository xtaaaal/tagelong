# Vercel Deployment Guide

## Step-by-Step Vercel Deployment

### 1. Create Vercel Account & Import Project
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "Add New" → "Project"
4. Import your `tagelong` GitHub repository

### 2. Configure Build Settings
1. **Framework Preset**: Next.js
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### 3. Environment Variables Setup
Add these variables in Vercel Dashboard > Settings > Environment Variables:

```bash
NEXT_PUBLIC_STRAPI_URL=https://your-railway-app.railway.app
```

**Important**: Replace `your-railway-app` with your actual Railway app URL

### 4. Domain Configuration
1. Go to Vercel Dashboard > Settings > Domains
2. Add your GoDaddy domain: `yourdomain.com`
3. Add www subdomain: `www.yourdomain.com`
4. Vercel will provide DNS configuration instructions

### 5. DNS Setup in GoDaddy
Update these DNS records in your GoDaddy account:

**A Records:**
```
Type: A
Name: @
Value: 76.76.19.19 (Vercel IP)
TTL: 600
```

**CNAME Records:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

**For Railway API subdomain:**
```
Type: CNAME
Name: api
Value: your-railway-app.railway.app
TTL: 600
```

### 6. SSL Certificates
- Vercel automatically provides SSL certificates
- SSL will be active within 24 hours of DNS propagation

### 7. Production Environment Update
After deployment, update your Railway environment:
```bash
CLIENT_URL=https://yourdomain.com
```

## Deployment Checklist
- [ ] Vercel project imported from GitHub
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Domain connected
- [ ] DNS records updated in GoDaddy
- [ ] SSL certificate active
- [ ] Railway CLIENT_URL updated

## Testing
1. Visit `https://yourdomain.com` - should load Next.js frontend
2. Visit `https://api.yourdomain.com` - should show Strapi API
3. Check that itineraries load properly on homepage
