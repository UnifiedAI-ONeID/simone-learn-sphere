
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { getUnifiedRoleRoute } from '@/utils/unifiedRoleRouting';
import {
  getConsolidatedAuthErrorMessage,
  logAuthEvent,
  withAuthRetry,
  validatePasswordStrength,
  cleanupAuthState,
  shouldSuggestOAuth,
  getOAuthRedirectUrl,
  generateOAuthState,
  ensureProfileExists,
  AuthResult
} from '@/utils/consolidatedAuthUtils';
import toast from 'react-hot-toast';

export const useEnhancedAuthentication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authState, setAuthState] = useState({
    showEmailVerification: false,
    show2FASetup: false,
    pendingVerificationEmail: '',
    suggestOAuth: false,
    retryCount: 0
  });
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const getRedirectUrl = useCallback(() => {
    return getOAuthRedirectUrl(isMobile);
  }, [isMobile]);

  const navigateBasedOnRole = useCallback((role: string) => {
    const redirectRoute = getUnifiedRoleRoute(role, true, isMobile);
    console.log('Navigating to:', redirectRoute);
    navigate(redirectRoute, { replace: true });
  }, [isMobile, navigate]);

  const storeRoleForAuth = useCallback((role: string) => {
    console.log('Storing role for authentication:', role);
    localStorage.setItem('pendingUserRole', role);
  }, []);

  const handleAuthError = useCallback((error: any, operation: string) => {
    const errorMessage = getConsolidatedAuthErrorMessage(error);
    setError(errorMessage);
    
    // Log authentication failure
    logAuthEvent(operation, undefined, false, error.code, error.message);
    
    // Suggest OAuth if appropriate
    if (shouldSuggestOAuth(error)) {
      setAuthState(prev => ({ ...prev, suggestOAuth: true }));
      toast.error('Email authentication unavailable. Try Google or LinkedIn sign-in!');
    } else {
      toast.error(errorMessage);
    }
    
    return { success: false, error: errorMessage };
  }, []);

  const signUpWithEmail = useCallback(async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    selectedRole: string
  ): Promise<AuthResult> => {
    if (!selectedRole) {
      setError('Please select a role before continuing');
      return { success: false, error: 'Role selection required' };
    }

    setIsLoading(true);
    setError('');
    setAuthState(prev => ({ ...prev, suggestOAuth: false }));

    try {
      cleanupAuthState();

      // Validate password
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        setError('Password does not meet security requirements');
        return { success: false, error: 'Invalid password' };
      }

      // Store role before signup
      storeRoleForAuth(selectedRole);

      const redirectUrl = getRedirectUrl();
      console.log('Starting email signup with role:', selectedRole);

      const signupOperation = async () => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              first_name: firstName,
              last_name: lastName,
              role: selectedRole
            }
          }
        });

        if (error) throw error;
        return data;
      };

      const data = await withAuthRetry(signupOperation, 3);

      // Log successful signup attempt
      await logAuthEvent('signup_attempt', 'email', true);

      if (data.user && !data.session) {
        // Email confirmation required
        setAuthState(prev => ({ 
          ...prev, 
          showEmailVerification: true,
          pendingVerificationEmail: email 
        }));
        toast.success('Please check your email and verify your account!');
        return { success: true, requiresEmailVerification: true };
      } else if (data.session) {
        console.log('Immediate signup success');
        
        // Ensure profile exists with proper error handling
        await ensureProfileExists(data.user.id, data.user, selectedRole);
        
        toast.success(`Account created successfully! Welcome, ${selectedRole}!`);
        navigateBasedOnRole(selectedRole);
        return { success: true };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return handleAuthError(error, 'signup_failed');
    } finally {
      setIsLoading(false);
    }
  }, [storeRoleForAuth, getRedirectUrl, navigateBasedOnRole, handleAuthError]);

  const signInWithEmail = useCallback(async (
    email: string, 
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    setError('');
    setAuthState(prev => ({ ...prev, suggestOAuth: false }));

    try {
      cleanupAuthState();
      console.log('Starting email sign in');

      const signinOperation = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        return data;
      };

      const data = await withAuthRetry(signinOperation, 3);

      if (data.user) {
        // Log successful signin
        await logAuthEvent('signin_attempt', 'email', true);
        
        console.log('Sign in successful');
        toast.success('Welcome back!');
        return { success: true };
      }

      return { success: false, error: 'Unknown error' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return handleAuthError(error, 'signin_failed');
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  const signInWithOAuth = useCallback(async (
    provider: 'google' | 'linkedin_oidc', 
    selectedRole?: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    setError('');

    try {
      cleanupAuthState();
      
      if (selectedRole) {
        storeRoleForAuth(selectedRole);
        console.log('Starting OAuth with role:', selectedRole);
      }

      // Generate and store OAuth state for CSRF protection
      const oauthState = generateOAuthState();
      localStorage.setItem('oauth_state', oauthState);
      localStorage.setItem('oauth_provider', provider);

      const redirectUrl = getRedirectUrl();
      console.log('Starting OAuth with redirect:', redirectUrl);

      // Don't use retry for OAuth as it can cause popup issues
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            state: oauthState
          }
        }
      });

      if (error) throw error;
      
      // Log OAuth attempt
      await logAuthEvent('oauth_attempt', provider, true);
      
      // Don't set loading to false here as the redirect will happen
      return { success: true };
    } catch (error: any) {
      console.error('OAuth error:', error);
      const errorMessage = getConsolidatedAuthErrorMessage(error);
      setError(errorMessage);
      
      await logAuthEvent('oauth_failed', provider, false, error.code, error.message);
      
      toast.error(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [storeRoleForAuth, getRedirectUrl]);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;

      await logAuthEvent('password_reset_request', 'email', true);
      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error: any) {
      return handleAuthError(error, 'password_reset_failed');
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  const clearError = useCallback(() => {
    setError('');
    setAuthState(prev => ({ ...prev, suggestOAuth: false }));
  }, []);

  const retryAuthentication = useCallback(() => {
    setAuthState(prev => ({ 
      ...prev, 
      retryCount: prev.retryCount + 1,
      suggestOAuth: false 
    }));
    clearError();
  }, [clearError]);

  return {
    isLoading,
    error,
    authState,
    signUpWithEmail,
    signInWithEmail,
    signInWithOAuth,
    resetPassword,
    clearError,
    retryAuthentication,
    storeRoleForAuth
  };
};
