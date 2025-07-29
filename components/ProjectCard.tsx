'use client';

import { Project } from '@/types/project';
import WebsitePreview from './WebsitePreview';

interface ProjectCardProps {
  project: Project;
  isEditMode?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, isEditMode = false, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div 
      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] flex flex-col h-full"
      style={{ 
        backgroundColor: 'var(--card-background)',
        border: '1px solid var(--border-color)'
      }}
    >
      {/* Project Preview */}
      <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--secondary)' }}>
        <WebsitePreview
          url={project.demoUrl || ''}
          title={project.title}
          className="w-full h-full object-cover"
          projectId={project.id}
        />
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-medium rounded-full">
              Featured
            </span>
          </div>
        )}
        {isEditMode && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit?.(project)}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
              style={{ 
                backgroundColor: 'var(--accent)', 
                color: 'var(--accent-foreground)' 
              }}
              title="Edit project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete?.(project.id)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110"
              title="Delete project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold line-clamp-2 flex-1 mr-3" style={{ color: 'var(--foreground)' }}>
            {project.title}
          </h3>
          <span 
            className="px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap"
            style={{ 
              backgroundColor: 'var(--secondary)', 
              color: 'var(--secondary-foreground)' 
            }}
          >
            {project.category}
          </span>
        </div>
        
        <p className="text-base mb-6 line-clamp-3 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {project.description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm font-medium rounded-full"
              style={{ 
                backgroundColor: 'var(--background)', 
                color: 'var(--foreground)',
                border: '1px solid var(--border-color)'
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span 
              className="px-3 py-1 text-sm font-medium rounded-full"
              style={{ 
                backgroundColor: 'var(--secondary)', 
                color: 'var(--muted-foreground)' 
              }}
            >
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        {/* Spacer to push buttons to bottom */}
        <div className="flex-grow"></div>
        
        {/* Action Links */}
        <div className="grid grid-cols-2 gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'var(--accent)', 
                color: 'var(--accent-foreground)' 
              }}
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-3 px-4 rounded-lg font-medium border transition-all duration-200 hover:scale-105"
              style={{ 
                borderColor: 'var(--border-color)',
                color: 'var(--foreground)'
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
