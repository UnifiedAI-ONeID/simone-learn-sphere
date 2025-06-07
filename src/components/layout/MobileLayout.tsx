
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { OptimizedMobileHeader } from './OptimizedMobileHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const MobileLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col">
        <OptimizedMobileHeader />
        <main className="flex-1 overflow-auto pb-16">
          <Outlet />
        </main>
        <MobileNavigation />
      </div>
    </ErrorBoundary>
  );
};
