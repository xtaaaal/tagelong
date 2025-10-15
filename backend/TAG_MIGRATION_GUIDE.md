# Tag Migration Guide: From Enumeration to Many-to-Many Relations

This guide explains how to migrate from enumeration-based tags to proper many-to-many relations in Strapi.

## What We've Implemented

### 1. New Tag Collection Type
- **Location**: `backend/src/api/tag/content-types/tag/schema.json`
- **Features**:
  - `name`: String field for tag name (unique)
  - `slug`: Auto-generated UID for SEO-friendly URLs
  - `icon`: Media field for uploading SVG icons
  - `description`: Optional description field
  - `itineraries`: Many-to-many relation back to itineraries

### 2. Updated Itinerary Schema
- **Location**: `backend/src/api/itinerary/content-types/itinerary/schema.json`
- **Change**: `tags` field now uses `manyToMany` relation instead of `enumeration`

### 3. Tag Seeding System
- **Seed Data**: `backend/src/api/tag/seed.json` - Contains all predefined tags
- **Seeder Script**: `backend/scripts/seed-tags.js` - Creates tags in database
- **Commands**:
  - `npm run seed:tags` - Create all predefined tags
  - `npm run list:tags` - List existing tags

### 4. Updated CSV Importer
- **Location**: `backend/scripts/api-csv-importer.js`
- **Features**:
  - Automatically creates tags if they don't exist
  - Caches tag lookups for performance
  - Supports comma-separated tag values in CSV
  - Maps tag names to relation IDs

## Migration Steps

### Step 1: Restart Strapi to Apply Schema Changes
```bash
cd backend
# Stop any running Strapi instances
pkill -f "strapi develop"

# Clear cache and restart
rm -rf .tmp dist
npm run develop
```

### Step 2: Seed the Tags
```bash
# In a new terminal, after Strapi is running
cd backend
npm run seed:tags
```

### Step 3: Verify the Changes
1. **Check Strapi Admin Panel**:
   - Go to `http://localhost:1337/admin`
   - Navigate to "Content Manager" → "Tags"
   - You should see all the predefined tags

2. **Check Itinerary Schema**:
   - Go to "Content Manager" → "Itineraries"
   - Edit any itinerary
   - The "Tags" field should now be a multi-select dropdown with existing tags

### Step 4: Test CSV Import with New Tags
```bash
# Test with your CSV file
npm run import:csv data/your-file.csv
```

## Benefits of This Approach

### ✅ Advantages
1. **True Multi-Selection**: Users can select multiple tags per itinerary
2. **Scalable**: Easy to add new tags without schema changes
3. **Relational**: Proper database relationships with referential integrity
4. **Flexible**: Tags can have additional properties (color, description, etc.)
5. **SEO-Friendly**: Each tag gets a unique slug for URLs

### 🔄 Migration Considerations
1. **Existing Data**: Any existing enumeration-based tags will need to be migrated
2. **API Changes**: Frontend code needs to be updated to handle relation arrays
3. **Search/Filter**: May need to update search logic to work with relations

## Frontend Updates Needed

### Update Category Filter Component
The frontend `category-filter.tsx` component will need updates to:
1. Fetch tags from the new `/api/tags` endpoint
2. Handle tag relations instead of enumeration values
3. Map tag IDs to category filters

### Update Data Loaders
The `loaders.ts` file will need updates to:
1. Populate tag relations in API calls
2. Handle tag arrays instead of single values

## Production Deployment

### For Render Deployment
1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Implement many-to-many tag relations"
   git push origin main
   ```

2. **Redeploy on Render**:
   - Go to your Render dashboard
   - Trigger a manual deploy for your Strapi service
   - This will apply the schema changes to production

3. **Seed production tags**:
   ```bash
   # Set your production API token
   export STRAPI_API_TOKEN=your_production_token
   export STRAPI_URL=https://your-render-url.onrender.com
   
   # Run the seeder
   npm run seed:tags
   ```

### Database Migration
- Strapi will automatically create the new database tables
- Existing data will be preserved
- New tag relations will be empty until you re-import data

## Troubleshooting

### Common Issues

1. **Schema Validation Errors**:
   - Check that both `tag` and `itinerary` schemas are correctly defined
   - Ensure relation names match exactly (`mappedBy` and `inversedBy`)

2. **Tag Creation Fails**:
   - Verify API permissions for tag creation
   - Check that tag names don't contain invalid characters

3. **CSV Import Issues**:
   - Ensure API token is set: `export STRAPI_API_TOKEN=your_token`
   - Check that tag names in CSV match existing tags or can be created

### Verification Commands
```bash
# Check if Strapi is running
curl http://localhost:1337/_health

# List existing tags
npm run list:tags

# Test API endpoints
curl "http://localhost:1337/api/tags"
curl "http://localhost:1337/api/itineraries?populate=tags"
```

## Next Steps

1. **Test the migration locally**
2. **Update frontend components** to work with new tag structure
3. **Deploy to production**
4. **Re-import your CSV data** with the new tag system
5. **Update any existing itineraries** to use the new tag relations

This migration provides a much more robust and scalable foundation for your tagging system!
