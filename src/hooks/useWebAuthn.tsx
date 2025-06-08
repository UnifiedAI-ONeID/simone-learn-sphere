
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseWebAuthnReturn {
  isSupported: boolean;
  isLoading: boolean;
  error: string | null;
  register: (email: string) => Promise<boolean>;
  authenticate: (email: string) => Promise<boolean>;
}

export const useWebAuthn = (): UseWebAuthnReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof window !== 'undefined' && 
    'navigator' in window && 
    'credentials' in navigator &&
    typeof PublicKeyCredential !== 'undefined';

  const register = useCallback(async (email: string): Promise<boolean> => {
    if (!isSupported) {
      setError('WebAuthn is not supported on this device');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User must be logged in to register a passkey');
        return false;
      }

      // Get registration challenge from edge function
      const { data: challengeData, error: challengeError } = await supabase.functions.invoke(
        'webauthn-register-challenge',
        {
          body: { userId: user.id, email }
        }
      );

      if (challengeError || !challengeData?.success) {
        throw new Error(challengeError?.message || 'Failed to get registration challenge');
      }

      const options = challengeData.options;

      // Convert challenge from base64 to ArrayBuffer
      const challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
      
      // Convert user ID to ArrayBuffer
      const userId = new TextEncoder().encode(user.id);

      // Create credential options
      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: options.rp,
          user: {
            ...options.user,
            id: userId,
          },
          pubKeyCredParams: options.pubKeyCredParams,
          authenticatorSelection: options.authenticatorSelection,
          timeout: options.timeout,
          attestation: options.attestation as AttestationConveyancePreference,
        },
      };

      const credential = await navigator.credentials.create(credentialCreationOptions) as PublicKeyCredential;
      
      if (credential && credential.response) {
        const response = credential.response as AuthenticatorAttestationResponse;
        
        // Get the public key from the attestation response
        const publicKeyBuffer = response.getPublicKey();
        if (!publicKeyBuffer) {
          setError('Failed to get public key from credential');
          return false;
        }

        // Convert ArrayBuffer to base64 string for storage
        const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));
        
        // Store credential info in the webauthn_credentials table
        const { error: insertError } = await supabase
          .from('webauthn_credentials')
          .insert({
            user_id: user.id,
            credential_id: credential.id,
            public_key: publicKeyBase64,
            device_type: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
            device_name: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop',
          });

        if (insertError) {
          console.error('Failed to save passkey:', insertError);
          setError('Failed to save passkey');
          return false;
        }

        // Update user profile to indicate passkey is enabled
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            passkey_enabled: true,
            two_factor_setup_completed: true 
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Failed to update profile:', profileError);
        }

        // Update security level
        await supabase.rpc('update_user_security_level', { user_id: user.id });

        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error('Passkey registration error:', err);
      setError(err.message || 'Failed to register passkey');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const authenticate = useCallback(async (email: string): Promise<boolean> => {
    if (!isSupported) {
      setError('WebAuthn is not supported on this device');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get authentication challenge from edge function
      const { data: challengeData, error: challengeError } = await supabase.functions.invoke(
        'webauthn-auth-challenge',
        {
          body: { email }
        }
      );

      if (challengeError || !challengeData?.success) {
        throw new Error(challengeError?.message || 'Failed to get authentication challenge');
      }

      const options = challengeData.options;

      // Convert challenge from base64 to ArrayBuffer
      const challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
      
      // Convert credential IDs from strings to ArrayBuffers
      const allowCredentials = options.allowCredentials.map((cred: any) => ({
        ...cred,
        id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0)),
      }));

      const credentialRequestOptions: CredentialRequestOptions = {
        publicKey: {
          challenge,
          allowCredentials,
          userVerification: options.userVerification as UserVerificationRequirement,
          timeout: options.timeout,
        },
      };

      const assertion = await navigator.credentials.get(credentialRequestOptions) as PublicKeyCredential;
      
      if (assertion) {
        // Update last used timestamp for the credential
        const credentialId = btoa(String.fromCharCode(...new Uint8Array(assertion.rawId)));
        
        await supabase
          .from('webauthn_credentials')
          .update({ last_used_at: new Date().toISOString() })
          .eq('credential_id', credentialId);

        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error('Passkey authentication error:', err);
      setError(err.message || 'Authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isLoading,
    error,
    register,
    authenticate,
  };
};
