import { Project } from '@/types/project';
import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

/**
 * Server-side function to get all projects from MongoDB
 * Use this in server components and API routes
 */
export async function getProjectsServer(): Promise<Project[]> {
  try {
    const db = await getDatabase();
    const collection = db.collection('projects');
    
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
    
    return transformedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Server-side function to get a single project by ID
 */
export async function getProjectServer(id: string): Promise<Project | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection('projects');
    
    const project = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!project) return null;
    
    return {
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      category: project.category,
      featured: project.featured,
      createdAt: project.createdAt,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

/**
 * Server-side function to get all unique categories
 */
export async function getCategoriesServer(): Promise<string[]> {
  try {
    const projects = await getProjectsServer();
    const categories = projects.map(project => project.category);
    return Array.from(new Set(categories));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Server-side function to get featured projects
 */
export async function getFeaturedProjectsServer(): Promise<Project[]> {
  try {
    const projects = await getProjectsServer();
    return projects.filter(project => project.featured);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}
