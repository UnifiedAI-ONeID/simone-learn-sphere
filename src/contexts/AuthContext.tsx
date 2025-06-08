
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const createUserProfile = async (user: User, selectedRole?: string) => {
  try {
    const role = selectedRole || user.user_metadata?.role || 'student';
    
    const firstName = user.user_metadata?.first_name || 
                      user.user_metadata?.full_name?.split(' ')[0] || 
                      user.email?.split('@')[0] || 'User';
    const lastName = user.user_metadata?.last_name || 
                     user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';

    const profileData = {
      id: user.id,
      email: user.email || '',
      first_name: firstName,
      last_name: lastName,
      role: role
    };
    
    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error('Error creating profile:', error);
    } else {
      console.log('Profile created/updated successfully:', role);
    }
    
    return role;
  } catch (error) {
    console.error('Failed to create profile:', error);
    return selectedRole || user.user_metadata?.role || 'student';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      await createUserProfile(user, user.user_metadata?.role);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          // Create profile immediately if user exists
          if (initialSession?.user) {
            const pendingRole = localStorage.getItem('pendingUserRole');
            await createUserProfile(initialSession.user, pendingRole || undefined);
            if (pendingRole) {
              localStorage.removeItem('pendingUserRole');
            }
          }
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log('User signed in, creating profile');
          
          // Create profile immediately on sign in
          const pendingRole = localStorage.getItem('pendingUserRole');
          await createUserProfile(newSession.user, pendingRole || undefined);
          if (pendingRole) {
            localStorage.removeItem('pendingUserRole');
          }
        }

        if (mounted && !loading) {
          setLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Starting sign out process');
      setLoading(true);
      
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Sign out error:', error);
      }
      
      setSession(null);
      setUser(null);
      
      window.location.href = '/';
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
