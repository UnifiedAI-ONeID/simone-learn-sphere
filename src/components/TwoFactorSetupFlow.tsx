
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface TwoFactorSetupFlowProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const TwoFactorSetupFlow: React.FC<TwoFactorSetupFlowProps> = ({
  email,
  onSuccess,
  onBack
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError(null);

    // Simulate verification process (replace with actual API call)
    setTimeout(() => {
      if (verificationCode === '123456') {
        setIsVerified(true);
        onSuccess();
      } else {
        setError('Invalid verification code. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    // Simulate resending the code (replace with actual API call)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Verification code resent to your email.');
    }, 1000);
  };

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Two-Factor Authentication Enabled
          </CardTitle>
          <CardDescription className="text-center">
            Your account is now protected with two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            You will need to enter a verification code from your email when you sign in.
          </p>
          <Button onClick={onBack} className="w-full">
            Back to Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Shield className="h-5 w-5" />
          Set Up Two-Factor Authentication
        </CardTitle>
        <CardDescription className="text-center">
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleVerifyCode}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>

          <Button
            variant="outline"
            onClick={handleResendCode}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Resend Code'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder.
        </div>
      </CardContent>
    </Card>
  );
};
