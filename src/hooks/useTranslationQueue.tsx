
import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalization } from '@/contexts/UnifiedLocalizationContext';

interface TranslationRequest {
  id: string;
  text: string;
  targetLanguage: string;
  resolve: (translation: string) => void;
  reject: (error: any) => void;
  priority: number;
}

const BATCH_SIZE = 5;
const BATCH_DELAY = 100;
const MAX_CONCURRENT = 3;

export const useTranslationQueue = () => {
  const { getTranslation } = useLocalization();
  const [queue, setQueue] = useState<TranslationRequest[]>([]);
  const [processing, setProcessing] = useState(new Set<string>());
  const processingRef = useRef(new Set<string>());
  const batchTimeoutRef = useRef<NodeJS.Timeout>();

  // Update ref when state changes
  useEffect(() => {
    processingRef.current = processing;
  }, [processing]);

  const processQueue = useCallback(async () => {
    if (queue.length === 0 || processingRef.current.size >= MAX_CONCURRENT) {
      return;
    }

    // Get batch of requests to process
    const batch = queue
      .filter(req => !processingRef.current.has(req.id))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, Math.min(BATCH_SIZE, MAX_CONCURRENT - processingRef.current.size));

    if (batch.length === 0) return;

    // Mark as processing
    const batchIds = batch.map(req => req.id);
    setProcessing(prev => {
      const newSet = new Set(prev);
      batchIds.forEach(id => newSet.add(id));
      return newSet;
    });

    // Remove from queue
    setQueue(prev => prev.filter(req => !batchIds.includes(req.id)));

    // Process batch
    const promises = batch.map(async (request) => {
      try {
        const translation = await getTranslation(request.text, request.targetLanguage);
        request.resolve(translation);
      } catch (error) {
        console.warn('Translation failed for:', request.text.substring(0, 30), error);
        request.reject(error);
      } finally {
        setProcessing(prev => {
          const newSet = new Set(prev);
          newSet.delete(request.id);
          return newSet;
        });
      }
    });

    await Promise.all(promises);

    // Process next batch if queue is not empty
    if (queue.length > batchIds.length) {
      setTimeout(processQueue, BATCH_DELAY);
    }
  }, [queue, getTranslation]);

  // Auto-process queue when items are added
  useEffect(() => {
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(() => {
      processQueue();
    }, BATCH_DELAY);

    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, [queue.length, processQueue]);

  const queueTranslation = useCallback((
    text: string,
    targetLanguage: string,
    priority: number = 1
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const id = `${text}:${targetLanguage}:${Date.now()}:${Math.random()}`;
      
      setQueue(prev => [...prev, {
        id,
        text,
        targetLanguage,
        resolve,
        reject,
        priority
      }]);
    });
  }, []);

  return {
    queueTranslation,
    queueSize: queue.length,
    isProcessing: processing.size > 0
  };
};
