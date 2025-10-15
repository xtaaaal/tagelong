# Production Tag Setup Guide

## After Render Deployment

### Step 1: Verify Deployment
1. Go to `https://api.tagelong.com/admin`
2. Check that the Tag collection appears in Content Manager
3. Verify the new schema is applied

### Step 2: Set Up API Permissions (if using script)

**In Production Strapi Admin:**
1. Go to **Settings** → **Users & Permissions** → **Roles**
2. Click on **Public** role
3. Scroll to **Tag** section
4. Enable these permissions:
   - ✅ **find** (to read tags)
   - ✅ **findOne** (to read individual tags)
   - ✅ **create** (to create tags via API)
5. Click **Save**

### Step 3: Create Tags

#### Option A: Manual Creation (Recommended)
1. **Content Manager** → **Tags** → **Create new entry**
2. **For each tag:**
   - **Name**: Popular, Adventure, Art, Budget, Cultural, Culinary, Eco-Tourism, Family, Historical, Luxury, Road Trip, Spiritual, Wellness, Wildlife
   - **Slug**: Auto-generated
   - **Description**: Optional
   - **Icon**: Upload corresponding SVG from your frontend icons

#### Option B: Use Seeder Script
```bash
# Set production environment
export STRAPI_URL=https://api.tagelong.com
export STRAPI_API_TOKEN=your_production_api_token

# Run seeder
cd backend
npm run seed:tags
```

### Step 4: Test Tag Relations
1. **Go to Content Manager** → **Itineraries**
2. **Edit any itinerary**
3. **Verify Tags field** shows as multi-select dropdown
4. **Select multiple tags** and save
5. **Check API response** includes tag relations

### Step 5: Re-import CSV Data (Optional)
If you want to re-import your CSV with the new tag system:

```bash
# Set production environment
export STRAPI_URL=https://api.tagelong.com
export STRAPI_API_TOKEN=your_production_api_token

# Test first
npm run import:csv data/your-file.csv --test

# Full import
npm run import:csv data/your-file.csv
```

## Expected Results

✅ **Tag Collection**: 14 predefined tags with icons
✅ **Many-to-Many Relations**: Itineraries can have multiple tags
✅ **API Endpoints**: `/api/tags` and `/api/itineraries?populate=tags`
✅ **Admin Interface**: Multi-select tag dropdown in itinerary forms
✅ **Frontend Ready**: Tag data available for category filters

## Troubleshooting

### Common Issues:
1. **403 Forbidden**: Check API permissions for Tag collection
2. **Schema Errors**: Ensure Render deployment completed successfully
3. **Missing Tags**: Verify tags were created manually or via script
4. **Icon Upload Issues**: Check Cloudinary configuration in production

### Verification Commands:
```bash
# Check tags API
curl "https://api.tagelong.com/api/tags"

# Check itineraries with tags
curl "https://api.tagelong.com/api/itineraries?populate=tags&pagination[limit]=1"
```
