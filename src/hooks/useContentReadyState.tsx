
import { useState, useEffect, useRef } from 'react';

interface ContentReadyOptions {
  delay?: number;
  waitForImages?: boolean;
  waitForFonts?: boolean;
  timeout?: number;
}

export const useContentReadyState = (options: ContentReadyOptions = {}) => {
  const { delay = 300, waitForImages = false, waitForFonts = false, timeout = 5000 } = options;
  const [isContentReady, setIsContentReady] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const forceTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Force ready after timeout to prevent infinite loading
    forceTimeoutRef.current = setTimeout(() => {
      console.log('ContentReadyState: Force ready after timeout');
      setIsContentReady(true);
      setIsContentVisible(true);
    }, timeout);

    const checkContentReady = async () => {
      try {
        // Basic DOM ready check
        if (document.readyState === 'complete') {
          markAsReady();
          return;
        }

        // Wait for DOM to be complete
        const handleReadyStateChange = () => {
          if (document.readyState === 'complete') {
            document.removeEventListener('readystatechange', handleReadyStateChange);
            markAsReady();
          }
        };
        document.addEventListener('readystatechange', handleReadyStateChange);

      } catch (error) {
        console.warn('ContentReadyState: Error checking ready state, marking as ready:', error);
        markAsReady();
      }
    };

    const markAsReady = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (forceTimeoutRef.current) clearTimeout(forceTimeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        setIsContentReady(true);
        setIsContentVisible(true);
      }, delay);
    };

    checkContentReady();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (forceTimeoutRef.current) clearTimeout(forceTimeoutRef.current);
    };
  }, [delay, timeout]);

  return {
    isContentReady,
    isContentVisible,
    forceReady: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (forceTimeoutRef.current) clearTimeout(forceTimeoutRef.current);
      setIsContentReady(true);
      setIsContentVisible(true);
    }
  };
};
