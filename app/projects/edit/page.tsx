'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import ProjectGallery from '@/components/ProjectGallery';

export default function ProjectsEditPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication with a small delay to handle timing issues
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setAuthChecked(true);
      
      if (!authenticated) {
        router.replace('/projects?requestEdit=true');
      }
    };

    // Initial check
    checkAuth();
    
    // Fallback check after a short delay (handles race conditions)
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: 'var(--muted-foreground)' }}></div>
      </div>
    );
  }

  // Show loading if not authenticated (while redirecting)
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: 'var(--muted-foreground)' }}></div>
      </div>
    );
  }

  return <ProjectGallery isEditMode={true} skipAuthCheck={true} />;
}
