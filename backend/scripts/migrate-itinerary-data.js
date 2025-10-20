const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const axios = require('axios');

class ItineraryDataMigrator {
  constructor(baseURL = 'http://localhost:1337') {
    this.baseURL = baseURL;
    this.results = {
      success: 0,
      errors: 0,
      skipped: 0,
      details: []
    };
  }

  async migrateData() {
    try {
      console.log('🚀 Starting itinerary data migration...');
      
      // Check if Strapi is running
      await this.checkStrapiConnection();
      
      // Read the old CSV data
      const csvFilePath = path.join(__dirname, '../data/itn-20251013.csv');
      console.log(`📁 Reading CSV file: ${csvFilePath}`);
      
      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`CSV file not found: ${csvFilePath}`);
      }

      const data = await this.parseCSV(csvFilePath);
      console.log(`📋 Found ${data.length} records to migrate`);

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        console.log(`\n⏳ Processing record ${i + 1}/${data.length}: "${row.title}"`);
        
        try {
          await this.migrateItinerary(row);
          this.results.success++;
          console.log(`✅ Successfully migrated: "${row.title}"`);
        } catch (error) {
          this.results.errors++;
          this.results.details.push({
            row: i + 1,
            title: row.title || 'Unknown',
            error: error.message
          });
          console.error(`❌ Error migrating "${row.title}": ${error.message}`);
        }
      }

      this.printSummary();
      
    } catch (error) {
      console.error('💥 Fatal error during migration:', error.message);
      throw error;
    }
  }

  async checkStrapiConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/api/itineraries`);
      console.log('✅ Strapi connection verified');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Strapi server is not running. Please start it with: npm run develop');
      }
      // If it's a 401/403, that's okay - it means Strapi is running
      console.log('✅ Strapi connection verified');
    }
  }

  async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  async migrateItinerary(row) {
    // Validate required fields
    if (!row.title || !row.country) {
      throw new Error('Missing required fields: title and country are mandatory');
    }

    // Transform the data to match new schema
    const itineraryData = {
      data: {
        title: row.title.trim(),
        country: row.country.trim(),
        region: row.region?.trim() || null,
        city: row.city?.trim() || null,
        tags: this.parseTags(row.tags),
        price: this.parseDecimal(row.price),
        // Remove currency field as per new schema
        isFree: this.parseBoolean(row.isFree),
        highlights: row.highlights?.trim() || null,
        publishStatus: this.parseEnumValue(row.publishStatus, ['draft', 'public', 'private']) || 'draft',
        // Add themeLayout field (default to Daily Style)
        themeLayout: 'Daily Style',
        // Transform Day components from old format to new format
        Day: this.transformDayComponents(row)
      }
    };

    // Check for existing itinerary with same title to avoid duplicates
    try {
      const response = await axios.get(`${this.baseURL}/api/itineraries`, {
        params: {
          'filters[title][$eq]': itineraryData.data.title
        }
      });
      
      if (response.data.data && response.data.data.length > 0) {
        console.log(`⚠️  Itinerary "${itineraryData.data.title}" already exists, skipping...`);
        this.results.skipped++;
        return;
      }
    } catch (error) {
      // If we can't check for duplicates, continue anyway
      console.log('⚠️  Could not check for duplicates, proceeding...');
    }

    // Create the itinerary using Strapi API
    const response = await axios.post(`${this.baseURL}/api/itineraries`, itineraryData);
    return response.data;
  }

  transformDayComponents(row) {
    const days = [];
    
    // Process each day (day1, day2, etc.)
    for (let dayNum = 1; dayNum <= 13; dayNum++) {
      const dayPrefix = `day${dayNum}`;
      
      // Check if this day has data
      if (!row[`${dayPrefix}_type`] && !row[`${dayPrefix}_number`]) {
        continue;
      }

      const dayData = {
        dayNumber: this.parseInteger(row[`${dayPrefix}_number`]),
        subtitle: row[`${dayPrefix}_subtitle`]?.trim() || null,
        picture: [], // Will be empty for now, can be populated later
        content: this.transformRecommendations(row, dayPrefix),
        googleMapsLink: this.collectGoogleMapsLinks(row, dayPrefix),
        youtubeLink: [], // Empty for now, can be populated later
        showDistanceFromLastStop: this.parseBoolean(row[`${dayPrefix}_show_distance`]) || false,
        fileUpload: null // Will be empty for now
      };

      days.push(dayData);
    }

    return days;
  }

  transformRecommendations(row, dayPrefix) {
    const recommendations = [];
    
    // Collect all recommendation fields for this day (recommendation_1a, recommendation_1b, etc.)
    for (let subIndex = 1; subIndex <= 3; subIndex++) {
      const suffix = String.fromCharCode(96 + subIndex); // a, b, c
      const fieldName = `${dayPrefix}_recommendation_${suffix}`;
      
      if (row[fieldName] && row[fieldName].trim()) {
        recommendations.push(row[fieldName].trim());
      }
    }
    
    // Join all recommendations into rich text content
    return recommendations.length > 0 ? recommendations.join('\n\n') : null;
  }

  collectGoogleMapsLinks(row, dayPrefix) {
    const links = [];
    
    // Collect all Google Maps links for this day
    for (let subIndex = 1; subIndex <= 3; subIndex++) {
      const suffix = String.fromCharCode(96 + subIndex); // a, b, c
      
      // Check for multiple links per sub-item (aa, ab, ac)
      for (let linkIndex = 1; linkIndex <= 3; linkIndex++) {
        const linkSuffix = String.fromCharCode(96 + linkIndex); // a, b, c
        const fieldName = `${dayPrefix}_googleMapsLink_${suffix}${linkSuffix}`;
        
        if (row[fieldName] && row[fieldName].trim()) {
          links.push(row[fieldName].trim());
        }
      }
    }
    
    return links;
  }

  parseTags(tagsString) {
    if (!tagsString) return [];
    
    // Split by comma and clean up
    return tagsString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  parseDecimal(value) {
    if (!value || value === '') return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }

  parseInteger(value) {
    if (!value || value === '') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  }

  parseBoolean(value) {
    if (!value) return false;
    const lowerValue = value.toString().toLowerCase();
    return ['true', 'yes', '1', 'y'].includes(lowerValue);
  }

  parseEnumValue(value, allowedValues) {
    if (!value) return null;
    const trimmedValue = value.trim();
    return allowedValues.includes(trimmedValue) ? trimmedValue : null;
  }

  printSummary() {
    console.log('\n==================================================');
    console.log('📊 MIGRATION SUMMARY');
    console.log('==================================================');
    console.log(`✅ Successfully migrated: ${this.results.success}`);
    console.log(`⚠️  Skipped (duplicates): ${this.results.skipped}`);
    console.log(`❌ Errors: ${this.results.errors}`);
    console.log(`📝 Total processed: ${this.results.success + this.results.skipped + this.results.errors}`);
    
    if (this.results.details.length > 0) {
      console.log('\n📋 Error Details:');
      this.results.details.forEach(detail => {
        console.log(`   Row ${detail.row}: "${detail.title}" - ${detail.error}`);
      });
    }
    
    console.log('==================================================');
    console.log('🎉 Migration completed!');
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  const migrator = new ItineraryDataMigrator();
  migrator.migrateData()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    });
}

module.exports = ItineraryDataMigrator;
