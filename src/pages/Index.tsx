import { isMobile, isTablet } from 'react-device-detect';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Users, Brain, Trophy, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { LocalizedText } from '@/components/LocalizedText';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls';
import { KeyboardHelp } from '@/components/accessibility/KeyboardHelp';
import { SkipLink } from '@/components/accessibility/SkipLink';
import { useScreenReaderAnnouncement } from '@/components/accessibility/LiveRegion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { LandingPageAssistant } from '@/components/LandingPageAssistant';
import { PlatformOverview } from '@/components/PlatformOverview';

const Index = () => {
  const navigate = useNavigate();
  const isMobileDevice = isMobile || isTablet;
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { announce, AnnouncementRegion } = useScreenReaderAnnouncement();
  const { isDarkMode, toggleDarkMode } = usePlatformTheme();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      console.log('Index: Authenticated user detected, redirecting to dashboard');
      const redirectRoute = getRoleBasedRoute(role);
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  // Show loading state while checking authentication
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">
            <LocalizedText text="Loading..." />
          </p>
        </div>
      </div>
    );
  }

  // Don't render the landing page if user is authenticated (they'll be redirected)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">
            <LocalizedText text="Redirecting to your dashboard..." />
          </p>
        </div>
      </div>
    );
  }

  const handleGetStarted = () => {
    toast.success(<LocalizedText text="Welcome to SimoneLabs!" />);
    announce("Welcome to SimoneLabs!");
    navigate('/auth');
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Course Creation",
      description: "Generate course outlines, quizzes, and content with advanced AI assistance"
    },
    {
      icon: BookOpen,
      title: "Flexible Learning Delivery",
      description: "Support for self-paced, live, and cohort-based educational experiences"
    },
    {
      icon: Users,
      title: "Community & Collaboration",
      description: "Discussion forums, mentorship, and study groups to enhance learning"
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Badges, points, streaks, and challenges to boost engagement"
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'}`}>
      <SkipLink />
      <AnnouncementRegion />
      
      {/* Navigation Header */}
      <header className="relative z-10 px-4 py-6 md:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between" role="navigation" aria-label="Main navigation">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
              <Brain className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <LocalizedText text="SimoneLabs" />
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <AccessibilityControls />
            <KeyboardHelp />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={handleGetStarted} variant="outline">
              <LocalizedText text="Sign In" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="px-4 py-12 md:px-6 lg:px-8" role="main">
        <div className="mx-auto max-w-7xl">
          <PlatformOverview />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 dark:border-gray-800 py-12" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>
              <LocalizedText text="© 2024 SimoneLabs. Democratizing education worldwide." />
            </p>
          </div>
        </div>
      </footer>

      {/* Landing Page Assistant */}
      <LandingPageAssistant />
    </div>
  );
};

export default Index;
