'use client';

import { useState, useEffect } from 'react';
import { Project, ProjectFormData } from '@/types/project';
import { isValidUrl } from '@/lib/fallback-utils';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  project?: Project;
}

const CATEGORIES = [
  'Full Stack',
  'Frontend',
  'Backend',
  'Mobile',
  'Web App',
  'API',
  'Desktop',
  'Game',
  'AI/ML',
  'Other'
];

export default function ProjectFormModal({ isOpen, onClose, onSubmit, project }: ProjectFormModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    technologies: '',
    demoUrl: '',
    githubUrl: '',
    category: 'Web App',
    featured: false,
    useFallbackImage: false,
  });
  
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        category: project.category,
        featured: project.featured,
        useFallbackImage: project.useFallbackImage || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        technologies: '',
        demoUrl: '',
        githubUrl: '',
        category: 'Web App',
        featured: false,
        useFallbackImage: false,
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};
    
    // Only title is required now
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    
    // Validate URLs if provided (but they're not required)
    if (formData.demoUrl && formData.demoUrl.trim() && !isValidUrl(formData.demoUrl)) {
      newErrors.demoUrl = 'Please enter a valid URL';
    }
    if (formData.githubUrl && formData.githubUrl.trim() && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      demoUrl: '',
      githubUrl: '',
      category: 'Web App',
      featured: false,
      useFallbackImage: false,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border"
        style={{ 
          backgroundColor: 'var(--card-background)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.title ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: errors.title ? '#f87171' : 'var(--border-color)'
                }}
                placeholder="Enter project title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.description ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: errors.description ? '#f87171' : 'var(--border-color)'
                }}
                placeholder="Describe your project (optional)"
              />
              {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
            </div>
            
            {/* Technologies */}
            <div>
              <label htmlFor="technologies" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Technologies
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.technologies ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: errors.technologies ? '#f87171' : 'var(--border-color)'
                }}
                placeholder="React, Node.js, MongoDB, etc. (comma-separated, optional)"
              />
              {errors.technologies && <p className="text-red-500 text-sm mt-2">{errors.technologies}</p>}
              <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>Separate multiple technologies with commas (optional)</p>
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Demo URL */}
            <div>
              <label htmlFor="demoUrl" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Demo URL
              </label>
              <input
                type="url"
                id="demoUrl"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.demoUrl ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: errors.demoUrl ? '#f87171' : 'var(--border-color)'
                }}
                placeholder="https://your-demo.com (optional)"
              />
              {errors.demoUrl && <p className="text-red-500 text-sm mt-2">{errors.demoUrl}</p>}
              <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>Live website URL for preview in project card (optional)</p>
            </div>
            
            {/* GitHub URL */}
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                  errors.githubUrl ? 'border-red-400' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: errors.githubUrl ? '#f87171' : 'var(--border-color)'
                }}
                placeholder="https://github.com/username/repo (optional)"
              />
              {errors.githubUrl && <p className="text-red-500 text-sm mt-2">{errors.githubUrl}</p>}
            </div>
            
            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-5 w-5 rounded border-2 transition-all duration-200"
                style={{ 
                  borderColor: 'var(--border-color)',
                  accentColor: 'var(--accent)'
                }}
              />
              <label htmlFor="featured" className="ml-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Mark as featured project
              </label>
            </div>
            
            {/* Use Fallback Image */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useFallbackImage"
                name="useFallbackImage"
                checked={formData.useFallbackImage}
                onChange={handleInputChange}
                className="h-5 w-5 rounded border-2 transition-all duration-200"
                style={{ 
                  borderColor: 'var(--border-color)',
                  accentColor: 'var(--accent)'
                }}
              />
              <label htmlFor="useFallbackImage" className="ml-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Use fallback image instead of preview
              </label>
            </div>
            <p className="text-sm -mt-2" style={{ color: 'var(--muted-foreground)' }}>
              When enabled, this will show a fallback image instead of trying to load the demo URL preview
            </p>
            
            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 rounded-lg font-medium border transition-all duration-200 hover:scale-105"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--foreground)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  color: 'var(--accent-foreground)' 
                }}
              >
                {project ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
