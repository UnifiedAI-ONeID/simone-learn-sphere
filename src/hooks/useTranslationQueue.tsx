
import { useState, useCallback, useRef } from 'react';
import { useLocalization } from '@/contexts/UnifiedLocalizationContext';

interface TranslationRequest {
  id: string;
  text: string;
  targetLanguage: string;
  resolve: (translation: string) => void;
  reject: (error: any) => void;
  timestamp: number;
}

const DEBOUNCE_DELAY = 200;

export const useTranslationQueue = () => {
  const { getTranslation } = useLocalization();
  const [isProcessing, setIsProcessing] = useState(false);
  const pendingRequests = useRef<Map<string, TranslationRequest>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout>();

  const processQueue = useCallback(async () => {
    if (pendingRequests.current.size === 0) return;

    setIsProcessing(true);
    const requests = Array.from(pendingRequests.current.values());
    pendingRequests.current.clear();

    console.log('TranslationQueue: Processing', requests.length, 'requests');

    // Process requests with a small delay between each to avoid overwhelming the service
    for (const request of requests) {
      try {
        const translation = await getTranslation(request.text, request.targetLanguage);
        request.resolve(translation);
      } catch (error) {
        console.warn('TranslationQueue: Failed to translate:', request.text.substring(0, 30), error);
        request.reject(error);
      }
      
      // Small delay between requests
      if (requests.indexOf(request) < requests.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    setIsProcessing(false);
  }, [getTranslation]);

  const queueTranslation = useCallback((
    text: string,
    targetLanguage: string,
    priority: number = 1
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const requestKey = `${text.trim()}:${targetLanguage}`;
      
      // If already queued, replace with new request
      if (pendingRequests.current.has(requestKey)) {
        const existing = pendingRequests.current.get(requestKey)!;
        existing.reject(new Error('Replaced by newer request'));
      }

      pendingRequests.current.set(requestKey, {
        id: requestKey,
        text: text.trim(),
        targetLanguage,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Clear existing timeout and set new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        processQueue();
      }, DEBOUNCE_DELAY);
    });
  }, [processQueue]);

  return {
    queueTranslation,
    queueSize: pendingRequests.current.size,
    isProcessing
  };
};
