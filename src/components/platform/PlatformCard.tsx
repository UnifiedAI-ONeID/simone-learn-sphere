
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { cn } from '@/lib/utils';

interface PlatformCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  children,
  title,
  description,
  className,
}) => {
  const { platform, theme } = usePlatformTheme();

  const getCardStyles = () => {
    switch (platform) {
      case 'ios':
        return cn(
          "bg-[var(--platform-surface)] border border-[var(--platform-border)]",
          "rounded-xl backdrop-blur-sm",
          "shadow-sm"
        );
      
      case 'android':
        return cn(
          "bg-[var(--platform-surface)] border-0",
          "rounded-3xl",
          theme.elevation.medium
        );
      
      case 'desktop':
        return cn(
          "bg-[var(--platform-surface)] border border-[var(--platform-border)]",
          "rounded-lg",
          "hover:shadow-lg transition-shadow duration-200",
          theme.elevation.low
        );
      
      default:
        return "";
    }
  };

  const getHeaderStyles = () => {
    switch (platform) {
      case 'ios':
        return "pb-3";
      case 'android':
        return "pb-4";
      default:
        return "";
    }
  };

  const getTitleStyles = () => {
    switch (platform) {
      case 'ios':
        return "text-lg font-semibold text-[var(--platform-text)]";
      case 'android':
        return "text-xl font-medium text-[var(--platform-text)]";
      case 'desktop':
        return "text-lg font-semibold text-[var(--platform-text)]";
      default:
        return "text-[var(--platform-text)]";
    }
  };

  return (
    <Card className={cn(getCardStyles(), className)} style={{ fontFamily: theme.typography.fontFamily }}>
      {(title || description) && (
        <CardHeader className={getHeaderStyles()}>
          {title && (
            <CardTitle className={getTitleStyles()}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-[var(--platform-text-secondary)]">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={platform === 'ios' ? 'pt-0' : platform === 'android' ? 'pt-2' : ''}>
        {children}
      </CardContent>
    </Card>
  );
};
