
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { getRoleBasedRoute } from '@/utils/roleRouting';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export const RoleProtectedRoute = ({ 
  children, 
  allowedRoles, 
  fallbackPath 
}: RoleProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, hasRole } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has any of the allowed roles
  const hasAccess = allowedRoles.some(allowedRole => hasRole(allowedRole));

  if (!hasAccess) {
    // Use provided fallback or determine based on user's actual role
    const redirectPath = fallbackPath || getRoleBasedRoute(role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
