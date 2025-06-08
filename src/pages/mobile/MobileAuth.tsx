
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { SimpleMobileAuth } from '@/components/SimpleMobileAuth';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import toast from 'react-hot-toast';

export const MobileAuth = () => {
  const { platform } = usePlatformTheme();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      const redirectRoute = getRoleBasedRoute(role, true);
      navigate(redirectRoute, { replace: true });
      toast.success('Welcome back!');
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  // Show loading state while checking auth
  if (authLoading || roleLoading) {
    return (
      <PlatformLayout className="flex items-center justify-center p-4">
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

  const getIconStyles = () => {
    switch (platform) {
      case 'ios':
        return "rounded-2xl shadow-xl bg-[var(--platform-primary)]";
      case 'android':
        return "rounded-full shadow-2xl bg-[var(--platform-primary)]";
      default:
        return "rounded-xl shadow-xl bg-[var(--platform-primary)]";
    }
  };

  const getHeadingStyles = () => {
    switch (platform) {
      case 'ios':
        return "text-2xl bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] bg-clip-text text-transparent font-semibold";
      case 'android':
        return "text-2xl bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] bg-clip-text text-transparent font-medium";
      default:
        return "text-2xl bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] bg-clip-text text-transparent font-bold";
    }
  };

  return (
    <PlatformLayout className="flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className={`flex h-16 w-16 items-center justify-center mx-auto mb-4 ${getIconStyles()}`}>
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className={getHeadingStyles()}>
            <LocalizedText text="Welcome Back" />
          </h1>
          <p className="text-[var(--platform-text-secondary)] mt-2">
            <LocalizedText text="Sign in to continue learning" />
          </p>
        </div>

        <SimpleMobileAuth />
      </div>
    </PlatformLayout>
  );
};
