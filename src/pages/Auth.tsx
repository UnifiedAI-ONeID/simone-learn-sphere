
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { DesktopAuth } from '@/components/auth/DesktopAuth';
import { AuthLoadingState } from '@/components/auth/AuthLoadingState';

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
    return <AuthLoadingState message="Checking authentication..." />;
  }

  return <DesktopAuth />;
};

export default Auth;
