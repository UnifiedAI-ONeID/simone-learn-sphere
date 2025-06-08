
import { UserRole } from '@/integrations/supabase/types';

export const getMobileRoleBasedRoute = (role: UserRole, isMobile: boolean = false): string => {
  if (!isMobile) {
    // Fallback to desktop routes
    switch (role) {
      case 'student':
        return '/student-dashboard';
      case 'educator':
        return '/educator-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  }

  // Mobile-specific routes
  switch (role) {
    case 'student':
      return '/student-dashboard';
    case 'educator':
      return '/educator-dashboard';
    case 'admin':
      return '/admin-dashboard';
    default:
      return '/';
  }
};

export const getMobileDashboardTabs = (role: UserRole) => {
  switch (role) {
    case 'student':
      return ['overview', 'courses', 'ai-tutor', 'progress', 'badges'];
    case 'educator':
      return ['overview', 'courses', 'ai-planner', 'analytics', 'students'];
    case 'admin':
      return ['overview', 'users', 'security', 'system', 'content'];
    default:
      return ['overview'];
  }
};

export const isMobileRoute = (pathname: string): boolean => {
  const mobileRoutes = [
    '/student-dashboard',
    '/educator-dashboard', 
    '/admin-dashboard',
    '/profile-settings',
    '/auth'
  ];
  
  return mobileRoutes.some(route => pathname.startsWith(route));
};
