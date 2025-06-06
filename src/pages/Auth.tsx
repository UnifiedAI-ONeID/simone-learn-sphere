import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, User, GraduationCap, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { signUpSchema, signInSchema, SignUpFormData, SignInFormData } from '@/schemas/authSchemas';
import { authRateLimiter } from '@/utils/rateLimiter';
import { getAuthErrorMessage, sanitizeInput } from '@/utils/errorHandling';
import { cleanupAuthState, ensureProfileExists } from '@/utils/authCleanup';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { getClientIP, sanitizeUserAgent } from '@/utils/securityUtils';
import { TranslatedText } from '@/components/TranslatedText';
import { getRoleBasedRoute } from '@/utils/roleRouting';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'educator'>('student');
  const [signInData, setSignInData] = useState<Partial<SignInFormData>>({});
  const [signUpData, setSignUpData] = useState<Partial<SignUpFormData>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logSecurityEvent } = useSecurityAudit();

  // Clear any existing auth state on component mount
  useEffect(() => {
    cleanupAuthState();
  }, []);

  const validateAndSanitizeSignIn = (data: Partial<SignInFormData>): SignInFormData | null => {
    try {
      const sanitized = {
        email: sanitizeInput(data.email || ''),
        password: data.password || ''
      };
      
      const validated = signInSchema.parse(sanitized);
      setValidationErrors({});
      return validated;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return null;
    }
  };

  const validateAndSanitizeSignUp = (data: Partial<SignUpFormData>): SignUpFormData | null => {
    try {
      const sanitized = {
        email: sanitizeInput(data.email || ''),
        password: data.password || '',
        firstName: sanitizeInput(data.firstName || ''),
        lastName: sanitizeInput(data.lastName || ''),
        role: userRole
      };
      
      const validated = signUpSchema.parse(sanitized);
      setValidationErrors({});
      return validated;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return null;
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'linkedin_oidc') => {
    setIsLoading(true);
    try {
      cleanupAuthState();
      
      // Clean sign out before OAuth
      try {
        await supabase.auth.signOut({ scope: 'global' });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.warn('Pre-OAuth cleanup failed, continuing');
      }

      // Use current origin for redirect
      const redirectUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (error) {
        // Handle specific OAuth errors
        if (error.message?.includes('Provider not enabled')) {
          toast({
            title: `${provider === 'google' ? 'Google' : 'LinkedIn'} authentication not configured`,
            description: 'Please contact support to enable social login.',
            variant: "destructive",
          });
          return;
        }
        
        const clientIP = await getClientIP();
        await logSecurityEvent('failed_oauth_login', {
          provider,
          error_message: error.message,
          attempt_time: new Date().toISOString()
        }, clientIP, sanitizeUserAgent(navigator.userAgent));
        
        throw error;
      }

      // OAuth redirects automatically, no need to handle success here
      
    } catch (error: any) {
      let errorMessage = getAuthErrorMessage(error);
      
      if (error.message?.includes('popup_closed_by_user')) {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      }
      
      if (error.message?.includes('access_denied')) {
        errorMessage = 'Access denied. Please check your permissions and try again.';
      }
      
      if (error.message?.includes('Provider not enabled')) {
        errorMessage = `${provider === 'google' ? 'Google' : 'LinkedIn'} authentication is not configured. Please use email/password or contact support.`;
      }
      
      toast({
        title: `${provider === 'google' ? 'Google' : 'LinkedIn'} sign in failed`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    const validated = validateAndSanitizeSignIn(signInData);
    if (!validated) return;

    const identifier = validated.email;
    
    if (authRateLimiter.isBlocked(identifier)) {
      const timeRemaining = Math.ceil(authRateLimiter.getBlockTimeRemaining(identifier) / 1000 / 60);
      toast({
        title: "Too many attempts",
        description: `Please wait ${timeRemaining} minutes before trying again.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.warn('Pre-signin cleanup failed, continuing');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        authRateLimiter.recordAttempt(identifier, true);
        
        const clientIP = await getClientIP();
        await logSecurityEvent('failed_login', {
          email: validated.email,
          error_message: error.message,
          attempt_time: new Date().toISOString()
        }, clientIP, sanitizeUserAgent(navigator.userAgent));
        
        throw error;
      }

      if (data.user) {
        authRateLimiter.recordAttempt(identifier, false);
        
        const clientIP = await getClientIP();
        await logSecurityEvent('successful_login', {
          user_id: data.user.id,
          email: validated.email,
          login_time: new Date().toISOString()
        }, clientIP, sanitizeUserAgent(navigator.userAgent));
        
        const profile = await ensureProfileExists(supabase, data.user);
        const userRole = profile?.role || 'student';
        const redirectRoute = getRoleBasedRoute(userRole);
        
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        
        navigate(redirectRoute, { replace: true });
      }
    } catch (error: any) {
      let errorMessage = getAuthErrorMessage(error);
      
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
        toast({
          title: "Email confirmation required",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    const validated = validateAndSanitizeSignUp(signUpData);
    if (!validated) return;

    const identifier = validated.email;
    
    if (authRateLimiter.isBlocked(identifier)) {
      const timeRemaining = Math.ceil(authRateLimiter.getBlockTimeRemaining(identifier) / 1000 / 60);
      toast({
        title: "Too many attempts",
        description: `Please wait ${timeRemaining} minutes before trying again.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.warn('Pre-signup cleanup failed, continuing');
      }

      const redirectUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: validated.firstName,
            last_name: validated.lastName,
            role: validated.role,
          },
        },
      });

      if (error) {
        authRateLimiter.recordAttempt(identifier, true);
        
        // Handle specific signup errors
        if (error.message?.includes('email rate limit exceeded')) {
          toast({
            title: "Email rate limit exceeded",
            description: "Too many email attempts. Please try again in a few minutes or contact support.",
            variant: "destructive",
          });
          return;
        }
        
        const clientIP = await getClientIP();
        await logSecurityEvent('failed_signup', {
          email: validated.email,
          error_message: error.message,
          attempt_time: new Date().toISOString()
        }, clientIP, sanitizeUserAgent(navigator.userAgent));
        
        throw error;
      }

      if (data.user) {
        authRateLimiter.recordAttempt(identifier, false);
        
        const clientIP = await getClientIP();
        await logSecurityEvent('successful_signup', {
          user_id: data.user.id,
          email: validated.email,
          role: validated.role,
          signup_time: new Date().toISOString()
        }, clientIP, sanitizeUserAgent(navigator.userAgent));
        
        // Check if email confirmation is required
        if (!data.session) {
          toast({
            title: "Account created!",
            description: "Please check your email for a confirmation link before signing in.",
          });
          return;
        }
        
        // If logged in immediately, ensure profile exists and redirect
        const profile = await ensureProfileExists(supabase, data.user);
        const userRole = profile?.role || validated.role;
        const redirectRoute = getRoleBasedRoute(userRole);
        
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        
        navigate(redirectRoute, { replace: true });
      }
    } catch (error: any) {
      let errorMessage = getAuthErrorMessage(error);
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      }
      
      if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.';
      }
      
      if (error.message?.includes('email rate limit exceeded')) {
        errorMessage = 'Too many email attempts. Please try again in a few minutes.';
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'student' as const,
      title: <TranslatedText text="Student" />,
      description: <TranslatedText text="Learn with personalized AI-powered experiences" />,
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'educator' as const,
      title: <TranslatedText text="Educator" />,
      description: <TranslatedText text="Create and monetize educational content" />,
      icon: User,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
              <Brain className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <TranslatedText text="Welcome to SimoneLabs" />
          </h1>
          <p className="text-gray-600">
            <TranslatedText text="Choose your role and start your educational journey" />
          </p>
        </div>

        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">
              <TranslatedText text="Select Your Role" />
            </CardTitle>
            <CardDescription className="text-center">
              <TranslatedText text="This will customize your experience" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setUserRole(role.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  userRole === role.id 
                    ? role.color 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <role.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">{role.title}</div>
                    <div className="text-sm text-gray-600">{role.description}</div>
                  </div>
                  {userRole === role.id && (
                    <Badge variant="secondary" className="bg-white text-current">
                      <TranslatedText text="Selected" />
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Auth Forms */}
        <Card>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <TranslatedText text="Sign In" />
              </TabsTrigger>
              <TabsTrigger value="signup">
                <TranslatedText text="Sign Up" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>
                  <TranslatedText text="Sign In" />
                </CardTitle>
                <CardDescription>
                  <TranslatedText text="Welcome back! Enter your credentials to continue." />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* OAuth Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <TranslatedText text="Continue with Google" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOAuthSignIn('linkedin_oidc')}
                    disabled={isLoading}
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    <TranslatedText text="Continue with LinkedIn" />
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        <TranslatedText text="Or continue with email" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email/Password Form Fields */}
                <div className="space-y-2">
                  <Label htmlFor="login-email">
                    <TranslatedText text="Email" />
                  </Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={signInData.email || ''}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-600">
                      <TranslatedText text={validationErrors.email} />
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">
                    <TranslatedText text="Password" />
                  </Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    placeholder="Enter your password"
                    value={signInData.password || ''}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading}
                    className={validationErrors.password ? 'border-red-500' : ''}
                  />
                  {validationErrors.password && (
                    <p className="text-sm text-red-600">
                      <TranslatedText text={validationErrors.password} />
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <TranslatedText text={isLoading ? 'Signing In...' : 'Sign In'} />
                </Button>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>
                  <TranslatedText text="Create Account" />
                </CardTitle>
                <CardDescription>
                  <TranslatedText text="Join SimoneLabs and start your learning journey." />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* OAuth Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <TranslatedText text="Sign up with Google" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOAuthSignIn('linkedin_oidc')}
                    disabled={isLoading}
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    <TranslatedText text="Sign up with LinkedIn" />
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        <TranslatedText text="Or sign up with email" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Name, Email, Password Form Fields */}
                <div className="space-y-2">
                  <Label htmlFor="firstname">
                    <TranslatedText text="First Name" />
                  </Label>
                  <Input 
                    id="firstname" 
                    placeholder="First name"
                    value={signUpData.firstName || ''}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={isLoading}
                    className={validationErrors.firstName ? 'border-red-500' : ''}
                  />
                  {validationErrors.firstName && (
                    <p className="text-xs text-red-600">
                      <TranslatedText text={validationErrors.firstName} />
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">
                    <TranslatedText text="Last Name" />
                  </Label>
                  <Input 
                    id="lastname" 
                    placeholder="Last name"
                    value={signUpData.lastName || ''}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={isLoading}
                    className={validationErrors.lastName ? 'border-red-500' : ''}
                  />
                  {validationErrors.lastName && (
                    <p className="text-xs text-red-600">
                      <TranslatedText text={validationErrors.lastName} />
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">
                    <TranslatedText text="Email" />
                  </Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={signUpData.email || ''}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-600">
                      <TranslatedText text={validationErrors.email} />
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    <TranslatedText text="Password" />
                  </Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="Create a password"
                    value={signUpData.password || ''}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading}
                    className={validationErrors.password ? 'border-red-500' : ''}
                  />
                  {validationErrors.password && (
                    <p className="text-sm text-red-600">
                      <TranslatedText text={validationErrors.password} />
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    <TranslatedText text="Must be 8+ characters with uppercase, lowercase, and number" />
                  </p>
                </div>
                <Button 
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <TranslatedText text={isLoading ? 'Creating Account...' : 'Create Account'} />
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Instructions Card */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-amber-800">
              <p className="font-medium">🔧 Setup Required</p>
              <p>OAuth providers need configuration in Supabase Dashboard → Authentication → Providers</p>
              <p className="mt-2 text-xs">For email signup: Configure SMTP or disable email confirmation in settings</p>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Note */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-blue-800">
              <p className="font-medium">♿ <TranslatedText text="Fully Accessible Platform" /></p>
              <p><TranslatedText text="Screen reader compatible • Keyboard navigation • High contrast support" /></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
