'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectFormData } from '@/types/project';
import { getProjects, addProject, updateProject, deleteProject, getCategories } from '@/lib/projects';
import { isAuthenticated, extendSession } from '@/lib/auth';
import { FiSettings } from 'react-icons/fi';
import ProjectCard from './ProjectCard';
import ProjectFormModal from './ProjectFormModal';
import ProjectViewModal from './ProjectViewModal';
import AuthModal from './AuthModal';

interface ProjectGalleryProps {
  isEditMode?: boolean;
}

export default function ProjectGallery({ isEditMode = false }: ProjectGalleryProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  
  // Authentication state
  const [isAuthenticated_, setIsAuthenticated_] = useState(false);

  const filterAndSortProjects = useCallback(() => {
    let filtered = [...projects];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.technologies.some(tech => tech.toLowerCase().includes(term))
      );
    }
    
    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    setFilteredProjects(filtered);
  }, [projects, selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    loadProjects();
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isEditMode && !isAuthenticated_) {
      setShowAuthModal(true);
    }
  }, [isEditMode, isAuthenticated_]);

  useEffect(() => {
    filterAndSortProjects();
  }, [filterAndSortProjects]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await getProjects();
      setProjects(allProjects);
      
      const allCategories = await getCategories();
      setCategories(['All', ...allCategories]);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = () => {
    if (typeof window !== 'undefined') {
      setIsAuthenticated_(isAuthenticated());
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated_(true);
    extendSession();
  };

  const handleAddProject = () => {
    if (!isAuthenticated_) {
      setShowAuthModal(true);
      return;
    }
    setEditingProject(undefined);
    setShowProjectModal(true);
  };

  const handleEditProject = (project: Project) => {
    if (!isAuthenticated_) {
      setShowAuthModal(true);
      return;
    }
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const handleViewProject = (project: Project) => {
    setViewingProject(project);
    setShowViewModal(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!isAuthenticated_) {
      setShowAuthModal(true);
      return;
    }
    
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleProjectSubmit = async (formData: ProjectFormData) => {
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
    };
    
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await addProject(projectData);
      }
      
      await loadProjects();
      setShowProjectModal(false);
      setEditingProject(undefined);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Page Header */}
      <div className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
                {isEditMode ? 'Edit Projects' : 'Project Gallery'}
              </h1>
              <p className="mt-3 text-lg" style={{ color: 'var(--muted-foreground)' }}>
                {isEditMode ? 'Manage your projects' : 'Discover amazing projects and applications'}
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-3">
              {isEditMode && isAuthenticated_ && (
                <>
                  <button
                    onClick={handleSettings}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={{ 
                      color: 'var(--muted-foreground)',
                      backgroundColor: 'transparent'
                    }}
                    title="Settings"
                  >
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleAddProject}
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: 'var(--accent)', 
                      color: 'var(--accent-foreground)' 
                    }}
                  >
                    Add Project
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border-color)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  style={{ 
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--border-color)'
                  }}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: 'var(--muted-foreground)' }}></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isEditMode={isEditMode && isAuthenticated_}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onView={handleViewProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-3" style={{ color: 'var(--foreground)' }}>No projects found</h3>
            <p className="text-lg mb-8" style={{ color: 'var(--muted-foreground)' }}>
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'No projects have been added yet.'}
            </p>
            {isEditMode && isAuthenticated_ && (
              <button
                onClick={handleAddProject}
                className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  color: 'var(--accent-foreground)' 
                }}
              >
                Add Your First Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
      
      <ProjectFormModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(undefined);
        }}
        onSubmit={handleProjectSubmit}
        project={editingProject}
      />

      <ProjectViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingProject(null);
        }}
        project={viewingProject}
      />
    </div>
  );
}
