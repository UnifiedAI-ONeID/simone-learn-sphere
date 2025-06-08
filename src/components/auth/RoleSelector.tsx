
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GraduationCap, Users } from 'lucide-react';

interface RoleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onValueChange }) => {
  const roleOptions = [
    {
      value: 'student',
      label: 'Student',
      description: 'Learn from courses and track your progress',
      icon: GraduationCap,
      color: 'text-blue-600'
    },
    {
      value: 'educator',
      label: 'Educator',
      description: 'Create and manage courses for students',
      icon: Users,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        Select your role
      </Label>
      <div className="grid gap-3">
        {roleOptions.map((role) => {
          const IconComponent = role.icon;
          return (
            <Button
              key={role.value}
              type="button"
              variant={value === role.value ? "default" : "outline"}
              className="w-full justify-start h-auto p-4 text-left"
              onClick={() => onValueChange(role.value)}
            >
              <IconComponent className={`h-5 w-5 mr-3 flex-shrink-0 ${value === role.value ? 'text-primary-foreground' : role.color}`} />
              <div>
                <div className="font-medium">
                  {role.label}
                </div>
                <div className={`text-sm ${value === role.value ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {role.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
