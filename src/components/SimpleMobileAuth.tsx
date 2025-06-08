import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LocalizedText } from '@/components/LocalizedText';
import { PlatformButton } from '@/components/platform/PlatformButton';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { validatePasswordStrength } from '@/utils/authUtils';
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
  
  const navigate = useNavigate();
  const { platform } = usePlatformTheme();
  const { 
    isLoading, 
    error, 
    setError, 
    showEmailVerification,
    pendingVerificationEmail,
    signUpWithEmail, 
    signInWithEmail, 
    signInWithOAuth,
    handleEmailVerificationSuccess
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
          <RoleSelector
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            variant="badge"
            required
          />
        )}

        {email && (
          <PasskeyAuth
            email={email}
            onSuccess={handlePasskeySuccess}
            isSignUp={isSignUp}
          />
        )}

        <div className="text-center space-y-2">
          {!isSignUp && (
            <PlatformButton
              type="button"
              variant="ghost"
              onClick={() => setShowPasswordReset(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <LocalizedText text="Forgot your password?" />
            </PlatformButton>
          )}
          
          <PlatformButton
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || (isSignUp && passwordErrors.length > 0) || (isSignUp && !selectedRole)}
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
        </div>
      </form>
    </PlatformCard>
  );
};
