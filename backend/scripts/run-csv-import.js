#!/usr/bin/env node

/**
 * CSV Import Runner
 * This script runs the CSV importer by creating a temporary bootstrap function
 */

const path = require('path');
const { importCSV } = require('./csv-importer-bootstrap');

// Get the CSV file path from command line arguments
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('❌ Please provide a CSV file path');
  console.log('Usage: node scripts/run-csv-import.js <path-to-csv-file>');
  console.log('Example: node scripts/run-csv-import.js data/itinerary-example.csv');
  process.exit(1);
}

// Create a temporary bootstrap to run the import
const originalBootstrap = require('../src/index').default.bootstrap || (() => {});

// Override the bootstrap function temporarily
require('../src/index').default.bootstrap = async ({ strapi }) => {
  // Run the original bootstrap first (if any)
  await originalBootstrap({ strapi });
  
  try {
    // Run the CSV import
    await importCSV(strapi, csvFilePath);
    
    console.log('✅ Import completed successfully. Stopping Strapi...');
    
    // Give a moment for any pending operations
    setTimeout(() => {
      process.exit(0);
    }, 1000);
    
  } catch (error) {
    console.error('💥 Import failed:', error.message);
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
};

// Start Strapi which will trigger our modified bootstrap
console.log('🚀 Starting Strapi for CSV import...');
require('@strapi/strapi')().start();
