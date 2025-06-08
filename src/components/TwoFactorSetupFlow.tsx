
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Smartphone, Fingerprint, Mail, ArrowRight } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';
import { PasskeyAuth } from '@/components/PasskeyAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface TwoFactorSetupFlowProps {
  onComplete: () => void;
  isOnboarding?: boolean;
}

type SetupStep = 'overview' | 'email_2fa' | 'passkey' | 'complete';

export const TwoFactorSetupFlow: React.FC<TwoFactorSetupFlowProps> = ({
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
  const { toast } = useToast();

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
    
    toast({
      title: "Email 2FA Enabled",
      description: "Two-factor authentication via email has been set up successfully.",
    });

    // Move to passkey setup or complete
    setCurrentStep('passkey');
  };

  const handlePasskeyComplete = async () => {
    setSetupMethods(prev => ({ ...prev, passkey: true }));
    await updateSecurityLevel();
    
    toast({
      title: "Passkey Enabled",
      description: "Passkey authentication has been set up successfully.",
    });

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
      toast({
        title: "Setup Required",
        description: "Please enable at least one two-factor authentication method.",
        variant: "destructive",
      });
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <LocalizedText text="Secure Your Account" />
          </CardTitle>
          <CardDescription>
            <LocalizedText text="Set up additional security measures to protect your account" />
          </CardDescription>
          <SecurityLevelBadge level={securityLevel} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
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

          <div className="flex gap-3">
            <Button 
              onClick={() => setCurrentStep('email_2fa')}
              disabled={setupMethods.email2FA}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              <LocalizedText text={setupMethods.email2FA ? "Email 2FA Enabled" : "Set Up Email 2FA"} />
            </Button>
            <Button 
              onClick={() => setCurrentStep('passkey')}
              disabled={setupMethods.passkey}
              variant="outline"
              className="flex-1"
            >
              <Fingerprint className="h-4 w-4 mr-2" />
              <LocalizedText text={setupMethods.passkey ? "Passkey Enabled" : "Set Up Passkey"} />
            </Button>
          </div>

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
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'email_2fa') {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentStep('overview')}
          className="mb-4"
        >
          ← <LocalizedText text="Back to Overview" />
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
      <div className="w-full max-w-md mx-auto space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentStep('overview')}
          className="mb-4"
        >
          ← <LocalizedText text="Back to Overview" />
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              <LocalizedText text="Set Up Passkey" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Use your device's biometrics or security key for passwordless login" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user?.email && (
              <PasskeyAuth
                email={user.email}
                onSuccess={handlePasskeyComplete}
                isSignUp={true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle>
            <LocalizedText text="Security Setup Complete!" />
          </CardTitle>
          <CardDescription>
            <LocalizedText text="Your account is now protected with enhanced security measures" />
          </CardDescription>
          <SecurityLevelBadge level={securityLevel} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
        </CardContent>
      </Card>
    );
  }

  return null;
};
