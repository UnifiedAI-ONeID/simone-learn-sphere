
import React from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ContextualAIHelper } from '@/components/ContextualAIHelper';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  children
}) => {
  const handleSuggestionClick = (suggestion: string) => {
    console.log('AI suggestion clicked:', suggestion);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <DashboardHeader 
        title={title}
        subtitle={subtitle || ''}
      />
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
      <ContextualAIHelper 
        currentPage={title}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
};
