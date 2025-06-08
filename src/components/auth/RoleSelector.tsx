import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Shield, BookOpen } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ensureProfileExists } from '@/utils/authUtils';

interface RoleSelectorProps {
  onRoleSelected: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelected }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = async (role: 'student' | 'educator' | 'admin') => {
    if (!user) {
      toast({
        title: "Session Expired",
        description: "Please sign in again to select a role.",
        variant: "destructive",
      });
      return;
    }

    try {
      await ensureProfileExists(user.id, user, role);

      // Redirect based on role
      navigate(`/${role}/dashboard`);
      onRoleSelected();
    } catch (error: any) {
      console.error("Role selection error:", error);
      toast({
        title: "Role Selection Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          <UnifiedLocalizedText text="Choose Your Role" />
        </CardTitle>
        <CardDescription className="text-center">
          <UnifiedLocalizedText text="Select the role that best describes you" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full justify-start"
          onClick={() => handleRoleSelect('student')}
        >
          <Users className="h-4 w-4 mr-2" />
          <UnifiedLocalizedText text="Student" />
          <Badge variant="secondary" className="ml-auto">
            <UnifiedLocalizedText text="Learn" />
          </Badge>
        </Button>
        <Button
          className="w-full justify-start"
          onClick={() => handleRoleSelect('educator')}
        >
          <GraduationCap className="h-4 w-4 mr-2" />
          <UnifiedLocalizedText text="Educator" />
          <Badge variant="secondary" className="ml-auto">
            <UnifiedLocalizedText text="Teach" />
          </Badge>
        </Button>
        <Button
          className="w-full justify-start"
          onClick={() => handleRoleSelect('admin')}
        >
          <Shield className="h-4 w-4 mr-2" />
          <UnifiedLocalizedText text="Admin" />
          <Badge variant="secondary" className="ml-auto">
            <UnifiedLocalizedText text="Manage" />
          </Badge>
        </Button>
      </CardContent>
    </Card>
  );
};
