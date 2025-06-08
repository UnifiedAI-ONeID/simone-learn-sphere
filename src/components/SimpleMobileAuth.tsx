import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LocalizedText } from '@/components/LocalizedText';
import { PlatformButton } from '@/components/platform/PlatformButton';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { handleAuthError, cleanupAuthState, validatePasswordStrength } from '@/utils/authUtils';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import toast from 'react-hot-toast';

export const SimpleMobileAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { platform } = usePlatformTheme();

  // Validate password in real-time for signup
  React.useEffect(() => {
    if (isSignUp && password) {
      const validation = validatePasswordStrength(password);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password, isSignUp]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      cleanupAuthState();

      if (isSignUp) {
        // Validate password for signup
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
          setError('Password does not meet requirements');
          setIsLoading(false);
          return;
        }

        localStorage.setItem('pendingUserRole', selectedRole);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/mobile/auth/callback`,
            data: {
              first_name: firstName,
              last_name: lastName,
              role: selectedRole
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          toast.success('Check your email for the confirmation link!');
          setError('Please check your email and click the confirmation link to complete registration.');
        } else if (data.session) {
          toast.success('Account created successfully!');
          const redirectRoute = getRoleBasedRoute(selectedRole, true);
          navigate(redirectRoute, { replace: true });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast.success('Welcome back!');
          // Navigation will be handled by auth context
        }
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      cleanupAuthState();
      localStorage.setItem('pendingUserRole', selectedRole);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/mobile/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error: any) {
      const errorMessage = handleAuthError(error, 'Google');
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      cleanupAuthState();
      localStorage.setItem('pendingUserRole', selectedRole);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/mobile/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error: any) {
      const errorMessage = handleAuthError(error, 'LinkedIn');
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handlePasskeySuccess = () => {
    toast.success('Authentication successful!');
    // Navigation will be handled by auth context
  };

  return (
    <PlatformCard 
      className="bg-card/90 backdrop-blur-sm border-border"
      title={isSignUp ? "Create Account" : "Sign In"}
      description={isSignUp ? "Join SimoneLabs today" : "Access your learning dashboard"}
    >
      {error && (
        <div className="flex items-center space-x-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {isSignUp && (
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`pl-10 bg-background border-input text-foreground ${
                  platform === 'ios' ? 'rounded-lg' : 
                  platform === 'android' ? 'rounded-xl' : 'rounded-lg'
                }`}
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`pl-10 bg-background border-input text-foreground ${
                  platform === 'ios' ? 'rounded-lg' : 
                  platform === 'android' ? 'rounded-xl' : 'rounded-lg'
                }`}
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 bg-background border-input text-foreground ${
                platform === 'ios' ? 'rounded-lg' : 
                platform === 'android' ? 'rounded-xl' : 'rounded-lg'
              }`}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 pr-10 bg-background border-input text-foreground ${
                platform === 'ios' ? 'rounded-lg' : 
                platform === 'android' ? 'rounded-xl' : 'rounded-lg'
              }`}
              required
            />
            <PlatformButton
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </PlatformButton>
          </div>
          {passwordErrors.length > 0 && (
            <div className="text-xs text-destructive space-y-1">
              {passwordErrors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          )}
        </div>

        {isSignUp && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              <LocalizedText text="I want to join as:" />
            </label>
            <div className="flex gap-2">
              <Badge 
                variant={selectedRole === 'student' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedRole('student')}
              >
                <LocalizedText text="Student" />
              </Badge>
              <Badge 
                variant={selectedRole === 'educator' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedRole('educator')}
              >
                <LocalizedText text="Educator" />
              </Badge>
            </div>
          </div>
        )}

        {email && (
          <PasskeyAuth
            email={email}
            onSuccess={handlePasskeySuccess}
            isSignUp={isSignUp}
          />
        )}

        <PlatformButton
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading || (isSignUp && passwordErrors.length > 0)}
        >
          <LocalizedText text={
            isLoading 
              ? "Please wait..." 
              : isSignUp 
                ? "Create Account" 
                : "Sign In"
          } />
        </PlatformButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              <LocalizedText text="Or continue with" />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PlatformButton
            type="button"
            variant="secondary"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="border-input hover:bg-accent hover:text-accent-foreground"
          >
            <LocalizedText text="Google" />
          </PlatformButton>
          <PlatformButton
            type="button"
            variant="secondary"
            onClick={handleLinkedInAuth}
            disabled={isLoading}
            className="border-input hover:bg-accent hover:text-accent-foreground"
          >
            <LocalizedText text="LinkedIn" />
          </PlatformButton>
        </div>

        <div className="text-center">
          <PlatformButton
            type="button"
            variant="ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setPasswordErrors([]);
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <LocalizedText text={isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"} />
          </PlatformButton>
        </div>
      </form>
    </PlatformCard>
  );
};
