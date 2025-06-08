
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Shield, GraduationCap, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';

interface UserRoleManagerProps {
  userId?: string;
  currentRole?: string;
  onRoleChange?: (newRole: string) => void;
}

export const UserRoleManager: React.FC<UserRoleManagerProps> = ({
  userId,
  currentRole,
  onRoleChange
}) => {
  const { role: adminRole } = useUserRole();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(currentRole || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const roles = [
    {
      value: 'student',
      label: 'Student',
      description: 'Can enroll in courses and track progress',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      value: 'educator',
      label: 'Educator',
      description: 'Can create and manage courses',
      icon: Users,
      color: 'bg-green-100 text-green-800'
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Full platform access and management',
      icon: Shield,
      color: 'bg-red-100 text-red-800'
    }
  ];

  const handleRoleUpdate = async () => {
    if (!selectedRole || selectedRole === currentRole) return;

    setIsUpdating(true);
    try {
      // Simulate role update - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onRoleChange) {
        onRoleChange(selectedRole);
      }

      toast({
        title: "Role Updated",
        description: `User role has been updated to ${selectedRole}.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Only allow admins to manage roles
  if (adminRole !== 'admin') {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage user roles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Role Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Role Display */}
        {currentRole && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Current Role
            </label>
            <div className="flex items-center gap-2">
              {roles.map(role => {
                if (role.value === currentRole) {
                  const IconComponent = role.icon;
                  return (
                    <Badge key={role.value} className={role.color}>
                      <IconComponent className="h-3 w-3 mr-1" />
                      {role.label}
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Role Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            New Role
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => {
                const IconComponent = role.icon;
                return (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <div>
                        <div className="font-medium">
                          {role.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Role Descriptions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Role Permissions
          </h4>
          {roles.map(role => {
            const IconComponent = role.icon;
            return (
              <div key={role.value} className="flex items-start gap-3 p-3 border rounded-lg">
                <IconComponent className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {role.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {role.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Update Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleRoleUpdate}
            disabled={isUpdating || !selectedRole || selectedRole === currentRole}
          >
            {isUpdating ? (
              "Updating..."
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Update Role
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
