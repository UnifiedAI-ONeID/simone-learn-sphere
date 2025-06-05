
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { getClientIP, sanitizeUserAgent } from '@/utils/securityUtils';

interface TwoFactorState {
  isEnabled: boolean;
  isVerifying: boolean;
  isLoading: boolean;
  pendingEmail?: string;
}

export const useEmailTwoFactor = () => {
  const [state, setState] = useState<TwoFactorState>({
    isEnabled: false,
    isVerifying: false,
    isLoading: false,
  });
  const { toast } = useToast();
  const { logSecurityEvent } = useSecurityAudit();

  const enableTwoFactor = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Send verification code to email
      const { error } = await supabase.functions.invoke('send-2fa-code', {
        body: { 
          email,
          action: 'enable_2fa'
        }
      });

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isVerifying: true,
        pendingEmail: email 
      }));

      const clientIP = await getClientIP();
      await logSecurityEvent('2fa_enable_requested', {
        email,
        timestamp: new Date().toISOString()
      }, clientIP, sanitizeUserAgent(navigator.userAgent));

      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the 6-digit verification code.",
      });

      return { success: true };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Failed to send code",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const verifyAndEnable = async (code: string) => {
    if (!state.pendingEmail) return { success: false, error: "No pending verification" };

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('verify-2fa-code', {
        body: {
          email: state.pendingEmail,
          code,
          action: 'enable_2fa'
        }
      });

      if (error) throw error;
      if (!data?.valid) throw new Error('Invalid verification code');

      // Store 2FA preference in user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { two_factor_enabled: true }
      });

      if (updateError) throw updateError;

      setState({
        isEnabled: true,
        isVerifying: false,
        isLoading: false,
      });

      const clientIP = await getClientIP();
      await logSecurityEvent('2fa_enabled', {
        email: state.pendingEmail,
        timestamp: new Date().toISOString()
      }, clientIP, sanitizeUserAgent(navigator.userAgent));

      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account.",
      });

      return { success: true };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const requestLoginCode = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { error } = await supabase.functions.invoke('send-2fa-code', {
        body: {
          email,
          action: 'login_verification'
        }
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        isLoading: false,
        isVerifying: true,
        pendingEmail: email
      }));

      const clientIP = await getClientIP();
      await logSecurityEvent('2fa_login_code_requested', {
        email,
        timestamp: new Date().toISOString()
      }, clientIP, sanitizeUserAgent(navigator.userAgent));

      toast({
        title: "Verification Code Sent",
        description: "Please check your email for your login verification code.",
      });

      return { success: true };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Failed to send code",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const verifyLoginCode = async (code: string) => {
    if (!state.pendingEmail) return { success: false, error: "No pending verification" };

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('verify-2fa-code', {
        body: {
          email: state.pendingEmail,
          code,
          action: 'login_verification'
        }
      });

      if (error) throw error;
      if (!data?.valid) throw new Error('Invalid verification code');

      setState(prev => ({
        ...prev,
        isLoading: false,
        isVerifying: false,
      }));

      const clientIP = await getClientIP();
      await logSecurityEvent('2fa_login_verified', {
        email: state.pendingEmail,
        timestamp: new Date().toISOString()
      }, clientIP, sanitizeUserAgent(navigator.userAgent));

      return { success: true, sessionToken: data.sessionToken };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const disableTwoFactor = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { error } = await supabase.auth.updateUser({
        data: { two_factor_enabled: false }
      });

      if (error) throw error;

      setState({
        isEnabled: false,
        isVerifying: false,
        isLoading: false,
      });

      const clientIP = await getClientIP();
      await logSecurityEvent('2fa_disabled', {
        timestamp: new Date().toISOString()
      }, clientIP, sanitizeUserAgent(navigator.userAgent));

      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account.",
      });

      return { success: true };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Failed to disable 2FA",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  return {
    state,
    enableTwoFactor,
    verifyAndEnable,
    requestLoginCode,
    verifyLoginCode,
    disableTwoFactor,
  };
};
