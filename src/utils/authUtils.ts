
import { supabase } from '@/integrations/supabase/client';

export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePasswordStrength = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  if (errors.length === 0) {
    strength = 'strong';
  } else if (errors.length <= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

export const handleAuthError = (error: any, provider?: string): string => {
  if (!error) return 'An unexpected error occurred';

  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.status || error.code;

  // Rate limiting errors
  if (errorCode === 429 || errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
    return `Too many authentication attempts. Please try again in a few minutes or use ${provider ? `${provider} ` : ''}social login instead.`;
  }

  // Email-specific errors
  if (errorMessage.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (errorMessage.includes('email already registered') || errorMessage.includes('user already registered')) {
    return 'An account with this email already exists. Please sign in instead or try social login.';
  }

  if (errorMessage.includes('email not confirmed') || errorMessage.includes('email_not_confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }

  if (errorMessage.includes('invalid_grant') || errorMessage.includes('refresh_token')) {
    return 'Your session has expired. Please sign in again.';
  }

  // Password errors
  if (errorMessage.includes('password') && errorMessage.includes('weak')) {
    return 'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.';
  }

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }

  // OAuth errors
  if (provider && (errorMessage.includes('oauth') || errorMessage.includes('provider'))) {
    return `Failed to sign in with ${provider}. Please try again or use email authentication.`;
  }

  // Generic fallback
  return 'Unable to complete the request. Please try again or contact support if the issue persists.';
};

export const cleanupAuthState = (): void => {
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }

    // Clear pending auth states
    localStorage.removeItem('pendingUserRole');
    localStorage.removeItem('authRetryCount');
    localStorage.removeItem('lastAuthError');
  } catch (error) {
    console.warn('Failed to cleanup auth state:', error);
  }
};

export const retryAuthOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (
        error.status === 400 || // Bad request
        error.status === 401 || // Unauthorized
        error.status === 403 || // Forbidden
        error.message?.includes('invalid login credentials') ||
        error.message?.includes('email already registered')
      ) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};

export const isRateLimitError = (error: any): boolean => {
  return error?.status === 429 || 
         error?.message?.toLowerCase().includes('rate limit') ||
         error?.message?.toLowerCase().includes('too many');
};

export const getRetryDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
};
