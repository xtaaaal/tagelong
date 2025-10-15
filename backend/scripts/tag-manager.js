#!/usr/bin/env node

const axios = require('axios');

class TagManager {
  constructor(strapiURL, apiToken) {
    this.baseURL = strapiURL;
    this.apiToken = apiToken;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`
    };
  }

  async listTags() {
    try {
      console.log('📋 Fetching all tags...\n');
      const response = await axios.get(`${this.baseURL}/api/tags?pagination[pageSize]=100`, {
        headers: this.headers
      });
      
      const tags = response.data.data || [];
      
      if (tags.length === 0) {
        console.log('❌ No tags found.');
        return [];
      }

      console.log('🏷️  Current tag order:\n');
      tags
        .sort((a, b) => (a.order || 999) - (b.order || 999))
        .forEach((tag, index) => {
          const order = tag.order || 'Not set';
          console.log(`${index + 1}. ${tag.name} (Order: ${order})`);
          console.log(`   Slug: ${tag.slug}`);
          if (tag.description) {
            console.log(`   Description: ${tag.description}`);
          }
          console.log('');
        });

      return tags;
    } catch (error) {
      console.error('❌ Failed to fetch tags:', error.message);
      if (error.response?.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      }
      return [];
    }
  }

  async updateTagOrder(tagId, newOrder) {
    try {
      const response = await axios.put(`${this.baseURL}/api/tags/${tagId}`, {
        data: { order: newOrder }
      }, { headers: this.headers });
      
      console.log(`✅ Updated tag order to ${newOrder}`);
      return response.data.data;
    } catch (error) {
      console.error(`❌ Failed to update tag ${tagId}:`, error.message);
      if (error.response?.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      }
      return null;
    }
  }

  async reorderTags(tagOrders) {
    console.log('🔄 Reordering tags...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const [tagSlug, order] of Object.entries(tagOrders)) {
      try {
        // Find tag by slug
        const response = await axios.get(`${this.baseURL}/api/tags?filters[slug][$eq]=${tagSlug}`, {
          headers: this.headers
        });
        
        const tags = response.data.data || [];
        if (tags.length === 0) {
          console.log(`⚠️  Tag with slug "${tagSlug}" not found`);
          errorCount++;
          continue;
        }

        const tag = tags[0];
        await this.updateTagOrder(tag.id, order);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to update tag "${tagSlug}":`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Reordering complete:`);
    console.log(`✅ Successfully updated: ${successCount} tags`);
    console.log(`❌ Failed to update: ${errorCount} tags`);
  }

  async setDefaultOrder() {
    console.log('🎯 Setting default tag order...\n');
    
    const defaultOrder = {
      'popular': 1,
      'adventure': 2,
      'cultural': 3,
      'culinary': 4,
      'art': 5,
      'historical': 6,
      'wellness': 7,
      'family': 8,
      'budget': 9,
      'luxury': 10,
      'eco-tourism': 11,
      'wildlife': 12,
      'road-trip': 13,
      'spiritual': 14
    };

    await this.reorderTags(defaultOrder);
  }
}

async function main() {
  const strapiURL = process.argv[3] || 'http://localhost:1337';
  const apiToken = process.env.STRAPI_API_TOKEN;

  if (!apiToken) {
    console.error('❌ STRAPI_API_TOKEN environment variable is required');
    console.log('Usage: STRAPI_API_TOKEN=your_token node scripts/tag-manager.js [command] [strapi-url]');
    console.log('Commands:');
    console.log('  list     - List all tags with their current order');
    console.log('  reorder  - Set default order for all tags');
    process.exit(1);
  }

  const manager = new TagManager(strapiURL, apiToken);
  const command = process.argv[2];

  switch (command) {
    case 'list':
      await manager.listTags();
      break;
      
    case 'reorder':
      await manager.setDefaultOrder();
      break;
      
    default:
      console.log('📖 Tag Manager - Available commands:');
      console.log('');
      console.log('  list     - List all tags with their current order');
      console.log('  reorder  - Set default order for all tags');
      console.log('');
      console.log('Usage:');
      console.log('  STRAPI_API_TOKEN=your_token node scripts/tag-manager.js list [strapi-url]');
      console.log('  STRAPI_API_TOKEN=your_token node scripts/tag-manager.js reorder [strapi-url]');
      console.log('');
      console.log('Examples:');
      console.log('  STRAPI_API_TOKEN=abc123 node scripts/tag-manager.js list');
      console.log('  STRAPI_API_TOKEN=abc123 node scripts/tag-manager.js reorder https://api.tagelong.com');
      break;
  }
}

main().catch(console.error);
