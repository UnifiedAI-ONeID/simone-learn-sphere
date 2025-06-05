
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionSecurityState {
  isSessionValid: boolean;
  timeUntilExpiry: number;
  sessionWarning: boolean;
  securityThreats: string[];
}

export const useEnhancedSessionSecurity = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [securityState, setSecurityState] = useState<SessionSecurityState>({
    isSessionValid: true,
    timeUntilExpiry: 0,
    sessionWarning: false,
    securityThreats: []
  });

  // Validate session integrity
  const validateSession = async () => {
    if (!user) return;

    try {
      // Check if session is still valid in Supabase
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error || !session.session) {
        setSecurityState(prev => ({
          ...prev,
          isSessionValid: false,
          securityThreats: [...prev.securityThreats, 'Invalid session detected']
        }));
        
        toast({
          title: "Session Security Alert",
          description: "Your session is invalid. Please sign in again.",
          variant: "destructive",
        });
        
        await signOut();
        return;
      }

      // Check session expiry
      const expiresAt = new Date(session.session.expires_at! * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Show warning 10 minutes before expiry
      const warningThreshold = 10 * 60 * 1000; // 10 minutes
      
      setSecurityState(prev => ({
        ...prev,
        isSessionValid: true,
        timeUntilExpiry,
        sessionWarning: timeUntilExpiry <= warningThreshold && timeUntilExpiry > 0
      }));

      // Auto-logout if session expired
      if (timeUntilExpiry <= 0) {
        toast({
          title: "Session Expired",
          description: "Your session has expired for security reasons.",
          variant: "destructive",
        });
        await signOut();
      }

    } catch (error) {
      console.error('Session validation error:', error);
      setSecurityState(prev => ({
        ...prev,
        securityThreats: [...prev.securityThreats, 'Session validation failed']
      }));
    }
  };

  // Monitor for suspicious activity
  const detectSuspiciousActivity = () => {
    const threats: string[] = [];
    
    // Check for multiple tabs (basic detection)
    if (typeof window !== 'undefined') {
      const tabId = sessionStorage.getItem('tabId');
      if (!tabId) {
        sessionStorage.setItem('tabId', Date.now().toString());
      }
      
      // Check for tab hijacking
      window.addEventListener('storage', (e) => {
        if (e.key === 'auth-token' && e.newValue !== e.oldValue) {
          threats.push('Potential session hijacking detected');
        }
      });
      
      // Check for suspicious user agent changes
      const storedUA = localStorage.getItem('userAgent');
      const currentUA = navigator.userAgent;
      
      if (storedUA && storedUA !== currentUA) {
        threats.push('User agent change detected');
      } else if (!storedUA) {
        localStorage.setItem('userAgent', currentUA);
      }
    }
    
    if (threats.length > 0) {
      setSecurityState(prev => ({
        ...prev,
        securityThreats: [...prev.securityThreats, ...threats]
      }));
    }
  };

  // Extend session if user is active
  const extendSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      toast({
        title: "Session Extended",
        description: "Your session has been extended for security.",
      });
      
      setSecurityState(prev => ({
        ...prev,
        sessionWarning: false
      }));
      
    } catch (error) {
      console.error('Failed to extend session:', error);
      toast({
        title: "Session Extension Failed",
        description: "Unable to extend session. Please sign in again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      // Initial validation
      validateSession();
      detectSuspiciousActivity();
      
      // Set up periodic validation
      const interval = setInterval(() => {
        validateSession();
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    securityState,
    extendSession,
    validateSession
  };
};
