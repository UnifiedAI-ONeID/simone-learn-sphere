
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

interface ImpersonationState {
  isImpersonating: boolean;
  targetUser: any;
  sessionId: string | null;
  canImpersonate: boolean;
}

export const useImpersonationSecurity = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const [impersonationState, setImpersonationState] = useState<ImpersonationState>({
    isImpersonating: false,
    targetUser: null,
    sessionId: null,
    canImpersonate: false
  });
  const [loading, setLoading] = useState(false);

  const validateAdminPermissions = useCallback(async (action: string, targetUserId?: string) => {
    if (role !== 'admin') {
      throw new Error('Unauthorized: Admin role required');
    }

    // Log admin action attempt
    await supabase.rpc('log_security_event', {
      event_type: 'admin_action_attempted',
      event_details: {
        action,
        target_user_id: targetUserId,
        admin_id: user?.id
      },
      ip_address: null,
      user_agent: navigator.userAgent
    });

    return true;
  }, [role, user]);

  const startImpersonation = useCallback(async (targetUserId: string, targetRole: string) => {
    if (!user) return null;

    try {
      setLoading(true);
      
      // Validate admin permissions
      await validateAdminPermissions('start_impersonation', targetUserId);

      // Call the existing start_impersonation function
      const { data: sessionId, error } = await supabase.rpc('start_impersonation', {
        target_user_id: targetUserId,
        target_role: targetRole
      });

      if (error) {
        console.error('Failed to start impersonation:', error);
        throw error;
      }

      // Get target user details
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (userError) {
        console.error('Failed to get target user:', userError);
        throw userError;
      }

      setImpersonationState({
        isImpersonating: true,
        targetUser,
        sessionId,
        canImpersonate: true
      });

      return sessionId;
    } catch (error) {
      console.error('Error starting impersonation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, validateAdminPermissions]);

  const endImpersonation = useCallback(async () => {
    if (!impersonationState.sessionId) return false;

    try {
      setLoading(true);

      const { data: success, error } = await supabase.rpc('end_impersonation', {
        session_id: impersonationState.sessionId
      });

      if (error) {
        console.error('Failed to end impersonation:', error);
        throw error;
      }

      setImpersonationState({
        isImpersonating: false,
        targetUser: null,
        sessionId: null,
        canImpersonate: role === 'admin'
      });

      return success;
    } catch (error) {
      console.error('Error ending impersonation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [impersonationState.sessionId, role]);

  const checkImpersonationContext = useCallback(async () => {
    if (!user || role !== 'admin') return;

    try {
      const { data: context, error } = await supabase.rpc('get_impersonation_context');

      if (error) {
        console.error('Failed to get impersonation context:', error);
        return;
      }

      if (context && context.length > 0) {
        const activeSession = context[0];
        setImpersonationState({
          isImpersonating: true,
          targetUser: {
            id: activeSession.target_user_id,
            first_name: activeSession.target_first_name,
            last_name: activeSession.target_last_name,
            email: activeSession.target_email,
            role: activeSession.target_role
          },
          sessionId: activeSession.session_id,
          canImpersonate: true
        });
      } else {
        setImpersonationState(prev => ({
          ...prev,
          isImpersonating: false,
          targetUser: null,
          sessionId: null,
          canImpersonate: true
        }));
      }
    } catch (error) {
      console.error('Error checking impersonation context:', error);
    }
  }, [user, role]);

  useEffect(() => {
    if (user && role === 'admin') {
      setImpersonationState(prev => ({ ...prev, canImpersonate: true }));
      checkImpersonationContext();
    } else {
      setImpersonationState({
        isImpersonating: false,
        targetUser: null,
        sessionId: null,
        canImpersonate: false
      });
    }
  }, [user, role, checkImpersonationContext]);

  return {
    impersonationState,
    loading,
    startImpersonation,
    endImpersonation,
    validateAdminPermissions,
    refreshImpersonationContext: checkImpersonationContext
  };
};
