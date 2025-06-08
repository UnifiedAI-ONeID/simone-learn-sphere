
import { supabase } from '@/integrations/supabase/client';

export const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  
  // Remove auth tokens
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('pendingUserRole');
  
  // Remove all Supabase auth keys
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear from sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const handleAuthError = (error: any, provider?: string) => {
  console.error('Auth error:', error);
  
  let errorMessage = 'Authentication failed. Please try again.';
  
  if (error.message?.includes('Provider not enabled')) {
    errorMessage = `${provider || 'OAuth'} authentication is not configured.`;
  } else if (error.message?.includes('Email not confirmed')) {
    errorMessage = 'Please check your email and confirm your account before signing in.';
  } else if (error.message?.includes('Invalid login credentials')) {
    errorMessage = 'Invalid email or password. Please try again.';
  } else if (error.message?.includes('User already registered')) {
    errorMessage = 'An account with this email already exists. Please sign in instead.';
  } else if (error.message?.includes('Password should be at least')) {
    errorMessage = 'Password must be at least 6 characters long.';
  }
  
  return errorMessage;
};

export const validatePasswordStrength = (password: string) => {
  const errors: string[] = [];
  const isValid = password.length >= 8;
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  return { isValid, errors };
};

export const ensureProfileExists = async (userId: string, userData: any, selectedRole?: string) => {
  try {
    console.log('Ensuring profile exists for user:', userId);
    
    const roleToAssign = selectedRole || userData.user_metadata?.role || 'student';
    
    const email = userData.email || '';
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
    
    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error('Error creating/updating profile:', error);
    }
    
    console.log('Profile created/updated successfully with role:', roleToAssign);
    return roleToAssign;
  } catch (error) {
    console.error('Failed to ensure profile exists:', error);
    return selectedRole || userData.user_metadata?.role || 'student';
  }
};
