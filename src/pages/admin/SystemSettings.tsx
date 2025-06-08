
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Shield, Palette, Key, Globe } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const SystemSettings = () => {
  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <LocalizedText text="System Settings" />
          </h1>
          <p className="text-muted-foreground">
            <LocalizedText text="Configure platform-wide settings and preferences" />
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="ui">
              <Palette className="h-4 w-4 mr-2" />
              UI Theme
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="localization">
              <Globe className="h-4 w-4 mr-2" />
              Localization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">General Platform Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="SimoneLabs" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Textarea 
                    id="platform-description" 
                    defaultValue="AI-powered learning platform for modern education"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Verification Required</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </PlatformCard>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">Security Configuration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enforce 2FA for all users</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Complexity Requirements</Label>
                    <p className="text-sm text-muted-foreground">Enforce strong password policies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout inactive users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                  <Input id="session-duration" type="number" defaultValue="60" className="mt-1" />
                </div>
              </div>
            </PlatformCard>
          </TabsContent>

          <TabsContent value="ui" className="space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">UI Theme Configuration</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode Available</Label>
                    <p className="text-sm text-muted-foreground">Allow users to switch to dark mode</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Custom Branding</Label>
                    <p className="text-sm text-muted-foreground">Enable custom logos and colors</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input id="primary-color" type="color" defaultValue="#6366f1" className="mt-1 w-20" />
                </div>
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input id="logo-url" placeholder="https://example.com/logo.png" className="mt-1" />
                </div>
              </div>
            </PlatformCard>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">API Key Management</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input id="openai-key" type="password" placeholder="sk-..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="stripe-key">Stripe API Key</Label>
                  <Input id="stripe-key" type="password" placeholder="sk_live_..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email-api-key">Email Service API Key</Label>
                  <Input id="email-api-key" type="password" placeholder="API key for email service" className="mt-1" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Enable API rate limiting</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </PlatformCard>
          </TabsContent>

          <TabsContent value="localization" className="space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">Localization Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="default-language">Default Language</Label>
                  <Input id="default-language" defaultValue="English" className="mt-1" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-translation</Label>
                    <p className="text-sm text-muted-foreground">Enable automatic content translation</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>RTL Language Support</Label>
                    <p className="text-sm text-muted-foreground">Support right-to-left languages</p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <Label htmlFor="supported-languages">Supported Languages</Label>
                  <Textarea 
                    id="supported-languages" 
                    defaultValue="English, Spanish, French, German, Japanese"
                    className="mt-1"
                  />
                </div>
              </div>
            </PlatformCard>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">
            <LocalizedText text="Reset to Defaults" />
          </Button>
          <Button>
            <LocalizedText text="Save Changes" />
          </Button>
        </div>
      </div>
    </PlatformLayout>
  );
};
