import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, User, GraduationCap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { signUpSchema, signInSchema, SignUpFormData, SignInFormData } from '@/schemas/authSchemas';
import { authRateLimiter } from '@/utils/rateLimiter';
import { getAuthErrorMessage, sanitizeInput } from '@/utils/errorHandling';
import { cleanupAuthState } from '@/utils/authCleanup';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { getClientIP, sanitizeUserAgent } from '@/utils/securityUtils';
import { TranslatedText } from '@/components/TranslatedText';
import { getRoleBasedRoute } from '@/utils/roleRouting';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'educator' | 'admin'>('student');
  const [signInData, setSignInData] = useState<Partial<SignInFormData>>({});
  const [signUpData, setSignUpData] = useState<Partial<SignUpFormData>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logSecurityEvent } = useSecurityAudit();

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
        
        // Get user role and redirect appropriately
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        const userRole = profileData?.role || 'student';
        const redirectRoute = getRoleBasedRoute(userRole);
        
        toast({
          title: "Success",
          description: "Welcome back!",
        });
        
        navigate(redirectRoute);
      }
    } catch (error: any) {
      let errorMessage = getAuthErrorMessage(error);
      
      // Handle email confirmation specifically
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
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
      } catch (err) {
        console.warn('Pre-signup cleanup failed, continuing');
      }

      const redirectUrl = `${window.location.origin}/`;
      
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
        
        // If logged in immediately, redirect based on role
        const redirectRoute = getRoleBasedRoute(validated.role);
        
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        
        navigate(redirectRoute);
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: getAuthErrorMessage(error),
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
    },
    {
      id: 'admin' as const,
      title: <TranslatedText text="Admin" />,
      description: <TranslatedText text="Manage platform and user analytics" />,
      icon: Shield,
      color: 'bg-green-100 text-green-800 border-green-200'
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
                <div className="grid grid-cols-2 gap-4">
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
