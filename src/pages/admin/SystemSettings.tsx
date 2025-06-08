import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Database, Globe, Security, Bell, Mail } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const SystemSettings = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <UnifiedLocalizedText text="System Settings" />
        </h1>
        <p className="text-gray-600">
          <UnifiedLocalizedText text="Configure platform-wide settings and preferences." />
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="General Settings" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Manage basic system configurations." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">
                <UnifiedLocalizedText text="Site Name" />
              </Label>
              <Input
                id="siteName"
                placeholder="Enter site name"
                defaultValue="Acme Learning Platform"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">
                <UnifiedLocalizedText text="Default Language" />
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Database Settings" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Configure database connection settings." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="databaseUrl">
                <UnifiedLocalizedText text="Database URL" />
              </Label>
              <Input
                id="databaseUrl"
                type="password"
                placeholder="Enter database URL"
                defaultValue="postgres://user:password@host:port/database"
              />
            </div>
            <Button>
              <Database className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text="Test Connection" />
            </Button>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Regional Settings" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Configure regional settings such as timezone and currency." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">
                <UnifiedLocalizedText text="Timezone" />
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="UTC" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add timezone options here */}
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">
                <UnifiedLocalizedText text="Currency" />
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add currency options here */}
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Security Settings" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Configure security settings to protect your platform." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enable2FA">
                  <UnifiedLocalizedText text="Enable Two-Factor Authentication" />
                </Label>
                <p className="text-sm text-gray-500">
                  <UnifiedLocalizedText text="Require users to use two-factor authentication for added security." />
                </p>
              </div>
              <Switch id="enable2FA" defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">
                <UnifiedLocalizedText text="Password Policy" />
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Strong" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add password policy options here */}
                  <SelectItem value="strong">Strong</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="weak">Weak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Notification Settings" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Configure system-wide notification settings." />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enableEmailNotifications">
                  <UnifiedLocalizedText text="Enable Email Notifications" />
                </Label>
                <p className="text-sm text-gray-500">
                  <UnifiedLocalizedText text="Send email notifications for important system events." />
                </p>
              </div>
              <Switch id="enableEmailNotifications" defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="notificationProvider">
                <UnifiedLocalizedText text="Notification Provider" />
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add notification provider options here */}
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
