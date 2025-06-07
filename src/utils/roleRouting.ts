
export const getRoleBasedRoute = (role: string | null): string => {
  console.log('Getting route for role:', role);
  
  if (!role) {
    console.warn('No role provided, defaulting to student dashboard');
    return '/student-dashboard';
  }

  // Handle combined roles - prioritize in order: admin > educator > student
  if (role.includes('admin')) {
    return '/admin-dashboard';
  } else if (role.includes('educator')) {
    return '/educator-dashboard';
  } else if (role.includes('student')) {
    return '/student-dashboard';
  }
  
  // Default to student dashboard for any unknown roles
  console.warn('Unknown role, defaulting to student dashboard:', role);
  return '/student-dashboard';
};

export const canAccessRoute = (userRole: string | null, route: string): boolean => {
  if (!userRole) return false;
  
  // Helper function to check if user has specific role
  const hasRole = (targetRole: string): boolean => {
    if (userRole === 'admin') return true; // Admin has all access
    return userRole.split('+').includes(targetRole);
  };
  
  switch (route) {
    case '/admin-dashboard':
      return hasRole('admin');
    case '/educator-dashboard':
      return hasRole('educator') || hasRole('admin');
    case '/student-dashboard':
      return true; // All authenticated users can access student dashboard
    case '/auth':
      return true; // Anyone can access auth page
    case '/':
      return true; // Anyone can access landing page
    default:
      return true; // Default to allowing access
  }
};

export const getRedirectRoute = (userRole: string | null, currentRoute: string): string | null => {
  // If user is not authenticated, redirect to auth
  if (!userRole) {
    return '/auth';
  }
  
  // If user is on auth page but authenticated, redirect to their dashboard
  if (currentRoute === '/auth') {
    return getRoleBasedRoute(userRole);
  }
  
  // If user cannot access current route, redirect to their appropriate dashboard
  if (!canAccessRoute(userRole, currentRoute)) {
    return getRoleBasedRoute(userRole);
  }
  
  // No redirect needed
  return null;
};
