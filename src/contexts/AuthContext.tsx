
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          console.log('Creating profile for user:', user.id);
          const profileData = {
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            role: user.user_metadata?.role || 'student'
          };
          
          await supabase.from('profiles').insert(profileData);
          console.log('Profile created successfully');
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        } else {
          console.log('AuthProvider: Initial session:', session ? 'exists' : 'none');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Defer profile creation to avoid blocking
            setTimeout(() => refreshProfile(), 100);
          }
        }
      } catch (error) {
        console.error('AuthProvider: Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, session ? 'session exists' : 'no session');
        
        setSession(session);
        setUser(session?.user ?? null);

        // Handle profile creation on sign in
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AuthProvider: User signed in, ensuring profile exists');
          setTimeout(() => refreshProfile(), 100);
        }

        setLoading(false);
      }
    );

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('AuthProvider: Signing out');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      }
      
      // Clear state
      setSession(null);
      setUser(null);
      
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('AuthProvider: Unexpected sign out error:', error);
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
