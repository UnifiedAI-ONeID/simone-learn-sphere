
interface AuthError {
  message: string;
  code?: string;
}

interface AppError {
  message: string;
  code?: string;
  context?: string;
  retryable?: boolean;
}

export const getAuthErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';

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

  return 'Unable to complete the request. Please try again later.';
};

export const getAppErrorMessage = (error: any, context?: string): AppError => {
  if (!error) return { message: 'An unexpected error occurred', retryable: true };

  const errorMessage = error.message?.toLowerCase() || '';
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
    return {
      message: 'Network connection issue. Please check your internet and try again.',
      code: 'NETWORK_ERROR',
      context,
      retryable: true
    };
  }

  // Database errors
  if (errorMessage.includes('relation') || errorMessage.includes('column') || errorMessage.includes('table')) {
    return {
      message: 'Database error. Our team has been notified.',
      code: 'DATABASE_ERROR',
      context,
      retryable: false
    };
  }

  // Translation errors
  if (context === 'translation') {
    return {
      message: 'Translation service temporarily unavailable.',
      code: 'TRANSLATION_ERROR',
      context,
      retryable: true
    };
  }

  // Dashboard data errors
  if (context === 'dashboard') {
    return {
      message: 'Unable to load dashboard data. Please refresh the page.',
      code: 'DASHBOARD_ERROR',
      context,
      retryable: true
    };
  }

  // Generic error
  return {
    message: 'Something went wrong. Please try again.',
    code: 'GENERIC_ERROR',
    context,
    retryable: true
  };
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>\"']/g, '')
    .substring(0, 1000);
};

export const logError = (error: any, context?: string, additionalData?: any) => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    additionalData
  };

  console.error('Application Error:', errorInfo);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error tracking service (Sentry, etc.)
  }
};

export const withRetry = async <T>(
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
        error.status === 400 ||
        error.status === 401 ||
        error.status === 403 ||
        error.message?.includes('invalid login credentials')
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
