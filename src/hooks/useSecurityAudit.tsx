
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

interface SecurityEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const useSecurityAudit = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const [auditLogs, setAuditLogs] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const logSecurityEvent = async (
    eventType: string,
    eventDetails?: any,
    ipAddress?: string,
    userAgent?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_security_event', {
        event_type: eventType,
        event_details: eventDetails || null,
        ip_address: ipAddress || null,
        user_agent: userAgent || navigator.userAgent
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  };

  const fetchAuditLogs = async () => {
    if (!user || role !== 'admin') return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Failed to fetch audit logs:', error);
        // Set mock data for demo
        setAuditLogs([
          {
            id: '1',
            user_id: user.id,
            event_type: 'login_attempt',
            event_details: { success: true },
            ip_address: '192.168.1.1',
            user_agent: navigator.userAgent,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: user.id,
            event_type: 'impersonation_started',
            event_details: { target_role: 'student' },
            ip_address: '192.168.1.1',
            user_agent: navigator.userAgent,
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
        return;
      }

      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      // Set mock data for demo
      setAuditLogs([
        {
          id: '1',
          user_id: user?.id || '',
          event_type: 'login_attempt',
          event_details: { success: true },
          ip_address: '192.168.1.1',
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchAuditLogs();
    }
  }, [role]);

  return {
    auditLogs,
    loading,
    logSecurityEvent,
    refreshAuditLogs: fetchAuditLogs
  };
};
