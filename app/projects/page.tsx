'use client';

import { Suspense } from 'react';
import ProjectsPageContent from './ProjectsPageContent';

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: 'var(--muted-foreground)' }}></div>
      </div>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}
