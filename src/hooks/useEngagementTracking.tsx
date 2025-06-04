
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useEngagementTracking = () => {
  const { user } = useAuth();

  const trackEngagement = useCallback(async (
    actionType: 'lesson_start' | 'lesson_complete' | 'course_create' | 'login' | 'logout' | 'page_view',
    resourceId?: string,
    metadata?: any
  ) => {
    if (!user) return;

    try {
      await supabase.from('user_engagement').insert({
        user_id: user.id,
        action_type: actionType,
        resource_id: resourceId,
        metadata
      });
    } catch (error) {
      console.error('Failed to track engagement:', error);
    }
  }, [user]);

  const trackLessonStart = useCallback((lessonId: string) => {
    trackEngagement('lesson_start', lessonId);
  }, [trackEngagement]);

  const trackLessonComplete = useCallback((lessonId: string, timeSpent: number) => {
    trackEngagement('lesson_complete', lessonId, { time_spent: timeSpent });
  }, [trackEngagement]);

  const trackCourseCreate = useCallback((courseId: string) => {
    trackEngagement('course_create', courseId);
  }, [trackEngagement]);

  const trackPageView = useCallback((pageName: string) => {
    trackEngagement('page_view', null, { page: pageName });
  }, [trackEngagement]);

  return {
    trackEngagement,
    trackLessonStart,
    trackLessonComplete,
    trackCourseCreate,
    trackPageView
  };
};
