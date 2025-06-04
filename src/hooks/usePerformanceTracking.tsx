
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePerformanceTracking = () => {
  const trackPerformance = useCallback(async (endpoint: string, startTime: number) => {
    const responseTime = Date.now() - startTime;
    
    try {
      await supabase.from('performance_metrics').insert({
        endpoint,
        response_time_ms: responseTime,
        user_agent: navigator.userAgent,
        ip_address: null // Will be populated by edge function if needed
      });
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  }, []);

  const withPerformanceTracking = useCallback(<T extends any[]>(
    endpoint: string,
    fn: (...args: T) => Promise<any>
  ) => {
    return async (...args: T) => {
      const startTime = Date.now();
      try {
        const result = await fn(...args);
        await trackPerformance(endpoint, startTime);
        return result;
      } catch (error) {
        await trackPerformance(endpoint, startTime);
        throw error;
      }
    };
  }, [trackPerformance]);

  return { trackPerformance, withPerformanceTracking };
};
