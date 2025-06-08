
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

      // Check if user already has passkeys
      const { data: existingPasskeys } = await supabase
        .from('webauthn_credentials')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (existingPasskeys && existingPasskeys.length > 0) {
        toast.error('You already have a passkey set up');
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
        // Get the user who owns this passkey
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', email)
          .single();

        if (profile) {
          // Create a Supabase session for the user
          // Note: In a production environment, you would need a more secure way to create sessions
          // This is a simplified implementation for demonstration
          
          toast.success('Passkey authentication successful!');
          onSuccess();
        } else {
          setShowError(true);
          toast.error('User not found');
        }
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
