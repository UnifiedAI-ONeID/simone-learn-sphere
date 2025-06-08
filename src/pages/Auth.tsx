
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { DesktopAuth } from '@/components/auth/DesktopAuth';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const isMobile = useIsMobile();

  // Redirect mobile users to mobile auth
  useEffect(() => {
    if (isMobile) {
      navigate('/auth', { replace: true });
      return;
    }
  }, [isMobile, navigate]);

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      const redirectRoute = getRoleBasedRoute(role, true);
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  // Show loading state while checking auth
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <DesktopAuth />;
};

export default Auth;
