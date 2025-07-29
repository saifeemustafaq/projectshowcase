/**
 * Utility script to clear localStorage data for the project showcase
 * Run this in browser console to reset demo data: clearProjectData()
 */
export function clearProjectData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('project_showcase_projects');
    sessionStorage.removeItem('project_showcase_session');
    console.log('Project showcase data cleared. Refresh the page to see new demo data.');
  }
}

// Extend window interface for development
declare global {
  interface Window {
    clearProjectData: () => void;
  }
}

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.clearProjectData = clearProjectData;
}
