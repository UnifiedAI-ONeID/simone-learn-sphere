
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVisibilityObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useVisibilityObserver = (options: UseVisibilityObserverOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((element: Element | null) => {
    // Clean up previous observer
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = element;

    if (element && !hasBeenVisible) {
      // Create observer if it doesn't exist
      if (!observerRef.current) {
        try {
          observerRef.current = new IntersectionObserver(
            ([entry]) => {
              const isCurrentlyVisible = entry.isIntersecting;
              setIsVisible(isCurrentlyVisible);
              
              if (isCurrentlyVisible && !hasBeenVisible) {
                setHasBeenVisible(true);
                
                if (triggerOnce && observerRef.current && elementRef.current) {
                  observerRef.current.unobserve(elementRef.current);
                }
              }
            },
            { threshold, rootMargin }
          );
        } catch (error) {
          console.warn('VisibilityObserver: Failed to create observer, marking as visible:', error);
          setIsVisible(true);
          setHasBeenVisible(true);
          return;
        }
      }
      
      // Observe the element
      try {
        observerRef.current.observe(element);
      } catch (error) {
        console.warn('VisibilityObserver: Failed to observe element, marking as visible:', error);
        setIsVisible(true);
        setHasBeenVisible(true);
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasBeenVisible]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ref: setRef,
    isVisible: triggerOnce ? hasBeenVisible : isVisible,
    hasBeenVisible
  };
};
