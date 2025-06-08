
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

      {/* Hero Section - Device Responsive */}
      <main id="main-content" className="px-4 py-12 md:px-6 lg:px-8" role="main">
        <div className="mx-auto max-w-7xl">
          {isMobileDevice ? (
            // Mobile-First Landing
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  📱 <LocalizedText text="Mobile-Optimized Learning" />
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  <LocalizedText text="Learn & Teach" />
                  <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    <LocalizedText text="On the Go" />
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  <LocalizedText text="Access powerful educational tools from your mobile device. Create courses, learn with AI assistance, and connect with a global community of learners." />
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 text-lg"
                  aria-describedby="mobile-cta-description"
                >
                  <LocalizedText text="Start Learning Today" />
                </Button>
                <p id="mobile-cta-description" className="text-sm text-gray-500 dark:text-gray-400">
                  <LocalizedText text="Free to start • No credit card required" />
                </p>
              </div>
            </div>
          ) : (
            // Desktop Landing
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    🚀 <LocalizedText text="Democratizing Education Worldwide" />
                  </Badge>
                  <h2 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-6xl">
                    <LocalizedText text="Empower Your" />
                    <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      <LocalizedText text="Teaching Journey" />
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                    <LocalizedText text="Create immersive educational experiences with AI-powered tools. Build, deliver, and monetize courses while connecting with learners globally." />
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleGetStarted}
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4"
                    aria-describedby="desktop-cta-description"
                  >
                    <LocalizedText text="Get Started Free" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20 px-8 py-4"
                    onClick={() => {
                      toast.success(<LocalizedText text="Demo coming soon!" />);
                      announce("Demo coming soon!");
                    }}
                  >
                    <LocalizedText text="Watch Demo" />
                  </Button>
                </div>
                
                <div id="desktop-cta-description" className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <LocalizedText text="Free to start" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <LocalizedText text="No credit card required" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <LocalizedText text="Fully accessible" />
                  </div>
                </div>
              </div>
              
              {/* Visual Element */}
              <div className="relative">
                <div className="relative rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardHeader className="pb-3">
                          <feature.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                        </CardHeader>
                        <CardContent>
                          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                            <LocalizedText text={feature.title} />
                          </CardTitle>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-7xl mt-24">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              <LocalizedText text="Everything You Need to Succeed" />
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              <LocalizedText text="From AI-powered course creation to community building, SimoneLabs provides all the tools for modern education." />
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" role="list" aria-label="Features">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-purple-100 dark:border-purple-800" role="listitem">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">
                    <LocalizedText text={feature.title} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    <LocalizedText text={feature.description} />
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Co-Founders Section */}
        <div className="mx-auto max-w-7xl mt-24">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              <LocalizedText text="Meet Our Co-Founders" />
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              <LocalizedText text="Passionate leaders dedicated to transforming education through innovation and technology." />
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" role="list" aria-label="Co-founders">
            {coFounders.map((founder, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-purple-100 dark:border-purple-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm" role="listitem">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-20 h-20 ring-4 ring-purple-100 dark:ring-purple-800">
                      <AvatarImage src={founder.avatarUrl} alt={`Portrait of ${founder.name}`} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-semibold">
                        {founder.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    <LocalizedText text={founder.name} />
                  </CardTitle>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <LocalizedText text={founder.role} />
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                    <LocalizedText text={founder.description} />
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-4xl mt-24 text-center">
          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                <LocalizedText text="Ready to Transform Education?" />
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                <LocalizedText text="Join thousands of educators who are already creating amazing learning experiences with SimoneLabs." />
              </p>
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-12 py-4 text-lg"
              >
                <LocalizedText text="Start Your Journey" />
              </Button>
            </CardContent>
          </Card>
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
