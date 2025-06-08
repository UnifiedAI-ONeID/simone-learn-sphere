
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface TwoFactorSetupProps {
  userEmail: string;
  isEnabled: boolean;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ userEmail, isEnabled }) => {
  const [enabled, setEnabled] = useState(isEnabled);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <UnifiedLocalizedText text="Two-Factor Authentication" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Add an extra layer of security to your account" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>
            <UnifiedLocalizedText text="Enable 2FA" />
          </span>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        {enabled && (
          <Button>
            <UnifiedLocalizedText text="Configure 2FA" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
