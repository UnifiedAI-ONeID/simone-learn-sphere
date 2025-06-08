
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthResult {
  success: boolean;
  error?: string;
  requiresEmailVerification?: boolean;
  requires2FA?: boolean;
  requiresOAuth?: boolean;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const AUTH_ERRORS = {
  RATE_LIMIT: 'over_email_send_rate_limit',
  INVALID_CREDENTIALS: 'invalid_login_credentials',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  WEAK_PASSWORD: 'weak_password',
  USER_ALREADY_REGISTERED: 'user_already_registered',
  NETWORK_ERROR: 'network_error',
  SMTP_ERROR: '535',
  OAUTH_ERROR: 'oauth_error',
  REDIRECT_ERROR: 'redirect_error',
} as const;

export const getRateLimitDelay = (attemptCount: number): number => {
  return Math.min(1000 * Math.pow(2, attemptCount), 30000);
};

export const isRateLimitError = (error: any): boolean => {
  return error?.message?.includes('rate limit') || 
         error?.error_code === AUTH_ERRORS.RATE_LIMIT ||
         error?.status === 429;
};

export const isSMTPError = (error: any): boolean => {
  return error?.message?.includes('535') || 
         error?.message?.includes('Invalid username') ||
         error?.message?.includes('SMTP');
};

export const isNetworkError = (error: any): boolean => {
  return error?.message?.includes('network') ||
         error?.message?.includes('fetch') ||
         error?.message?.includes('connection') ||
         !navigator.onLine;
};

export const isOAuthError = (error: any): boolean => {
  return error?.message?.includes('oauth') ||
         error?.message?.includes('provider') ||
         error?.message?.includes('redirect') ||
         error?.code?.includes('oauth');
};

export const getConsolidatedAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';

  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.error_code || error.code;

  console.log('Consolidated Auth Error:', { error, errorMessage, errorCode });

  // OAuth specific errors
  if (isOAuthError(error)) {
    if (errorMessage.includes('redirect')) {
      return 'OAuth redirect error. Please check your browser settings and try again.';
    }
    if (errorMessage.includes('provider')) {
      return 'OAuth provider error. Please try again or use email authentication.';
    }
    return 'OAuth authentication failed. Please try again or use email sign-in.';
  }

  // Rate limiting errors
  if (isRateLimitError(error)) {
    return 'Too many attempts. Please try using Google or LinkedIn sign-in instead, or wait a few minutes.';
  }

  // SMTP/Email configuration errors
  if (isSMTPError(error)) {
    return 'Email service temporarily unavailable. Please try signing in with Google or LinkedIn.';
  }

  // Network errors
  if (isNetworkError(error)) {
    return 'Network connection issue. Please check your internet and try again.';
  }

  // Specific auth errors
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

  if (errorMessage.includes('popup') || errorMessage.includes('closed')) {
    return 'Sign-in popup was closed. Please try again and complete the sign-in process.';
  }

  return 'Authentication failed. Please try again or use an alternative sign-in method.';
};

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

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  
  return {
    isValid,
    errors,
    strength
  };
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
    localStorage.removeItem('oauth_state');
    localStorage.removeItem('oauth_provider');
  } catch (error) {
    console.warn('Failed to cleanup auth state:', error);
  }
};

export const ensureProfileExists = async (userId: string, user: any, role?: string): Promise<any> => {
  if (!userId || !user) return null;
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile && !fetchError) {
      console.log('Profile exists:', existingProfile);
      return existingProfile;
    }
    
    // If profile doesn't exist, create it with retry logic
    console.log('Creating new profile for user:', userId);
    const profileData = {
      id: userId,
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      role: role || user.user_metadata?.role || 'student'
    };
    
    // Retry profile creation up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        
        if (!createError && newProfile) {
          console.log('Profile created successfully:', newProfile);
          return newProfile;
        }
        
        if (createError && attempt === 3) {
          console.error('Failed to create profile after 3 attempts:', createError);
        } else if (createError) {
          console.warn(`Profile creation attempt ${attempt} failed:`, createError);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (retryError) {
        console.error(`Profile creation retry ${attempt} error:`, retryError);
        if (attempt === 3) break;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    // Return default profile if creation fails
    return {
      id: userId,
      role: role || 'student',
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || ''
    };
  } catch (error) {
    console.error('Error ensuring profile exists:', error);
    // Return default profile on error
    return {
      id: userId,
      role: role || 'student',
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || ''
    };
  }
};

export const withAuthRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (
        error.status === 400 ||
        error.status === 401 ||
        error.status === 403 ||
        error.message?.includes('invalid login credentials') ||
        error.message?.includes('user already registered') ||
        isOAuthError(error) // Don't retry OAuth errors
      ) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delay = getRateLimitDelay(attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

export const shouldSuggestOAuth = (error: any): boolean => {
  return isRateLimitError(error) || isSMTPError(error) || isNetworkError(error);
};

export const generateOAuthState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getOAuthRedirectUrl = (isMobile: boolean = false): string => {
  const baseUrl = window.location.origin;
  return isMobile ? `${baseUrl}/mobile/auth/callback` : `${baseUrl}/auth/callback`;
};

export const logAuthEvent = async (
  eventType: string,
  provider?: string,
  success: boolean = true,
  errorCode?: string,
  errorMessage?: string
) => {
  try {
    await supabase.rpc('log_auth_event', {
      event_type: eventType,
      provider,
      success,
      error_code: errorCode,
      error_message: errorMessage
    });
  } catch (error) {
    console.warn('Failed to log auth event:', error);
  }
};
