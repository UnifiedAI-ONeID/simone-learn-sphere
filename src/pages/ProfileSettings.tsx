
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TranslatedText } from '@/components/TranslatedText';
import { UserRoleManager } from '@/components/UserRoleManager';
import { ProfilePictureUpload } from '@/components/ProfilePictureUpload';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';

const ProfileSettings = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const { toast } = useToast();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <TranslatedText text="Profile Settings" />
        </h1>
        <p className="text-gray-600">
          <TranslatedText text="Manage your account settings and preferences." />
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Picture */}
        <ProfilePictureUpload />

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TranslatedText text="Basic Information" />
            </CardTitle>
            <CardDescription>
              <TranslatedText text="Update your personal details." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    <TranslatedText text="First Name" />
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    <TranslatedText text="Last Name" />
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <TranslatedText text="Email" />
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  <TranslatedText text="Email cannot be changed" />
                </p>
              </div>
              <Button type="submit" disabled={isLoading}>
                <TranslatedText text={isLoading ? 'Updating...' : 'Update Profile'} />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Role Management */}
        <UserRoleManager />

        {/* Two-Factor Authentication */}
        <TwoFactorSetup />

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TranslatedText text="Account Actions" />
            </CardTitle>
            <CardDescription>
              <TranslatedText text="Manage your account." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              <TranslatedText text="Sign Out" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
