
import { useState, useEffect } from 'react';

export type Platform = 'ios' | 'android' | 'desktop';

export const usePlatformDetection = () => {
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    const detectPlatform = (): Platform => {
      const userAgent = navigator.userAgent;
      
      // Check for iOS devices
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        return 'ios';
      }
      
      // Check for Android devices
      if (/Android/.test(userAgent)) {
        return 'android';
      }
      
      // Check for mobile viewport on other devices
      const isMobileViewport = window.innerWidth < 768;
      if (isMobileViewport) {
        // Default to iOS design for mobile web
        return 'ios';
      }
      
      return 'desktop';
    };

    setPlatform(detectPlatform());

    // Listen for viewport changes
    const handleResize = () => {
      setPlatform(detectPlatform());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return platform;
};
