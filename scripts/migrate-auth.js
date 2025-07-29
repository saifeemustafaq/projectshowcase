#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// The old hardcoded hash (admin123)
const OLD_PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

async function migrateToDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ Error: MONGODB_URI environment variable is not set.');
    console.log('Please create a .env.local file with your MongoDB connection string.');
    process.exit(1);
  }

  console.log('🔄 Migration Tool: Hardcoded Auth → Database Auth');
  console.log('===================================================\n');
  console.log('This tool will migrate from the old hardcoded password system');
  console.log('to the new MongoDB-based authentication system.\n');

  rl.question('Do you want to migrate the existing hardcoded password (admin123) to the database? (y/N): ', async (answer) => {
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('❌ Migration cancelled.');
      rl.close();
      return;
    }

    let client;
    try {
      console.log('\n🔄 Connecting to MongoDB...');
      client = new MongoClient(uri);
      await client.connect();
      
      const db = client.db('project_showcase');
      const adminCollection = db.collection('admin');
      
      // Check if admin user already exists
      const existingAdmin = await adminCollection.findOne({ role: 'admin' });
      
      if (existingAdmin) {
        console.log('✅ Admin user already exists in the database.');
        console.log('No migration needed. Use "npm run reset-password" to change the password.');
        return;
      }

      console.log('🔄 Creating admin user with existing password...');
      const result = await adminCollection.insertOne({
        role: 'admin',
        passwordHash: OLD_PASSWORD_HASH,
        createdAt: new Date(),
        updatedAt: new Date(),
        migratedFrom: 'hardcoded'
      });

      if (result.acknowledged) {
        console.log('✅ Migration completed successfully!');
        console.log('📝 The existing password (admin123) is now stored in MongoDB.');
        console.log('🔐 Consider running "npm run reset-password" to set a new secure password.');
        console.log('\n🗑️  You can now remove the hardcoded PASSWORD_HASH from lib/auth.ts');
      } else {
        console.log('❌ Migration failed.');
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      if (client) {
        await client.close();
      }
      rl.close();
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Migration cancelled.');
  rl.close();
  process.exit(0);
});

migrateToDatabase();
