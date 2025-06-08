
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { getClientIP } from '@/utils/securityUtils';

interface SecurityState {
  threatLevel: 'low' | 'medium' | 'high';
  activeThreats: string[];
  lastSecurityCheck: Date;
}

export const useSecurityMonitor = () => {
  const { user } = useAuth();
  const { logSecurityEvent } = useSecurityAudit();
  const [securityState, setSecurityState] = useState<SecurityState>({
    threatLevel: 'low',
    activeThreats: [],
    lastSecurityCheck: new Date()
  });

  useEffect(() => {
    if (!user) return;

    const monitorSecurity = async () => {
      const threats: string[] = [];
      let threatLevel: 'low' | 'medium' | 'high' = 'low';

      // Monitor for suspicious activity
      const userAgent = navigator.userAgent;
      let clientIP = 'unknown';
      
      try {
        clientIP = await getClientIP();
      } catch (error) {
        console.log('Could not get client IP:', error);
      }

      // Check for unusual browser patterns
      if (userAgent.includes('HeadlessChrome') || userAgent.includes('PhantomJS')) {
        threats.push('Automated browser detected');
        threatLevel = 'high';
      }

      // Check for multiple rapid requests
      const requestCount = parseInt(sessionStorage.getItem('requestCount') || '0');
      if (requestCount > 50) {
        threats.push('High request frequency detected');
        threatLevel = 'medium';
      }

      // Check for suspicious timing patterns
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
      const currentTime = Date.now();
      if (currentTime - lastActivity < 100 && requestCount > 0) {
        threats.push('Rapid interaction pattern detected');
        threatLevel = 'medium';
      }

      // Log security events if threats detected
      if (threats.length > 0) {
        await logSecurityEvent('security_threat_detected', {
          threats,
          threatLevel,
          userAgent,
          clientIP,
          timestamp: new Date().toISOString()
        });
      }

      setSecurityState({
        threatLevel,
        activeThreats: threats,
        lastSecurityCheck: new Date()
      });

      // Update tracking
      sessionStorage.setItem('requestCount', (requestCount + 1).toString());
      localStorage.setItem('lastActivity', currentTime.toString());
    };

    // Initial check
    monitorSecurity();

    // Set up periodic monitoring
    const interval = setInterval(monitorSecurity, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user, logSecurityEvent]);

  return securityState;
};
