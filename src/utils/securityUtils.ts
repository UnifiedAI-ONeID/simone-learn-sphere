
export const getClientIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to get client IP:', error);
    return null;
  }
};

export const sanitizeUserAgent = (userAgent: string): string => {
  // Remove potentially sensitive information from user agent
  return userAgent.substring(0, 500); // Truncate to reasonable length
};

export const isValidRole = (role: string): boolean => {
  return ['student', 'educator', 'admin'].includes(role);
};

export const canAccessAdminFeatures = (userRole: string | null): boolean => {
  return userRole === 'admin';
};

export const canAccessEducatorFeatures = (userRole: string | null): boolean => {
  return userRole === 'educator' || userRole === 'admin';
};

export const validateRoleTransition = (
  currentRole: string,
  newRole: string,
  userRole: string | null
): boolean => {
  // Admins can change any role
  if (userRole === 'admin') return true;
  
  // Users can only downgrade their own role
  if (currentRole === 'admin' && newRole !== 'admin') return false;
  if (currentRole === 'educator' && !['educator', 'student'].includes(newRole)) return false;
  
  return true;
};

export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
