const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

class ItineraryAPIImporter {
  constructor(baseURL = 'http://localhost:1337') {
    this.baseURL = baseURL;
    this.apiToken = process.env.STRAPI_API_TOKEN;
    this.headers = {
      'Content-Type': 'application/json',
      ...(this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {})
    };
    this.results = {
      success: 0,
      errors: 0,
      skipped: 0,
      details: []
    };
    this.tagCache = new Map(); // Cache for tag lookups
  }

  async importFromCSV(csvFilePath) {
    try {
      console.log('🚀 Starting CSV import via Strapi API...');
      console.log(`📁 Reading CSV file: ${csvFilePath}`);
      
      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`CSV file not found: ${csvFilePath}`);
      }

      // Check if Strapi is running
      await this.checkStrapiConnection();

      // Load tag cache for relation handling
      await this.loadTagCache();

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
          
          // Log detailed error for debugging
          if (error.response?.data) {
            console.error('📋 Detailed Strapi error:', JSON.stringify(error.response.data, null, 2));
          }
          
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

  async checkStrapiConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/api/itineraries?pagination[limit]=1`, { headers: this.headers });
      console.log('✅ Connected to Strapi API');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('❌ Cannot connect to Strapi API. Make sure Strapi is running on ' + this.baseURL);
      }
      // If we get a 403 or other error, that's OK - it means Strapi is running
      console.log('✅ Strapi API is running');
    }
  }

  async loadTagCache() {
    try {
      console.log('🏷️  Loading tag cache...');
      const response = await axios.get(`${this.baseURL}/api/tags`, { headers: this.headers });
      const tags = response.data.data || [];
      
      this.tagCache.clear();
      tags.forEach(tag => {
        this.tagCache.set(tag.attributes.name.toLowerCase(), tag.id);
        this.tagCache.set(tag.attributes.slug, tag.id);
      });
      
      console.log(`✅ Loaded ${tags.length} tags into cache`);
    } catch (error) {
      console.warn('⚠️  Could not load tag cache:', error.message);
      console.warn('   Tags will be created on-demand if needed');
    }
  }

  async getOrCreateTag(tagName) {
    if (!tagName || tagName.trim() === '') return null;
    
    const normalizedName = tagName.trim();
    const cacheKey = normalizedName.toLowerCase();
    
    // Check cache first
    if (this.tagCache.has(cacheKey)) {
      return this.tagCache.get(cacheKey);
    }
    
    try {
      // Try to find existing tag
      const response = await axios.get(`${this.baseURL}/api/tags?filters[name][$eq]=${encodeURIComponent(normalizedName)}`, {
        headers: this.headers
      });
      
      if (response.data.data && response.data.data.length > 0) {
        const tag = response.data.data[0];
        this.tagCache.set(cacheKey, tag.id);
        this.tagCache.set(tag.attributes.slug, tag.id);
        return tag.id;
      }
      
      // Create new tag if not found
      console.log(`🏷️  Creating new tag: ${normalizedName}`);
      const createResponse = await axios.post(`${this.baseURL}/api/tags`, {
        data: {
          name: normalizedName,
          slug: normalizedName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
      }, { headers: this.headers });
      
      const newTag = createResponse.data.data;
      this.tagCache.set(cacheKey, newTag.id);
      this.tagCache.set(newTag.attributes.slug, newTag.id);
      
      return newTag.id;
    } catch (error) {
      console.error(`❌ Failed to get/create tag "${normalizedName}":`, error.message);
      return null;
    }
  }

  async parseTags(tagsString) {
    if (!tagsString || tagsString.trim() === '') return [];
    
    // Split by comma and clean up
    const tagNames = tagsString.split(',').map(name => name.trim()).filter(name => name);
    const tagIds = [];
    
    for (const tagName of tagNames) {
      const tagId = await this.getOrCreateTag(tagName);
      if (tagId) {
        tagIds.push(tagId);
      }
    }
    
    return tagIds;
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

    // Check for existing itinerary with same title
    try {
      const existingResponse = await axios.get(`${this.baseURL}/api/itineraries`, {
        params: {
          'filters[title][$eq]': row.title.trim(),
          'pagination[limit]': 1
        },
        headers: this.headers
      });

      if (existingResponse.data.data && existingResponse.data.data.length > 0) {
        // Delete existing entry to replace with updated Day format
        const existingId = existingResponse.data.data[0].documentId;
        console.log(`🔄 Updating existing itinerary "${row.title}" (ID: ${existingId})...`);
        
        await axios.delete(`${this.baseURL}/api/itineraries/${existingId}`, {
          headers: this.headers
        });
        console.log(`🗑️  Deleted existing entry to update with new Day format`);
      }
    } catch (error) {
      // If we can't check for duplicates, we'll try to create anyway
      console.log(`⚠️  Could not check for duplicates: ${error.message}`);
    }

    // Parse Day components first to debug
    const dayComponents = this.parseDayComponents(row);
    console.log(`📅 Found ${dayComponents.length} day entries for "${row.title}"`);
    
    if (dayComponents.length > 0) {
      console.log(`📋 Day components preview:`);
      dayComponents.slice(0, 3).forEach((day, idx) => {
        console.log(`   Day ${day.dayNumber}: "${day.subtitle}" (${day.recommendation ? 'has recommendation' : 'no recommendation'})`);
      });
      if (dayComponents.length > 3) {
        console.log(`   ... and ${dayComponents.length - 3} more days`);
      }
    }

    // Parse and prepare the itinerary data
    const itineraryData = {
      title: row.title.trim(),
      country: row.country.trim(),
      region: row.region?.trim() || null,
      city: row.city?.trim() || null,
      tags: await this.parseTags(row.tags),
      price: this.parseDecimal(row.price),
      currency: row.currency?.trim() || 'USD',
      isFree: this.parseBoolean(row.isFree),
      highlights: row.highlights?.trim() || null,
      publishStatus: this.parseEnumValue(row.publishStatus, ['draft', 'public', 'private']) || 'draft',
      // Handle Day components if they exist in CSV
      Day: dayComponents
    };

    // Create the itinerary using Strapi REST API
    const response = await axios.post(`${this.baseURL}/api/itineraries`, {
      data: itineraryData
    }, { headers: this.headers });

    return response.data;
  }

  parseDayComponents(row) {
    const days = [];
    
    // Parse the new CSV structure: subtitle_1a, recommendation_1a, etc.
    // Group by day number first
    const dayGroups = {};
    
    // Scan all CSV columns to find day-related data
    Object.keys(row).forEach(columnName => {
      // Match patterns like: subtitle_1a, picture_1a, recommendation_1a, googleMapsLink_1aa, etc.
      const dayMatch = columnName.match(/^(subtitle|picture|recommendation|googleMapsLink|showDistanceFromLastStop|dayType|dayNumber)_(\d+)([a-z]+)?$/i);
      
      if (dayMatch) {
        const [, fieldName, dayNumber, subIndex] = dayMatch;
        const dayNum = parseInt(dayNumber);
        let subIdx = subIndex || 'a'; // Default to 'a' if no sub-index
        
        // Handle inconsistent googleMapsLink naming patterns
        // Convert googleMapsLink_1aa -> 1a, googleMapsLink_1ba -> 1b, etc.
        if (fieldName === 'googleMapsLink' && subIndex) {
          if (subIndex.length === 2) {
            // Pattern like "aa" -> "a", "ba" -> "b", "ca" -> "c", etc.
            subIdx = subIndex.charAt(0);
          }
        }
        
        if (!dayGroups[dayNum]) {
          dayGroups[dayNum] = {};
        }
        
        if (!dayGroups[dayNum][subIdx]) {
          dayGroups[dayNum][subIdx] = {};
        }
        
        dayGroups[dayNum][subIdx][fieldName] = row[columnName];
      }
    });
    
    // Convert grouped data to Day components
    Object.keys(dayGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(dayNum => {
      const dayNumber = parseInt(dayNum);
      const subEntries = dayGroups[dayNum];
      
      // Get dayType from dayType_X column or default
      const dayType = row[`dayType_${dayNum}`] || 'Input Number';
      
      // Process each sub-entry (a, b, c, etc.) for this day as SEPARATE components
      Object.keys(subEntries).sort().forEach(subIdx => {
        const entry = subEntries[subIdx];
        
        // Format subtitle to include [Day X] prefix
        const originalSubtitle = entry.subtitle?.trim();
        const formattedSubtitle = originalSubtitle 
          ? `[Day ${dayNumber}] ${originalSubtitle}`
          : `[Day ${dayNumber}]`;

        // Handle recommendation length limit
        let processedRecommendation = null;
        if (entry.recommendation?.trim()) {
          const fullRecommendation = entry.recommendation.trim();
          const maxLength = 950; // Leave some buffer for 1000 char limit
          
          if (fullRecommendation.length > maxLength) {
            processedRecommendation = fullRecommendation.substring(0, maxLength).trim();
            // Try to cut at a sentence/word boundary
            const lastPeriod = processedRecommendation.lastIndexOf('.');
            const lastSpace = processedRecommendation.lastIndexOf(' ');
            
            if (lastPeriod > maxLength * 0.8) {
              processedRecommendation = processedRecommendation.substring(0, lastPeriod + 1);
            } else if (lastSpace > maxLength * 0.9) {
              processedRecommendation = processedRecommendation.substring(0, lastSpace);
            }
            
            processedRecommendation += '... [content truncated]';
          } else {
            processedRecommendation = fullRecommendation;
          }
        }

        const day = {
          dayType: dayType,
          dayNumber: dayNumber,
          subtitle: formattedSubtitle,
          recommendation: processedRecommendation,
          googleMapsLink: entry.googleMapsLink?.trim() || null,
          showDistanceFromLastStop: this.parseBoolean(entry.showDistanceFromLastStop)
        };
        
        // Only add days that have meaningful content
        if (day.subtitle || day.recommendation) {
          days.push(day);
        }
      });
    });
    
    return days;
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

  async testCSVParsing(csvFilePath, maxRows = 3) {
    try {
      console.log('🧪 Testing CSV parsing (no import)...');
      console.log(`📁 Reading CSV file: ${csvFilePath}`);
      
      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`CSV file not found: ${csvFilePath}`);
      }

      const data = await this.parseCSV(csvFilePath);
      console.log(`📋 Found ${data.length} records in CSV`);

      // Test parse first few rows
      const testRows = data.slice(0, maxRows);
      
      testRows.forEach((row, index) => {
        console.log(`\n🔍 Testing Row ${index + 1}: "${row.title}"`);
        
        // Show basic fields
        console.log(`   Country: ${row.country}`);
        console.log(`   City: ${row.city || 'None'}`);
        console.log(`   Publish Status: ${row.publishStatus || 'None'}`);
        
        // Test day parsing
        const dayComponents = this.parseDayComponents(row);
        console.log(`   📅 Day components found: ${dayComponents.length}`);
        
        if (dayComponents.length > 0) {
          dayComponents.forEach((day, dayIdx) => {
            console.log(`     Day ${day.dayNumber} (${day.dayType}): "${day.subtitle}"`);
            if (day.recommendation) {
              console.log(`       Recommendation: ${day.recommendation.substring(0, 100)}${day.recommendation.length > 100 ? '...' : ''}`);
            }
            if (day.googleMapsLink) {
              console.log(`       Maps Link: ${day.googleMapsLink}`);
            }
          });
        } else {
          console.log(`     ⚠️  No day components found - check CSV column naming`);
          
          // Help debug by showing available columns that might be day-related
          const dayColumns = Object.keys(row).filter(col => 
            col.match(/^(subtitle|picture|recommendation|googleMapsLink|dayType|dayNumber)_\d+/i)
          );
          if (dayColumns.length > 0) {
            console.log(`     🔍 Found these day-related columns: ${dayColumns.slice(0, 5).join(', ')}${dayColumns.length > 5 ? '...' : ''}`);
          }
        }
      });
      
      console.log('\n✅ CSV parsing test completed');
      
    } catch (error) {
      console.error('❌ CSV parsing test failed:', error.message);
      throw error;
    }
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
  const strapiURL = process.argv[3] || 'http://localhost:1337';
  const testMode = process.argv.includes('--test') || process.argv.includes('-t');
  
  if (!csvFilePath) {
    console.error('❌ Please provide a CSV file path');
    console.log('Usage: node scripts/api-csv-importer.js <path-to-csv-file> [strapi-url] [--test]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/api-csv-importer.js data/itn-20251013.csv --test          # Test parsing only');
    console.log('  node scripts/api-csv-importer.js data/itn-20251013.csv               # Full import');
    console.log('  node scripts/api-csv-importer.js data/itn-20251013.csv http://localhost:1337  # Custom URL');
    console.log('');
    console.log('Options:');
    console.log('  --test, -t    Test CSV parsing without importing (recommended first)');
    process.exit(1);
  }

  const importer = new ItineraryAPIImporter(strapiURL);
  
  try {
    if (testMode) {
      console.log('🧪 Running in TEST MODE - no data will be imported');
      await importer.testCSVParsing(csvFilePath, 5); // Test first 5 rows
      console.log('\n✅ Test completed! If the day parsing looks correct, run without --test to import.');
    } else {
      await importer.importFromCSV(csvFilePath);
      console.log('🎉 Import completed successfully!');
    }
    process.exit(0);
  } catch (error) {
    console.error('💥 Operation failed:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = ItineraryAPIImporter;
