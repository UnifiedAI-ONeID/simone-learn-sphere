
import React, { useEffect } from 'react';
import { getEnhancedSecurityHeaders } from '@/utils/enhancedSecurityHeaders';

interface SecurityHeadersProviderProps {
  children: React.ReactNode;
}

export const SecurityHeadersProvider: React.FC<SecurityHeadersProviderProps> = ({ children }) => {
  useEffect(() => {
    // Apply security headers to the document
    const headers = getEnhancedSecurityHeaders();
    
    // Create meta tags for security headers that can be set via meta tags
    const metaHeaders = [
      { 'http-equiv': 'Content-Security-Policy', content: headers['Content-Security-Policy'] },
      { 'http-equiv': 'X-Content-Type-Options', content: headers['X-Content-Type-Options'] },
      { 'http-equiv': 'X-Frame-Options', content: headers['X-Frame-Options'] },
      { 'http-equiv': 'Referrer-Policy', content: headers['Referrer-Policy'] }
    ];

    const addedMetas: HTMLMetaElement[] = [];

    metaHeaders.forEach(header => {
      const existingMeta = document.querySelector(`meta[http-equiv="${header['http-equiv']}"]`);
      if (existingMeta) {
        existingMeta.setAttribute('content', header.content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', header['http-equiv']);
        meta.setAttribute('content', header.content);
        document.head.appendChild(meta);
        addedMetas.push(meta);
      }
    });

    // Set up Content Security Policy violation reporting
    document.addEventListener('securitypolicyviolation', (e) => {
      console.warn('CSP Violation:', {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy,
        disposition: e.disposition
      });
      
      // Log to security monitoring if available
      if (window.securityMonitoring) {
        window.securityMonitoring.logSecurityEvent('csp_violation', {
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          disposition: e.disposition
        }, 'medium');
      }
    });

    // Cleanup function
    return () => {
      addedMetas.forEach(meta => {
        if (meta.parentNode) {
          meta.parentNode.removeChild(meta);
        }
      });
    };
  }, []);

  return <>{children}</>;
};

// Extend window interface for security monitoring
declare global {
  interface Window {
    securityMonitoring?: {
      logSecurityEvent: (eventType: string, details: any, severity: string) => void;
    };
  }
}
