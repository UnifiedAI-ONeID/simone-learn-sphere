import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack?: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerificationSuccess,
  onBack
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-email', {
        body: {
          email,
          code: verificationCode
        }
      });

      if (error) throw error;
      if (!data?.valid) throw new Error('Invalid verification code');

      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified!",
      });

      onVerificationSuccess();
    } catch (error: any) {
      console.error('Email verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
      setVerificationCode('');
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Failed to resend",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Mail className="h-5 w-5" />
          <UnifiedLocalizedText text="Verify Your Email" />
        </CardTitle>
        <CardDescription className="text-center">
          <UnifiedLocalizedText text="We've sent a verification code to your email address" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
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
          <p className="text-sm text-muted-foreground text-center">
            <UnifiedLocalizedText text="Enter the 6-digit code from your email" />
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleVerifyCode}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full"
          >
            {isLoading ? (
              <UnifiedLocalizedText text="Verifying..." />
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                <UnifiedLocalizedText text="Verify Email" />
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text={isResending ? "Sending..." : "Resend Code"} />
            </Button>
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isLoading || isResending}
                className="flex-1"
              >
                <UnifiedLocalizedText text="Back" />
              </Button>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <UnifiedLocalizedText text="Didn't receive the email? Check your spam folder or try resending." />
        </div>
      </CardContent>
    </Card>
  );
};
