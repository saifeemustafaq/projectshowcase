'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';

export default function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRequestEdit = searchParams.get('requestEdit');
  const [requestEdit, setRequestEdit] = useState(!!initialRequestEdit);

  useEffect(() => {
    // Set the initial requestEdit state but don't clean URL immediately
    if (initialRequestEdit) {
      setRequestEdit(true);
    }
  }, [initialRequestEdit]);

  const handleAuthSuccess = () => {
    // Clean up URL only after successful auth when navigating to edit
    if (requestEdit) {
      router.replace('/projects');
      setRequestEdit(false);
    }
  };

  return <ProjectGallery 
    isEditMode={false} 
    requestEdit={requestEdit} 
    onAuthSuccess={handleAuthSuccess}
  />;
}
