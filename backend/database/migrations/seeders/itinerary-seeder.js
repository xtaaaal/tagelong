'use strict';

const itineraries = [
  // Your itinerary data here
];

module.exports = {
  async seed(strapi) {
    console.log('🌱 Seeding itineraries...');
    
    for (const itinerary of itineraries) {
      try {
        await strapi.documents('api::itinerary.itinerary').create({
          data: itinerary,
          status: 'published'
        });
        console.log(`✅ Created: ${itinerary.title}`);
      } catch (error) {
        console.error(`❌ Error creating ${itinerary.title}:`, error.message);
      }
    }
    
    console.log('🎉 Seeding completed!');
  }
};