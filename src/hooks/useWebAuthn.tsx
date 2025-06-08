
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

      // Generate challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Create credential options
      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'SimoneLabs',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(user.id),
            name: email,
            displayName: email,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'preferred',
          },
          timeout: 60000,
          attestation: 'direct',
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
        
        // Store credential info in Supabase
        const { error } = await supabase
          .from('user_passkeys')
          .insert({
            user_id: user.id,
            user_email: email,
            credential_id: credential.id,
            public_key: publicKeyBase64,
            device_name: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop',
          });

        if (error) {
          console.error('Failed to save passkey:', error);
          setError('Failed to save passkey');
          return false;
        }

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
      // Get user's credentials from database
      const { data: userPasskeys, error: fetchError } = await supabase
        .from('user_passkeys')
        .select('credential_id')
        .eq('user_email', email)
        .eq('is_active', true);

      if (fetchError) {
        console.error('Error fetching passkeys:', fetchError);
        setError('Failed to fetch passkeys');
        return false;
      }

      if (!userPasskeys || userPasskeys.length === 0) {
        setError('No passkeys found for this email');
        return false;
      }

      // Generate challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credentialRequestOptions: CredentialRequestOptions = {
        publicKey: {
          challenge,
          allowCredentials: userPasskeys.map(pk => ({
            id: new TextEncoder().encode(pk.credential_id),
            type: 'public-key' as const,
          })),
          userVerification: 'preferred',
          timeout: 60000,
        },
      };

      const assertion = await navigator.credentials.get(credentialRequestOptions);
      
      if (assertion) {
        // Update last used timestamp
        await supabase
          .from('user_passkeys')
          .update({ last_used_at: new Date().toISOString() })
          .eq('user_email', email);

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
