const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const axios = require('axios');

class ItineraryDataUpdater {
  constructor(baseURL = 'http://localhost:1337') {
    this.baseURL = baseURL;
  }

  async updateExistingItinerary() {
    try {
      console.log('🚀 Starting itinerary data update...');
      
      // Check if Strapi is running
      await this.checkStrapiConnection();
      
      // Get the existing itinerary
      const response = await axios.get(`${this.baseURL}/api/itineraries?populate=*`);
      const itineraries = response.data.data;
      
      if (itineraries.length === 0) {
        console.log('❌ No itineraries found to update');
        return;
      }

      const itinerary = itineraries[0];
      console.log(`📋 Found itinerary: "${itinerary.title}"`);
      
      // Read the CSV data to get the updated information
      const csvFilePath = path.join(__dirname, '../data/itn-20251013.csv');
      const csvData = await this.parseCSV(csvFilePath);
      const csvRow = csvData[0]; // Get the first (and only) row
      
      // Transform the Day components to match new schema
      const updatedDays = this.transformDayComponents(csvRow);
      
      // Prepare update data
      const updateData = {
        data: {
          themeLayout: 'Daily Style', // Set default theme layout
          Day: updatedDays
        }
      };

      console.log(`🔄 Updating itinerary with ${updatedDays.length} days...`);
      
      // Update the itinerary using documentId (Strapi 5 format)
      const updateResponse = await axios.put(
        `${this.baseURL}/api/itineraries/${itinerary.documentId}`,
        updateData
      );
      
      console.log('✅ Successfully updated itinerary!');
      console.log(`📊 Updated with ${updatedDays.length} day components`);
      
      // Show summary of what was updated
      this.showUpdateSummary(updatedDays);
      
    } catch (error) {
      console.error('💥 Error updating itinerary:', error.message);
      if (error.response?.data) {
        console.error('📋 Detailed error:', JSON.stringify(error.response.data, null, 2));
      }
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

  transformDayComponents(row) {
    const days = [];
    
    // Process each day (day1, day2, etc.)
    for (let dayNum = 1; dayNum <= 13; dayNum++) {
      // Check if this day has data using the correct field names
      if (!row[`dayType_${dayNum}`] && !row[`dayNumber_${dayNum}`]) {
        continue;
      }

      const dayData = {
        dayNumber: this.parseInteger(row[`dayNumber_${dayNum}`]),
        subtitle: row[`subtitle_${dayNum}a`]?.trim() || null,
        picture: [], // Will be empty for now
        content: this.transformRecommendations(row, dayNum),
        googleMapsLink: this.getFirstGoogleMapsLink(row, dayNum), // Get first link only for now
        youtubeLink: null, // Empty for now
        showDistanceFromLastStop: this.parseBoolean(row[`showDistanceFromLastStop_${dayNum}a`]) || false,
        fileUpload: null // Will be empty for now
      };

      days.push(dayData);
    }

    return days;
  }

  transformRecommendations(row, dayNum) {
    const recommendations = [];
    
    // Collect all recommendation fields for this day (a, b, c)
    for (let subIndex = 1; subIndex <= 3; subIndex++) {
      const suffix = String.fromCharCode(96 + subIndex); // a, b, c
      const fieldName = `recommendation_${dayNum}${suffix}`;
      
      if (row[fieldName] && row[fieldName].trim()) {
        recommendations.push(row[fieldName].trim());
      }
    }
    
    return recommendations.length > 0 ? recommendations.join('\n\n') : null;
  }

  getFirstGoogleMapsLink(row, dayNum) {
    // Get the first Google Maps link for this day
    for (let subIndex = 1; subIndex <= 3; subIndex++) {
      const suffix = String.fromCharCode(96 + subIndex); // a, b, c
      
      // Check for multiple links per sub-item (aa, ab, ac)
      for (let linkIndex = 1; linkIndex <= 3; linkIndex++) {
        const linkSuffix = String.fromCharCode(96 + linkIndex); // a, b, c
        const fieldName = `googleMapsLink_${dayNum}${suffix}${linkSuffix}`;
        
        if (row[fieldName] && row[fieldName].trim()) {
          return row[fieldName].trim();
        }
      }
    }
    
    return null;
  }

  collectGoogleMapsLinks(row, dayNum) {
    const links = [];
    
    // Collect all Google Maps links for this day
    for (let subIndex = 1; subIndex <= 3; subIndex++) {
      const suffix = String.fromCharCode(96 + subIndex); // a, b, c
      
      // Check for multiple links per sub-item (aa, ab, ac)
      for (let linkIndex = 1; linkIndex <= 3; linkIndex++) {
        const linkSuffix = String.fromCharCode(96 + linkIndex); // a, b, c
        const fieldName = `googleMapsLink_${dayNum}${suffix}${linkSuffix}`;
        
        if (row[fieldName] && row[fieldName].trim()) {
          links.push(row[fieldName].trim());
        }
      }
    }
    
    return links;
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

  showUpdateSummary(days) {
    console.log('\n==================================================');
    console.log('📊 UPDATE SUMMARY');
    console.log('==================================================');
    console.log(`✅ Total days processed: ${days.length}`);
    
    let totalMapsLinks = 0;
    let daysWithContent = 0;
    
    days.forEach((day, index) => {
      if (day.googleMapsLink && day.googleMapsLink.length > 0) {
        totalMapsLinks += day.googleMapsLink.length;
      }
      if (day.content) {
        daysWithContent++;
      }
    });
    
    console.log(`📍 Total Google Maps links: ${totalMapsLinks}`);
    console.log(`📝 Days with content: ${daysWithContent}`);
    console.log(`🎨 Theme Layout: Daily Style`);
    console.log('==================================================');
  }
}

// Run the update if this script is executed directly
if (require.main === module) {
  const updater = new ItineraryDataUpdater();
  updater.updateExistingItinerary()
    .then(() => {
      console.log('✅ Update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Update failed:', error.message);
      process.exit(1);
    });
}

module.exports = ItineraryDataUpdater;
