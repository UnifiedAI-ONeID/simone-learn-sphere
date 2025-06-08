
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint, AlertCircle } from 'lucide-react';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { LocalizedText } from '@/components/LocalizedText';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

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
        toast.error('Please complete email verification first');
        return;
      }
      
      const success = await register(email);
      if (success) {
        toast.success('Passkey set up successfully!');
        onSuccess();
      } else {
        setShowError(true);
        toast.error('Failed to set up passkey');
      }
    } else {
      // For signin, authenticate with passkey
      const success = await authenticate(email);
      if (success) {
        // Create a temporary session token for passkey authentication
        const sessionToken = crypto.randomUUID();
        
        // Store temporary session token
        const { error: tokenError } = await supabase
          .from('temp_session_tokens')
          .insert({
            email,
            token: sessionToken,
            expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
          });

        if (tokenError) {
          console.error('Failed to create session token:', tokenError);
          setShowError(true);
          toast.error('Authentication failed');
          return;
        }

        // In a production environment, you would verify this token server-side
        // and create a proper authentication session
        toast.success('Passkey authentication successful!');
        onSuccess();
      } else {
        setShowError(true);
        toast.error('Passkey authentication failed');
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
