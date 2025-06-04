
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, User, GraduationCap, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState('student');
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'signup') => {
    setIsLoading(true);
    // Simulate auth process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`${type === 'login' ? 'Welcome back!' : 'Account created successfully!'}`);
    
    // Navigate based on role
    if (userRole === 'educator') {
      navigate('/educator-dashboard');
    } else if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/student-dashboard');
    }
    
    setIsLoading(false);
  };

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Learn with personalized AI-powered experiences',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'educator',
      title: 'Educator',
      description: 'Create and monetize educational content',
      icon: User,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage platform and user analytics',
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
            Welcome to SimoneLabs
          </h1>
          <p className="text-gray-600">
            Choose your role and start your educational journey
          </p>
        </div>

        {/* Role Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Select Your Role</CardTitle>
            <CardDescription className="text-center">
              This will customize your experience
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
                      Selected
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
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Welcome back! Enter your credentials to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    aria-describedby="email-help"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    aria-describedby="password-help"
                  />
                </div>
                <Button 
                  onClick={() => handleAuth('login')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join SimoneLabs and start your learning journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input 
                      id="firstname" 
                      placeholder="First name"
                      aria-describedby="firstname-help"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input 
                      id="lastname" 
                      placeholder="Last name"
                      aria-describedby="lastname-help"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="Enter your email"
                    aria-describedby="signup-email-help"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="Create a password"
                    aria-describedby="signup-password-help"
                  />
                </div>
                <Button 
                  onClick={() => handleAuth('signup')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Accessibility Note */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-blue-800">
              <p className="font-medium">♿ Fully Accessible Platform</p>
              <p>Screen reader compatible • Keyboard navigation • High contrast support</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
