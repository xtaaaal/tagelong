const axios = require('axios');

async function testStrapiConnection() {
  try {
    console.log('🧪 Testing Strapi connection...');
    
    // First, test if Strapi is running
    const healthResponse = await axios.get('http://localhost:1337/_health', {
      timeout: 5000
    });
    console.log('✅ Strapi health check passed');

    // Test API access
    const apiResponse = await axios.get('http://localhost:1337/api/itineraries?pagination[limit]=1', {
      timeout: 5000
    });
    console.log('✅ Strapi API accessible');

    // Test creating a simple itinerary
    const testData = {
      data: {
        title: 'Test Itinerary',
        country: 'Test Country',
        publishStatus: 'draft',
        isFree: false,
        currency: 'USD'
      }
    };

    const createResponse = await axios.post('http://localhost:1337/api/itineraries', testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Test itinerary created successfully:', createResponse.data.data.title);
    console.log('🎉 All tests passed! CSV importer should work now.');

    // Clean up - delete the test itinerary
    const testId = createResponse.data.data.documentId;
    await axios.delete(`http://localhost:1337/api/itineraries/${testId}`);
    console.log('🧹 Test itinerary cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Strapi is not running. Please start it with: npm run develop');
    } else if (error.response) {
      console.log('📋 Response status:', error.response.status);
      console.log('📋 Response data:', error.response.data);
    }
    
    process.exit(1);
  }
}

testStrapiConnection();
