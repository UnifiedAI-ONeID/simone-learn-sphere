
export const getRoleBasedRoute = (role: string | null): string => {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'educator':
      return '/educator-dashboard';
    case 'student':
    default:
      return '/student-dashboard';
  }
};

export const canAccessRoute = (userRole: string | null, route: string): boolean => {
  if (!userRole) return false;
  
  switch (route) {
    case '/admin-dashboard':
      return userRole === 'admin';
    case '/educator-dashboard':
      return userRole === 'educator' || userRole === 'admin';
    case '/student-dashboard':
      return true; // All authenticated users can access student dashboard
    default:
      return true;
  }
};
