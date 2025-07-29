require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const DEFAULT_PROJECTS = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform built with Next.js and Stripe integration for seamless online shopping experience.',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS', 'PostgreSQL'],
    demoUrl: 'https://nextjs.org',
    githubUrl: 'https://github.com/username/ecommerce-platform',
    category: 'Full Stack',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, team collaboration features, and intuitive drag-and-drop interface.',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
    demoUrl: 'https://tailwindcss.com',
    githubUrl: 'https://github.com/username/task-manager',
    category: 'Web App',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard that provides detailed weather information, forecasts, and interactive maps for any location worldwide.',
    technologies: ['Vue.js', 'Weather API', 'Chart.js', 'CSS3'],
    demoUrl: 'https://vercel.com',
    githubUrl: 'https://github.com/username/weather-dashboard',
    category: 'Frontend',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Mobile Fitness Tracker',
    description: 'A React Native mobile application for tracking workouts, nutrition, and health metrics with personalized recommendations.',
    technologies: ['React Native', 'Expo', 'Firebase', 'Redux'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com/username/fitness-tracker',
    category: 'Mobile',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Simple Blog',
    description: 'A minimal blog with basic features.',
    technologies: ['HTML', 'CSS'],
    demoUrl: '',
    githubUrl: '',
    category: 'Frontend',
    featured: false,
    createdAt: new Date().toISOString(),
  }
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    return;
  }
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db('project_showcase');
    const collection = db.collection('projects');
    
    // Check if collection is empty
    const count = await collection.countDocuments();
    
    if (count > 0) {
      console.log(`📝 Database already has ${count} projects. Clearing existing data...`);
      await collection.deleteMany({});
      console.log('🗑️  Cleared existing projects.');
    }
    
    console.log('🌱 Seeding database with sample projects...');
    const result = await collection.insertMany(DEFAULT_PROJECTS);
    console.log(`✅ Successfully inserted ${result.insertedCount} projects!`);
    
    // Verify insertion
    const newCount = await collection.countDocuments();
    console.log(`📊 Total projects in database: ${newCount}`);
    
    // Show inserted projects
    const projects = await collection.find({}).toArray();
    console.log('\n🗂️  Inserted projects:');
    projects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.title} (${project.category}) - Featured: ${project.featured}`);
    });
    
    await client.close();
    console.log('\n✅ Database seeding completed successfully!');
    console.log('🚀 You can now run your Next.js app and projects should load.');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
  }
}

seedDatabase();
