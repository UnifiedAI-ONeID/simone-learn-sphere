
import { supabase } from '@/integrations/supabase/client';

export const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('pendingUserRole');
  
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

  // Clear security tracking
  sessionStorage.removeItem('securityRequestCount');
  sessionStorage.removeItem('lastSecurityCheck');
};

export const handleAuthError = (error: any, provider?: string) => {
  console.error('Auth error:', error);
  
  let errorMessage = 'Authentication failed. Please try again.';
  
  if (error.message?.includes('Provider not enabled')) {
    errorMessage = `${provider || 'OAuth'} authentication is not configured. Please contact support.`;
  } else if (error.message?.includes('Invalid redirect URL')) {
    errorMessage = 'OAuth configuration error. The redirect URL may not be properly configured.';
  } else if (error.message?.includes('unauthorized_client')) {
    errorMessage = `${provider || 'OAuth'} client is not properly configured.`;
  } else if (error.message?.includes('Email not confirmed')) {
    errorMessage = 'Please check your email and confirm your account before signing in.';
  } else if (error.message?.includes('Invalid login credentials')) {
    errorMessage = 'Invalid email or password. Please try again.';
  } else if (error.message?.includes('User already registered')) {
    errorMessage = 'An account with this email already exists. Please sign in instead.';
  } else if (error.message?.includes('rate limit')) {
    errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
  } else if (error.message?.includes('Password should be at least')) {
    errorMessage = 'Password must be at least 8 characters long.';
  }
  
  return errorMessage;
};

export const ensureProfileExists = async (userId: string, userData: any, selectedRole?: string) => {
  try {
    console.log('Ensuring profile exists for user:', userId);
    
    const roleToAssign = selectedRole || userData.user_metadata?.role || 'student';
    
    // Basic email validation - just check if it's a reasonable email format
    const email = userData.email || '';
    if (!email || !email.includes('@')) {
      console.warn('Invalid email format, but continuing with profile creation');
    }

    // Extract names with fallbacks
    const firstName = userData.user_metadata?.first_name || 
                      userData.user_metadata?.full_name?.split(' ')[0] || 
                      userData.email?.split('@')[0] || 'User';
    const lastName = userData.user_metadata?.last_name || 
                     userData.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';

    const profileData = {
      id: userId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: roleToAssign
    };
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single();
    
    if (existingProfile && !fetchError) {
      console.log('Profile already exists:', existingProfile);
      return existingProfile.role;
    }
    
    // Use upsert to handle both creation and updates
    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error('Error creating/updating profile:', error);
      // Don't throw error, just return default role
      return roleToAssign;
    }
    
    // Log successful profile creation - but don't fail if logging fails
    try {
      await supabase.rpc('log_security_event', {
        event_type: 'profile_created',
        event_details: {
          user_id: userId,
          role: roleToAssign,
          email_domain: email.split('@')[1] || 'unknown'
        },
        ip_address: null,
        user_agent: navigator.userAgent
      });
    } catch (logError) {
      console.warn('Failed to log security event, but continuing:', logError);
    }
    
    console.log('Profile created/updated successfully with role:', roleToAssign);
    return roleToAssign;
  } catch (error) {
    console.error('Failed to ensure profile exists:', error);
    
    // Log security event for profile creation failure - but don't fail if this fails
    try {
      await supabase.rpc('log_security_event', {
        event_type: 'profile_creation_failed',
        event_details: {
          user_id: userId,
          error: error.message,
          email: userData.email
        },
        ip_address: null,
        user_agent: navigator.userAgent
      });
    } catch (logError) {
      console.warn('Failed to log security event:', logError);
    }
    
    // Return default role instead of throwing
    return selectedRole || userData.user_metadata?.role || 'student';
  }
};

export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeUserInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Basic HTML sanitization - remove script tags and dangerous content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const logAuthEvent = async (eventType: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'low') => {
  try {
    await supabase.rpc('log_security_event', {
      event_type: eventType,
      event_details: details,
      ip_address: null,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.warn('Failed to log auth event (non-critical):', error);
  }
};
