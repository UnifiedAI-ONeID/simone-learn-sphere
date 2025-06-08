import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { RoleSelector } from './RoleSelector';
import { useEnhancedAuthentication } from '@/hooks/useEnhancedAuthentication';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Brain, 
  AlertTriangle,
  Chrome,
  Linkedin,
  User
} from 'lucide-react';

interface DesktopAuthProps {
  onClose: () => void;
}

export const DesktopAuth: React.FC<DesktopAuthProps> = ({ onClose }) => {
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
    clearError,
    signUpWithEmail,
    signInWithEmail,
    signInWithOAuth,
    authState
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
      const result = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        selectedRole
      );
      if (result.success && !result.requiresEmailVerification) {
        onClose();
      }
    } else {
      const result = await signInWithEmail(formData.email, formData.password);
      if (result.success) {
        onClose();
      }
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'linkedin_oidc') => {
    const role = activeTab === 'signup' ? selectedRole : undefined;
    if (activeTab === 'signup' && !selectedRole) {
      return;
    }
    
    const result = await signInWithOAuth(provider, role);
    if (result.success) {
      // OAuth will redirect, so we don't need to manually close
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center text-2xl">
            <Brain className="h-6 w-6" />
            <UnifiedLocalizedText text="Welcome to SimoneLabs" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Sign in to your account or create a new one" />
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {authState.suggestOAuth && (
            <Alert>
              <AlertDescription>
                <UnifiedLocalizedText text="Try signing in with Google or LinkedIn for a faster experience!" />
              </AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              className="w-full"
            >
              <Chrome className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text="Continue with Google" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('linkedin_oidc')}
              disabled={isLoading}
              className="w-full"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text="Continue with LinkedIn" />
            </Button>
          </div>

          <div className="relative">
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
                  {isLoading ? 'Signing in...' : <UnifiedLocalizedText text="Sign In" />}
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
                    <UnifiedLocalizedText text="8+ characters with uppercase, lowercase, numbers, and symbols" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !selectedRole}
                >
                  {isLoading ? 'Creating account...' : <UnifiedLocalizedText text="Create Account" />}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground">
            <Button 
              variant="link" 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <UnifiedLocalizedText text="Back to home" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
