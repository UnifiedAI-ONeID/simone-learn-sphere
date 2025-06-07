
import React, { createContext, useContext, ReactNode } from 'react';
import { usePlatformDetection, Platform } from '@/hooks/usePlatformDetection';
import { getPlatformTheme, PlatformTheme } from '@/utils/platformThemes';

interface PlatformThemeContextType {
  platform: Platform;
  theme: PlatformTheme;
}

const PlatformThemeContext = createContext<PlatformThemeContextType | undefined>(undefined);

export const usePlatformTheme = () => {
  const context = useContext(PlatformThemeContext);
  if (context === undefined) {
    throw new Error('usePlatformTheme must be used within a PlatformThemeProvider');
  }
  return context;
};

interface PlatformThemeProviderProps {
  children: ReactNode;
}

export const PlatformThemeProvider: React.FC<PlatformThemeProviderProps> = ({ children }) => {
  const platform = usePlatformDetection();
  const theme = getPlatformTheme(platform);

  // Apply theme CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--platform-${key}`, value);
    });
    root.style.setProperty('--platform-font-family', theme.typography.fontFamily);
    root.style.setProperty('--platform-border-radius', theme.spacing.borderRadius);
  }, [theme]);

  const value = {
    platform,
    theme,
  };

  return (
    <PlatformThemeContext.Provider value={value}>
      {children}
    </PlatformThemeContext.Provider>
  );
};
