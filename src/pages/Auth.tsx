
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { handleAuthError, cleanupAuthState } from '@/utils/authUtils';
import { Brain, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import { LocalizedText } from '@/components/LocalizedText';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [searchParams] = useSearchParams();

  // Check for auth errors from URL params
  useEffect(() => {
    const errorFromUrl = searchParams.get('error');
    if (errorFromUrl) {
      setError('Authentication failed. Please try again.');
      toast.error('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      const redirectRoute = getRoleBasedRoute(role, true);
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Basic validation
      if (!email || !password || !firstName || !lastName) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      // Clean up any existing auth state
      cleanupAuthState();

      // Store role selection for later use
      localStorage.setItem('pendingUserRole', selectedRole);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    } catch (error: any) {
      console.error('Sign up error:', error);
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Basic validation
      if (!email || !password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      // Clean up any existing auth state
      cleanupAuthState();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Welcome back!');
        // Navigation will be handled by the auth context
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
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
      
      // Store role selection for OAuth flow
      localStorage.setItem('pendingUserRole', selectedRole);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
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
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('LinkedIn auth error:', error);
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

  // Show loading state while checking auth
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            <LocalizedText text="Loading..." />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle - Positioned absolutely */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-card border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="flex h-12 w-12 items-center justify-center mx-auto mb-4 rounded-lg bg-gradient-to-r from-primary to-primary/80">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            <LocalizedText text="Welcome to SimoneLabs" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <LocalizedText text="Your AI-powered learning platform" />
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="signin" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <LocalizedText text="Sign In" />
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                <LocalizedText text="Sign Up" />
              </TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background border-input text-foreground"
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
                      className="pl-10 pr-10 bg-background border-input text-foreground"
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
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <LocalizedText text="Signing in..." />
                  ) : (
                    <LocalizedText text="Sign In" />
                  )}
                </Button>

                {email && (
                  <PasskeyAuth
                    email={email}
                    onSuccess={handlePasskeySuccess}
                    isSignUp={false}
                  />
                )}

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
                    className="border-input hover:bg-accent hover:text-accent-foreground"
                  >
                    <LocalizedText text="Google" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLinkedInAuth}
                    disabled={isLoading}
                    className="border-input hover:bg-accent hover:text-accent-foreground"
                  >
                    <LocalizedText text="LinkedIn" />
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 bg-background border-input text-foreground"
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
                      className="pl-10 bg-background border-input text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background border-input text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background border-input text-foreground"
                      required
                      minLength={8}
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
                </div>

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

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <LocalizedText text="Creating account..." />
                  ) : (
                    <LocalizedText text="Create Account" />
                  )}
                </Button>

                {email && (
                  <PasskeyAuth
                    email={email}
                    onSuccess={handlePasskeySuccess}
                    isSignUp={true}
                  />
                )}

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
                    className="border-input hover:bg-accent hover:text-accent-foreground"
                  >
                    <LocalizedText text="Google" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLinkedInAuth}
                    disabled={isLoading}
                    className="border-input hover:bg-accent hover:text-accent-foreground"
                  >
                    <LocalizedText text="LinkedIn" />
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
