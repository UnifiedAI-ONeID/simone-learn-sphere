
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
    const baseStyles = "font-medium transition-all duration-200 active:scale-95";
    
    switch (platform) {
      case 'ios':
        return cn(
          baseStyles,
          "rounded-lg border-0",
          variant === 'primary' && "bg-[var(--platform-primary)] text-white shadow-sm",
          variant === 'secondary' && "bg-[var(--platform-background)] text-[var(--platform-primary)] border border-[var(--platform-border)]",
          variant === 'ghost' && "bg-transparent text-[var(--platform-primary)]",
          size === 'sm' && "px-3 py-2 text-sm",
          size === 'md' && "px-4 py-3 text-base",
          size === 'lg' && "px-6 py-4 text-lg"
        );
      
      case 'android':
        return cn(
          baseStyles,
          "rounded-xl uppercase tracking-wide",
          variant === 'primary' && "bg-[var(--platform-primary)] text-white shadow-md",
          variant === 'secondary' && "bg-transparent text-[var(--platform-primary)] border border-[var(--platform-primary)]",
          variant === 'ghost' && "bg-transparent text-[var(--platform-primary)]",
          size === 'sm' && "px-4 py-2 text-sm font-medium",
          size === 'md' && "px-6 py-3 text-sm font-medium",
          size === 'lg' && "px-8 py-4 text-base font-medium"
        );
      
      case 'desktop':
        return cn(
          baseStyles,
          "rounded-lg",
          variant === 'primary' && "bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] text-white shadow-lg hover:shadow-xl",
          variant === 'secondary' && "bg-[var(--platform-surface)] text-[var(--platform-text)] border border-[var(--platform-border)] hover:bg-gray-50",
          variant === 'ghost' && "bg-transparent text-[var(--platform-primary)] hover:bg-[var(--platform-background)]",
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
