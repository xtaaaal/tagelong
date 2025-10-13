const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class ItineraryCSVImporter {
  constructor() {
    this.results = {
      success: 0,
      errors: 0,
      skipped: 0,
      details: []
    };
  }

  async importFromCSV(csvFilePath) {
    try {
      console.log(`📁 Reading CSV file: ${csvFilePath}`);
      
      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`CSV file not found: ${csvFilePath}`);
      }

      const data = await this.parseCSV(csvFilePath);
      console.log(`📋 Found ${data.length} records to import`);

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        console.log(`\n⏳ Processing record ${i + 1}/${data.length}: "${row.title}"`);
        
        try {
          await this.importItinerary(row);
          this.results.success++;
          console.log(`✅ Successfully imported: "${row.title}"`);
        } catch (error) {
          this.results.errors++;
          this.results.details.push({
            row: i + 1,
            title: row.title || 'Unknown',
            error: error.message
          });
          console.error(`❌ Error importing "${row.title}": ${error.message}`);
        }
      }

      this.printSummary();
      
    } catch (error) {
      console.error('💥 Fatal error during import:', error.message);
      throw error;
    }
  }

  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  async importItinerary(row) {
    // Validate required fields
    if (!row.title || !row.country) {
      throw new Error('Missing required fields: title and country are mandatory');
    }

    // Parse and prepare the itinerary data
    const itineraryData = {
      title: row.title.trim(),
      country: row.country.trim(),
      region: row.region?.trim() || null,
      city: row.city?.trim() || null,
      tags: this.parseEnumValue(row.tags, ['Adventure', 'Cultural', 'Food', 'Nature', 'Urban', 'Beach', 'Mountain', 'Historical']),
      price: this.parseDecimal(row.price),
      currency: row.currency?.trim() || 'USD',
      isFree: this.parseBoolean(row.isFree),
      highlights: row.highlights?.trim() || null,
      publishStatus: this.parseEnumValue(row.publishStatus, ['draft', 'public', 'private']) || 'draft',
      // Handle Day components if they exist in CSV
      Day: this.parseDayComponents(row)
    };

    // Check for existing itinerary with same title to avoid duplicates
    const existingItinerary = await strapi.documents('api::itinerary.itinerary').findFirst({
      filters: {
        title: itineraryData.title
      }
    });

    if (existingItinerary) {
      console.log(`⚠️  Itinerary "${itineraryData.title}" already exists, skipping...`);
      this.results.skipped++;
      return;
    }

    // Create the itinerary using Strapi 5 Document Service
    const createdItinerary = await strapi.documents('api::itinerary.itinerary').create({
      data: itineraryData,
      status: 'draft' // You can change this to 'published' if needed
    });

    return createdItinerary;
  }

  parseDayComponents(row) {
    const days = [];
    
    // Check if there are day-related columns in the CSV
    // This assumes columns like: day1_type, day1_number, day1_subtitle, day1_recommendation, etc.
    let dayIndex = 1;
    
    while (row[`day${dayIndex}_subtitle`] || row[`day${dayIndex}_recommendation`]) {
      const day = {
        dayType: row[`day${dayIndex}_type`] || 'Input Number',
        dayNumber: parseInt(row[`day${dayIndex}_number`]) || dayIndex,
        subtitle: row[`day${dayIndex}_subtitle`]?.trim() || null,
        recommendation: row[`day${dayIndex}_recommendation`]?.trim() || null,
        googleMapsLink: row[`day${dayIndex}_maps_link`]?.trim() || null,
        showDistanceFromLastStop: this.parseBoolean(row[`day${dayIndex}_show_distance`])
      };
      
      // Only add days that have meaningful content
      if (day.subtitle || day.recommendation) {
        days.push(day);
      }
      
      dayIndex++;
    }
    
    return days.length > 0 ? days : null;
  }

  parseDecimal(value) {
    if (!value || value.trim() === '') return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }

  parseBoolean(value) {
    if (!value || value.trim() === '') return false;
    const lowerValue = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'on'].includes(lowerValue);
  }

  parseEnumValue(value, allowedValues) {
    if (!value || value.trim() === '') return null;
    const trimmedValue = value.trim();
    return allowedValues.includes(trimmedValue) ? trimmedValue : null;
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully imported: ${this.results.success}`);
    console.log(`⚠️  Skipped (duplicates): ${this.results.skipped}`);
    console.log(`❌ Errors: ${this.results.errors}`);
    console.log(`📝 Total processed: ${this.results.success + this.results.skipped + this.results.errors}`);
    
    if (this.results.details.length > 0) {
      console.log('\n📋 Error Details:');
      this.results.details.forEach(detail => {
        console.log(`  Row ${detail.row} (${detail.title}): ${detail.error}`);
      });
    }
    
    console.log('='.repeat(50));
  }
}

// Main execution function
async function main() {
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.error('❌ Please provide a CSV file path');
    console.log('Usage: node scripts/csv-importer.js <path-to-csv-file>');
    process.exit(1);
  }

  const importer = new ItineraryCSVImporter();
  
  try {
    await importer.importFromCSV(csvFilePath);
    console.log('🎉 Import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Import failed:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = ItineraryCSVImporter;