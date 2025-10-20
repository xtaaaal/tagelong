#!/usr/bin/env node

/**
 * Production Deployment Script
 * Complete deployment process with data migration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProductionDeployment {
  constructor() {
    this.productionUrl = process.env.PRODUCTION_STRAPI_URL || 'https://api.tagelong.com';
    this.apiToken = process.env.STRAPI_API_TOKEN;
  }

  async deploy() {
    console.log('🚀 Starting production deployment with schema migration...');
    console.log(`📡 Target: ${this.productionUrl}`);

    if (!this.apiToken) {
      console.error('❌ Missing STRAPI_API_TOKEN environment variable');
      console.error('   Get your API token from: Settings → API Tokens → Create new token');
      process.exit(1);
    }

    try {
      // Step 1: Backup current production data
      console.log('\n📋 Step 1: Backing up current production data...');
      execSync('node scripts/backup-production-data.js', { stdio: 'inherit' });

      // Step 2: Deploy schema changes
      console.log('\n🚀 Step 2: Deploying schema changes...');
      console.log('   This will be handled by your deployment platform (Railway/Render)');
      console.log('   Push your changes to GitHub to trigger deployment');

      // Step 3: Wait for deployment
      console.log('\n⏳ Step 3: Waiting for deployment to complete...');
      console.log('   Please wait for your deployment platform to finish building');
      console.log('   Check your deployment logs for completion');

      // Step 4: Migrate data
      console.log('\n🔄 Step 4: Migrating data to new schema...');
      console.log('   Run this command after deployment is complete:');
      console.log('   node scripts/migrate-production-data.js');

      console.log('\n✅ Deployment preparation complete!');
      console.log('\n📋 Next Steps:');
      console.log('1. Push your changes to GitHub');
      console.log('2. Wait for deployment to complete');
      console.log('3. Run: node scripts/migrate-production-data.js');
      console.log('4. Verify data in production admin panel');

    } catch (error) {
      console.error('💥 Deployment preparation failed:', error.message);
      process.exit(1);
    }
  }

  async verifyDeployment() {
    console.log('🔍 Verifying production deployment...');
    
    try {
      const axios = require('axios');
      const response = await axios.get(`${this.productionUrl}/api/itineraries`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Production API is accessible');
      console.log(`📊 Found ${response.data.data?.length || 0} itineraries`);

      // Check if new schema fields exist
      if (response.data.data?.length > 0) {
        const sample = response.data.data[0];
        if (sample.themeLayout !== undefined) {
          console.log('✅ New schema fields are present');
        } else {
          console.log('⚠️  New schema fields not yet available');
        }
      }

    } catch (error) {
      console.error('❌ Production verification failed:', error.message);
    }
  }
}

// Main execution
async function main() {
  const deployment = new ProductionDeployment();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case '--verify':
      await deployment.verifyDeployment();
      break;
    case '--deploy':
    default:
      await deployment.deploy();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionDeployment;
