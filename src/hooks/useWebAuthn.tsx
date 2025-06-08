
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WebAuthnCredential {
  id: string;
  rawId: ArrayBuffer;
  type: 'public-key';
}

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
      // Create credential options
      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge: new Uint8Array(32).map(() => Math.random() * 256),
          rp: {
            name: 'SimoneLabs',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(email),
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
      
      if (credential) {
        // Store credential info in Supabase
        const { error } = await supabase
          .from('user_passkeys')
          .insert({
            user_email: email,
            credential_id: credential.id,
            public_key: Array.from(new Uint8Array(credential.response.publicKey || new ArrayBuffer(0))),
          });

        if (error) {
          setError('Failed to save passkey');
          return false;
        }

        return true;
      }
      
      return false;
    } catch (err: any) {
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
      // Get user's credentials
      const { data: userPasskeys } = await supabase
        .from('user_passkeys')
        .select('credential_id')
        .eq('user_email', email);

      if (!userPasskeys || userPasskeys.length === 0) {
        setError('No passkeys found for this email');
        return false;
      }

      const credentialRequestOptions: CredentialRequestOptions = {
        publicKey: {
          challenge: new Uint8Array(32).map(() => Math.random() * 256),
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
        // In a real app, you'd verify the assertion server-side
        // For now, we'll just sign in the user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'passkey-auth', // This would be handled differently in production
        });

        if (error) {
          setError('Authentication failed');
          return false;
        }

        return true;
      }
      
      return false;
    } catch (err: any) {
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
