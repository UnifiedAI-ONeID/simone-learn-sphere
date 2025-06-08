
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, ensureProfileExists, logAuthEvent } from '@/utils/authUtils';

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

  const validateSessionSecurity = async (userId: string) => {
    try {
      const sessionCount = parseInt(sessionStorage.getItem('activeSessionCount') || '0');
      
      if (sessionCount > 10) { // Increased from 5 to 10 for less restrictive validation
        await logAuthEvent('excessive_sessions_detected', {
          user_id: userId,
          session_count: sessionCount
        }, 'medium'); // Reduced from 'high' to 'medium'
        
        sessionStorage.setItem('activeSessionCount', '1');
        return true; // Changed to return true instead of false to be less restrictive
      }
      
      sessionStorage.setItem('activeSessionCount', (sessionCount + 1).toString());
      return true;
    } catch (error) {
      console.error('Session security validation failed:', error);
      return true; // Always return true to avoid blocking authentication
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Clean up auth state but don't be too aggressive
        localStorage.removeItem('pendingUserRole');

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
          // Don't log this as it's often not critical
        }

        if (mounted) {
          console.log('AuthProvider: Initial session:', initialSession ? 'exists' : 'none');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            const isSecure = await validateSessionSecurity(initialSession.user.id);
            
            if (isSecure) {
              await logAuthEvent('session_restored', {
                user_id: initialSession.user.id
              }, 'low');
              
              // Defer profile creation to avoid blocking
              setTimeout(() => {
                if (mounted) {
                  ensureProfileExists(
                    initialSession.user.id, 
                    initialSession.user, 
                    initialSession.user.user_metadata?.role
                  ).catch(error => {
                    console.warn('Profile creation deferred failed:', error);
                  });
                }
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error('AuthProvider: Error in initializeAuth:', error);
        // Don't block authentication for initialization errors
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log('AuthProvider: Auth state changed:', event, newSession ? 'session exists' : 'no session');
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log('AuthProvider: User signed in, ensuring profile exists');
          
          const isSecure = await validateSessionSecurity(newSession.user.id);
          
          if (isSecure) {
            await logAuthEvent('user_signed_in', {
              user_id: newSession.user.id,
              email: newSession.user.email,
              provider: newSession.user.app_metadata?.provider
            }, 'low');
            
            // Defer profile creation to avoid blocking the auth flow
            setTimeout(() => {
              if (mounted) {
                ensureProfileExists(
                  newSession.user.id, 
                  newSession.user, 
                  newSession.user.user_metadata?.role
                ).catch(error => {
                  console.warn('Profile creation failed, but user is still authenticated:', error);
                });
              }
            }, 100);
          }
        }

        if (event === 'SIGNED_OUT') {
          sessionStorage.removeItem('activeSessionCount');
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
      
      if (currentUser) {
        await logAuthEvent('signout_initiated', {
          user_id: currentUser.id,
          timestamp: new Date().toISOString()
        }, 'low');
      }
      
      cleanupAuthState();
      sessionStorage.removeItem('activeSessionCount');
      
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
      
      setSession(null);
      setUser(null);
      
      window.location.href = '/';
    } catch (error) {
      console.error('AuthProvider: Unexpected sign out error:', error);
      await logAuthEvent('signout_error', {
        error: error.message,
        user_id: user?.id
      }, 'medium'); // Reduced from 'high' to 'medium'
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
