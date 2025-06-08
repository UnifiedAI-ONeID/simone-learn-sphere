
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedSessionSecurity } from '@/hooks/useEnhancedSessionSecurity';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { useSessionTracking } from '@/hooks/useSessionTracking';

interface SecurityContextType {
  isSecure: boolean;
  threatLevel: 'low' | 'medium' | 'high';
  sessionValid: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    // Return safe defaults instead of throwing
    return {
      isSecure: true,
      threatLevel: 'low' as const,
      sessionValid: true,
    };
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isSecure, setIsSecure] = useState(true);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [sessionValid, setSessionValid] = useState(true);

  // Only use security hooks if user is authenticated
  const shouldUseSecurityHooks = !!user;

  const sessionSecurity = shouldUseSecurityHooks ? useEnhancedSessionSecurity() : null;
  const securityMonitor = shouldUseSecurityHooks ? useSecurityMonitor() : null;
  const sessionTracking = shouldUseSecurityHooks ? useSessionTracking() : null;

  useEffect(() => {
    if (!shouldUseSecurityHooks) {
      setIsSecure(true);
      setThreatLevel('low');
      setSessionValid(true);
      return;
    }

    // Update security state based on hooks
    if (sessionSecurity) {
      setSessionValid(sessionSecurity.isSessionValid);
    }

    if (securityMonitor) {
      setThreatLevel(securityMonitor.threatLevel || 'low');
      setIsSecure(!securityMonitor.hasActiveThreats);
    }
  }, [shouldUseSecurityHooks, sessionSecurity, securityMonitor]);

  const value = {
    isSecure,
    threatLevel,
    sessionValid,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
