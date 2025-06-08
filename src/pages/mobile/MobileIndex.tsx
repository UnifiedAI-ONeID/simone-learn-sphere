
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
      title: `${platform === 'ios' ? 'Native iOS' : platform === 'android' ? 'Material Design' : 'Mobile'} Experience`,
      description: "Learn anywhere with platform-native design"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with learners worldwide"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn badges and track your progress"
    }
  ];

  const getHeroIconStyles = () => {
    switch (platform) {
      case 'ios':
        return "rounded-2xl shadow-xl bg-[var(--platform-primary)]";
      case 'android':
        return "rounded-full shadow-2xl bg-[var(--platform-primary)]";
      default:
        return "rounded-xl shadow-xl bg-[var(--platform-primary)]";
    }
  };

  const getBadgeStyles = () => {
    switch (platform) {
      case 'ios':
        return "px-4 py-2 bg-[var(--platform-primary)]/10 text-[var(--platform-primary)] rounded-full";
      case 'android':
        return "px-4 py-2 bg-[var(--platform-primary)]/10 text-[var(--platform-primary)] rounded-full uppercase tracking-wide text-xs";
      default:
        return "px-4 py-2 bg-[var(--platform-primary)]/10 text-[var(--platform-primary)]";
    }
  };

  const getHeadingStyles = () => {
    switch (platform) {
      case 'ios':
        return "text-4xl tracking-tight text-[var(--platform-text)] font-semibold";
      case 'android':
        return "text-4xl tracking-tight text-[var(--platform-text)] font-medium";
      default:
        return "text-4xl tracking-tight text-[var(--platform-text)] font-bold";
    }
  };

  const getFeatureCardStyles = () => {
    switch (platform) {
      case 'ios':
        return "active:scale-95 transition-transform duration-200 rounded-xl";
      case 'android':
        return "active:scale-95 transition-transform duration-200 rounded-3xl";
      default:
        return "active:scale-95 transition-transform duration-200";
    }
  };

  const getFeatureIconStyles = () => {
    switch (platform) {
      case 'ios':
        return "w-10 h-10 bg-[var(--platform-primary)] flex items-center justify-center text-white rounded-lg";
      case 'android':
        return "w-12 h-12 bg-[var(--platform-primary)] flex items-center justify-center text-white rounded-2xl";
      default:
        return "w-10 h-10 bg-[var(--platform-primary)] flex items-center justify-center text-white rounded-lg";
    }
  };

  return (
    <PlatformLayout>
      {/* Hero Section */}
      <div className="px-4 pt-12 pb-8">
        <div className="text-center space-y-6">
          <div className={`flex h-20 w-20 items-center justify-center mx-auto ${getHeroIconStyles()}`}>
            <Brain className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <Badge variant="secondary" className={getBadgeStyles()}>
              <Smartphone className="w-4 h-4 mr-2" />
              <LocalizedText text={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Learning Platform`} />
            </Badge>
            
            <h1 className={getHeadingStyles()}>
              <LocalizedText text="Learn & Teach" />
              <span className="block bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] bg-clip-text text-transparent">
                <LocalizedText text="Anywhere" />
              </span>
            </h1>
            
            <p className="text-lg text-[var(--platform-text-secondary)] max-w-sm mx-auto leading-relaxed">
              <LocalizedText text="Access powerful educational tools designed for your device. Create, learn, and connect with a global community." />
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
          <h2 className={getHeadingStyles().replace('text-4xl', 'text-2xl')}>
            <LocalizedText text="Everything You Need" />
          </h2>
          <p className="text-[var(--platform-text-secondary)] mt-2">
            <LocalizedText text="Powerful features designed for mobile learning" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <PlatformCard key={index} className={getFeatureCardStyles()}>
              <div className="flex items-center space-x-4 p-2">
                <div className={getFeatureIconStyles()}>
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
