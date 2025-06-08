
import { useState, useEffect, useRef } from 'react';

interface ContentReadyOptions {
  delay?: number;
  waitForImages?: boolean;
  waitForFonts?: boolean;
}

export const useContentReadyState = (options: ContentReadyOptions = {}) => {
  const { delay = 300, waitForImages = true, waitForFonts = true } = options;
  const [isContentReady, setIsContentReady] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkContentReady = async () => {
      try {
        // Wait for DOM to be ready
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            const handler = () => {
              if (document.readyState === 'complete') {
                document.removeEventListener('readystatechange', handler);
                resolve(void 0);
              }
            };
            document.addEventListener('readystatechange', handler);
          });
        }

        // Wait for images if requested
        if (waitForImages) {
          const images = document.querySelectorAll('img');
          await Promise.all(
            Array.from(images).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise(resolve => {
                img.onload = img.onerror = () => resolve(void 0);
              });
            })
          );
        }

        // Wait for fonts if requested
        if (waitForFonts && 'fonts' in document) {
          await document.fonts.ready;
        }

        // Add a small delay to ensure everything is settled
        timeoutRef.current = setTimeout(() => {
          setIsContentReady(true);
          setIsContentVisible(true);
        }, delay);

      } catch (error) {
        console.warn('Content ready check failed:', error);
        // Fallback - mark as ready after delay
        timeoutRef.current = setTimeout(() => {
          setIsContentReady(true);
          setIsContentVisible(true);
        }, delay);
      }
    };

    checkContentReady();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, waitForImages, waitForFonts]);

  return {
    isContentReady,
    isContentVisible,
    forceReady: () => {
      setIsContentReady(true);
      setIsContentVisible(true);
    }
  };
};
