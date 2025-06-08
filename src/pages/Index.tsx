
import { isMobile, isTablet } from 'react-device-detect';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getUnifiedRoleRoute } from '@/utils/unifiedRoleRouting';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { Founders } from '@/components/Founders';

// Lazy load heavy components
const AccessibilityControls = lazy(() => import('@/components/accessibility/AccessibilityControls').then(m => ({ default: m.AccessibilityControls })));
const KeyboardHelp = lazy(() => import('@/components/accessibility/KeyboardHelp').then(m => ({ default: m.KeyboardHelp })));
const SkipLink = lazy(() => import('@/components/accessibility/SkipLink').then(m => ({ default: m.SkipLink })));
const PlatformOverview = lazy(() => import('@/components/PlatformOverview').then(m => ({ default: m.PlatformOverview })));
const LandingPageAssistant = lazy(() => import('@/components/LandingPageAssistant').then(m => ({ default: m.LandingPageAssistant })));

const Index = () => {
  const navigate = useNavigate();
  const isMobileDevice = isMobile || isTablet;
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { isDarkMode, toggleDarkMode } = usePlatformTheme();
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  console.log('Index: Rendering with user:', !!user, 'role:', role, 'authLoading:', authLoading, 'roleLoading:', roleLoading, 'contentReady:', isContentReady);

  // Simple content ready state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      console.log('Index: Authenticated user detected, redirecting to dashboard');
      console.log('Index: User role:', role);
      const redirectRoute = getUnifiedRoleRoute(role, true, false);
      console.log('Index: Redirecting to:', redirectRoute);
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  // Preload components after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="landing-subtitle">Loading...</p>
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
          <p className="landing-subtitle">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleGetStarted = () => {
    console.log('Index: Get started clicked, navigating to auth');
    toast.success('Welcome to SimoneLabs!');
    navigate('/auth');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-background' : 'bg-gradient-to-br from-background via-primary/5 to-secondary/10'}`}>
      {componentsLoaded && (
        <Suspense fallback={null}>
          <SkipLink />
        </Suspense>
      )}
      
      {/* Navigation Header */}
      <header className="relative z-10 px-6 py-8 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between" role="navigation" aria-label="Main navigation">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Brain className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold landing-gradient-text">SimoneLabs</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {componentsLoaded && (
              <Suspense fallback={null}>
                <AccessibilityControls />
                <KeyboardHelp />
              </Suspense>
            )}
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
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="px-6 py-12 lg:px-8" role="main">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={
            <div className="text-center space-y-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-muted-foreground">Loading content...</p>
            </div>
          }>
            <PlatformOverview 
              totalUsers={0}
              activeCourses={0}
              completionRate={0}
              aiUsage={0}
              userEngagement={0}
              securityScore={100}
            />
          </Suspense>
        </div>
      </main>

      {/* Founders Section */}
      <Founders />

      {/* Footer */}
      <footer className="mt-24 border-t border-border/50 py-12 bg-card/30 backdrop-blur-sm" role="contentinfo">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">© 2024 SimoneLabs. Democratizing education worldwide.</p>
          </div>
        </div>
      </footer>

      {/* Landing Page Assistant - Load last */}
      {componentsLoaded && isContentReady && (
        <Suspense fallback={null}>
          <LandingPageAssistant />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
