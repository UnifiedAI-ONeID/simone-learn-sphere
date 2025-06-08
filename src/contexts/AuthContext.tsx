
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, ensureProfileExists, logAuthEvent } from '@/utils/authUtils';
import { generateSessionFingerprint } from '@/utils/enhancedSecurityHeaders';

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
      await logAuthEvent('profile_refresh_failed', {
        user_id: user.id,
        error: error.message
      }, 'medium');
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
          await logAuthEvent('session_initialization_failed', {
            error: error.message
          }, 'medium');
        }

        if (mounted) {
          console.log('AuthProvider: Initial session:', initialSession ? 'exists' : 'none');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            // Log successful session restoration
            await logAuthEvent('session_restored', {
              user_id: initialSession.user.id,
              session_fingerprint: generateSessionFingerprint().slice(0, 8)
            }, 'low');
            
            // Check session limits
            const { data: canProceed } = await supabase.rpc('check_session_limits', {
              check_user_id: initialSession.user.id
            });
            
            if (!canProceed) {
              console.warn('Session limit exceeded, signing out');
              await supabase.auth.signOut();
              return;
            }
            
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
        await logAuthEvent('auth_initialization_failed', {
          error: error.message
        }, 'high');
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

        // Enhanced logging for auth events
        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log('AuthProvider: User signed in, ensuring profile exists');
          
          await logAuthEvent('user_signed_in', {
            user_id: newSession.user.id,
            email: newSession.user.email,
            provider: newSession.user.app_metadata?.provider,
            session_fingerprint: generateSessionFingerprint().slice(0, 8)
          }, 'low');
          
          // Check session limits
          const { data: canProceed } = await supabase.rpc('check_session_limits', {
            check_user_id: newSession.user.id
          });
          
          if (!canProceed) {
            console.warn('Session limit exceeded during sign in');
            await supabase.auth.signOut();
            return;
          }
          
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

        if (event === 'SIGNED_OUT') {
          await logAuthEvent('user_signed_out', {
            timestamp: new Date().toISOString()
          }, 'low');
        }

        if (event === 'TOKEN_REFRESHED' && newSession?.user) {
          await logAuthEvent('token_refreshed', {
            user_id: newSession.user.id,
            timestamp: new Date().toISOString()
          }, 'low');
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
      
      const currentUser = user;
      
      // Log sign out attempt
      if (currentUser) {
        await logAuthEvent('signout_initiated', {
          user_id: currentUser.id,
          timestamp: new Date().toISOString()
        }, 'low');
      }
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
        await logAuthEvent('signout_failed', {
          error: error.message,
          user_id: currentUser?.id
        }, 'medium');
      } else {
        await logAuthEvent('signout_completed', {
          user_id: currentUser?.id,
          timestamp: new Date().toISOString()
        }, 'low');
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      
      // Force redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('AuthProvider: Unexpected sign out error:', error);
      await logAuthEvent('signout_error', {
        error: error.message,
        user_id: user?.id
      }, 'high');
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
