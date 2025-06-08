
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
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  const setRef = useCallback((element: HTMLElement | null) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = element;

    if (element && !hasBeenVisible) {
      if (!observerRef.current) {
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
      }
      
      observerRef.current.observe(element);
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
