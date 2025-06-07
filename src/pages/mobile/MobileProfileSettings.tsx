
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, User, Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LocalizedText } from '@/components/LocalizedText';

export const MobileProfileSettings = () => {
  const { user, signOut } = useAuth();

  const settingsOptions = [
    { icon: User, label: 'Profile Information', description: 'Update your personal details' },
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
    { icon: Shield, label: 'Security', description: 'Password and security settings' },
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-4 ring-white">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Options */}
      <div className="space-y-3">
        {settingsOptions.map((option, index) => (
          <Card key={index} className="bg-white/70 backdrop-blur-sm border-purple-100 active:scale-95 transition-transform">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <option.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    <LocalizedText text={option.label} />
                  </h3>
                  <p className="text-sm text-gray-600">
                    <LocalizedText text={option.description} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sign Out */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-100"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <LocalizedText text="Sign Out" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
