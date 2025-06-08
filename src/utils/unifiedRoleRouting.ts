
// Define UserRole type locally since it's not exported from supabase types
type UserRole = 'student' | 'educator' | 'admin';

export const getUnifiedRoleRoute = (
  role: string | null, 
  isLoginContext: boolean = false,
  isMobile: boolean = false
): string => {
  console.log('Getting unified route for role:', role, 'login context:', isLoginContext, 'mobile:', isMobile);
  
  if (!role) {
    console.warn('No role provided, defaulting to student dashboard');
    return isMobile ? '/mobile/student-dashboard' : '/student-dashboard';
  }

  // During login, always prioritize admin role if user has it
  if (isLoginContext && role.includes('admin')) {
    console.log('Login context: Admin user detected, routing to admin dashboard');
    return isMobile ? '/mobile/admin-dashboard' : '/admin-dashboard';
  }

  // Handle combined roles - prioritize in order: admin > educator > student
  if (role.includes('admin')) {
    console.log('Routing admin to admin dashboard');
    return isMobile ? '/mobile/admin-dashboard' : '/admin-dashboard';
  } else if (role.includes('educator')) {
    console.log('Routing educator to educator dashboard');
    return isMobile ? '/mobile/educator-dashboard' : '/educator-dashboard';
  } else if (role.includes('student')) {
    console.log('Routing student to student dashboard');
    return isMobile ? '/mobile/student-dashboard' : '/student-dashboard';
  }
  
  // Default to student dashboard for any unknown roles
  console.warn('Unknown role, defaulting to student dashboard:', role);
  return isMobile ? '/mobile/student-dashboard' : '/student-dashboard';
};

export const canAccessRoute = (userRole: string | null, route: string): boolean => {
  if (!userRole) return false;
  
  // Helper function to check if user has specific role
  const hasRole = (targetRole: string): boolean => {
    if (userRole === 'admin') return true; // Admin has all access
    return userRole.split('+').includes(targetRole);
  };
  
  // Handle both mobile and desktop routes
  const routePattern = route.replace('/mobile', '');
  
  switch (routePattern) {
    case '/admin-dashboard':
      return hasRole('admin');
    case '/educator-dashboard':
      return hasRole('educator') || hasRole('admin');
    case '/student-dashboard':
      return true; // All authenticated users can access student dashboard
    case '/auth':
    case '/mobile/auth':
      return true; // Anyone can access auth page
    case '/':
      return true; // Anyone can access landing page
    default:
      return true; // Default to allowing access
  }
};

export const getRedirectRoute = (
  userRole: string | null, 
  currentRoute: string,
  isMobile: boolean = false
): string | null => {
  // If user is not authenticated, redirect to auth
  if (!userRole) {
    return isMobile ? '/mobile/auth' : '/auth';
  }
  
  // If user is on auth page but authenticated, redirect to their dashboard
  if (currentRoute === '/auth' || currentRoute === '/mobile/auth') {
    return getUnifiedRoleRoute(userRole, true, isMobile);
  }
  
  // If user cannot access current route, redirect to their appropriate dashboard
  if (!canAccessRoute(userRole, currentRoute)) {
    return getUnifiedRoleRoute(userRole, true, isMobile);
  }
  
  // No redirect needed
  return null;
};

// Legacy compatibility functions
export const getRoleBasedRoute = (role: string | null, isLoginContext: boolean = false): string => {
  return getUnifiedRoleRoute(role, isLoginContext, false);
};

export const getMobileRoleBasedRoute = (role: UserRole, isLoginContext: boolean = false): string => {
  return getUnifiedRoleRoute(role, isLoginContext, true);
};
