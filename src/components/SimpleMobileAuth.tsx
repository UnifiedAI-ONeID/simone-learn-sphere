import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LocalizedText } from '@/components/LocalizedText';
import { PlatformButton } from '@/components/platform/PlatformButton';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { Mobile2FASetupFlow } from '@/components/mobile/Mobile2FASetupFlow';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { validatePasswordStrength, isRateLimitError } from '@/utils/authUtils';
import { EmailVerification } from '@/components/EmailVerification';
import { PasswordResetRequest } from '@/components/PasswordResetRequest';

export const SimpleMobileAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showRateLimitHelp, setShowRateLimitHelp] = useState(false);
  
  const navigate = useNavigate();
  const { platform } = usePlatformTheme();
  const { 
    isLoading, 
    error, 
    setError, 
    showEmailVerification,
    show2FASetup,
    pendingVerificationEmail,
    signUpWithEmail, 
    signInWithEmail, 
    signInWithOAuth,
    handleEmailVerificationSuccess,
    handle2FASetupComplete
  } = useEnhancedAuth();

  // Validate password in real-time for signup
  React.useEffect(() => {
    if (isSignUp && password) {
      const validation = validatePasswordStrength(password);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password, isSignUp]);

  // Show rate limit help if error is rate limiting
  React.useEffect(() => {
    setShowRateLimitHelp(isRateLimitError({ message: error }));
  }, [error]);

  if (showEmailVerification && pendingVerificationEmail) {
    return (
      <div className="w-full max-w-sm">
        <EmailVerification
          email={pendingVerificationEmail}
          onVerificationSuccess={handleEmailVerificationSuccess}
          onBack={() => setError('')}
        />
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <div className="w-full max-w-sm">
        <PasswordResetRequest
          onBack={() => setShowPasswordReset(false)}
        />
      </div>
    );
  }

  if (show2FASetup) {
    return (
      <div className="w-full max-w-sm">
        <Mobile2FASetupFlow
          onComplete={handle2FASetupComplete}
          isOnboarding={true}
        />
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (!selectedRole) {
        setError('Please select a role before continuing');
        return;
      }

      const result = await signUpWithEmail(email, password, firstName, lastName, selectedRole);
      if (result.success && !result.requiresEmailConfirmation) {
        // Navigation handled in hook
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.success && !result.requires2FA) {
        // Navigation handled by auth context
      } else if (result.requires2FA) {
        // Handle 2FA flow
        console.log('2FA required');
      }
    }
  };

  const handleGoogleAuth = async () => {
    if (isSignUp && !selectedRole) {
      setError('Please select a role before continuing with Google');
      return;
    }

    await signInWithOAuth('google', isSignUp ? selectedRole : undefined);
  };

  const handleLinkedInAuth = async () => {
    if (isSignUp && !selectedRole) {
      setError('Please select a role before continuing with LinkedIn');
      return;
    }

    await signInWithOAuth('linkedin_oidc', isSignUp ? selectedRole : undefined);
  };

  const handlePasskeySuccess = () => {
    // Navigation handled by auth context
  };

  return (
    <PlatformCard 
      className="bg-card/90 backdrop-blur-sm border-border"
      title={isSignUp ? "Create Account" : "Sign In"}
      description={isSignUp ? "Join SimoneLabs today" : "Access your learning dashboard"}
    >
      <div className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-destructive">{error}</p>
                {showRateLimitHelp && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      <LocalizedText text="Try these alternatives:" />
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <PlatformButton
                        variant="outline"
                        size="sm"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        <LocalizedText text="Google Login" />
                      </PlatformButton>
                      <PlatformButton
                        variant="outline"
                        size="sm"
                        onClick={handleLinkedInAuth}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        <LocalizedText text="LinkedIn Login" />
                      </PlatformButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Role Selection for Sign Up */}
        {isSignUp && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              <LocalizedText text="I am a..." />
            </label>
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Name Fields for Sign Up */}
        {isSignUp && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                <LocalizedText text="First Name" />
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10"
                  placeholder="John"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                <LocalizedText text="Last Name" />
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10"
                  placeholder="Doe"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            <LocalizedText text="Email" />
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder="your@email.com"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            <LocalizedText text="Password" />
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Validation for Sign Up */}
          {isSignUp && passwordErrors.length > 0 && (
            <div className="space-y-1">
              {passwordErrors.map((error, index) => (
                <p key={index} className="text-xs text-destructive">• {error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <PlatformButton
            type="submit"
            disabled={isLoading || (isSignUp && passwordErrors.length > 0)}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>
                  <LocalizedText text={isSignUp ? "Creating Account..." : "Signing In..."} />
                </span>
              </div>
            ) : (
              <LocalizedText text={isSignUp ? "Create Account" : "Sign In"} />
            )}
          </PlatformButton>
        </form>

        {/* Forgot Password Link */}
        {!isSignUp && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              <LocalizedText text="Forgot your password?" />
            </button>
          </div>
        )}

        {/* Social Login Options */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                <LocalizedText text="Or continue with" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PlatformButton
              variant="outline"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span><LocalizedText text="Google" /></span>
            </PlatformButton>

            <PlatformButton
              variant="outline"
              onClick={handleLinkedInAuth}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span><LocalizedText text="LinkedIn" /></span>
            </PlatformButton>
          </div>
        </div>

        {/* Passkey Authentication */}
        {!isSignUp && email && (
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  <LocalizedText text="Secure login" />
                </span>
              </div>
            </div>
            
            <PasskeyAuth
              email={email}
              onSuccess={handlePasskeySuccess}
              isSignUp={false}
            />
          </div>
        )}

        {/* Switch between Sign In/Sign Up */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {isSignUp ? (
              <LocalizedText text="Already have an account?" />
            ) : (
              <LocalizedText text="Don't have an account?" />
            )}
          </span>
          {' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setPasswordErrors([]);
            }}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            {isSignUp ? (
              <LocalizedText text="Sign in" />
            ) : (
              <LocalizedText text="Sign up" />
            )}
          </button>
        </div>
      </div>
    </PlatformCard>
  );
};
