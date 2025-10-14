#!/usr/bin/env node

/**
 * Data Migration Script for Production Deployment
 * Exports local Strapi data and prepares it for production import
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class DataMigrator {
  constructor() {
    this.localUrl = 'http://localhost:1337';
    this.productionUrl = process.env.PRODUCTION_STRAPI_URL;
    this.apiToken = process.env.STRAPI_API_TOKEN;
    this.exportDir = 'data-export';
  }

  async exportLocalData() {
    console.log('🚀 Starting local data export...');
    
    try {
      // Create export directory
      if (!fs.existsSync(this.exportDir)) {
        fs.mkdirSync(this.exportDir, { recursive: true });
      }

      // Export itineraries
      console.log('📋 Exporting itineraries...');
      const itineraries = await this.fetchData(`${this.localUrl}/api/itineraries?populate=*`);
      fs.writeFileSync(
        path.join(this.exportDir, 'itineraries.json'),
        JSON.stringify(itineraries, null, 2)
      );
      console.log(`✅ Exported ${itineraries.data?.length || 0} itineraries`);

      // Export global content
      console.log('🌐 Exporting global content...');
      const global = await this.fetchData(`${this.localUrl}/api/global?populate=*`);
      fs.writeFileSync(
        path.join(this.exportDir, 'global.json'),
        JSON.stringify(global, null, 2)
      );
      console.log('✅ Exported global content');

      // Export home page
      console.log('🏠 Exporting home page content...');
      const homePage = await this.fetchData(`${this.localUrl}/api/home-page?populate=*`);
      fs.writeFileSync(
        path.join(this.exportDir, 'home-page.json'),
        JSON.stringify(homePage, null, 2)
      );
      console.log('✅ Exported home page content');

      console.log(`\n🎉 Export completed! Files saved in '${this.exportDir}' directory`);
      console.log('\n📋 Next steps:');
      console.log('1. Deploy your Strapi backend to Railway');
      console.log('2. Set PRODUCTION_STRAPI_URL and STRAPI_API_TOKEN environment variables');
      console.log('3. Run: node scripts/data-migrator.js --import');

    } catch (error) {
      console.error('❌ Export failed:', error.message);
      process.exit(1);
    }
  }

  async importToProduction() {
    if (!this.productionUrl || !this.apiToken) {
      console.error('❌ Missing environment variables:');
      console.error('   PRODUCTION_STRAPI_URL - Your Railway Strapi URL');
      console.error('   STRAPI_API_TOKEN - Your Strapi API token');
      process.exit(1);
    }

    console.log('🚀 Starting production data import...');
    console.log(`📡 Target: ${this.productionUrl}`);

    try {
      // Import itineraries
      console.log('📋 Importing itineraries...');
      const itinerariesData = JSON.parse(
        fs.readFileSync(path.join(this.exportDir, 'itineraries.json'), 'utf8')
      );
      
      if (itinerariesData.data) {
        for (const itinerary of itinerariesData.data) {
          await this.createEntry('itineraries', itinerary.attributes);
          console.log(`✅ Imported: ${itinerary.attributes.title}`);
        }
      }

      console.log('\n🎉 Import completed successfully!');
      console.log('🌐 Visit your production site to verify the data');

    } catch (error) {
      console.error('❌ Import failed:', error.message);
      process.exit(1);
    }
  }

  async fetchData(url) {
    const response = await axios.get(url);
    return response.data;
  }

  async createEntry(contentType, data) {
    const response = await axios.post(
      `${this.productionUrl}/api/${contentType}`,
      { data },
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
}

// Main execution
async function main() {
  const migrator = new DataMigrator();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case '--import':
      await migrator.importToProduction();
      break;
    case '--export':
    default:
      await migrator.exportLocalData();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DataMigrator;
