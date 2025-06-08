
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint, AlertCircle } from 'lucide-react';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { LocalizedText } from '@/components/LocalizedText';

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
    
    const success = isSignUp 
      ? await register(email)
      : await authenticate(email);

    if (success) {
      onSuccess();
    } else {
      setShowError(true);
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
            {error || 'Passkey authentication failed'}
          </p>
        </div>
      )}
    </div>
  );
};
