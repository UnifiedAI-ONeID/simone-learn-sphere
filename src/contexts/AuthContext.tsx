
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { secureSignOut, cleanupAuthState, ensureProfileExists } from '@/utils/authCleanup';

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
      await ensureProfileExists(supabase, user);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Handle profile creation/validation on sign in
        if (event === 'SIGNED_IN' && session?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            if (mounted) {
              try {
                await ensureProfileExists(supabase, session.user);
              } catch (error) {
                console.error('Error ensuring profile exists:', error);
              }
            }
          }, 100);
        }

        // Clear any stale data on sign out
        if (event === 'SIGNED_OUT') {
          cleanupAuthState();
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          cleanupAuthState();
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Ensure profile exists for existing session
          if (session?.user) {
            try {
              await ensureProfileExists(supabase, session.user);
            } catch (error) {
              console.error('Error ensuring profile exists on init:', error);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await secureSignOut(supabase);
    } catch (error) {
      console.error('Error signing out:', error);
      // Force cleanup and redirect even if sign out fails
      cleanupAuthState();
      window.location.href = '/auth';
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
