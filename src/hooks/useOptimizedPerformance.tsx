
import { useCallback, useEffect, useState } from 'react';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
}

export const useOptimizedPerformance = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0
  });
  const { trackPerformance } = usePerformanceTracking();

  const measureRenderTime = useCallback(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      setMetrics(prev => ({ ...prev, renderTime }));
      trackPerformance(`${componentName}_render`, startTime);
    };
  }, [componentName, trackPerformance]);

  const measureInteraction = useCallback((action: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const interactionTime = endTime - startTime;
      setMetrics(prev => ({ ...prev, interactionTime }));
      trackPerformance(`${componentName}_${action}`, startTime);
    };
  }, [componentName, trackPerformance]);

  useEffect(() => {
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));
  }, []);

  return {
    metrics,
    measureRenderTime,
    measureInteraction
  };
};
