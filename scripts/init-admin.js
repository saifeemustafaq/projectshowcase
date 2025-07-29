#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function initializeAdmin() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ Error: MONGODB_URI environment variable is not set.');
    console.log('Please create a .env.local file with your MongoDB connection string.');
    process.exit(1);
  }

  let client;
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('project_showcase');
    const adminCollection = db.collection('admin');
    
    // Check if admin user already exists
    const existingAdmin = await adminCollection.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists in the database.');
      console.log('Use "npm run reset-password" to change the admin password.');
      return;
    }

    // Create default admin user with password "admin123"
    const defaultPassword = 'admin123';
    const passwordHash = hashPassword(defaultPassword);
    
    console.log('🔄 Creating default admin user...');
    const result = await adminCollection.insertOne({
      role: 'admin',
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (result.acknowledged) {
      console.log('✅ Default admin user created successfully!');
      console.log('📝 Default password: admin123');
      console.log('🔐 Please run "npm run reset-password" to set a secure password.');
    } else {
      console.log('❌ Failed to create admin user.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

initializeAdmin();
