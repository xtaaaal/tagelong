#!/usr/bin/env node

/**
 * Production Data Backup Script
 * Exports all production data before schema migration
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ProductionDataBackup {
  constructor() {
    this.productionUrl = process.env.PRODUCTION_STRAPI_URL || 'https://api.tagelong.com';
    this.apiToken = process.env.STRAPI_API_TOKEN;
    this.backupDir = 'production-backup';
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  async backupAllData() {
    console.log('🚀 Starting production data backup...');
    console.log(`📡 Source: ${this.productionUrl}`);
    console.log(`📅 Timestamp: ${this.timestamp}`);

    if (!this.apiToken) {
      console.error('❌ Missing STRAPI_API_TOKEN environment variable');
      console.error('   Get your API token from: Settings → API Tokens → Create new token');
      process.exit(1);
    }

    try {
      // Create backup directory
      const backupPath = path.join(this.backupDir, this.timestamp);
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }

      // Backup itineraries
      console.log('📋 Backing up itineraries...');
      const itineraries = await this.fetchAllData('/api/itineraries?populate=*');
      fs.writeFileSync(
        path.join(backupPath, 'itineraries.json'),
        JSON.stringify(itineraries, null, 2)
      );
      console.log(`✅ Backed up ${itineraries.data?.length || 0} itineraries`);

      // Backup tags
      console.log('🏷️  Backing up tags...');
      const tags = await this.fetchAllData('/api/tags?populate=*');
      fs.writeFileSync(
        path.join(backupPath, 'tags.json'),
        JSON.stringify(tags, null, 2)
      );
      console.log(`✅ Backed up ${tags.data?.length || 0} tags`);

      // Backup users (if any)
      console.log('👥 Backing up users...');
      try {
        const users = await this.fetchAllData('/api/users?populate=*');
        fs.writeFileSync(
          path.join(backupPath, 'users.json'),
          JSON.stringify(users, null, 2)
        );
        console.log(`✅ Backed up ${users.data?.length || 0} users`);
      } catch (error) {
        console.log('⚠️  Users endpoint not accessible (normal for most setups)');
      }

      // Create backup summary
      const summary = {
        timestamp: this.timestamp,
        source: this.productionUrl,
        backup: {
          itineraries: itineraries.data?.length || 0,
          tags: tags.data?.length || 0,
          users: 0 // Will be updated if users were backed up
        },
        schema_version: 'pre-migration',
        notes: 'Backup created before schema migration (currency removal, themeLayout addition, etc.)'
      };

      fs.writeFileSync(
        path.join(backupPath, 'backup-summary.json'),
        JSON.stringify(summary, null, 2)
      );

      console.log('\n🎉 Backup completed successfully!');
      console.log(`📁 Backup location: ${backupPath}`);
      console.log('📋 Summary:');
      console.log(`   - Itineraries: ${summary.backup.itineraries}`);
      console.log(`   - Tags: ${summary.backup.tags}`);
      console.log(`   - Users: ${summary.backup.users}`);

    } catch (error) {
      console.error('💥 Backup failed:', error.message);
      if (error.response?.data) {
        console.error('📋 API Error:', JSON.stringify(error.response.data, null, 2));
      }
      process.exit(1);
    }
  }

  async fetchAllData(endpoint) {
    const url = `${this.productionUrl}${endpoint}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
}

// Main execution
async function main() {
  const backup = new ProductionDataBackup();
  await backup.backupAllData();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionDataBackup;
