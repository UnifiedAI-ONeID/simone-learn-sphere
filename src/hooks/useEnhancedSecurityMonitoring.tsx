
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateSessionFingerprint, generateSecureSessionToken } from '@/utils/enhancedSecurityHeaders';

interface SecurityAlert {
  id: string;
  alert_type: string;
  alert_details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  created_at: string;
}

interface SecurityState {
  alerts: SecurityAlert[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  sessionFingerprint: string;
  lastSecurityCheck: Date;
  activeSessions: number;
}

export const useEnhancedSecurityMonitoring = () => {
  const { user } = useAuth();
  const [securityState, setSecurityState] = useState<SecurityState>({
    alerts: [],
    threatLevel: 'low',
    sessionFingerprint: '',
    lastSecurityCheck: new Date(),
    activeSessions: 0
  });
  const [loading, setLoading] = useState(false);

  const logSecurityEvent = useCallback(async (
    eventType: string,
    eventDetails?: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_enhanced_security_event', {
        event_type: eventType,
        event_details: eventDetails || null,
        severity
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }, [user]);

  const checkSessionLimits = useCallback(async () => {
    if (!user) return true;

    try {
      const { data, error } = await supabase.rpc('check_session_limits', {
        check_user_id: user.id
      });

      if (error) {
        console.error('Failed to check session limits:', error);
        return true;
      }

      return data;
    } catch (error) {
      console.error('Error checking session limits:', error);
      return true;
    }
  }, [user]);

  const fetchSecurityAlerts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Failed to fetch security alerts:', error);
        return;
      }

      const alerts = data || [];
      const maxSeverity = alerts.reduce((max, alert) => {
        const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
        const currentLevel = severityLevels[alert.severity];
        const maxLevel = severityLevels[max];
        return currentLevel > maxLevel ? alert.severity : max;
      }, 'low');

      setSecurityState(prev => ({
        ...prev,
        alerts,
        threatLevel: maxSeverity,
        lastSecurityCheck: new Date()
      }));
    } catch (error) {
      console.error('Error fetching security alerts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const resolveSecurityAlert = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ 
          resolved: true, 
          resolved_at: new Date().toISOString() 
        })
        .eq('id', alertId);

      if (error) {
        console.error('Failed to resolve security alert:', error);
        return;
      }

      setSecurityState(prev => ({
        ...prev,
        alerts: prev.alerts.filter(alert => alert.id !== alertId)
      }));

      await logSecurityEvent('security_alert_resolved', { alert_id: alertId });
    } catch (error) {
      console.error('Error resolving security alert:', error);
    }
  }, [logSecurityEvent]);

  const initializeSessionSecurity = useCallback(async () => {
    if (!user) return;

    try {
      const fingerprint = generateSessionFingerprint();
      const sessionToken = generateSecureSessionToken();

      setSecurityState(prev => ({
        ...prev,
        sessionFingerprint: fingerprint
      }));

      // Check session limits
      const canCreateSession = await checkSessionLimits();
      if (!canCreateSession) {
        await logSecurityEvent(
          'session_creation_blocked', 
          { reason: 'session_limit_exceeded' },
          'high'
        );
        return;
      }

      // Update session with fingerprint
      const { error } = await supabase
        .from('user_sessions')
        .update({
          session_fingerprint: fingerprint,
          last_activity: new Date().toISOString(),
          security_flags: {
            secure_initialization: true,
            fingerprint_verified: true
          }
        })
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Failed to update session security:', error);
      }

      await logSecurityEvent('secure_session_initialized', {
        fingerprint_hash: btoa(fingerprint.slice(0, 8)),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error initializing session security:', error);
      await logSecurityEvent(
        'session_security_initialization_failed',
        { error: error.message },
        'high'
      );
    }
  }, [user, checkSessionLimits, logSecurityEvent]);

  const performSecurityScan = useCallback(async () => {
    if (!user) return;

    try {
      const threats: string[] = [];
      const currentFingerprint = generateSessionFingerprint();

      // Check for fingerprint changes
      if (securityState.sessionFingerprint && securityState.sessionFingerprint !== currentFingerprint) {
        threats.push('Session fingerprint mismatch detected');
        await logSecurityEvent(
          'session_fingerprint_mismatch',
          {
            original_hash: btoa(securityState.sessionFingerprint.slice(0, 8)),
            current_hash: btoa(currentFingerprint.slice(0, 8))
          },
          'high'
        );
      }

      // Check for suspicious browser patterns
      const userAgent = navigator.userAgent;
      if (userAgent.includes('HeadlessChrome') || userAgent.includes('PhantomJS') || userAgent.includes('Selenium')) {
        threats.push('Automated browser detected');
        await logSecurityEvent(
          'automated_browser_detected',
          { user_agent: userAgent },
          'critical'
        );
      }

      // Check for rapid activity
      const requestCount = parseInt(sessionStorage.getItem('securityRequestCount') || '0');
      if (requestCount > 100) {
        threats.push('Excessive request frequency detected');
        await logSecurityEvent(
          'excessive_request_frequency',
          { request_count: requestCount },
          'high'
        );
      }

      // Update request counter
      sessionStorage.setItem('securityRequestCount', (requestCount + 1).toString());

      if (threats.length > 0) {
        await fetchSecurityAlerts(); // Refresh alerts
      }

    } catch (error) {
      console.error('Error performing security scan:', error);
    }
  }, [user, securityState.sessionFingerprint, logSecurityEvent, fetchSecurityAlerts]);

  useEffect(() => {
    if (user) {
      initializeSessionSecurity();
      fetchSecurityAlerts();

      // Set up periodic security monitoring
      const securityInterval = setInterval(() => {
        performSecurityScan();
      }, 30000); // Every 30 seconds

      // Set up periodic alert refresh
      const alertInterval = setInterval(() => {
        fetchSecurityAlerts();
      }, 60000); // Every minute

      return () => {
        clearInterval(securityInterval);
        clearInterval(alertInterval);
      };
    }
  }, [user, initializeSessionSecurity, fetchSecurityAlerts, performSecurityScan]);

  return {
    securityState,
    loading,
    logSecurityEvent,
    checkSessionLimits,
    resolveSecurityAlert,
    refreshAlerts: fetchSecurityAlerts,
    performSecurityScan
  };
};
