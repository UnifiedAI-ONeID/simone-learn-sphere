
export const getRoleBasedRoute = (role: string | null, isLoginContext: boolean = false): string => {
  console.log('Getting route for role:', role, 'login context:', isLoginContext);
  
  if (!role) {
    console.warn('No role provided, defaulting to student dashboard');
    return '/student-dashboard';
  }

  // During login, always prioritize admin role if user has it
  if (isLoginContext && role.includes('admin')) {
    console.log('Login context: Admin user detected, routing to admin dashboard');
    return '/admin-dashboard';
  }

  // Handle combined roles - prioritize in order: admin > educator > student
  if (role.includes('admin')) {
    console.log('Routing admin to admin dashboard');
    return '/admin-dashboard';
  } else if (role.includes('educator')) {
    console.log('Routing educator to educator dashboard');
    return '/educator-dashboard';
  } else if (role.includes('student')) {
    console.log('Routing student to student dashboard');
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
  // Always prioritize admin dashboard for admin users
  if (currentRoute === '/auth') {
    return getRoleBasedRoute(userRole, true);
  }
  
  // If user cannot access current route, redirect to their appropriate dashboard
  if (!canAccessRoute(userRole, currentRoute)) {
    return getRoleBasedRoute(userRole, true);
  }
  
  // No redirect needed
  return null;
};
