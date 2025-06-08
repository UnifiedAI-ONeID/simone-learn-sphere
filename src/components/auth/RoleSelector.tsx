
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GraduationCap, Users, BookOpen, Lightbulb } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  variant?: 'badge' | 'radio';
  className?: string;
  required?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  variant = 'badge',
  className = '',
  required = false
}) => {
  const { platform } = usePlatformTheme();

  const roles = [
    {
      id: 'student',
      label: 'Student',
      description: 'Learn from courses and track your progress',
      icon: GraduationCap,
      color: 'bg-blue-500',
      features: ['Access courses', 'Track progress', 'AI tutoring', 'Earn badges']
    },
    {
      id: 'educator',
      label: 'Educator',
      description: 'Create and manage courses for students',
      icon: Users,
      color: 'bg-green-500',
      features: ['Create courses', 'Manage students', 'AI course planning', 'Analytics']
    }
  ];

  const getBadgeStyles = (isSelected: boolean) => {
    const baseStyles = "cursor-pointer transition-all duration-200 p-4 border-2 rounded-lg";
    
    switch (platform) {
      case 'ios':
        return `${baseStyles} ${isSelected 
          ? 'border-primary bg-primary/10 shadow-md' 
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
        } rounded-xl`;
      case 'android':
        return `${baseStyles} ${isSelected 
          ? 'border-primary bg-primary/10 shadow-lg' 
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
        } rounded-2xl`;
      default:
        return `${baseStyles} ${isSelected 
          ? 'border-primary bg-primary/10 shadow-sm' 
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
        }`;
    }
  };

  if (variant === 'radio') {
    return (
      <div className={`space-y-3 ${className}`}>
        <Label className="text-sm font-medium text-foreground">
          <LocalizedText text="Select your role" />
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <RadioGroup 
          value={selectedRole} 
          onValueChange={onRoleChange}
          className="grid gap-3"
          required={required}
        >
          {roles.map((role) => (
            <div key={role.id} className="flex items-center space-x-3">
              <RadioGroupItem value={role.id} id={`role-${role.id}`} />
              <Label 
                htmlFor={`role-${role.id}`} 
                className="flex items-center space-x-2 cursor-pointer flex-1"
              >
                <div className={`w-8 h-8 ${role.color} rounded-full flex items-center justify-center`}>
                  <role.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    <LocalizedText text={role.label} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <LocalizedText text={role.description} />
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-foreground">
        <LocalizedText text="I want to join as:" />
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="grid gap-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className={getBadgeStyles(selectedRole === role.id)}
            onClick={() => onRoleChange(role.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedRole === role.id}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRoleChange(role.id);
              }
            }}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <role.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground">
                    <LocalizedText text={role.label} />
                  </h3>
                  {selectedRole === role.id && (
                    <Badge variant="default" className="text-xs">
                      <LocalizedText text="Selected" />
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <LocalizedText text={role.description} />
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <LocalizedText text={feature} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
