const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Read the seed data
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/api/itinerary/seed.json'), 'utf8'));

// Strapi API configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('Please set STRAPI_API_TOKEN in your environment variables');
  process.exit(1);
}

async function importItineraries() {
  console.log('Starting import of itineraries...');
  
  for (const itinerary of seedData.itineraries) {
    try {
      const response = await axios.post(
        `${STRAPI_URL}/api/itineraries`,
        {
          data: {
            ...itinerary,
            publishedAt: new Date().toISOString()
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`
          }
        }
      );
      
      console.log(`Successfully imported: ${itinerary.title}`);
    } catch (error) {
      console.error(`Failed to import ${itinerary.title}:`, error.response?.data || error.message);
    }
  }
  
  console.log('Import completed!');
}

importItineraries().catch(console.error); 