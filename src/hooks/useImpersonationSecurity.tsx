
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedSecurityMonitoring } from './useEnhancedSecurityMonitoring';

interface ImpersonationContext {
  sessionId: string | null;
  targetUserId: string | null;
  targetRole: string | null;
  targetFirstName: string | null;
  targetLastName: string | null;
  targetEmail: string | null;
  isImpersonating: boolean;
}

export const useImpersonationSecurity = () => {
  const { user } = useAuth();
  const { logSecurityEvent } = useEnhancedSecurityMonitoring();
  const [impersonationContext, setImpersonationContext] = useState<ImpersonationContext>({
    sessionId: null,
    targetUserId: null,
    targetRole: null,
    targetFirstName: null,
    targetLastName: null,
    targetEmail: null,
    isImpersonating: false
  });

  const checkImpersonationStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_impersonation_context');
      
      if (error) {
        console.error('Failed to get impersonation context:', error);
        return;
      }

      if (data && data.length > 0) {
        const context = data[0];
        setImpersonationContext({
          sessionId: context.session_id,
          targetUserId: context.target_user_id,
          targetRole: context.target_role,
          targetFirstName: context.target_first_name,
          targetLastName: context.target_last_name,
          targetEmail: context.target_email,
          isImpersonating: true
        });

        // Validate session is still active
        const { data: isValid } = await supabase.rpc('validate_impersonation_session', {
          session_id: context.session_id
        });

        if (!isValid) {
          // Session expired, clear context
          setImpersonationContext({
            sessionId: null,
            targetUserId: null,
            targetRole: null,
            targetFirstName: null,
            targetLastName: null,
            targetEmail: null,
            isImpersonating: false
          });
        }
      } else {
        setImpersonationContext({
          sessionId: null,
          targetUserId: null,
          targetRole: null,
          targetFirstName: null,
          targetLastName: null,
          targetEmail: null,
          isImpersonating: false
        });
      }
    } catch (error) {
      console.error('Error checking impersonation status:', error);
    }
  };

  const startSecureImpersonation = async (targetUserId: string, targetRole: string) => {
    try {
      // Validate admin action first
      const { error: validationError } = await supabase.rpc('validate_admin_action', {
        action_type: 'start_impersonation',
        target_user_id: targetUserId
      });

      if (validationError) {
        throw validationError;
      }

      const { data: sessionId, error } = await supabase.rpc('start_impersonation', {
        target_user_id: targetUserId,
        target_role: targetRole
      });

      if (error) throw error;

      await logSecurityEvent('secure_impersonation_started', {
        target_user_id: targetUserId,
        target_role: targetRole,
        session_id: sessionId,
        security_validation: true
      }, 'high');

      // Refresh impersonation status
      await checkImpersonationStatus();

      return sessionId;
    } catch (error) {
      await logSecurityEvent('impersonation_security_failure', {
        target_user_id: targetUserId,
        target_role: targetRole,
        error: error.message
      }, 'critical');
      throw error;
    }
  };

  const endSecureImpersonation = async () => {
    if (!impersonationContext.sessionId) return;

    try {
      const { data: success, error } = await supabase.rpc('end_impersonation', {
        session_id: impersonationContext.sessionId
      });

      if (error) throw error;

      if (success) {
        await logSecurityEvent('secure_impersonation_ended', {
          session_id: impersonationContext.sessionId,
          target_user_id: impersonationContext.targetUserId,
          security_validation: true
        }, 'medium');

        setImpersonationContext({
          sessionId: null,
          targetUserId: null,
          targetRole: null,
          targetFirstName: null,
          targetLastName: null,
          targetEmail: null,
          isImpersonating: false
        });
      }

      return success;
    } catch (error) {
      await logSecurityEvent('impersonation_end_failure', {
        session_id: impersonationContext.sessionId,
        error: error.message
      }, 'high');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      checkImpersonationStatus();

      // Set up periodic validation
      const interval = setInterval(checkImpersonationStatus, 60000); // Every minute

      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    impersonationContext,
    startSecureImpersonation,
    endSecureImpersonation,
    refreshImpersonationStatus: checkImpersonationStatus
  };
};
