
import { Platform } from '@/hooks/usePlatformDetection';

export interface PlatformTheme {
  colors: {
    light: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      accent: string;
    };
    dark: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      accent: string;
    };
  };
  typography: {
    fontFamily: string;
    headingWeight: string;
    bodyWeight: string;
  };
  spacing: {
    unit: number;
    borderRadius: string;
  };
  elevation: {
    low: string;
    medium: string;
    high: string;
  };
}

const iosTheme: PlatformTheme = {
  colors: {
    light: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#F2F2F7',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C6C6C8',
      accent: '#FF3B30',
    },
    dark: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      accent: '#FF453A',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    headingWeight: '600',
    bodyWeight: '400',
  },
  spacing: {
    unit: 8,
    borderRadius: '10px',
  },
  elevation: {
    low: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 4px 12px rgba(0,0,0,0.15)',
    high: '0 8px 24px rgba(0,0,0,0.2)',
  },
};

const androidTheme: PlatformTheme = {
  colors: {
    light: {
      primary: '#6750A4',
      secondary: '#625B71',
      background: '#FFFBFE',
      surface: '#FFFFFF',
      text: '#1D1B20',
      textSecondary: '#49454F',
      border: '#79747E',
      accent: '#B3261E',
    },
    dark: {
      primary: '#D0BCFF',
      secondary: '#CCC2DC',
      background: '#141218',
      surface: '#1D1B20',
      text: '#E6E0E9',
      textSecondary: '#CAC4D0',
      border: '#938F99',
      accent: '#F2B8B5',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Noto Sans", sans-serif',
    headingWeight: '500',
    bodyWeight: '400',
  },
  spacing: {
    unit: 8,
    borderRadius: '12px',
  },
  elevation: {
    low: '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
    medium: '0 2px 6px 2px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.3)',
    high: '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)',
  },
};

const desktopTheme: PlatformTheme = {
  colors: {
    light: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      accent: '#ef4444',
    },
    dark: {
      primary: '#818cf8',
      secondary: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      accent: '#f87171',
    },
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
    headingWeight: '600',
    bodyWeight: '400',
  },
  spacing: {
    unit: 16,
    borderRadius: '8px',
  },
  elevation: {
    low: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    high: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

export const getPlatformTheme = (platform: Platform): PlatformTheme => {
  switch (platform) {
    case 'ios':
      return iosTheme;
    case 'android':
      return androidTheme;
    case 'desktop':
      return desktopTheme;
    default:
      return desktopTheme;
  }
};
