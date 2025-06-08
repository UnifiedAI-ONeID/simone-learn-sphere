
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Shield, 
  Bell, 
  Mail, 
  Database, 
  Globe, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Save 
} from 'lucide-react';

export const SystemSettings = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          System Settings
        </h1>
        <p className="text-gray-600">
          Configure platform-wide settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              General Settings
            </CardTitle>
            <CardDescription>
              Manage basic system configurations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">
                Site Name
              </Label>
              <Input
                id="siteName"
                placeholder="Enter site name"
                defaultValue="Acme Learning Platform"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">
                Default Language
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
              Database Settings
            </CardTitle>
            <CardDescription>
              Configure database connection settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="databaseUrl">
                Database URL
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
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              Regional Settings
            </CardTitle>
            <CardDescription>
              Configure regional settings such as timezone and currency.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">
                Timezone
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
                Currency
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
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security settings to protect your platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enable2FA">
                  Enable Two-Factor Authentication
                </Label>
                <p className="text-sm text-gray-500">
                  Require users to use two-factor authentication for added security.
                </p>
              </div>
              <Switch id="enable2FA" defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">
                Password Policy
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
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure system-wide notification settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enableEmailNotifications">
                  Enable Email Notifications
                </Label>
                <p className="text-sm text-gray-500">
                  Send email notifications for important system events.
                </p>
              </div>
              <Switch id="enableEmailNotifications" defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="notificationProvider">
                Notification Provider
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
