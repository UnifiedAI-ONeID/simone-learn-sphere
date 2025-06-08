import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedSecurityMonitoring } from '@/hooks/useEnhancedSecurityMonitoring';
import { useToast } from '@/hooks/use-toast';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

interface EnhancedSecurityState {
  sessionWarning: boolean;
  timeUntilExpiry: number;
  securityThreats: string[];
  lastActivity: number;
}

export const useEnhancedSessionSecurity = () => {
  const { user, signOut } = useAuth();
  const { securityState, logSecurityEvent } = useEnhancedSecurityMonitoring();
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionWarning, setSessionWarning] = useState(false);

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setSessionWarning(false);
  }, []);

  const handleSessionTimeout = useCallback(async () => {
    if (user) {
      await logSecurityEvent('session_timeout', {
        user_id: user.id,
        last_activity: new Date(lastActivity).toISOString()
      });
      
      toast({
        title: "Session Expired",
        description: "Your session has expired due to inactivity. Please sign in again.",
        variant: "destructive",
      });
      
      await signOut();
    }
  }, [user, lastActivity, logSecurityEvent, toast, signOut]);

  const handleTimeoutWarning = useCallback(() => {
    setSessionWarning(true);
    toast({
      title: "Session Expiring Soon",
      description: "Your session will expire in 5 minutes due to inactivity.",
      variant: "destructive",
    });
  }, [toast]);

  const extendSession = useCallback(() => {
    updateActivity();
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  }, [updateActivity, toast]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [user, updateActivity]);

  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const timeSinceActivity = Date.now() - lastActivity;
      
      if (timeSinceActivity >= SESSION_TIMEOUT) {
        handleSessionTimeout();
      } else if (timeSinceActivity >= SESSION_TIMEOUT - WARNING_TIME && !sessionWarning) {
        handleTimeoutWarning();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, lastActivity, sessionWarning, handleSessionTimeout, handleTimeoutWarning]);

  const enhancedSecurityState: EnhancedSecurityState = {
    sessionWarning,
    timeUntilExpiry: Math.max(0, SESSION_TIMEOUT - (Date.now() - lastActivity)),
    securityThreats: securityState.securityThreats,
    lastActivity
  };

  return {
    securityState: enhancedSecurityState,
    extendSession,
    logSecurityEvent,
    performSecurityScan: () => {} // Placeholder for compatibility
  };
};
