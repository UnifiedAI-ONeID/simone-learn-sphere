import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useEnhancedAuthentication } from '@/hooks/useEnhancedAuthentication';
import { RoleSelector } from './RoleSelector';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Chrome,
  Linkedin,
  RefreshCw
} from 'lucide-react';

export const EnhancedAuthForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const {
    isLoading,
    error,
    authState,
    signUpWithEmail,
    signInWithEmail,
    signInWithOAuth,
    resetPassword,
    clearError,
    retryAuthentication
  } = useEnhancedAuthentication();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      if (!selectedRole) {
        return;
      }
      await signUpWithEmail(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        selectedRole
      );
    } else {
      await signInWithEmail(formData.email, formData.password);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'linkedin_oidc') => {
    const role = activeTab === 'signup' ? selectedRole : undefined;
    await signInWithOAuth(provider, role);
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      return;
    }
    await resetPassword(formData.email);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Authenticating..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            <UnifiedLocalizedText text="Welcome to SimoneLabs" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Sign in to your account or create a new one" />
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={retryAuthentication}
                  className="ml-2"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {authState.suggestOAuth && (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <UnifiedLocalizedText text="Try signing in with Google or LinkedIn for faster access" />
              </AlertDescription>
            </Alert>
          )}

          {authState.showEmailVerification && (
            <Alert className="mb-4">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <UnifiedLocalizedText text={`Verification email sent to ${authState.pendingVerificationEmail}. Please check your inbox.`} />
              </AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              className="w-full"
            >
              <Chrome className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text="Google" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('linkedin_oidc')}
              disabled={isLoading}
              className="w-full"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text="LinkedIn" />
            </Button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                <UnifiedLocalizedText text="Or continue with email" />
              </span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">
                <UnifiedLocalizedText text="Sign In" />
              </TabsTrigger>
              <TabsTrigger value="signup">
                <UnifiedLocalizedText text="Sign Up" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">
                    <UnifiedLocalizedText text="Email" />
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">
                    <UnifiedLocalizedText text="Password" />
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <UnifiedLocalizedText text="Sign In" />
                  )}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={handlePasswordReset}
                  disabled={!formData.email}
                >
                  <UnifiedLocalizedText text="Forgot your password?" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <RoleSelector
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">
                      <UnifiedLocalizedText text="First Name" />
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="first-name"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">
                      <UnifiedLocalizedText text="Last Name" />
                    </Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">
                    <UnifiedLocalizedText text="Email" />
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    <UnifiedLocalizedText text="Password" />
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <UnifiedLocalizedText text="Password must contain 8+ characters with uppercase, lowercase, numbers, and symbols" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !selectedRole}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <UnifiedLocalizedText text="Create Account" />
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {authState.retryCount > 0 && (
            <div className="mt-4 text-center">
              <Badge variant="outline">
                <UnifiedLocalizedText text={`Retry attempt: ${authState.retryCount}`} />
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
