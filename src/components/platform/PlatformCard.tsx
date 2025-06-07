
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
          "rounded-[var(--platform-border-radius)] backdrop-blur-sm",
          "shadow-sm"
        );
      
      case 'android':
        return cn(
          "bg-[var(--platform-surface)] border-0",
          "rounded-[var(--platform-border-radius)]",
          theme.elevation.medium
        );
      
      case 'desktop':
        return cn(
          "bg-[var(--platform-surface)] border border-[var(--platform-border)]",
          "rounded-[var(--platform-border-radius)]",
          "hover:shadow-lg transition-shadow duration-200",
          theme.elevation.low
        );
      
      default:
        return "";
    }
  };

  return (
    <Card className={cn(getCardStyles(), className)} style={{ fontFamily: theme.typography.fontFamily }}>
      {(title || description) && (
        <CardHeader className={platform === 'android' ? 'pb-3' : ''}>
          {title && (
            <CardTitle className={cn(
              "text-[var(--platform-text)]",
              platform === 'ios' && "text-lg font-semibold",
              platform === 'android' && "text-xl font-medium",
              platform === 'desktop' && "text-lg font-semibold"
            )}>
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
      <CardContent className={platform === 'ios' ? 'pt-0' : ''}>
        {children}
      </CardContent>
    </Card>
  );
};
