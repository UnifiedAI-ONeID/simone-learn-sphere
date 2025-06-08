import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PasswordResetRequest } from '@/components/PasswordResetRequest';
import { EmailVerification } from '@/components/EmailVerification';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { TwoFactorLogin } from '@/components/TwoFactorLogin';

interface SimpleMobileAuthProps {
  onSuccess: (sessionToken?: string) => void;
}

export const SimpleMobileAuth: React.FC<SimpleMobileAuthProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetRequest, setShowResetRequest] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/mobile/auth-callback`,
        },
      });

      if (error) {
        console.error('OAuth sign-in error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('OAuth sign-in initiated:', data);
        // No need to navigate here; Supabase handles the redirect
      }
    } catch (error: any) {
      console.error('Unexpected OAuth error:', error);
      toast({
        title: "Unexpected error",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/mobile/auth-callback?next=/profile-setup`,
          },
        });

        if (error) {
          console.error('Sign-up error:', error);
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.log('Sign-up success:', data);
          toast({
            title: "Check your email",
            description: "We've sent a verification link to your email address.",
          });
          setShowEmailVerification(true);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Sign-in error:', error);
          if (error.message === "Invalid login credentials") {
            toast({
              title: "Sign in failed",
              description: "Invalid email or password.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign in failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          console.log('Sign-in success:', data);
          if (data?.session?.user?.app_metadata?.provider === 'email' && !data?.session?.user?.email_confirmed_at) {
            setShowEmailVerification(true);
          } else if (data?.session?.user?.app_metadata?.provider === 'email' && data?.session?.user?.user_metadata?.two_factor_enabled) {
            setShowTwoFactor(true);
          } else {
            onSuccess();
          }
        }
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected error",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetRequest) {
    return <PasswordResetRequest onBack={() => setShowResetRequest(false)} />;
  }

  if (showEmailVerification) {
    return (
      <EmailVerification
        email={email}
        onVerificationSuccess={onSuccess}
        onBack={() => setShowEmailVerification(false)}
      />
    );
  }

  if (showTwoFactor) {
    return (
      <TwoFactorLogin
        email={email}
        onVerificationSuccess={onSuccess}
        onBack={() => setShowTwoFactor(false)}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Brain className="h-5 w-5" />
          <UnifiedLocalizedText text={isSignUp ? "Create Account" : "Sign In"} />
        </CardTitle>
        <CardDescription className="text-center">
          <UnifiedLocalizedText text={isSignUp ? "Create a new account" : "Enter your credentials to access your account"} />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer"
            />
            <EyeButton onClick={() => setShowPassword(!showPassword)} showPassword={showPassword} />
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              <UnifiedLocalizedText text={isLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")} />
            </Button>
          </div>
        </form>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
          >
            <Mail className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Google" />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading}
          >
            <Lock className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Github" />
          </Button>
        </div>

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              <UnifiedLocalizedText text="Already have an account?" />
              <Button variant="link" onClick={() => setIsSignUp(false)}>
                <UnifiedLocalizedText text="Sign In" />
              </Button>
            </>
          ) : (
            <>
              <UnifiedLocalizedText text="Don't have an account?" />
              <Button variant="link" onClick={() => setIsSignUp(true)}>
                <UnifiedLocalizedText text="Sign Up" />
              </Button>
            </>
          )}
        </div>

        {!isSignUp && (
          <div className="text-center text-sm text-muted-foreground">
            <Button variant="link" onClick={() => setShowResetRequest(true)}>
              <UnifiedLocalizedText text="Forgot Password?" />
            </Button>
          </div>
        )}
        
        <PasskeyAuth email={email} onSuccess={onSuccess} isSignUp={isSignUp} />
      </CardContent>
    </Card>
  );
};

interface EyeButtonProps {
  onClick: () => void;
  showPassword: boolean;
}

const EyeButton: React.FC<EyeButtonProps> = ({ onClick, showPassword }) => (
  <Button
    type="button"
    onClick={onClick}
    variant="ghost"
    size="sm"
    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-auto p-0 text-muted-foreground hover:text-foreground"
  >
    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    <span className="sr-only"><UnifiedLocalizedText text={showPassword ? "Hide password" : "Show password"} /></span>
  </Button>
);
