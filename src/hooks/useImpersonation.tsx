
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImpersonationContext {
  session_id: string;
  target_user_id: string;
  target_role: string;
  target_first_name: string;
  target_last_name: string;
  target_email: string;
}

export const useImpersonation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [impersonationContext, setImpersonationContext] = useState<ImpersonationContext | null>(null);
  const [loading, setLoading] = useState(false);

  const checkImpersonationStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_impersonation_context');
      
      if (error) {
        console.error('Error checking impersonation status:', error);
        return;
      }

      if (data && data.length > 0) {
        setImpersonationContext(data[0]);
      } else {
        setImpersonationContext(null);
      }
    } catch (error) {
      console.error('Error checking impersonation status:', error);
    }
  };

  const startImpersonation = async (targetUserId: string, targetRole: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('start_impersonation', {
        target_user_id: targetUserId,
        target_role: targetRole
      });

      if (error) throw error;

      await checkImpersonationStatus();
      
      toast({
        title: "Impersonation Started",
        description: "You are now impersonating the selected user.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Failed to start impersonation",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const endImpersonation = async () => {
    if (!impersonationContext) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('end_impersonation', {
        session_id: impersonationContext.session_id
      });

      if (error) throw error;

      setImpersonationContext(null);
      
      toast({
        title: "Impersonation Ended",
        description: "You have returned to your admin account.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Failed to end impersonation",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkImpersonationStatus();
    }
  }, [user]);

  return {
    impersonationContext,
    loading,
    startImpersonation,
    endImpersonation,
    refreshStatus: checkImpersonationStatus
  };
};
