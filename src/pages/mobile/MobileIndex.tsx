
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Moon, Sun } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getUnifiedRoleRoute } from '@/utils/unifiedRoleRouting';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';

// Define UserRole type locally since it's not exported from supabase types
type UserRole = 'student' | 'educator' | 'admin';

export const MobileIndex = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { isDarkMode, toggleDarkMode } = usePlatformTheme();

  console.log('MobileIndex: Rendering with user:', !!user, 'role:', role, 'authLoading:', authLoading, 'roleLoading:', roleLoading);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      console.log('MobileIndex: Authenticated user detected, redirecting to dashboard');
      const redirectRoute = getUnifiedRoleRoute(role as UserRole, true, true);
      console.log('MobileIndex: Redirecting to:', redirectRoute);
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
          <p className="text-muted-foreground">
            <UnifiedLocalizedText text="Loading..." />
          </p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (they'll be redirected)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">
            <UnifiedLocalizedText text="Redirecting to your dashboard..." />
          </p>
        </div>
      </div>
    );
  }

  const handleGetStarted = () => {
    console.log('MobileIndex: Get started clicked, navigating to mobile auth');
    navigate('/mobile/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Mobile Header */}
      <header className="px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <UnifiedLocalizedText text="SimoneLabs" />
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-primary"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              <UnifiedLocalizedText text="Learn Anywhere, Anytime" />
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              <UnifiedLocalizedText text="Access world-class education from your mobile device. Start your learning journey today." />
            </p>
          </div>

          <div className="space-y-4 max-w-sm mx-auto">
            <Button 
              onClick={handleGetStarted}
              className="w-full h-12 text-lg font-semibold"
            >
              <UnifiedLocalizedText text="Get Started" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              <UnifiedLocalizedText text="Join thousands of learners worldwide" />
            </p>
          </div>

          {/* Feature highlights for mobile */}
          <div className="mt-12 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">
                <UnifiedLocalizedText text="AI-Powered Learning" />
              </h3>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Get personalized guidance and support" />
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          <UnifiedLocalizedText text="© 2024 SimoneLabs. Democratizing education worldwide." />
        </p>
      </footer>
    </div>
  );
};
