
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { cn } from '@/lib/utils';

interface PlatformButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const PlatformButton: React.FC<PlatformButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const { platform, theme } = usePlatformTheme();

  const getButtonStyles = () => {
    const baseStyles = "font-medium transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (platform) {
      case 'ios':
        return cn(
          baseStyles,
          "rounded-lg active:scale-95",
          variant === 'primary' && "bg-[var(--platform-primary)] text-white focus:ring-blue-500",
          variant === 'secondary' && "bg-[var(--platform-surface)] text-[var(--platform-primary)] border border-[var(--platform-border)] focus:ring-blue-500",
          variant === 'ghost' && "bg-transparent text-[var(--platform-primary)] focus:ring-blue-500",
          size === 'sm' && "px-4 py-2 text-sm font-medium",
          size === 'md' && "px-6 py-3 text-base font-semibold",
          size === 'lg' && "px-8 py-4 text-lg font-semibold"
        );
      
      case 'android':
        return cn(
          baseStyles,
          "rounded-full uppercase tracking-wide font-medium shadow-md active:shadow-lg",
          variant === 'primary' && "bg-[var(--platform-primary)] text-white focus:ring-purple-500 hover:shadow-lg",
          variant === 'secondary' && "bg-transparent text-[var(--platform-primary)] border border-[var(--platform-primary)] focus:ring-purple-500",
          variant === 'ghost' && "bg-transparent text-[var(--platform-primary)] focus:ring-purple-500",
          size === 'sm' && "px-4 py-2 text-xs",
          size === 'md' && "px-6 py-3 text-sm",
          size === 'lg' && "px-8 py-4 text-base"
        );
      
      case 'desktop':
        return cn(
          baseStyles,
          "rounded-lg hover:shadow-lg",
          variant === 'primary' && "bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] text-white focus:ring-indigo-500",
          variant === 'secondary' && "bg-[var(--platform-surface)] text-[var(--platform-text)] border border-[var(--platform-border)] hover:bg-gray-50 focus:ring-indigo-500",
          variant === 'ghost' && "bg-transparent text-[var(--platform-primary)] hover:bg-[var(--platform-background)] focus:ring-indigo-500",
          size === 'sm' && "px-3 py-2 text-sm",
          size === 'md' && "px-4 py-2 text-sm",
          size === 'lg' && "px-6 py-3 text-base"
        );
      
      default:
        return baseStyles;
    }
  };

  return (
    <Button
      className={cn(getButtonStyles(), className)}
      style={{ fontFamily: theme.typography.fontFamily }}
      {...props}
    >
      {children}
    </Button>
  );
};
