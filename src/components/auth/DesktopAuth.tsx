
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Brain } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { validatePasswordStrength } from '@/utils/authUtils';

export const DesktopAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const { isLoading, error, setError, signUpWithEmail, signInWithEmail, signInWithOAuth } = useEnhancedAuth();

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
      if (result.success) {
        // Navigation handled by auth context
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center mx-auto mb-4 bg-primary rounded-xl shadow-xl">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            <LocalizedText text="SimoneLabs" />
          </h1>
          <p className="text-muted-foreground mt-2">
            <LocalizedText text={isSignUp ? "Create your account" : "Welcome back"} />
          </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardHeader className="text-center">
            <CardTitle>
              <LocalizedText text={isSignUp ? "Create Account" : "Sign In"} />
            </CardTitle>
            <CardDescription>
              <LocalizedText text={isSignUp ? "Join SimoneLabs today" : "Access your learning dashboard"} />
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      className="pl-10"
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
                      className="pl-10"
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
                    className="pl-10"
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
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
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
                  </Button>
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
                  variant="radio"
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (isSignUp && passwordErrors.length > 0) || (isSignUp && !selectedRole)}
              >
                <LocalizedText text={
                  isLoading 
                    ? "Please wait..." 
                    : isSignUp 
                      ? "Create Account" 
                      : "Sign In"
                } />
              </Button>

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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <LocalizedText text="Google" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLinkedInAuth}
                  disabled={isLoading}
                >
                  <LocalizedText text="LinkedIn" />
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setPasswordErrors([]);
                  }}
                  className="text-sm"
                >
                  <LocalizedText text={isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"} />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
