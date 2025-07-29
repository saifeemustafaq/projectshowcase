export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  technologies: string;
  demoUrl: string;
  githubUrl: string;
  category: string;
  featured: boolean;
}
