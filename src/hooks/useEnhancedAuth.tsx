
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { getMobileRoleBasedRoute } from '@/utils/mobileRouting';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { handleAuthError, cleanupAuthState, validatePasswordStrength } from '@/utils/authUtils';
import toast from 'react-hot-toast';

export const useEnhancedAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const storeRoleForAuth = useCallback((role: string) => {
    console.log('Storing role for authentication:', role);
    localStorage.setItem('pendingUserRole', role);
  }, []);

  const getRedirectUrl = useCallback(() => {
    return isMobile 
      ? `${window.location.origin}/mobile/auth/callback`
      : `${window.location.origin}/auth/callback`;
  }, [isMobile]);

  const navigateBasedOnRole = useCallback((role: string) => {
    const redirectRoute = isMobile 
      ? getMobileRoleBasedRoute(role as any, true)
      : getRoleBasedRoute(role, true);
    
    console.log('Navigating to:', redirectRoute);
    navigate(redirectRoute, { replace: true });
  }, [isMobile, navigate]);

  const signUpWithEmail = useCallback(async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    selectedRole: string
  ) => {
    if (!selectedRole) {
      setError('Please select a role before continuing');
      return { success: false, error: 'Role selection required' };
    }

    setIsLoading(true);
    setError('');

    try {
      cleanupAuthState();

      // Validate password
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        setError('Password does not meet requirements');
        return { success: false, error: 'Invalid password' };
      }

      // Store role before signup
      storeRoleForAuth(selectedRole);

      const redirectUrl = getRedirectUrl();
      console.log('Starting email signup with role:', selectedRole);

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

      if (data.user && !data.session) {
        toast.success('Check your email for the confirmation link!');
        setError('Please check your email and click the confirmation link to complete registration.');
        return { success: true, requiresEmailConfirmation: true };
      } else if (data.session) {
        console.log('Immediate signup success');
        toast.success(`Account created successfully! Welcome, ${selectedRole}!`);
        navigateBasedOnRole(selectedRole);
        return { success: true };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [storeRoleForAuth, getRedirectUrl, navigateBasedOnRole]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      cleanupAuthState();
      console.log('Starting email sign in');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('Sign in successful');
        toast.success('Welcome back!');
        // Navigation will be handled by auth context
        return { success: true };
      }

      return { success: false, error: 'Unknown error' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = handleAuthError(error);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'linkedin_oidc', selectedRole?: string) => {
    setIsLoading(true);
    setError('');

    try {
      cleanupAuthState();
      
      if (selectedRole) {
        storeRoleForAuth(selectedRole);
        console.log('Starting OAuth with role:', selectedRole);
      }

      const redirectUrl = getRedirectUrl();
      console.log('Starting OAuth with redirect:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('OAuth error:', error);
      const errorMessage = handleAuthError(error, provider === 'google' ? 'Google' : 'LinkedIn');
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [storeRoleForAuth, getRedirectUrl]);

  return {
    isLoading,
    error,
    setError,
    signUpWithEmail,
    signInWithEmail,
    signInWithOAuth,
    storeRoleForAuth
  };
};
