
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { isMobile, isTablet } from 'react-device-detect';

export const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !roleLoading && user && role) {
      console.log('AuthRedirectHandler: User authenticated, redirecting based on role and device');
      console.log('AuthRedirectHandler: User role:', role);
      console.log('AuthRedirectHandler: Is mobile:', isMobile || isTablet);
      
      const redirectRoute = getRoleBasedRoute(role, true);
      console.log('AuthRedirectHandler: Redirecting to:', redirectRoute);
      
      navigate(redirectRoute, { replace: true });
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  return null;
};
