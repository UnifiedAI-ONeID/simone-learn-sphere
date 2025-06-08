
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Brain, Trophy, Smartphone } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getMobileRoleBasedRoute } from '@/utils/mobileRouting';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define UserRole type locally since it's not exported from supabase types
type UserRole = 'student' | 'educator' | 'admin';

// Lazy load heavy components
const PlatformButton = lazy(() => import('@/components/platform/PlatformButton').then(m => ({ default: m.PlatformButton })));
const PlatformCard = lazy(() => import('@/components/platform/PlatformCard').then(m => ({ default: m.PlatformCard })));
const PlatformLayout = lazy(() => import('@/components/platform/PlatformLayout').then(m => ({ default: m.PlatformLayout })));
const ThemeToggle = lazy(() => import('@/components/ThemeToggle').then(m => ({ default: m.ThemeToggle })));

export const MobileIndex = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { platform, theme } = usePlatformTheme();

  // Redirect authenticated users using mobile routing - only redirect once
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      console.log('MobileIndex: Authenticated user detected, redirecting to mobile dashboard');
      console.log('MobileIndex: User role:', role);
      const redirectRoute = getMobileRoleBasedRoute(role as UserRole, true);
      console.log('MobileIndex: Redirecting to:', redirectRoute);
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
        <div className="absolute top-4 right-4 z-10">
          <Suspense fallback={null}>
            <ThemeToggle />
          </Suspense>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">
            <LocalizedText text="Loading..." />
          </p>
        </div>
      </div>
    );
  }

  const handleGetStarted = async () => {
    try {
      // Use dynamic import for haptics to avoid blocking
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
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

  const coFounders = [
    {
      name: "Fiona Wong",
      role: "Co-Founder & CEO",
      avatar: "FW",
      avatarUrl: "/lovable-uploads/d6a21c1b-8b9b-4811-a5eb-eafac22bca5f.png",
      description: "Passionate about democratizing education and empowering educators worldwide"
    },
    {
      name: "Simon Luke",
      role: "Co-Founder & CTO",
      avatar: "SL",
      avatarUrl: "/lovable-uploads/7a68d4b0-5778-4fc6-bd9d-8d45d0d83da0.png",
      description: "Building innovative AI-powered solutions for the future of learning"
    }
  ];

  const getHeroIconStyles = () => {
    switch (platform) {
      case 'ios':
        return "rounded-2xl shadow-xl bg-primary";
      case 'android':
        return "rounded-full shadow-2xl bg-primary";
      default:
        return "rounded-xl shadow-xl bg-primary";
    }
  };

  const getBadgeStyles = () => {
    switch (platform) {
      case 'ios':
        return "px-4 py-2 bg-primary/10 text-primary rounded-full";
      case 'android':
        return "px-4 py-2 bg-primary/10 text-primary rounded-full uppercase tracking-wide text-xs";
      default:
        return "px-4 py-2 bg-primary/10 text-primary";
    }
  };

  const getHeadingStyles = () => {
    switch (platform) {
      case 'ios':
        return "text-4xl tracking-tight text-foreground font-semibold";
      case 'android':
        return "text-4xl tracking-tight text-foreground font-medium";
      default:
        return "text-4xl tracking-tight text-foreground font-bold";
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
        return "w-10 h-10 bg-primary flex items-center justify-center text-white rounded-lg";
      case 'android':
        return "w-12 h-12 bg-primary flex items-center justify-center text-white rounded-2xl";
      default:
        return "w-10 h-10 bg-primary flex items-center justify-center text-white rounded-lg";
    }
  };

  const getFounderCardStyles = () => {
    switch (platform) {
      case 'ios':
        return "active:scale-95 transition-transform duration-200 rounded-xl bg-card border-border";
      case 'android':
        return "active:scale-95 transition-transform duration-200 rounded-3xl bg-card border-border";
      default:
        return "active:scale-95 transition-transform duration-200 bg-card border-border";
    }
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <PlatformLayout className="bg-background text-foreground transition-colors duration-300">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="px-4 pt-12 pb-8">
          <div className="text-center space-y-6">
            <div className={`flex h-20 w-20 items-center justify-center mx-auto ${getHeroIconStyles()}`}>
              <Brain className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <div className="space-y-4">
              <Badge variant="secondary" className={getBadgeStyles()}>
                <Smartphone className="w-4 h-4 mr-2" />
                <LocalizedText text={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Learning Platform`} />
              </Badge>
              
              <h1 className={getHeadingStyles()}>
                <LocalizedText text="Learn & Teach" />
                <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  <LocalizedText text="Anywhere" />
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed">
                <LocalizedText text="Access powerful educational tools designed for your device. Create, learn, and connect with a global community." />
              </p>
            </div>
            
            <PlatformButton 
              onClick={handleGetStarted}
              disabled={isLoading}
              size="lg" 
              className="w-full py-4 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span><LocalizedText text="Starting..." /></span>
                </div>
              ) : (
                <LocalizedText text="Start Learning Today" />
              )}
            </PlatformButton>
            
            <p className="text-sm text-muted-foreground">
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
            <p className="text-muted-foreground mt-2">
              <LocalizedText text="Powerful features designed for mobile learning" />
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <PlatformCard key={index} className={`${getFeatureCardStyles()} bg-card border-border`}>
                <div className="flex items-center space-x-4 p-2">
                  <div className={getFeatureIconStyles()}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-foreground ${
                      platform === 'ios' ? 'text-lg font-medium' : 
                      platform === 'android' ? 'text-lg font-medium' : 'text-lg font-semibold'
                    }`}>
                      <LocalizedText text={feature.title} />
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      <LocalizedText text={feature.description} />
                    </p>
                  </div>
                </div>
              </PlatformCard>
            ))}
          </div>
        </div>

        {/* Co-Founders Section */}
        <div className="px-4 py-8">
          <div className="text-center mb-8">
            <h2 className={getHeadingStyles().replace('text-4xl', 'text-2xl')}>
              <LocalizedText text="Meet Our Co-Founders" />
            </h2>
            <p className="text-muted-foreground mt-2">
              <LocalizedText text="Passionate about transforming education" />
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {coFounders.map((founder, index) => (
              <PlatformCard key={index} className={getFounderCardStyles()}>
                <div className="p-6 text-center space-y-4">
                  <Avatar className={`h-20 w-20 mx-auto ring-2 ring-primary/20 ${
                    platform === 'ios' ? 'rounded-2xl' : 
                    platform === 'android' ? 'rounded-full' : 'rounded-xl'
                  }`}>
                    <AvatarImage src={founder.avatarUrl} alt={founder.name} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                      {founder.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className={`text-foreground ${
                      platform === 'ios' ? 'text-xl font-semibold' : 
                      platform === 'android' ? 'text-xl font-medium' : 'text-xl font-bold'
                    }`}>
                      <LocalizedText text={founder.name} />
                    </h3>
                    <p className="text-primary font-medium">
                      <LocalizedText text={founder.role} />
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      <LocalizedText text={founder.description} />
                    </p>
                  </div>
                </div>
              </PlatformCard>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 py-8">
          <PlatformCard className="bg-gradient-to-r from-primary/10 to-primary/5 border-border">
            <div className="py-8 text-center">
              <h3 className={`text-xl text-foreground mb-3 ${
                platform === 'ios' ? 'font-semibold' : 
                platform === 'android' ? 'font-medium' : 'font-bold'
              }`}>
                <LocalizedText text="Ready to Transform Your Learning?" />
              </h3>
              <p className="text-muted-foreground mb-6">
                <LocalizedText text="Join thousands of learners already using SimoneLabs" />
              </p>
              <PlatformButton 
                onClick={handleGetStarted}
                disabled={isLoading}
                className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LocalizedText text="Get Started Free" />
              </PlatformButton>
            </div>
          </PlatformCard>
        </div>
      </PlatformLayout>
    </Suspense>
  );
};
