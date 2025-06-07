
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Brain, Trophy, Smartphone } from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const MobileIndex = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      const redirectRoute = getRoleBasedRoute(role);
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">
            <TranslatedText text="Loading..." />
          </p>
        </div>
      </div>
    );
  }

  const handleGetStarted = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      // Haptics not available
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate('/auth');
    }, 500);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized education with AI assistance"
    },
    {
      icon: BookOpen,
      title: "Mobile-First Courses",
      description: "Learn anywhere, anytime on your device"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with learners worldwide"
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn badges and track achievements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="px-4 pt-12 pb-8">
        <div className="text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 mx-auto shadow-xl">
            <Brain className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 bg-purple-100 text-purple-800">
              <Smartphone className="w-4 h-4 mr-2" />
              <TranslatedText text="Mobile Learning Platform" />
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              <TranslatedText text="Learn & Teach" />
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                <TranslatedText text="On Your Phone" />
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
              <TranslatedText text="Access powerful educational tools designed specifically for mobile. Create, learn, and connect with a global community." />
            </p>
          </div>
          
          <Button 
            onClick={handleGetStarted}
            disabled={isLoading}
            size="lg" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 text-lg shadow-lg active:scale-95 transition-transform"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span><TranslatedText text="Starting..." /></span>
              </div>
            ) : (
              <TranslatedText text="Start Learning Today" />
            )}
          </Button>
          
          <p className="text-sm text-gray-500">
            <TranslatedText text="Free to start • No credit card required" />
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText text="Everything You Need" />
          </h2>
          <p className="text-gray-600">
            <TranslatedText text="Powerful features designed for mobile learning" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 active:scale-95">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-gray-900 text-lg">
                    <TranslatedText text={feature.title} />
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  <TranslatedText text={feature.description} />
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-8">
        <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              <TranslatedText text="Ready to Transform Your Learning?" />
            </h3>
            <p className="text-gray-600 mb-6">
              <TranslatedText text="Join thousands of learners already using SimoneLabs" />
            </p>
            <Button 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 active:scale-95 transition-transform"
            >
              <TranslatedText text="Get Started Free" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
