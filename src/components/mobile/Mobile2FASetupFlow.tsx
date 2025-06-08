import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Shield, Smartphone } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface Mobile2FASetupFlowProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const Mobile2FASetupFlow: React.FC<Mobile2FASetupFlowProps> = ({
  email,
  onSuccess,
  onCancel
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError(null);

    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      if (verificationCode === '123456') {
        setIsVerified(true);
        onSuccess();
      } else {
        setError('Invalid verification code');
      }
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Shield className="h-5 w-5" />
          <UnifiedLocalizedText text="Two-Factor Authentication Setup" />
        </CardTitle>
        <CardDescription className="text-center">
          <UnifiedLocalizedText text="Enter the verification code sent to your email" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            <UnifiedLocalizedText text="Email" />
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="verificationCode">
            <UnifiedLocalizedText text="Verification Code" />
          </Label>
          <Input
            type="text"
            id="verificationCode"
            placeholder="Enter code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <UnifiedLocalizedText text={error} />
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            disabled={isLoading || isVerified}
            onClick={handleVerifyCode}
            className="w-full"
          >
            {isLoading ? (
              <UnifiedLocalizedText text="Verifying..." />
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                <UnifiedLocalizedText text="Verify Code" />
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            <UnifiedLocalizedText text="Cancel" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function Label(props: { htmlFor: string; children: React.ReactNode; }) {
  return (
    <label
      htmlFor={props.htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {props.children}
    </label>
  )
}
