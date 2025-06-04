
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';
import { Clock, Shield } from 'lucide-react';

export const SessionTimeoutWarning = () => {
  const { showTimeoutWarning, extendSession, timeUntilTimeout } = useSessionSecurity();

  if (!showTimeoutWarning) return null;

  const minutesLeft = Math.ceil(timeUntilTimeout / (60 * 1000));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <CardTitle className="text-xl">Session Expiring Soon</CardTitle>
          <CardDescription>
            Your session will expire in {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''} due to inactivity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Shield className="h-4 w-4" />
            This is a security measure to protect your account.
          </div>
          <div className="flex gap-3">
            <Button onClick={extendSession} className="flex-1">
              Stay Logged In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
