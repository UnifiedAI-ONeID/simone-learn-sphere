
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export interface RoleSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onValueChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role-select">
        <UnifiedLocalizedText text="Select Your Role" />
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">
            <UnifiedLocalizedText text="Student" />
          </SelectItem>
          <SelectItem value="educator">
            <UnifiedLocalizedText text="Educator" />
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
