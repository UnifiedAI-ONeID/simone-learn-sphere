import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { Mail, Lock, Eye, EyeOff, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PasswordResetRequest } from '@/components/PasswordResetRequest';
import { EmailVerification } from '@/components/EmailVerification';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { TwoFactorLogin } from '@/components/TwoFactorLogin';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useEnhancedSessionSecurity } from '@/hooks/useEnhancedSessionSecurity';

interface DesktopAuthProps {
  onClose: () => void;
}

export const DesktopAuth: React.FC<DesktopAuthProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetRequest, setShowResetRequest] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showTwoFactorLogin, setShowTwoFactorLogin] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const pendingRole = searchParams.get('role') as 'student' | 'educator' | 'admin' | null;
  const { role } = useUserRole();
  const navigate = useNavigate();
  const { trackEvent } = useEngagementTracking();
  const { refreshSecurityState } = useEnhancedSessionSecurity();

  const isSignUp = searchParams.get('mode') === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, pendingRole);
        if (error) throw error;

        trackEvent('auth_signup', { method: 'email', role: pendingRole || 'student' });
        setShowEmailVerification(true);
        toast({
          title: "Sign up successful",
          description: "Please verify your email to continue.",
        });
      } else {
        const { error, session } = await signIn(email, password);
        if (error) {
          if (error.message === 'Email not confirmed') {
            setShowEmailVerification(true);
            toast({
              title: "Email not verified",
              description: "Please verify your email to continue.",
            });
          } else if (error.message === '2FA is enabled for this user') {
            setShowTwoFactorLogin(true);
            toast({
              title: "Two-Factor Authentication Required",
              description: "Please enter the verification code sent to your email.",
            });
          } else {
            throw error;
          }
          return;
        }

        trackEvent('auth_signin', { method: 'email', role: role || 'unknown' });
        toast({
          title: "Sign in successful",
          description: "You have been successfully signed in.",
        });
        refreshSecurityState();
        onClose();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASuccess = (sessionToken?: string) => {
    setShowTwoFactorLogin(false);
    toast({
      title: "Sign in successful",
      description: "You have been successfully signed in.",
    });
    refreshSecurityState();
    onClose();
  };

  if (showEmailVerification && email) {
    return (
      <EmailVerification
        email={email}
        onVerificationSuccess={onClose}
        onBack={() => setShowEmailVerification(false)}
      />
    );
  }

  if (showTwoFactorLogin && email) {
    return (
      <TwoFactorLogin
        email={email}
        onVerificationSuccess={handle2FASuccess}
        onBack={() => setShowTwoFactorLogin(false)}
      />
    );
  }

  if (showResetRequest) {
    return <PasswordResetRequest onBack={() => setShowResetRequest(false)} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Brain className="h-5 w-5" />
          <UnifiedLocalizedText text={isSignUp ? "Create an Account" : "Sign In"} />
        </CardTitle>
        <CardDescription className="text-center">
          <UnifiedLocalizedText text={isSignUp ? "Join our platform and start learning" : "Enter your credentials to access your account"} />
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
            <div className="relative">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-0"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              <UnifiedLocalizedText text={isLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")} />
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowResetRequest(true)}
            >
              <UnifiedLocalizedText text="Forgot Password?" />
            </Button>
          </div>
        </form>

        <Separator className="my-4" />

        <div className="text-center text-sm text-muted-foreground">
          <UnifiedLocalizedText text={isSignUp ? "Already have an account?" : "Don't have an account?"} />
          <Button variant="link" onClick={() => {
            const newMode = isSignUp ? 'signin' : 'signup';
            navigate(`/?mode=${newMode}`);
          }}>
            <UnifiedLocalizedText text={isSignUp ? "Sign In" : "Sign Up"} />
          </Button>
        </div>

        <Separator className="my-4" />

        <PasskeyAuth
          email={email}
          onSuccess={onClose}
          isSignUp={isSignUp}
        />
      </CardContent>
    </Card>
  );
};
