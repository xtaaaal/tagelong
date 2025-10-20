#!/usr/bin/env node

/**
 * Production Data Migration Script
 * Migrates production data to new schema format
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ProductionDataMigrator {
  constructor() {
    this.productionUrl = process.env.PRODUCTION_STRAPI_URL || 'https://api.tagelong.com';
    this.apiToken = process.env.STRAPI_API_TOKEN;
    this.backupDir = 'production-backup';
  }

  async migrateProductionData() {
    console.log('🚀 Starting production data migration...');
    console.log(`📡 Target: ${this.productionUrl}`);

    if (!this.apiToken) {
      console.error('❌ Missing STRAPI_API_TOKEN environment variable');
      process.exit(1);
    }

    try {
      // Find the latest backup
      const latestBackup = this.findLatestBackup();
      if (!latestBackup) {
        console.error('❌ No backup found. Please run backup script first.');
        process.exit(1);
      }

      console.log(`📁 Using backup: ${latestBackup}`);

      // Load backup data
      const itineraries = JSON.parse(
        fs.readFileSync(path.join(latestBackup, 'itineraries.json'), 'utf8')
      );
      const tags = JSON.parse(
        fs.readFileSync(path.join(latestBackup, 'tags.json'), 'utf8')
      );

      // First, clear existing data (optional - you might want to keep some)
      console.log('🗑️  Clearing existing data...');
      await this.clearExistingData();

      // Import tags first (since itineraries reference them)
      console.log('🏷️  Importing tags...');
      await this.importTags(tags);

      // Import itineraries with schema transformation
      console.log('📋 Importing itineraries with schema migration...');
      await this.importItineraries(itineraries);

      console.log('\n🎉 Migration completed successfully!');
      console.log('🌐 Visit your production site to verify the data');

    } catch (error) {
      console.error('💥 Migration failed:', error.message);
      if (error.response?.data) {
        console.error('📋 API Error:', JSON.stringify(error.response.data, null, 2));
      }
      process.exit(1);
    }
  }

  findLatestBackup() {
    if (!fs.existsSync(this.backupDir)) {
      return null;
    }

    const backups = fs.readdirSync(this.backupDir)
      .filter(dir => fs.statSync(path.join(this.backupDir, dir)).isDirectory())
      .sort()
      .reverse();

    return backups.length > 0 ? path.join(this.backupDir, backups[0]) : null;
  }

  async clearExistingData() {
    // Clear itineraries
    try {
      const itineraries = await this.fetchAllData('/api/itineraries');
      for (const itinerary of itineraries.data || []) {
        await this.deleteEntry('itineraries', itinerary.documentId);
        console.log(`🗑️  Deleted itinerary: ${itinerary.title}`);
      }
    } catch (error) {
      console.log('⚠️  Could not clear itineraries:', error.message);
    }

    // Clear tags
    try {
      const tags = await this.fetchAllData('/api/tags');
      for (const tag of tags.data || []) {
        await this.deleteEntry('tags', tag.documentId);
        console.log(`🗑️  Deleted tag: ${tag.name}`);
      }
    } catch (error) {
      console.log('⚠️  Could not clear tags:', error.message);
    }
  }

  async importTags(tagsData) {
    if (!tagsData.data) return;

    for (const tag of tagsData.data) {
      const tagData = {
        data: {
          name: tag.attributes.name,
          slug: tag.attributes.slug,
          description: tag.attributes.description || null,
          order: tag.attributes.order || 0
        }
      };

      await this.createEntry('tags', tagData);
      console.log(`✅ Imported tag: ${tag.attributes.name}`);
    }
  }

  async importItineraries(itinerariesData) {
    if (!itinerariesData.data) return;

    for (const itinerary of itinerariesData.data) {
      const itineraryData = {
        data: {
          title: itinerary.attributes.title,
          country: itinerary.attributes.country,
          region: itinerary.attributes.region || null,
          city: itinerary.attributes.city || null,
          price: itinerary.attributes.price || null,
          // Remove currency field (no longer exists)
          isFree: itinerary.attributes.isFree || false,
          highlights: itinerary.attributes.highlights || null,
          publishStatus: itinerary.attributes.publishStatus || 'draft',
          // Add new themeLayout field
          themeLayout: 'Daily Style', // Default value
          // Transform Day components
          Day: this.transformDayComponents(itinerary.attributes.Day || [])
        }
      };

      // Handle tags relation
      if (itinerary.attributes.tags?.data) {
        itineraryData.data.tags = itinerary.attributes.tags.data.map(tag => tag.id);
      }

      await this.createEntry('itineraries', itineraryData);
      console.log(`✅ Imported itinerary: ${itinerary.attributes.title}`);
    }
  }

  transformDayComponents(days) {
    return days.map(day => ({
      dayNumber: day.dayNumber || null,
      subtitle: day.subtitle || null,
      picture: [], // Will be empty for now
      content: this.transformRecommendationToRichText(day.recommendation), // Transform old field
      googleMapsLink: day.googleMapsLink || null, // Will be single string for now
      youtubeLink: null, // Empty for now
      showDistanceFromLastStop: day.showDistanceFromLastStop || false,
      fileUpload: null // Will be empty for now
    }));
  }

  transformRecommendationToRichText(recommendation) {
    if (!recommendation) return null;
    
    // Convert plain text to basic rich text format
    return `<p>${recommendation.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
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

  async createEntry(contentType, data) {
    const url = `${this.productionUrl}/api/${contentType}`;
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async deleteEntry(contentType, documentId) {
    const url = `${this.productionUrl}/api/${contentType}/${documentId}`;
    const response = await axios.delete(url, {
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
  const migrator = new ProductionDataMigrator();
  await migrator.migrateProductionData();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionDataMigrator;
