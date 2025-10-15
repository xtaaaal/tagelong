#!/usr/bin/env node

/**
 * Tag Seeder Script
 * Creates all the predefined tags in the database
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class TagSeeder {
  constructor() {
    this.baseURL = process.env.STRAPI_URL || 'http://localhost:1337';
    this.apiToken = process.env.STRAPI_API_TOKEN;
    this.headers = {
      'Content-Type': 'application/json',
      ...(this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {})
    };
  }

  async createTag(tagData) {
    try {
      const response = await axios.post(`${this.baseURL}/api/tags`, {
        data: tagData
      }, { headers: this.headers });

      console.log(`✅ Created tag: ${tagData.name}`);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('already exists')) {
        console.log(`⚠️  Tag already exists: ${tagData.name}`);
        return null;
      } else {
        console.error(`❌ Failed to create tag ${tagData.name}:`, error.message);
        if (error.response?.data) {
          console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
        return null;
      }
    }
  }

  async getExistingTags() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, { headers: this.headers });
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch existing tags:', error.message);
      return [];
    }
  }

  async seedTags() {
    console.log('🚀 Starting tag seeding process...\n');

    // Load seed data
    const seedPath = path.join(__dirname, '../src/api/tag/seed.json');
    let seedData;
    
    try {
      const seedContent = fs.readFileSync(seedPath, 'utf8');
      seedData = JSON.parse(seedContent);
    } catch (error) {
      console.error('❌ Failed to load seed data:', error.message);
      return;
    }

    // Check existing tags
    const existingTags = await this.getExistingTags();
    const existingTagNames = existingTags.map(tag => tag.attributes.name);

    console.log(`📋 Found ${existingTags.length} existing tags`);
    console.log(`📝 Will create ${seedData.length} tags from seed data\n`);

    let created = 0;
    let skipped = 0;

    for (const tagData of seedData) {
      if (existingTagNames.includes(tagData.name)) {
        console.log(`⏭️  Skipping existing tag: ${tagData.name}`);
        skipped++;
        continue;
      }

      const result = await this.createTag(tagData);
      if (result) {
        created++;
      }
    }

    console.log(`\n🎉 Tag seeding completed!`);
    console.log(`✅ Created: ${created} tags`);
    console.log(`⏭️  Skipped: ${skipped} tags`);
    console.log(`📊 Total: ${created + skipped} tags processed`);
  }

  async listTags() {
    console.log('📋 Listing all existing tags...\n');
    
    const tags = await this.getExistingTags();
    
    if (tags.length === 0) {
      console.log('No tags found in the database.');
      return;
    }

    console.log(`Found ${tags.length} tags:\n`);
    tags.forEach((tag, index) => {
      const attrs = tag.attributes;
      console.log(`${index + 1}. ${attrs.name}`);
      console.log(`   Slug: ${attrs.slug}`);
      if (attrs.description) {
        console.log(`   Description: ${attrs.description}`);
      }
      if (attrs.icon) {
        console.log(`   Icon: ${attrs.icon.url || 'Uploaded'}`);
      }
      console.log('');
    });
  }
}

// Main execution
async function main() {
  const seeder = new TagSeeder();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case '--list':
    case '-l':
      await seeder.listTags();
      break;
    case '--seed':
    case '-s':
    default:
      await seeder.seedTags();
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}
