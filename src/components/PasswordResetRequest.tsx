
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PasswordResetRequestProps {
  onBack: () => void;
}

export const PasswordResetRequest: React.FC<PasswordResetRequestProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-password-reset', {
        body: { email }
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Reset Link Sent",
        description: "If an account with this email exists, a password reset link has been sent.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <LocalizedText text="Reset Link Sent" />
          </CardTitle>
          <CardDescription className="text-center">
            <LocalizedText text="Check your email for password reset instructions" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <LocalizedText text="If you don't see the email, check your spam folder." />
          </div>
          <Button onClick={onBack} variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <LocalizedText text="Back to Sign In" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Mail className="h-5 w-5" />
          <LocalizedText text="Reset Password" />
        </CardTitle>
        <CardDescription className="text-center">
          <LocalizedText text="Enter your email to receive a password reset link" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              <LocalizedText text={isLoading ? "Sending..." : "Send Reset Link"} />
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <LocalizedText text="Back to Sign In" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
