
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint, AlertCircle } from 'lucide-react';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { LocalizedText } from '@/components/LocalizedText';
import { supabase } from '@/integrations/supabase/client';

interface PasskeyAuthProps {
  email: string;
  onSuccess: () => void;
  isSignUp?: boolean;
}

export const PasskeyAuth: React.FC<PasskeyAuthProps> = ({
  email,
  onSuccess,
  isSignUp = false,
}) => {
  const { isSupported, isLoading, error, register, authenticate } = useWebAuthn();
  const [showError, setShowError] = useState(false);

  const handlePasskeyAction = async () => {
    setShowError(false);
    
    if (isSignUp) {
      // For signup, user must be authenticated first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowError(true);
        return;
      }
      
      const success = await register(email);
      if (success) {
        onSuccess();
      } else {
        setShowError(true);
      }
    } else {
      // For signin, check if passkeys exist and authenticate
      const success = await authenticate(email);
      if (success) {
        // Try to sign in the user
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (profile) {
          onSuccess();
        } else {
          setShowError(true);
        }
      } else {
        setShowError(true);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handlePasskeyAction}
        disabled={isLoading || !email}
      >
        <Fingerprint className="h-4 w-4 mr-2" />
        <LocalizedText 
          text={isSignUp ? "Set up Passkey" : "Sign in with Passkey"} 
        />
      </Button>

      {(error || showError) && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">
            {error || (isSignUp ? 'Failed to set up passkey' : 'Passkey authentication failed')}
          </p>
        </div>
      )}
    </div>
  );
};
