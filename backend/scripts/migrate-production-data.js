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
          name: tag.name,
          slug: tag.slug,
          description: tag.description || null,
          order: tag.order || 0
        }
      };

      // Handle icon import - try to find existing icon or skip if not found
      if (tag.icon) {
        try {
          // Try to find if the icon already exists in production
          const existingIcon = await this.findExistingMedia(tag.icon);
          if (existingIcon) {
            tagData.data.icon = existingIcon.id;
            console.log(`✅ Found existing icon for ${tag.name}`);
          } else {
            console.log(`⚠️  Icon not found in production for ${tag.name}, skipping icon`);
          }
        } catch (error) {
          console.log(`⚠️  Could not import icon for ${tag.name}:`, error.message);
        }
      }

      await this.createEntry('tags', tagData);
      console.log(`✅ Imported tag: ${tag.name}${tag.icon ? ' (with icon)' : ''}`);
    }
  }

  async importItineraries(itinerariesData) {
    if (!itinerariesData.data) return;

    for (const itinerary of itinerariesData.data) {
      const itineraryData = {
        data: {
          title: itinerary.title,
          country: itinerary.country,
          region: itinerary.region || null,
          city: itinerary.city || null,
          price: itinerary.price || null,
          // Remove currency field (no longer exists)
          isFree: itinerary.isFree || false,
          highlights: itinerary.highlights || null,
          publishStatus: itinerary.publishStatus || 'draft',
          // Add new themeLayout field
          themeLayout: 'Daily Style', // Default value
          // Transform Day components
          Day: await this.transformDayComponents(itinerary.Day || [])
        }
      };

      // Handle mainPicture import
      if (itinerary.mainPicture) {
        try {
          const existingMainPicture = await this.findExistingMedia(itinerary.mainPicture);
          if (existingMainPicture) {
            itineraryData.data.mainPicture = existingMainPicture.id;
            console.log(`✅ Found existing mainPicture for ${itinerary.title}`);
          } else {
            console.log(`⚠️  MainPicture not found in production for ${itinerary.title}, skipping mainPicture`);
          }
        } catch (error) {
          console.log(`⚠️  Could not import mainPicture for ${itinerary.title}:`, error.message);
        }
      }

      // Handle tags relation
      if (itinerary.tags?.data) {
        itineraryData.data.tags = itinerary.tags.data.map(tag => tag.id);
      }

      await this.createEntry('itineraries', itineraryData);
      console.log(`✅ Imported itinerary: ${itinerary.title}`);
    }
  }

  async transformDayComponents(days) {
    const transformedDays = [];
    
    for (const day of days) {
      const dayData = {
        dayNumber: day.dayNumber || null,
        subtitle: day.subtitle || null,
        picture: [], // Will be populated with existing media IDs
        content: this.transformRecommendationToRichText(day.recommendation), // Transform old field
        googleMapsLink: day.googleMapsLink || null, // Will be single string for now
        youtubeLink: null, // Empty for now
        showDistanceFromLastStop: day.showDistanceFromLastStop || false,
        fileUpload: null // Will be empty for now
      };

      // Handle picture import for this day
      if (day.picture && Array.isArray(day.picture)) {
        for (const picture of day.picture) {
          try {
            const existingPicture = await this.findExistingMedia(picture);
            if (existingPicture) {
              dayData.picture.push(existingPicture.id);
              console.log(`✅ Found existing picture for day ${day.dayNumber}: ${picture.name}`);
            } else {
              console.log(`⚠️  Picture not found in production for day ${day.dayNumber}: ${picture.name}`);
            }
          } catch (error) {
            console.log(`⚠️  Could not import picture for day ${day.dayNumber}:`, error.message);
          }
        }
      }

      transformedDays.push(dayData);
    }
    
    return transformedDays;
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

  async findExistingMedia(mediaData) {
    try {
      // Try to find media by name first
      const response = await axios.get(`${this.productionUrl}/api/upload/files`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          'filters[name][$eq]': mediaData.name
        }
      });

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }

      // If not found by name, try by hash
      const hashResponse = await axios.get(`${this.productionUrl}/api/upload/files`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          'filters[hash][$eq]': mediaData.hash
        }
      });

      if (hashResponse.data && hashResponse.data.length > 0) {
        return hashResponse.data[0];
      }

      return null;
    } catch (error) {
      console.log(`⚠️  Error searching for media: ${error.message}`);
      return null;
    }
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
