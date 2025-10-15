# Tag Ordering Guide

This guide explains how to control the order of tags in your category filter on the frontend.

## 🎯 **How Tag Ordering Works**

Tags are now displayed in the category filter based on their `order` field in Strapi. Lower numbers appear first.

### **Order Priority:**
1. **Order field** (primary) - Lower numbers = higher priority
2. **Name** (fallback) - Alphabetical if order is the same
3. **Default** - Tags without order appear at the end

## 🛠️ **Methods to Control Tag Order**

### **Method 1: Strapi Admin Panel (Recommended)**

1. **Go to Strapi Admin**: `https://api.tagelong.com/admin`
2. **Navigate to**: Content Manager → Tags
3. **Edit each tag** and set the `Order` field:
   - Popular: 1
   - Adventure: 2
   - Cultural: 3
   - Culinary: 4
   - Art: 5
   - Historical: 6
   - Wellness: 7
   - Family: 8
   - Budget: 9
   - Luxury: 10
   - Eco-Tourism: 11
   - Wildlife: 12
   - Road Trip: 13
   - Spiritual: 14

### **Method 2: Command Line Script**

#### **List Current Order:**
```bash
# Local development
STRAPI_API_TOKEN=your_token npm run tag:list

# Production
STRAPI_API_TOKEN=your_production_token npm run tag:list https://api.tagelong.com
```

#### **Set Default Order:**
```bash
# Local development
STRAPI_API_TOKEN=your_token npm run tag:reorder

# Production
STRAPI_API_TOKEN=your_production_token npm run tag:reorder https://api.tagelong.com
```

### **Method 3: Direct API Calls**

```bash
# Update a specific tag's order
curl -X PUT "https://api.tagelong.com/api/tags/TAG_ID" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"order": 1}}'
```

## 📋 **Default Tag Order**

Here's the recommended order for optimal user experience:

| Order | Tag | Reason |
|-------|-----|--------|
| 1 | Popular | Most commonly used |
| 2 | Adventure | High engagement |
| 3 | Cultural | Broad appeal |
| 4 | Culinary | Popular category |
| 5 | Art | Cultural subset |
| 6 | Historical | Educational value |
| 7 | Wellness | Health trend |
| 8 | Family | Specific audience |
| 9 | Budget | Practical consideration |
| 10 | Luxury | Premium segment |
| 11 | Eco-Tourism | Growing trend |
| 12 | Wildlife | Niche interest |
| 13 | Road Trip | Specific travel type |
| 14 | Spiritual | Specialized interest |

## 🔄 **Updating Existing Tags**

If you already have tags in production, you can update their order:

### **Option A: Manual Update**
1. Go to Strapi admin panel
2. Edit each tag individually
3. Set the order field
4. Save changes

### **Option B: Bulk Update Script**
```bash
# This will set all tags to the default order
STRAPI_API_TOKEN=your_token npm run tag:reorder https://api.tagelong.com
```

## 🎨 **Frontend Behavior**

- **Loading State**: Shows skeleton while fetching tags
- **Sorted Display**: Tags appear in order field sequence
- **Responsive**: Maintains order across all screen sizes
- **Caching**: Order is cached for 1 hour for performance

## 🚀 **Deployment Steps**

1. **Update Schema**: Push the new `order` field to production
2. **Set Order Values**: Use admin panel or script to set order
3. **Deploy Frontend**: Frontend will automatically use the new ordering
4. **Verify**: Check that tags appear in the correct order

## 🔧 **Troubleshooting**

### **Tags Not Appearing in Order:**
- Check that `order` field is set in Strapi
- Verify frontend is fetching from production API
- Clear browser cache

### **Order Not Updating:**
- Ensure API token has write permissions
- Check Strapi admin panel for validation errors
- Verify tag IDs are correct

### **Script Errors:**
- Verify `STRAPI_API_TOKEN` is set correctly
- Check API endpoint URL is accessible
- Ensure token has sufficient permissions

## 📊 **Monitoring**

You can monitor tag order changes by:
- Checking Strapi admin panel
- Using the `npm run tag:list` command
- Monitoring frontend category filter display

This system gives you complete control over how tags appear to your users while maintaining a clean, professional interface.
