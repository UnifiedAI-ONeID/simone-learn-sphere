import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mobile2FASettings } from './Mobile2FASettings';

interface TwoFactorSetupProps {
  userEmail: string;
  isEnabled: boolean;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ userEmail, isEnabled }) => {
  const [isEnabling, setIsEnabling] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleEnable2FA = async () => {
    setIsEnabling(true);
    try {
      // Simulate sending a verification code to the user's email
      // In a real application, you would use a service like Twilio Verify or Authy
      // to send the code via SMS or email

      toast({
        title: "Verification code sent",
        description: "A verification code has been sent to your email address.",
      });
    } catch (error: any) {
      toast({
        title: "Error enabling 2FA",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      // Simulate verifying the code
      // In a real application, you would compare the code entered by the user
      // to the code sent via SMS or email

      if (verificationCode === '123456') {
        // Simulate updating the user's profile to enable 2FA
        const { data, error } = await supabase
          .from('profiles')
          .update({ two_factor_enabled: true })
          .eq('id', user?.id);

        if (error) throw error;

        toast({
          title: "2FA enabled",
          description: "Two-factor authentication has been enabled on your account.",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "The code you entered is invalid. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error verifying code",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <UnifiedLocalizedText text="Two-Factor Authentication" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Add an extra layer of security to your account." />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <UnifiedLocalizedText text="Two-factor authentication is enabled on your account." />
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <UnifiedLocalizedText text="Two-factor authentication is not enabled on your account." />
              </AlertDescription>
            </Alert>
            <Button disabled={isEnabling} onClick={handleEnable2FA}>
              {isEnabling ? (
                <UnifiedLocalizedText text="Enabling..." />
              ) : (
                <UnifiedLocalizedText text="Enable Two-Factor Authentication" />
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
