
import { useIsMobile } from '@/hooks/use-mobile';
import { UserRole } from '@/integrations/supabase/types';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { getMobileRoleBasedRoute } from '@/utils/mobileRouting';

export const useResponsiveRoute = (role: UserRole) => {
  const isMobile = useIsMobile();
  
  return isMobile 
    ? getMobileRoleBasedRoute(role, true)
    : getRoleBasedRoute(role, false);
};

export const getRouteForPlatform = (role: UserRole, isMobile: boolean): string => {
  return isMobile 
    ? getMobileRoleBasedRoute(role, true)
    : getRoleBasedRoute(role, false);
};

// Utility to check if current route matches expected role route
export const isCorrectRoleRoute = (currentPath: string, role: UserRole, isMobile: boolean): boolean => {
  const expectedRoute = getRouteForPlatform(role, isMobile);
  return currentPath === expectedRoute || currentPath.startsWith(expectedRoute);
};
