
export const cleanupAuthState = () => {
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
  
  // Clear any cached user data
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_profile');
};

export const secureSignOut = async (supabase: any) => {
  try {
    // Attempt global sign out
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clean up auth state after successful sign out
    cleanupAuthState();
    
    // Redirect to auth page
    window.location.href = '/auth';
  } catch (error) {
    console.error('Sign out error:', error);
    // Even if sign out fails, clean up and redirect
    cleanupAuthState();
    window.location.href = '/auth';
  }
};

export const ensureProfileExists = async (supabase: any, user: any) => {
  if (!user) return null;
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (existingProfile && !fetchError) {
      return existingProfile;
    }
    
    // If profile doesn't exist, create it
    const profileData = {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      role: user.user_metadata?.role || 'student'
    };
    
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    
    if (createError) {
      console.error('Failed to create profile:', createError);
      // Return a default profile structure
      return {
        id: user.id,
        role: 'student',
        email: user.email,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || ''
      };
    }
    
    return newProfile;
  } catch (error) {
    console.error('Error ensuring profile exists:', error);
    // Return default profile on error
    return {
      id: user.id,
      role: 'student',
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || ''
    };
  }
};
