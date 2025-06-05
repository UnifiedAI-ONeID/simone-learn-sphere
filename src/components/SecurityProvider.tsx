
import React, { createContext, useContext, ReactNode } from 'react';
import { SecurityAlert } from '@/components/SecurityAlert';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { useEnhancedSessionSecurity } from '@/hooks/useEnhancedSessionSecurity';
import { useImpersonationSecurity } from '@/hooks/useImpersonationSecurity';

interface SecurityContextType {
  sessionSecurity: ReturnType<typeof useEnhancedSessionSecurity>;
  impersonationSecurity: ReturnType<typeof useImpersonationSecurity>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const sessionSecurity = useEnhancedSessionSecurity();
  const impersonationSecurity = useImpersonationSecurity();

  const value = {
    sessionSecurity,
    impersonationSecurity
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
      <SecurityAlert />
      <SessionTimeoutWarning />
    </SecurityContext.Provider>
  );
};
