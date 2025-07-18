
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Clock, Eye, Lock } from 'lucide-react';
import { useEnhancedSessionSecurity } from '@/hooks/useEnhancedSessionSecurity';

export const EnhancedSecurityAlert = () => {
  const { securityState } = useEnhancedSessionSecurity();

  if (securityState.securityThreats.length === 0 && !securityState.sessionWarning) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      {securityState.sessionWarning && (
        <Alert className="mb-2 border-orange-200 bg-orange-50 dark:bg-orange-950/10">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium text-orange-800 dark:text-orange-200">
                Session About to Expire
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Your session will expire in {Math.ceil(securityState.timeUntilExpiry / (60 * 1000))} minutes
              </p>
            </div>
            <Button size="sm" onClick={() => {}} className="ml-2">
              Extend
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {securityState.securityThreats.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800 dark:text-red-200">
                Security Threats Detected
              </span>
            </div>
            <ul className="mt-2 space-y-1">
              {securityState.securityThreats.map((threat, index) => (
                <li key={index} className="text-sm text-red-700 dark:text-red-300">
                  • {threat}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
