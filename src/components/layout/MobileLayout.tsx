
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileAppNavigation } from './MobileAppNavigation';
import { MobileAppHeader } from './MobileAppHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

export const MobileLayout = () => {
  const { measureRenderTime } = useOptimizedPerformance('MobileLayout');

  React.useEffect(() => {
    const endMeasure = measureRenderTime();
    return endMeasure;
  }, [measureRenderTime]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
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
