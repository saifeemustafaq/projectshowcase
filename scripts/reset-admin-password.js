#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function resetAdminPassword() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ Error: MONGODB_URI environment variable is not set.');
    console.log('Please create a .env.local file with your MongoDB connection string.');
    process.exit(1);
  }

  console.log('🔐 Admin Password Reset Tool');
  console.log('===============================\n');

  rl.question('Enter the new admin password: ', async (password) => {
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters long.');
      rl.close();
      return;
    }

    rl.question('Confirm the new password: ', async (confirmPassword) => {
      if (password !== confirmPassword) {
        console.log('❌ Passwords do not match.');
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
        
        const passwordHash = hashPassword(password);
        
        console.log('🔄 Updating admin password...');
        const result = await adminCollection.updateOne(
          { role: 'admin' },
          { 
            $set: { 
              passwordHash,
              updatedAt: new Date(),
              role: 'admin'
            }
          },
          { upsert: true }
        );

        if (result.acknowledged) {
          console.log('✅ Admin password has been successfully reset!');
          console.log(`📝 Password hash: ${passwordHash}`);
          if (result.upsertedCount > 0) {
            console.log('👤 Admin user created in database.');
          } else {
            console.log('🔄 Existing admin user password updated.');
          }
        } else {
          console.log('❌ Failed to update admin password.');
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
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Password reset cancelled.');
  rl.close();
  process.exit(0);
});

resetAdminPassword();
