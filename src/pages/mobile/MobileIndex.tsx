
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Brain, Trophy, Smartphone } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PlatformButton } from '@/components/platform/PlatformButton';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { Badge } from '@/components/ui/badge';

export const MobileIndex = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { platform, theme } = usePlatformTheme();

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      const redirectRoute = getRoleBasedRoute(role);
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading || user) {
    return (
      <PlatformLayout className="flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-[var(--platform-primary)] rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-[var(--platform-text-secondary)]">
            <LocalizedText text="Loading..." />
          </p>
        </div>
      </PlatformLayout>
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
      title: `${platform === 'ios' ? 'iOS' : platform === 'android' ? 'Android' : 'Mobile'}-First Courses`,
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
    <PlatformLayout>
      {/* Hero Section */}
      <div className="px-4 pt-12 pb-8">
        <div className="text-center space-y-6">
          <div className={`flex h-20 w-20 items-center justify-center mx-auto ${
            platform === 'ios' ? 'rounded-2xl' : platform === 'android' ? 'rounded-full' : 'rounded-xl'
          } bg-[var(--platform-primary)] shadow-xl`}>
            <Brain className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <Badge variant="secondary" className={`px-4 py-2 bg-[var(--platform-primary)]/10 text-[var(--platform-primary)] ${
              platform === 'android' ? 'rounded-full uppercase tracking-wide text-xs' : ''
            }`}>
              <Smartphone className="w-4 h-4 mr-2" />
              <LocalizedText text={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Learning Platform`} />
            </Badge>
            
            <h1 className={`text-4xl tracking-tight text-[var(--platform-text)] ${
              platform === 'ios' ? 'font-semibold' : 
              platform === 'android' ? 'font-medium' : 'font-bold'
            }`}>
              <LocalizedText text="Learn & Teach" />
              <span className="block bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] bg-clip-text text-transparent">
                <LocalizedText text="On Your Phone" />
              </span>
            </h1>
            
            <p className="text-lg text-[var(--platform-text-secondary)] max-w-sm mx-auto leading-relaxed">
              <LocalizedText text="Access powerful educational tools designed specifically for mobile. Create, learn, and connect with a global community." />
            </p>
          </div>
          
          <PlatformButton 
            onClick={handleGetStarted}
            disabled={isLoading}
            size="lg" 
            className="w-full py-4 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span><LocalizedText text="Starting..." /></span>
              </div>
            ) : (
              <LocalizedText text="Start Learning Today" />
            )}
          </PlatformButton>
          
          <p className="text-sm text-[var(--platform-text-secondary)]">
            <LocalizedText text="Free to start • No credit card required" />
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 py-8">
        <div className="text-center mb-8">
          <h2 className={`text-2xl text-[var(--platform-text)] mb-2 ${
            platform === 'ios' ? 'font-semibold' : 
            platform === 'android' ? 'font-medium' : 'font-bold'
          }`}>
            <LocalizedText text="Everything You Need" />
          </h2>
          <p className="text-[var(--platform-text-secondary)]">
            <LocalizedText text="Powerful features designed for mobile learning" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <PlatformCard key={index} className="active:scale-95 transition-transform duration-200">
              <div className="flex items-center space-x-3 p-2">
                <div className={`w-10 h-10 bg-[var(--platform-primary)] flex items-center justify-center text-white ${
                  platform === 'ios' ? 'rounded-lg' : 
                  platform === 'android' ? 'rounded-xl' : 'rounded-lg'
                }`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-[var(--platform-text)] ${
                    platform === 'ios' ? 'text-lg font-medium' : 
                    platform === 'android' ? 'text-lg font-medium' : 'text-lg font-semibold'
                  }`}>
                    <LocalizedText text={feature.title} />
                  </h3>
                  <p className="text-[var(--platform-text-secondary)] text-sm">
                    <LocalizedText text={feature.description} />
                  </p>
                </div>
              </div>
            </PlatformCard>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-8">
        <PlatformCard className="bg-gradient-to-r from-[var(--platform-primary)]/10 to-[var(--platform-secondary)]/10">
          <div className="py-8 text-center">
            <h3 className={`text-xl text-[var(--platform-text)] mb-3 ${
              platform === 'ios' ? 'font-semibold' : 
              platform === 'android' ? 'font-medium' : 'font-bold'
            }`}>
              <LocalizedText text="Ready to Transform Your Learning?" />
            </h3>
            <p className="text-[var(--platform-text-secondary)] mb-6">
              <LocalizedText text="Join thousands of learners already using SimoneLabs" />
            </p>
            <PlatformButton 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="px-8 py-3"
            >
              <LocalizedText text="Get Started Free" />
            </PlatformButton>
          </div>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
