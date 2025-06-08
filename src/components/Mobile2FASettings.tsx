
import React, { useState, useEffect } from 'react';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { PlatformButton } from '@/components/platform/PlatformButton';
import { Input } from '@/components/ui/input';
import { Shield, Smartphone, Mail, CheckCircle } from 'lucide-react';
import { TwoFactorLogin } from '@/components/TwoFactorLogin';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailTwoFactor } from '@/hooks/useEmailTwoFactor';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

export const Mobile2FASettings = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showEnableFlow, setShowEnableFlow] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { state, enableTwoFactor, verifyAndEnable, disableTwoFactor } = useEmailTwoFactor();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('two_factor_enabled, email')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setUserProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEnable2FA = async () => {
    if (!user?.email) return;
    
    const result = await enableTwoFactor(user.email);
    if (result.success) {
      setShowVerification(true);
    }
  };

  const handleVerify2FA = async (code: string) => {
    const result = await verifyAndEnable(code);
    if (result.success) {
      setShowVerification(false);
      setUserProfile(prev => ({ ...prev, two_factor_enabled: true }));
      toast.success('Two-factor authentication enabled successfully!');
    }
  };

  const handleDisable2FA = async () => {
    const result = await disableTwoFactor();
    if (result.success) {
      setUserProfile(prev => ({ ...prev, two_factor_enabled: false }));
    }
  };

  if (showVerification) {
    return (
      <div className="p-4">
        <TwoFactorLogin
          email={user?.email || ''}
          onVerificationSuccess={() => handleVerify2FA}
          onBack={() => setShowVerification(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <PlatformCard
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        className="bg-card/90 backdrop-blur-sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Email 2FA
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verify with codes sent to your email
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userProfile?.two_factor_enabled ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">
                    Enabled
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Disabled
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {userProfile?.two_factor_enabled ? (
              <PlatformButton
                onClick={handleDisable2FA}
                disabled={state.isLoading}
                variant="secondary"
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Shield className="w-4 h-4 mr-2" />
                {state.isLoading ? "Disabling..." : "Disable 2FA"}
              </PlatformButton>
            ) : (
              <PlatformButton
                onClick={handleEnable2FA}
                disabled={state.isLoading || !user?.email}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Mail className="w-4 h-4 mr-2" />
                {state.isLoading ? "Setting up..." : "Enable Email 2FA"}
              </PlatformButton>
            )}
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Two-factor authentication adds an extra layer of security by requiring a verification code sent to your email when signing in.
            </p>
          </div>
        </div>
      </PlatformCard>
    </div>
  );
};
