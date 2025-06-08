
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Smartphone, Fingerprint, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Mobile2FASetupFlowProps {
  onComplete: () => void;
  isOnboarding?: boolean;
}

type SetupStep = 'overview' | 'email_2fa' | 'passkey' | 'complete';

export const Mobile2FASetupFlow: React.FC<Mobile2FASetupFlowProps> = ({
  onComplete,
  isOnboarding = false
}) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('overview');
  const [setupMethods, setSetupMethods] = useState({
    email2FA: false,
    passkey: false
  });
  const [securityLevel, setSecurityLevel] = useState('basic');
  const { user } = useAuth();

  useEffect(() => {
    checkCurrentSetup();
  }, [user]);

  const checkCurrentSetup = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('two_factor_enabled, passkey_enabled, security_level, two_factor_setup_completed')
      .eq('id', user.id)
      .single();

    if (profile) {
      setSetupMethods({
        email2FA: profile.two_factor_enabled || false,
        passkey: profile.passkey_enabled || false
      });
      setSecurityLevel(profile.security_level || 'basic');

      // If already completed, skip to complete step
      if (profile.two_factor_setup_completed) {
        setCurrentStep('complete');
      }
    }
  };

  const handleEmail2FAComplete = async () => {
    setSetupMethods(prev => ({ ...prev, email2FA: true }));
    await updateSecurityLevel();
    
    toast.success('Email 2FA Enabled');
    setCurrentStep('passkey');
  };

  const handlePasskeyComplete = async () => {
    setSetupMethods(prev => ({ ...prev, passkey: true }));
    await updateSecurityLevel();
    
    toast.success('Passkey Enabled');
    setCurrentStep('complete');
  };

  const updateSecurityLevel = async () => {
    if (!user) return;
    
    await supabase.rpc('update_user_security_level', { user_id: user.id });
    
    // Refresh security level
    const { data: profile } = await supabase
      .from('profiles')
      .select('security_level')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      setSecurityLevel(profile.security_level);
    }
  };

  const skipToComplete = async () => {
    if (!setupMethods.email2FA && !setupMethods.passkey) {
      toast.error('Please enable at least one two-factor authentication method.');
      return;
    }

    // Mark setup as completed
    await supabase
      .from('profiles')
      .update({ two_factor_setup_completed: true })
      .eq('id', user.id);

    setCurrentStep('complete');
  };

  const SecurityLevelBadge = ({ level }: { level: string }) => {
    const variants = {
      basic: { color: 'bg-yellow-100 text-yellow-800', icon: Shield },
      enhanced: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      maximum: { color: 'bg-green-100 text-green-800', icon: Shield }
    };
    
    const variant = variants[level as keyof typeof variants] || variants.basic;
    const Icon = variant.icon;
    
    return (
      <Badge className={`${variant.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        <LocalizedText text={`${level.charAt(0).toUpperCase() + level.slice(1)} Security`} />
      </Badge>
    );
  };

  if (currentStep === 'overview') {
    return (
      <PlatformCard className="w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">
              <LocalizedText text="Secure Your Account" />
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            <LocalizedText text="Set up additional security measures to protect your account" />
          </p>
          <SecurityLevelBadge level={securityLevel} />
        </div>

        <div className="space-y-4 mb-6">
          <div className={`p-4 border rounded-lg ${setupMethods.email2FA ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">
                    <LocalizedText text="Email Two-Factor Authentication" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <LocalizedText text="Receive verification codes via email" />
                  </p>
                </div>
              </div>
              {setupMethods.email2FA && <CheckCircle className="h-5 w-5 text-green-600" />}
            </div>
          </div>

          <div className={`p-4 border rounded-lg ${setupMethods.passkey ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">
                    <LocalizedText text="Passkey Authentication" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <LocalizedText text="Use biometrics or hardware keys for secure login" />
                  </p>
                </div>
              </div>
              {setupMethods.passkey && <CheckCircle className="h-5 w-5 text-green-600" />}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => setCurrentStep('email_2fa')}
            disabled={setupMethods.email2FA}
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            <LocalizedText text={setupMethods.email2FA ? "Email 2FA Enabled" : "Set Up Email 2FA"} />
          </Button>
          
          <Button 
            onClick={() => setCurrentStep('passkey')}
            disabled={setupMethods.passkey}
            variant="outline"
            className="w-full"
          >
            <Fingerprint className="h-4 w-4 mr-2" />
            <LocalizedText text={setupMethods.passkey ? "Passkey Enabled" : "Set Up Passkey"} />
          </Button>

          {(setupMethods.email2FA || setupMethods.passkey) && (
            <Button onClick={skipToComplete} className="w-full">
              <LocalizedText text="Complete Setup" />
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {isOnboarding && (
            <Button variant="ghost" onClick={onComplete} className="w-full">
              <LocalizedText text="Skip for Now" />
            </Button>
          )}
        </div>
      </PlatformCard>
    );
  }

  if (currentStep === 'email_2fa') {
    return (
      <div className="w-full space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentStep('overview')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <LocalizedText text="Back to Overview" />
        </Button>
        <TwoFactorSetup 
          userEmail={user?.email || ''} 
          isEnabled={setupMethods.email2FA}
          onSetupComplete={handleEmail2FAComplete}
        />
      </div>
    );
  }

  if (currentStep === 'passkey') {
    return (
      <div className="w-full space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentStep('overview')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <LocalizedText text="Back to Overview" />
        </Button>
        <PlatformCard>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Fingerprint className="h-5 w-5" />
              <h3 className="text-lg font-medium">
                <LocalizedText text="Set Up Passkey" />
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              <LocalizedText text="Use your device's biometrics or security key for passwordless login" />
            </p>
          </div>
          {user?.email && (
            <PasskeyAuth
              email={user.email}
              onSuccess={handlePasskeyComplete}
              isSignUp={true}
            />
          )}
        </PlatformCard>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <PlatformCard className="w-full">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <LocalizedText text="Security Setup Complete!" />
          </h3>
          <p className="text-muted-foreground mb-4">
            <LocalizedText text="Your account is now protected with enhanced security measures" />
          </p>
          <SecurityLevelBadge level={securityLevel} />
          
          <div className="space-y-2 my-6">
            {setupMethods.email2FA && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <LocalizedText text="Email Two-Factor Authentication enabled" />
              </div>
            )}
            {setupMethods.passkey && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <LocalizedText text="Passkey authentication enabled" />
              </div>
            )}
          </div>

          <Button onClick={onComplete} className="w-full">
            <LocalizedText text="Continue to Dashboard" />
          </Button>
        </div>
      </PlatformCard>
    );
  }

  return null;
};
