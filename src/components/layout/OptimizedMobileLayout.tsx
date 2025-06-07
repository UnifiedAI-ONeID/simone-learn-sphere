
import React, { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { MobileHeader } from './MobileHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load components for better performance
const SecurityProvider = lazy(() => import('@/components/SecurityProvider').then(module => ({ default: module.SecurityProvider })));

export const OptimizedMobileLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-auto pb-16">
          <Suspense fallback={
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          }>
            <SecurityProvider>
              <Outlet />
            </SecurityProvider>
          </Suspense>
        </main>
        <MobileNavigation />
      </div>
    </ErrorBoundary>
  );
};
