#!/usr/bin/env node

/**
 * Force Schema Update Script
 * This script helps trigger database schema updates in Strapi
 */

const axios = require('axios');

class SchemaUpdater {
  constructor() {
    this.baseURL = process.env.STRAPI_URL || 'http://localhost:1337';
    this.apiToken = process.env.STRAPI_API_TOKEN;
  }

  async checkSchemaStatus() {
    try {
      console.log('🔍 Checking current schema status...');
      
      // Try to fetch itineraries to see current structure
      const response = await axios.get(`${this.baseURL}/api/itineraries?pagination[limit]=1`, {
        headers: this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {}
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        const itinerary = response.data.data[0];
        console.log('📋 Current itinerary structure:');
        console.log('  - Title:', itinerary.attributes.title);
        console.log('  - Tags:', itinerary.attributes.tags);
        console.log('  - Tags type:', Array.isArray(itinerary.attributes.tags) ? 'Array (Multi-select)' : 'String (Single-select)');
        
        return {
          success: true,
          isMultiSelect: Array.isArray(itinerary.attributes.tags)
        };
      } else {
        console.log('⚠️  No itineraries found to check schema');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Error checking schema:', error.message);
      return { success: false, error: error.message };
    }
  }

  async testMultiSelectUpdate() {
    try {
      console.log('🧪 Testing multi-select tags update...');
      
      // Try to update an existing itinerary with multiple tags
      const testData = {
        data: {
          tags: ["Adventure", "Budget", "Cultural"] // Multiple tags
        }
      };

      const response = await axios.put(`${this.baseURL}/api/itineraries/1`, testData, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {})
        }
      });

      console.log('✅ Multi-select update successful!');
      console.log('📋 Updated tags:', response.data.data.attributes.tags);
      return true;
    } catch (error) {
      console.error('❌ Multi-select update failed:', error.message);
      if (error.response?.data) {
        console.error('📄 Error details:', JSON.stringify(error.response.data, null, 2));
      }
      return false;
    }
  }

  async runDiagnostics() {
    console.log('🚀 Starting schema diagnostics...\n');
    
    const schemaStatus = await this.checkSchemaStatus();
    
    if (schemaStatus.success) {
      if (schemaStatus.isMultiSelect) {
        console.log('✅ Schema is already updated - tags support multiple selection!');
      } else {
        console.log('⚠️  Schema needs update - tags are still single-select');
        console.log('💡 Try the following solutions:');
        console.log('   1. Restart your Strapi development server');
        console.log('   2. Clear .tmp and dist folders, then restart');
        console.log('   3. For production: redeploy your backend service');
      }
    }

    console.log('\n🧪 Testing multi-select functionality...');
    const testResult = await this.testMultiSelectUpdate();
    
    if (testResult) {
      console.log('\n🎉 Schema update is working correctly!');
    } else {
      console.log('\n❌ Schema update needs attention. See solutions above.');
    }
  }
}

// Main execution
async function main() {
  const updater = new SchemaUpdater();
  await updater.runDiagnostics();
}

if (require.main === module) {
  main().catch(console.error);
}
