
import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  children?: React.ReactNode;
  level?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  level = 'polite',
  atomic = true,
  relevant = 'all'
}) => {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className="sr-only"
    >
      {children}
    </div>
  );
};

// Hook for announcing messages to screen readers
export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = useState<string>('');

  const announce = (message: string, level: 'polite' | 'assertive' = 'polite') => {
    // Clear any existing announcement
    setAnnouncement('');
    
    // Set new announcement after a brief delay to ensure it's heard
    setTimeout(() => {
      setAnnouncement(message);
      
      // Clear the announcement after it's been read
      setTimeout(() => {
        setAnnouncement('');
      }, 1000);
    }, 100);
  };

  const AnnouncementRegion = () => (
    <LiveRegion level="polite">
      {announcement}
    </LiveRegion>
  );

  return { announce, AnnouncementRegion };
};
