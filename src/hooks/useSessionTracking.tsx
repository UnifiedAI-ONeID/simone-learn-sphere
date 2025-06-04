
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSessionTracking = () => {
  const { user } = useAuth();

  const startSession = useCallback(async () => {
    if (!user) return;

    try {
      // End any existing active sessions
      await supabase
        .from('user_sessions')
        .update({ is_active: false, session_end: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Start new session
      await supabase.from('user_sessions').insert({
        user_id: user.id,
        user_agent: navigator.userAgent,
        ip_address: null // Will be populated by edge function if needed
      });
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }, [user]);

  const endSession = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_sessions')
        .update({ is_active: false, session_end: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_active', true);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      startSession();

      // End session on page unload
      const handleBeforeUnload = () => {
        endSession();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        endSession();
      };
    }
  }, [user, startSession, endSession]);

  return { startSession, endSession };
};
