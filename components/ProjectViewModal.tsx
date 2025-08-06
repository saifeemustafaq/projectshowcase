'use client';

import { Project } from '@/types/project';
import { useFeatureFlags } from './FeatureFlagsProvider';
import WebsitePreview from './WebsitePreview';

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ProjectViewModal({ isOpen, onClose, project }: ProjectViewModalProps) {
  const { flags } = useFeatureFlags();
  
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
          style={{ 
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                  Project Details
                </h3>
                {project.featured && (
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--secondary)', 
                  color: 'var(--secondary-foreground)' 
                }}
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className={`grid ${flags.websitePreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
              {/* Left Column - Project Preview (only show if feature flag is enabled) */}
              {flags.websitePreview && (
                <div className="space-y-6">
                  <div className="aspect-video rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--secondary)' }}>
                    <WebsitePreview
                      url={project.demoUrl || ''}
                      title={project.title}
                      className="w-full h-full object-cover"
                      projectId={project.id}
                      useFallbackImage={project.useFallbackImage}
                    />
                  </div>

                  {/* Action Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                        style={{ 
                          backgroundColor: 'var(--accent)', 
                          color: 'var(--accent-foreground)' 
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-3 px-4 rounded-lg font-medium border transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                        style={{ 
                          borderColor: 'var(--border-color)',
                          color: 'var(--foreground)'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>

                  {/* Technologies */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                      Technologies Used
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 text-sm font-medium rounded-lg"
                          style={{ 
                            backgroundColor: 'var(--background)', 
                            color: 'var(--foreground)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column - Project Details (or main content when preview is disabled) */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: 'var(--foreground)' }}>
                    {project.title}
                  </h1>
                  <span 
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{ 
                      backgroundColor: 'var(--secondary)', 
                      color: 'var(--secondary-foreground)' 
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                    Description
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {project.description}
                  </p>
                </div>

                {/* When preview is disabled, show technologies and action links here */}
                {!flags.websitePreview && (
                  <>
                    {/* Technologies */}
                    <div>
                      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                        Technologies Used
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 text-sm font-medium rounded-lg"
                            style={{ 
                              backgroundColor: 'var(--background)', 
                              color: 'var(--foreground)',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                          style={{ 
                            backgroundColor: 'var(--accent)', 
                            color: 'var(--accent-foreground)' 
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center py-3 px-4 rounded-lg font-medium border transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                          style={{ 
                            borderColor: 'var(--border-color)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--secondary)', 
                  color: 'var(--secondary-foreground)' 
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
