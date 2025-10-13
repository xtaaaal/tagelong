# CSV Data Importer for Strapi Itineraries

This script allows you to import itinerary data from CSV files into your Strapi CMS using the Strapi 5 Document Service API.

## Features

- ✅ Import itineraries with full validation
- ✅ Support for complex Day components 
- ✅ Duplicate detection and prevention
- ✅ Comprehensive error handling and reporting
- ✅ Progress tracking during import
- ✅ Detailed import summary

## CSV Format

The CSV file should contain the following columns:

### Required Columns:
- `title` - The itinerary title (required)
- `country` - Country name (required)

### Optional Columns:
- `region` - Region/state within the country
- `city` - City name
- `tags` - One of: Adventure, Cultural, Food, Nature, Urban, Beach, Mountain, Historical
- `price` - Numeric price value
- `currency` - Currency code (defaults to USD)
- `isFree` - Boolean: true/false, yes/no, 1/0
- `highlights` - Text description of highlights
- `publishStatus` - One of: draft, public, private (defaults to draft)

### Day Component Columns (Optional):
For each day, you can add columns like:
- `day1_type` - Day type: "Arrival Day", "Departure Day", "Input Number", "Other Subtitle"
- `day1_number` - Day number (integer)
- `day1_subtitle` - Day subtitle/title
- `day1_recommendation` - Day recommendations/description
- `day1_maps_link` - Google Maps link
- `day1_show_distance` - Boolean for showing distance from last stop

You can add as many days as needed (day1, day2, day3, etc.)

## Usage

### Method 1: Using npm scripts

```bash
# Import a specific CSV file
npm run import:csv path/to/your-file.csv

# Import the example CSV file
npm run import:example
```

### Method 2: Direct node execution

```bash
# From the backend directory
node scripts/csv-importer.js path/to/your-file.csv

# Example with the provided sample file
node scripts/csv-importer.js data/itinerary-example.csv
```

## Example CSV Structure

See `data/itinerary-example.csv` for a complete example with 3 sample itineraries including day-by-day breakdowns.

## Import Process

1. **Validation**: Each row is validated for required fields
2. **Duplicate Check**: Existing itineraries with the same title are skipped
3. **Data Processing**: CSV data is parsed and converted to match Strapi schema
4. **Component Handling**: Day components are automatically created from day columns
5. **Creation**: New itinerary documents are created using Strapi 5 Document Service
6. **Reporting**: Detailed summary shows success/error counts

## Error Handling

The importer provides comprehensive error handling:
- Missing required fields are reported
- Invalid enum values are logged
- File not found errors are caught
- Database connection issues are handled
- Detailed error summary at the end

## Output Example

```
🚀 Initializing Strapi...
✅ Strapi initialized successfully
📁 Reading CSV file: data/itinerary-example.csv
📋 Found 3 records to import

⏳ Processing record 1/3: "Tokyo Cherry Blossom Tour"
✅ Successfully imported: "Tokyo Cherry Blossom Tour"

⏳ Processing record 2/3: "Bali Adventure"
✅ Successfully imported: "Bali Adventure"

⏳ Processing record 3/3: "Swiss Alps Hiking"
✅ Successfully imported: "Swiss Alps Hiking"

==================================================
📊 IMPORT SUMMARY
==================================================
✅ Successfully imported: 3
⚠️  Skipped (duplicates): 0
❌ Errors: 0
📝 Total processed: 3
==================================================
🎉 Import completed successfully!
```

## Tips

1. **Test with small batches first** - Start with a few records to test your CSV format
2. **Check your data** - Ensure enum values match exactly (case-sensitive)
3. **Backup your database** - Always backup before running large imports
4. **Review the summary** - Check the import summary for any errors or skipped records
5. **Draft status** - All imports start as drafts, publish them manually in Strapi admin

## Troubleshooting

### Common Issues:

1. **"Missing required fields"** - Ensure `title` and `country` columns exist and have values
2. **"CSV file not found"** - Check the file path is correct and file exists
3. **"Strapi initialization failed"** - Make sure Strapi is not already running
4. **Invalid enum values** - Check that tags and publishStatus match allowed values exactly

### Need Help?

1. Check the error details in the import summary
2. Verify your CSV format matches the example
3. Ensure all required Strapi services are running
4. Check console output for specific error messages
