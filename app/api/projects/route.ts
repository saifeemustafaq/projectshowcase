import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Project } from '@/types/project';

// Default sample projects for initial seeding
const DEFAULT_PROJECTS: Omit<Project, 'id'>[] = [
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
];

// GET all projects
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('projects');
    
    // Check if collection is empty and seed with default data
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(DEFAULT_PROJECTS);
    }
    
    const projects = await collection.find({}).toArray();
    
    // Transform MongoDB documents to Project interface
    const transformedProjects: Project[] = projects.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      technologies: doc.technologies,
      demoUrl: doc.demoUrl,
      githubUrl: doc.githubUrl,
      category: doc.category,
      featured: doc.featured,
      createdAt: doc.createdAt,
    }));
    
    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection('projects');
    
    // Handle empty/undefined values
    const newProject = {
      title: body.title || 'Untitled Project',
      description: body.description || '',
      technologies: Array.isArray(body.technologies) ? body.technologies : 
                   (body.technologies ? body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      demoUrl: body.demoUrl || '',
      githubUrl: body.githubUrl || '',
      category: body.category || 'Other',
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString(),
    };
    
    const result = await collection.insertOne(newProject);
    
    const createdProject: Project = {
      id: result.insertedId.toString(),
      ...newProject,
    };
    
    return NextResponse.json(createdProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
