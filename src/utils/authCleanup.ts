
export const cleanupAuthState = () => {
  // Remove auth tokens from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if available
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
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
      console.log('Profile exists:', existingProfile);
      return existingProfile;
    }
    
    // If profile doesn't exist, create it
    console.log('Creating new profile for user:', user.id);
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
    
    console.log('Profile created successfully:', newProfile);
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
