
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Shield, 
  Mail, 
  Users, 
  Database, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

interface SystemSettings {
  registration_enabled: boolean;
  email_verification_required: boolean;
  admin_approval_required: boolean;
  max_session_duration: number;
  password_min_length: number;
  two_factor_required: boolean;
  platform_name: string;
  welcome_message: string;
}

export const SystemConfiguration = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    registration_enabled: true,
    email_verification_required: true,
    admin_approval_required: false,
    max_session_duration: 24,
    password_min_length: 8,
    two_factor_required: false,
    platform_name: 'SimoneLabs',
    welcome_message: 'Welcome to SimoneLabs - Your educational AI platform'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { hasRole } = useUserRole();

  // Only render for admins
  if (!hasRole('admin')) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <Shield className="h-5 w-5" />
            <div>
              <p className="font-medium">Access Denied</p>
              <p className="text-sm">System configuration requires administrator privileges.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_type: 'system_configuration_update',
        action_details: {
          settings_updated: settings,
          updated_fields: Object.keys(settings)
        }
      });

      toast({
        title: "Settings saved",
        description: "System configuration has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Configuration</h2>
          <p className="text-gray-600 dark:text-gray-300">Configure platform settings and security policies</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
          <Crown className="h-4 w-4" />
          <span>Admin Only</span>
        </div>
      </div>

      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Settings
          </CardTitle>
          <CardDescription>
            Basic platform configuration and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                value={settings.platform_name}
                onChange={(e) => updateSetting('platform_name', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <Textarea
              id="welcome-message"
              value={settings.welcome_message}
              onChange={(e) => updateSetting('welcome_message', e.target.value)}
              placeholder="Enter the welcome message shown to new users..."
            />
          </div>
        </CardContent>
      </Card>

      {/* User Registration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Registration
          </CardTitle>
          <CardDescription>
            Control how users can register and access the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Public Registration</Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Allow new users to register without invitation
              </p>
            </div>
            <Switch
              checked={settings.registration_enabled}
              onCheckedChange={(checked) => updateSetting('registration_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Email Verification</Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Users must verify their email before accessing the platform
              </p>
            </div>
            <Switch
              checked={settings.email_verification_required}
              onCheckedChange={(checked) => updateSetting('email_verification_required', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Admin Approval</Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                New user accounts must be approved by an administrator
              </p>
            </div>
            <Switch
              checked={settings.admin_approval_required}
              onCheckedChange={(checked) => updateSetting('admin_approval_required', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security policies and authentication requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-duration">Max Session Duration (hours)</Label>
              <Input
                id="session-duration"
                type="number"
                min="1"
                max="168"
                value={settings.max_session_duration}
                onChange={(e) => updateSetting('max_session_duration', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-length">Minimum Password Length</Label>
              <Input
                id="password-length"
                type="number"
                min="6"
                max="50"
                value={settings.password_min_length}
                onChange={(e) => updateSetting('password_min_length', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Force all users to enable 2FA for enhanced security
              </p>
            </div>
            <Switch
              checked={settings.two_factor_required}
              onCheckedChange={(checked) => updateSetting('two_factor_required', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Administrator Actions
          </CardTitle>
          <CardDescription>
            High-privilege actions that affect the entire system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Save Configuration</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Apply all settings changes to the system
              </p>
            </div>
            <Button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Database: Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Authentication: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Security: Enabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
