
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
    errorMessage = 'Password must be at least 6 characters long.';
  }
  
  return errorMessage;
};

export const ensureProfileExists = async (userId: string, userData: any, selectedRole?: string) => {
  try {
    console.log('Ensuring profile exists for user:', userId);
    
    const roleToAssign = selectedRole || userData.user_metadata?.role || 'student';
    
    const profileData = {
      id: userId,
      email: userData.email,
      first_name: userData.user_metadata?.first_name || 
                  userData.user_metadata?.full_name?.split(' ')[0] || '',
      last_name: userData.user_metadata?.last_name || 
                 userData.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
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
      throw error;
    }
    
    console.log('Profile created/updated successfully with role:', roleToAssign);
    return roleToAssign;
  } catch (error) {
    console.error('Failed to ensure profile exists:', error);
    throw error;
  }
};
