
import React from 'react';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { cn } from '@/lib/utils';

interface PlatformLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PlatformLayout: React.FC<PlatformLayoutProps> = ({ children, className }) => {
  const { platform, theme } = usePlatformTheme();

  const getLayoutStyles = () => {
    switch (platform) {
      case 'ios':
        return cn(
          "min-h-screen bg-[var(--platform-background)]",
          "font-[var(--platform-font-family)]"
        );
      
      case 'android':
        return cn(
          "min-h-screen bg-[var(--platform-background)]",
          "font-[var(--platform-font-family)]"
        );
      
      case 'desktop':
        return cn(
          "min-h-screen bg-gradient-to-br from-[var(--platform-background)] to-gray-100",
          "font-[var(--platform-font-family)]"
        );
      
      default:
        return "min-h-screen";
    }
  };

  return (
    <div className={cn(getLayoutStyles(), className)} style={{ fontFamily: theme.typography.fontFamily }}>
      {children}
    </div>
  );
};
