
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, ensureProfileExists } from '@/utils/authUtils';

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
    if (!user) return;

    try {
      console.log('AuthProvider: Refreshing profile for user:', user.id);
      await ensureProfileExists(user.id, user, user.user_metadata?.role);
    } catch (error) {
      console.error('AuthProvider: Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Clean up any stale auth state first
        cleanupAuthState();

        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        }

        if (mounted) {
          console.log('AuthProvider: Initial session:', initialSession ? 'exists' : 'none');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            // Defer profile creation to avoid blocking
            setTimeout(() => {
              if (mounted) {
                ensureProfileExists(
                  initialSession.user.id, 
                  initialSession.user, 
                  initialSession.user.user_metadata?.role
                ).catch(console.error);
              }
            }, 100);
          }
        }
      } catch (error) {
        console.error('AuthProvider: Error in initializeAuth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log('AuthProvider: Auth state changed:', event, newSession ? 'session exists' : 'no session');
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle profile creation on sign in
        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log('AuthProvider: User signed in, ensuring profile exists');
          // Defer to prevent potential deadlocks
          setTimeout(() => {
            if (mounted) {
              ensureProfileExists(
                newSession.user.id, 
                newSession.user, 
                newSession.user.user_metadata?.role
              ).catch(console.error);
            }
          }, 100);
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
      console.log('AuthProvider: Starting sign out process');
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      
      // Force redirect to landing page
      window.location.href = '/';
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
