
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImpersonationSecurityState {
  activeSession: boolean;
  sessionTimeRemaining: number;
  securityWarnings: string[];
  sessionDetails: {
    targetUser?: string;
    startTime?: Date;
    maxDuration?: number;
  };
}

interface ImpersonationContext {
  session_id: string;
  target_user_id: string;
  target_role: string;
  target_first_name: string;
  target_last_name: string;
  target_email: string;
  started_at: string;
  max_duration_minutes: number;
}

export const useImpersonationSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [securityState, setSecurityState] = useState<ImpersonationSecurityState>({
    activeSession: false,
    sessionTimeRemaining: 0,
    securityWarnings: [],
    sessionDetails: {}
  });

  const validateImpersonationSession = async () => {
    if (!user) return;

    try {
      // Check for active impersonation sessions
      const { data, error } = await supabase.rpc('get_impersonation_context');
      
      if (error) {
        console.error('Error checking impersonation status:', error);
        return;
      }

      if (data && data.length > 0) {
        const session = data[0] as ImpersonationContext;
        
        // Calculate time remaining
        const startTime = new Date(session.started_at);
        const maxDuration = session.max_duration_minutes || 60;
        const endTime = new Date(startTime.getTime() + maxDuration * 60000);
        const timeRemaining = endTime.getTime() - Date.now();
        
        // Check for security warnings
        const warnings: string[] = [];
        
        // Warn if session is close to expiring
        if (timeRemaining <= 10 * 60000 && timeRemaining > 0) { // 10 minutes
          warnings.push('Impersonation session expiring soon');
        }
        
        // Warn if session has been active for a long time
        const sessionDuration = Date.now() - startTime.getTime();
        if (sessionDuration >= 45 * 60000) { // 45 minutes
          warnings.push('Long impersonation session detected');
        }

        setSecurityState({
          activeSession: true,
          sessionTimeRemaining: Math.max(0, timeRemaining),
          securityWarnings: warnings,
          sessionDetails: {
            targetUser: `${session.target_first_name} ${session.target_last_name}`,
            startTime,
            maxDuration
          }
        });

        // Auto-end expired sessions
        if (timeRemaining <= 0) {
          await endImpersonationSession(session.session_id);
          toast({
            title: "Impersonation Session Expired",
            description: "Session has been automatically terminated for security.",
            variant: "destructive",
          });
        }

      } else {
        setSecurityState({
          activeSession: false,
          sessionTimeRemaining: 0,
          securityWarnings: [],
          sessionDetails: {}
        });
      }
    } catch (error) {
      console.error('Impersonation validation error:', error);
    }
  };

  const endImpersonationSession = async (sessionId: string) => {
    try {
      const { error } = await supabase.rpc('end_impersonation', {
        session_id: sessionId
      });

      if (error) throw error;

      setSecurityState(prev => ({
        ...prev,
        activeSession: false,
        sessionTimeRemaining: 0,
        securityWarnings: [],
        sessionDetails: {}
      }));

    } catch (error) {
      console.error('Failed to end impersonation session:', error);
    }
  };

  const logSecurityEvent = async (eventType: string, details: any) => {
    try {
      await supabase.rpc('log_security_event', {
        event_type: eventType,
        event_details: details
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // Initial check
      validateImpersonationSession();
      
      // Set up periodic monitoring
      const interval = setInterval(() => {
        validateImpersonationSession();
      }, 30000); // Check every 30 seconds for impersonation
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Log security events when warnings change
  useEffect(() => {
    if (securityState.securityWarnings.length > 0) {
      logSecurityEvent('impersonation_security_warning', {
        warnings: securityState.securityWarnings,
        session_details: securityState.sessionDetails
      });
    }
  }, [securityState.securityWarnings]);

  return {
    securityState,
    validateImpersonationSession,
    endImpersonationSession: () => {
      // Implementation would need session ID from context
      toast({
        title: "End Session",
        description: "Please use the impersonation banner to end the session.",
      });
    }
  };
};
