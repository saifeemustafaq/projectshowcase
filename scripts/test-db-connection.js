require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Check if environment variable exists
console.log('MONGODB_URI exists:', process.env.MONGODB_URI ? 'Yes' : 'No');
console.log('MONGODB_URI value:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    console.log('Please create a .env.local file with your MongoDB connection string:');
    console.log('MONGODB_URI=mongodb://localhost:27017/project_showcase');
    console.log('or');
    console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project_showcase');
    return;
  }
  
  try {
    console.log('🔄 Testing MongoDB connection...');
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    const db = client.db('project_showcase');
    console.log('📊 Database name:', db.databaseName);
    
    // Test projects collection
    const collection = db.collection('projects');
    const count = await collection.countDocuments();
    console.log('📝 Projects in database:', count);
    
    if (count === 0) {
      console.log('⚠️  No projects found in database. This might be why projects aren\'t loading.');
    } else {
      const projects = await collection.find({}).limit(5).toArray();
      console.log('🗂️  Sample projects:');
      projects.forEach(project => {
        console.log(`  - ${project.title} (${project.category})`);
      });
    }
    
    await client.close();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 This looks like a network/DNS issue. Check your connection string.');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Authentication failed. Check your username/password.');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Connection timeout. Check if MongoDB is running and accessible.');
    }
  }
}

testConnection();
