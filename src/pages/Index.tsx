
import { isMobile, isTablet } from 'react-device-detect';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
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
import { Brain } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="landing-subtitle">
            <LocalizedText text="Loading..." />
          </p>
        </div>
      </div>
    );
  }

  // Don't render the landing page if user is authenticated (they'll be redirected)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="landing-subtitle">
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-background' : 'bg-gradient-to-br from-background via-primary/5 to-secondary/10'}`}>
      <SkipLink />
      <AnnouncementRegion />
      
      {/* Navigation Header */}
      <header className="relative z-10 px-6 py-8 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between" role="navigation" aria-label="Main navigation">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Brain className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold landing-gradient-text">
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
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              onClick={handleGetStarted} 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-semibold"
            >
              <LocalizedText text="Sign In" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="px-6 py-12 lg:px-8" role="main">
        <div className="mx-auto max-w-7xl">
          <PlatformOverview />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-border/50 py-12 bg-card/30 backdrop-blur-sm" role="contentinfo">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">
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
