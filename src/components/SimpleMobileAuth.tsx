
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  AlertTriangle, 
  Chrome,
  Linkedin,
  GraduationCap,
  Users,
  Shield
} from 'lucide-react';

interface SimpleMobileAuthProps {
  onSuccess: () => void;
}

export const SimpleMobileAuth: React.FC<SimpleMobileAuthProps> = ({ onSuccess }) => {
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
    setError,
    signUpWithEmail,
    signInWithEmail,
    signInWithOAuth,
    storeRoleForAuth
  } = useEnhancedAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      if (!selectedRole) {
        setError('Please select a role before continuing');
        return;
      }
      const result = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        selectedRole
      );
      if (result.success) {
        onSuccess();
      }
    } else {
      const result = await signInWithEmail(formData.email, formData.password);
      if (result.success) {
        onSuccess();
      }
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'linkedin_oidc') => {
    const role = activeTab === 'signup' ? selectedRole : undefined;
    if (activeTab === 'signup' && !selectedRole) {
      setError('Please select a role before continuing');
      return;
    }
    
    await signInWithOAuth(provider, role);
  };

  const roleOptions = [
    {
      value: 'student',
      label: 'Student',
      description: 'Learn from courses and track progress',
      icon: GraduationCap
    },
    {
      value: 'educator',
      label: 'Educator',
      description: 'Create and manage courses',
      icon: Users
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Manage platform and users',
      icon: Shield
    }
  ];

  return (
    <Card className="w-full max-w-sm mx-auto bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">
          <UnifiedLocalizedText text="Welcome to SimoneLabs" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Sign in to your account or create a new one" />
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-2">
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
            <span className="bg-card px-2 text-muted-foreground">
              <UnifiedLocalizedText text="Or continue with email" />
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">
              <UnifiedLocalizedText text="Sign In" />
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UnifiedLocalizedText text="Sign Up" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm">
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
                <Label htmlFor="signin-password" className="text-sm">
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

          <TabsContent value="signup" className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm">
                  <UnifiedLocalizedText text="I am a..." />
                </Label>
                <div className="grid gap-2">
                  {roleOptions.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <Button
                        key={role.value}
                        type="button"
                        variant={selectedRole === role.value ? "default" : "outline"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => setSelectedRole(role.value)}
                      >
                        <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="first-name" className="text-sm">
                    <UnifiedLocalizedText text="First Name" />
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="last-name" className="text-sm">
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
                <Label htmlFor="signup-email" className="text-sm">
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
                <Label htmlFor="signup-password" className="text-sm">
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
      </CardContent>
    </Card>
  );
};
