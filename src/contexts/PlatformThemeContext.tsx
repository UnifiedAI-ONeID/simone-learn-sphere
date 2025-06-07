
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePlatformDetection, Platform } from '@/hooks/usePlatformDetection';
import { getPlatformTheme, PlatformTheme } from '@/utils/platformThemes';

interface PlatformThemeContextType {
  platform: Platform;
  theme: PlatformTheme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply theme CSS variables based on current mode
  React.useEffect(() => {
    const root = document.documentElement;
    const currentColors = isDarkMode ? theme.colors.dark : theme.colors.light;
    
    Object.entries(currentColors).forEach(([key, value]) => {
      root.style.setProperty(`--platform-${key}`, value);
    });
    root.style.setProperty('--platform-font-family', theme.typography.fontFamily);
    root.style.setProperty('--platform-border-radius', theme.spacing.borderRadius);
  }, [theme, isDarkMode]);

  const value = {
    platform,
    theme,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <PlatformThemeContext.Provider value={value}>
      {children}
    </PlatformThemeContext.Provider>
  );
};
