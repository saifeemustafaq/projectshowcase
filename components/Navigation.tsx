'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/projects" 
            className="text-xl font-bold tracking-tight transition-all duration-200 hover:scale-105"
            style={{ color: 'var(--foreground)' }}
          >
            Project Showcase
          </Link>
          
          <div className="flex items-center space-x-1">
            <Link
              href="/projects"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                pathname === '/projects' ? 'shadow-sm' : ''
              }`}
              style={{ 
                backgroundColor: pathname === '/projects' ? 'var(--accent)' : 'transparent',
                color: pathname === '/projects' ? 'var(--accent-foreground)' : 'var(--foreground)'
              }}
            >
              Gallery
            </Link>
            <Link
              href="/projects/edit"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                pathname === '/projects/edit' ? 'shadow-sm' : ''
              }`}
              style={{ 
                backgroundColor: pathname === '/projects/edit' ? 'var(--accent)' : 'transparent',
                color: pathname === '/projects/edit' ? 'var(--accent-foreground)' : 'var(--foreground)'
              }}
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
