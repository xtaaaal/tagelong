# Fix 403 Error - Enable Public API Access

## The Problem
Your Strapi backend at `https://tagelong.onrender.com` is working perfectly, but the API endpoints are protected by default in production, causing 403 Forbidden errors.

## Quick Fix - Make Itineraries Public

1. **Access Strapi Admin**: Go to https://tagelong.onrender.com/admin
2. **Create Admin Account** (if not done already)
3. **Go to Settings** → **Users & Permissions Plugin** → **Roles**
4. **Click "Public" role**
5. **Under "Permissions"**, find **"Itinerary"**
6. **Check these permissions:**
   - ✅ create
   - ✅ find 
   - ✅ findOne
7. **Save**

## Then Import Your Data
```bash
node scripts/api-csv-importer.js data/itn-20251013.csv https://tagelong.onrender.com
```

## Alternative: API Token Method (More Secure)

1. **Settings** → **API Tokens** → **Create new API Token**
2. **Name**: CSV Importer
3. **Type**: Full access
4. **Copy the token and run:**
   ```bash
   STRAPI_API_TOKEN=your-token node scripts/api-csv-importer.js data/itn-20251013.csv https://tagelong.onrender.com
   ```

## After Import Success
You can restrict the permissions again for security if desired.

Your backend is live and working - just need to configure API permissions!
