# Tag Icon Upload Guide

## Updated Tag Schema

Your Tag collection now includes an **icon** field instead of color:

### Tag Schema Fields:
- **name**: Tag name (e.g., "Popular", "Adventure")
- **slug**: Auto-generated URL-friendly version (e.g., "popular", "adventure")
- **icon**: Image upload field for SVG icons
- **description**: Optional description
- **itineraries**: Many-to-many relation to itineraries

## How to Upload Tag Icons

### Step 1: Create Tags Manually
Since the API permissions need to be configured, create tags manually in Strapi Admin:

1. **Go to Content Manager** → **Tags**
2. **Click "Create new entry"**
3. **Fill in the basic information:**
   - **Name**: `Popular` (or any tag name)
   - **Slug**: Will auto-generate
   - **Description**: Optional

### Step 2: Upload Icons
For each tag, upload the corresponding SVG icon:

1. **In the tag edit form, find the "Icon" field**
2. **Click the upload button**
3. **Upload the corresponding SVG file from your frontend:**

| Tag Name | Icon File |
|----------|-----------|
| Popular | `popular.svg` |
| Adventure | `adventure.svg` |
| Art | `art.svg` |
| Budget | `budget.svg` |
| Cultural | `cultural.svg` |
| Culinary | `culinary.svg` |
| Eco-Tourism | `eco-tourism.svg` |
| Family | `family.svg` |
| Historical | `historical.svg` |
| Luxury | `luxury.svg` |
| Road Trip | `road-trip.svg` |
| Spiritual | `spiritual.svg` |
| Wellness | `wellness.svg` |
| Wildlife | `wildlife.svg` |

### Step 3: Copy Icons to Backend
To make the icons available for upload in Strapi:

1. **Copy icons from frontend to backend uploads:**
   ```bash
   # Create uploads directory if it doesn't exist
   mkdir -p backend/public/uploads/tag-icons
   
   # Copy all SVG icons
   cp frontend/public/assets/icons/*.svg backend/public/uploads/tag-icons/
   ```

2. **Or upload directly in Strapi Admin:**
   - Use the Media Library in Strapi Admin
   - Upload each SVG file
   - Assign to the corresponding tag

## Benefits of Icon-Based Tags

### ✅ Advantages:
1. **Visual Consistency**: Icons match your frontend design
2. **Better UX**: Users can quickly identify categories
3. **Scalable**: Easy to update icons without code changes
4. **Flexible**: Can use different icon formats (SVG, PNG, etc.)
5. **Professional**: More polished than color-based tags

### 🎯 Usage in Frontend:
Your frontend can now:
1. **Fetch tag data with icons** from `/api/tags?populate=icon`
2. **Display tag icons** in category filters
3. **Use tag icons** in itinerary cards
4. **Maintain visual consistency** across the app

## API Response Example

With icons, your tag API response will look like:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Popular",
        "slug": "popular",
        "description": "Most popular and trending destinations",
        "icon": {
          "url": "/uploads/popular_abc123.svg",
          "alternativeText": "Popular tag icon"
        }
      }
    }
  ]
}
```

## Next Steps

1. **Restart Strapi** to apply schema changes
2. **Create tags manually** in admin panel
3. **Upload corresponding icons** for each tag
4. **Test the many-to-many relationship** with itineraries
5. **Update frontend** to use tag icons instead of hardcoded icons

This approach gives you much more flexibility and maintains consistency between your backend and frontend!
