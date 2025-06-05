
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, Mail, Check, X } from 'lucide-react';
import { useEmailTwoFactor } from '@/hooks/useEmailTwoFactor';
import { TranslatedText } from '@/components/TranslatedText';

interface TwoFactorSetupProps {
  userEmail: string;
  isEnabled?: boolean;
  onSetupComplete?: () => void;
}

export const TwoFactorSetup = ({ userEmail, isEnabled = false, onSetupComplete }: TwoFactorSetupProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { state, enableTwoFactor, verifyAndEnable, disableTwoFactor } = useEmailTwoFactor();

  const handleEnable2FA = async () => {
    const result = await enableTwoFactor(userEmail);
    if (!result.success) {
      console.error('Failed to enable 2FA:', result.error);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) return;
    
    const result = await verifyAndEnable(verificationCode);
    if (result.success) {
      setVerificationCode('');
      onSetupComplete?.();
    }
  };

  const handleDisable2FA = async () => {
    const result = await disableTwoFactor();
    if (result.success) {
      onSetupComplete?.();
    }
  };

  if (isEnabled) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Check className="h-5 w-5" />
            <TranslatedText text="Two-Factor Authentication Enabled" />
          </CardTitle>
          <CardDescription className="text-green-600">
            <TranslatedText text="Your account is protected with email-based two-factor authentication." />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <Mail className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleDisable2FA}
            disabled={state.isLoading}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            <TranslatedText text="Disable 2FA" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <TranslatedText text="Enable Two-Factor Authentication" />
        </CardTitle>
        <CardDescription>
          <TranslatedText text="Add an extra layer of security to your account with email verification codes." />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!state.isVerifying ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">
                <TranslatedText text="Email Address" />
              </Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-600">
                <TranslatedText text="Verification codes will be sent to this email address." />
              </p>
            </div>
            <Button 
              onClick={handleEnable2FA}
              disabled={state.isLoading}
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              <TranslatedText text={state.isLoading ? 'Sending Code...' : 'Send Verification Code'} />
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="verification-code">
                <TranslatedText text="Enter Verification Code" />
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  value={verificationCode}
                  onChange={setVerificationCode}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-sm text-gray-600 text-center">
                <TranslatedText text="Check your email for the 6-digit verification code." />
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={state.isLoading || verificationCode.length !== 6}
                className="flex-1"
              >
                <TranslatedText text={state.isLoading ? 'Verifying...' : 'Verify & Enable'} />
              </Button>
              <Button
                variant="outline"
                onClick={() => setVerificationCode('')}
                disabled={state.isLoading}
              >
                <TranslatedText text="Cancel" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
