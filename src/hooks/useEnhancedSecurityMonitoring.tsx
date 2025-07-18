
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateSessionFingerprint, generateSecureSessionToken } from '@/utils/enhancedSecurityHeaders';

interface SecurityAlert {
  id: string;
  alert_type: string;
  alert_details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  resolved: boolean;
}

interface SecurityState {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  sessionFingerprint: string;
  lastSecurityCheck: Date;
  activeSessions: number;
  securityThreats: string[];
  alerts: SecurityAlert[];
}

export const useEnhancedSecurityMonitoring = () => {
  const { user } = useAuth();
  const [securityState, setSecurityState] = useState<SecurityState>({
    threatLevel: 'low',
    sessionFingerprint: '',
    lastSecurityCheck: new Date(),
    activeSessions: 0,
    securityThreats: [],
    alerts: []
  });
  const [loading, setLoading] = useState(false);

  const logSecurityEvent = useCallback(async (
    eventType: string,
    eventDetails?: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('log_security_event', {
        event_type: eventType,
        event_details: eventDetails || null,
        ip_address: null,
        user_agent: navigator.userAgent
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }, [user]);

  const resolveSecurityAlert = useCallback(async (alertId: string) => {
    if (!user) return;

    try {
      // Since we don't have the security_alerts table in current schema,
      // we'll just remove it from local state and log the resolution
      setSecurityState(prev => ({
        ...prev,
        alerts: prev.alerts.filter(alert => alert.id !== alertId)
      }));

      await logSecurityEvent('security_alert_resolved', {
        alert_id: alertId,
        resolved_by: user.id
      }, 'low');
    } catch (error) {
      console.error('Error resolving security alert:', error);
    }
  }, [user, logSecurityEvent]);

  const initializeSessionSecurity = useCallback(async () => {
    if (!user) return;

    try {
      const fingerprint = generateSessionFingerprint();
      const sessionToken = generateSecureSessionToken();

      setSecurityState(prev => ({
        ...prev,
        sessionFingerprint: fingerprint
      }));

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
  }, [user, logSecurityEvent]);

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

      // Create alerts from threats
      const newAlerts: SecurityAlert[] = threats.map((threat, index) => ({
        id: `alert_${Date.now()}_${index}`,
        alert_type: threat.toLowerCase().replace(/\s+/g, '_'),
        alert_details: { description: threat },
        severity: threat.includes('automated') ? 'critical' : 'high' as any,
        created_at: new Date().toISOString(),
        resolved: false
      }));

      // Update security state
      setSecurityState(prev => ({
        ...prev,
        securityThreats: threats,
        alerts: [...prev.alerts, ...newAlerts],
        threatLevel: threats.length > 0 ? (threats.some(t => t.includes('automated')) ? 'critical' : 'high') : 'low',
        lastSecurityCheck: new Date()
      }));

    } catch (error) {
      console.error('Error performing security scan:', error);
    }
  }, [user, securityState.sessionFingerprint, logSecurityEvent]);

  useEffect(() => {
    if (user) {
      initializeSessionSecurity();

      // Set up periodic security monitoring
      const securityInterval = setInterval(() => {
        performSecurityScan();
      }, 30000); // Every 30 seconds

      return () => {
        clearInterval(securityInterval);
      };
    }
  }, [user, initializeSessionSecurity, performSecurityScan]);

  return {
    securityState,
    loading,
    logSecurityEvent,
    performSecurityScan,
    resolveSecurityAlert
  };
};
