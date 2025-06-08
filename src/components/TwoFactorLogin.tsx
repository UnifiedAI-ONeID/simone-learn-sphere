
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, Mail, ArrowLeft } from 'lucide-react';
import { useEmailTwoFactor } from '@/hooks/useEmailTwoFactor';

interface TwoFactorLoginProps {
  email: string;
  onVerificationSuccess: (sessionToken?: string) => void;
  onBack: () => void;
}

export const TwoFactorLogin = ({ email, onVerificationSuccess, onBack }: TwoFactorLoginProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { state, requestLoginCode, verifyLoginCode } = useEmailTwoFactor();

  const handleRequestCode = async () => {
    const result = await requestLoginCode(email);
    if (!result.success) {
      console.error('Failed to request login code:', result.error);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) return;
    
    const result = await verifyLoginCode(verificationCode);
    if (result.success) {
      onVerificationSuccess(result.sessionToken);
    }
  };

  // Auto-request code when component mounts
  useEffect(() => {
    if (!state.isVerifying) {
      handleRequestCode();
    }
  }, []); // Empty dependency array to run only on mount

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription className="text-center">
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
            <Mail className="h-4 w-4" />
            <span>{email}</span>
          </div>
        </div>

        <div className="space-y-2">
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
            Enter the 6-digit code from your email
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleVerifyCode}
            disabled={state.isLoading || verificationCode.length !== 6}
            className="w-full"
          >
            {state.isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRequestCode}
              disabled={state.isLoading}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Resend Code
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
              disabled={state.isLoading}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
