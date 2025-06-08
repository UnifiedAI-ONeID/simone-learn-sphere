
import React from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ContextualAIHelper } from '@/components/ContextualAIHelper';

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
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title={title}
        subtitle={subtitle || ''}
      />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
      <ContextualAIHelper />
    </div>
  );
};
