import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { Project } from '@/types/project';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const collection = db.collection('projects');
    
    const project = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const transformedProject: Project = {
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
    
    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection('projects');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const updatedProject = await collection.findOne({ _id: new ObjectId(id) });
    
    const transformedProject: Project = {
      id: updatedProject!._id.toString(),
      title: updatedProject!.title,
      description: updatedProject!.description,
      technologies: updatedProject!.technologies,
      demoUrl: updatedProject!.demoUrl,
      githubUrl: updatedProject!.githubUrl,
      category: updatedProject!.category,
      featured: updatedProject!.featured,
      createdAt: updatedProject!.createdAt,
    };
    
    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const collection = db.collection('projects');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
