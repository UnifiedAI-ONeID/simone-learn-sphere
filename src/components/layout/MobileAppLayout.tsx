
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileAppHeader } from './MobileAppHeader';
import { MobileAppNavigation } from './MobileAppNavigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

export const MobileAppLayout = () => {
  const { measureRenderTime } = useOptimizedPerformance('MobileAppLayout');

  React.useEffect(() => {
    const endMeasure = measureRenderTime();
    return endMeasure;
  }, [measureRenderTime]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col">
        <MobileAppHeader />
        <main className="flex-1 overflow-auto pb-20 px-4">
          <div className="max-w-md mx-auto">
            <Outlet />
          </div>
        </main>
        <MobileAppNavigation />
      </div>
    </ErrorBoundary>
  );
};
