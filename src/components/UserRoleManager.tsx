
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { TranslatedText } from '@/components/TranslatedText';
import { User, GraduationCap, Settings } from 'lucide-react';

export const UserRoleManager = () => {
  const { user } = useAuth();
  const { role: currentRole } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableRoles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Learn with personalized AI-powered experiences',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'educator',
      title: 'Educator', 
      description: 'Create and monetize educational content',
      icon: User,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const handleAddRole = async (newRole: string) => {
    if (!user || !currentRole) return;

    setIsLoading(true);
    try {
      // Check if user already has this role
      if (currentRole.includes(newRole)) {
        toast({
          title: "Role already assigned",
          description: `You already have the ${newRole} role.`,
          variant: "destructive",
        });
        return;
      }

      // Combine current role with new role
      const combinedRole = currentRole === 'admin' ? 'admin' : `${currentRole}+${newRole}`;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: combinedRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Role added successfully",
        description: `You now have ${newRole} access in addition to your existing roles.`,
      });

      // Refresh the page to update role context
      window.location.reload();

    } catch (error: any) {
      console.error('Error adding role:', error);
      toast({
        title: "Failed to add role",
        description: error.message || "An error occurred while adding the role.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentRoles = () => {
    if (!currentRole) return [];
    if (currentRole === 'admin') return ['admin'];
    return currentRole.split('+');
  };

  const currentRoles = getCurrentRoles();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <TranslatedText text="Manage Your Roles" />
        </CardTitle>
        <CardDescription>
          <TranslatedText text="Add additional roles to expand your platform capabilities" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">
            <TranslatedText text="Current Roles:" />
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentRoles.map((role) => (
              <Badge key={role} variant="secondary" className="capitalize">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">
            <TranslatedText text="Available Roles to Add:" />
          </h4>
          <div className="space-y-2">
            {availableRoles.map((role) => {
              const hasRole = currentRoles.includes(role.id);
              const isAdmin = currentRoles.includes('admin');
              
              return (
                <div
                  key={role.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    hasRole 
                      ? 'border-gray-200 bg-gray-50 opacity-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <role.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{role.title}</div>
                        <div className="text-sm text-gray-600">{role.description}</div>
                      </div>
                    </div>
                    {!hasRole && !isAdmin && (
                      <Button
                        onClick={() => handleAddRole(role.id)}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                      >
                        <TranslatedText text="Add Role" />
                      </Button>
                    )}
                    {hasRole && (
                      <Badge variant="secondary">
                        <TranslatedText text="Current" />
                      </Badge>
                    )}
                    {isAdmin && (
                      <Badge variant="secondary">
                        <TranslatedText text="Admin has all access" />
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <TranslatedText text="Note: Adding roles will combine your access levels. You can access features from all your assigned roles." />
        </div>
      </CardContent>
    </Card>
  );
};
