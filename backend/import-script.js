const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337'; // Your Strapi URL
const API_TOKEN = process.env.STRAPI_API_TOKEN; // Get this from Strapi admin Settings > API Tokens

const itineraries = [
  {
    title: "Tokyo Explorer's Delight",
    country: "Japan",
    region: "Kanto",
    city: "Tokyo",
    tags: ["Urban", "Cultural", "Food"],
    price: 2500.00,
    currency: "USD",
    isFree: false,
    highlights: "Experience the perfect blend of traditional and modern Japan in this 5-day Tokyo adventure. From ancient temples to cutting-edge technology, immerse yourself in the vibrant culture of Japan's capital.",
    publishStatus: "public",
    days: [
      {
        dayType: "Arrival Day",
        subtitle: "Arrival and Shinjuku",
        recommendation: "Arrive in Tokyo and explore the vibrant Shinjuku district. Visit the Tokyo Metropolitan Government Building for panoramic views and experience the famous Robot Restaurant show.",
        googleMapsLink: "https://maps.google.com/shinjuku-tokyo",
        showDistanceFromLastStop: false
      },
      {
        dayType: "Input Number",
        dayNumber: 2,
        subtitle: "Traditional Tokyo",
        recommendation: "Discover the traditional side of Tokyo with visits to ancient temples and shrines. Morning visit to Senso-ji Temple, explore Asakusa district, lunch at a traditional ramen shop, evening at Tokyo Skytree.",
        googleMapsLink: "https://maps.google.com/asakusa-tokyo",
        showDistanceFromLastStop: true
      }
    ]
  },
  // Add all your other 19 itineraries here...
];

async function importData() {
  for (const itinerary of itineraries) {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/itineraries`, {
        data: itinerary
      }, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Imported: ${itinerary.title}`);
    } catch (error) {
      console.error(`❌ Error importing ${itinerary.title}:`, error.response?.data || error.message);
    }
  }
}

importData();