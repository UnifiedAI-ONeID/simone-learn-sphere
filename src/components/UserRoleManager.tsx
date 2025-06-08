import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, GraduationCap, Settings } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const UserRoleManager = () => {
  const { user } = useAuth();
  const { role, setRole } = useUserRole();
  const [selectedRole, setSelectedRole] = useState(role || 'student');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = async () => {
    if (!user || selectedRole === role) return;

    setIsLoading(true);
    try {
      // Update role in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', user.id);

      if (error) throw error;

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { role: selectedRole }
      });

      if (metadataError) throw metadataError;

      // Update local role state
      setRole(selectedRole);

      toast({
        title: "Role updated",
        description: `Your role has been updated to ${selectedRole}.`,
      });
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (roleType: string) => {
    switch (roleType) {
      case 'student':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'educator':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'student':
        return <User className="h-4 w-4" />;
      case 'educator':
        return <GraduationCap className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <UnifiedLocalizedText text="Role Management" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Change your role to access different features" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <UnifiedLocalizedText text="Current Role:" />
          <Badge className={getRoleBadgeColor(role || 'student')}>
            {getRoleIcon(role || 'student')}
            <span className="ml-1 capitalize">{role || 'student'}</span>
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            <UnifiedLocalizedText text="Select New Role" />
          </label>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Student" />
                </div>
              </SelectItem>
              <SelectItem value="educator">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Educator" />
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Admin" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedRole !== role && (
          <Alert>
            <AlertDescription>
              <UnifiedLocalizedText text="Changing your role will affect the features and content you can access." />
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleRoleChange}
          disabled={isLoading || selectedRole === role}
          className="w-full"
        >
          {isLoading ? (
            <UnifiedLocalizedText text="Updating..." />
          ) : (
            <UnifiedLocalizedText text="Update Role" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
