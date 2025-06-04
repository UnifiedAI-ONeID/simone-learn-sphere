
interface AuthError {
  message: string;
  code?: string;
}

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';

  // Supabase auth error messages
  const errorMessage = error.message?.toLowerCase() || '';

  if (errorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (errorMessage.includes('email already registered') || errorMessage.includes('user already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }

  if (errorMessage.includes('email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }

  if (errorMessage.includes('password') && errorMessage.includes('weak')) {
    return 'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.';
  }

  if (errorMessage.includes('rate limit')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }

  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Return a generic message for unknown errors to avoid leaking sensitive information
  return 'Unable to complete the request. Please try again later.';
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 1000); // Limit length
};
