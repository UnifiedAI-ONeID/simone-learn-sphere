
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalization } from '@/contexts/UnifiedLocalizationContext';
import { useContentReadyState } from '@/hooks/useContentReadyState';
import { useTranslationQueue } from '@/hooks/useTranslationQueue';
import { useVisibilityObserver } from '@/hooks/useVisibilityObserver';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OptimizedLocalizedTextProps {
  text: string;
  targetLanguage?: string;
  className?: string;
  fallback?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  showLoadingSpinner?: boolean;
  showRetryButton?: boolean;
  maxRetries?: number;
  priority?: number;
  waitForContent?: boolean;
  lazy?: boolean;
}

export const OptimizedLocalizedText: React.FC<OptimizedLocalizedTextProps> = ({
  text,
  targetLanguage,
  className,
  fallback,
  as: Component = 'span',
  showLoadingSpinner = false,
  showRetryButton = false,
  maxRetries = 3,
  priority = 1,
  waitForContent = true,
  lazy = true,
}) => {
  const { currentLanguage, translationError } = useLocalization();
  const { isContentReady } = useContentReadyState({ delay: 200 });
  const { queueTranslation } = useTranslationQueue();
  const { ref: visibilityRef, isVisible } = useVisibilityObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  const [localizedText, setLocalizedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTranslated, setHasTranslated] = useState(false);

  const targetLang = targetLanguage || currentLanguage.code;
  const shouldTranslate = targetLang !== 'en' && text.trim().length > 0;
  const canTranslate = !waitForContent || isContentReady;
  const isVisibleForTranslation = !lazy || isVisible;

  // Memoize the translation key to prevent unnecessary re-translations
  const translationKey = useMemo(() => {
    return `${text.trim()}:${targetLang}`;
  }, [text, targetLang]);

  const translateText = useCallback(async () => {
    if (!shouldTranslate || !canTranslate || !isVisibleForTranslation || hasTranslated) {
      return;
    }

    if (!text || !text.trim()) {
      setLocalizedText('');
      return;
    }

    setHasError(false);
    setIsLoading(true);
    setHasTranslated(true);

    try {
      console.log('OptimizedLocalizedText: Queuing translation:', text.substring(0, 30), 'to', targetLang);
      const result = await queueTranslation(text.trim(), targetLang, priority);
      setLocalizedText(result);
      setRetryCount(0);
      console.log('OptimizedLocalizedText: Translation complete:', result.substring(0, 30));
    } catch (error) {
      console.warn('OptimizedLocalizedText: Translation failed for:', text.substring(0, 30), error);
      setLocalizedText(text);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [shouldTranslate, canTranslate, isVisibleForTranslation, hasTranslated, text, targetLang, priority, queueTranslation]);

  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setHasTranslated(false);
      translateText();
    }
  }, [retryCount, maxRetries, translateText]);

  // Effect for translation
  useEffect(() => {
    if (shouldTranslate && canTranslate && isVisibleForTranslation && !hasTranslated) {
      // Add a small delay to avoid overwhelming the queue
      const timer = setTimeout(translateText, Math.random() * 100);
      return () => clearTimeout(timer);
    }
  }, [shouldTranslate, canTranslate, isVisibleForTranslation, hasTranslated, translationKey, translateText]);

  // Reset translation state when key changes
  useEffect(() => {
    setHasTranslated(false);
    setLocalizedText(text);
    setHasError(false);
    setIsLoading(false);
  }, [translationKey, text]);

  // Create a proper ref callback that handles both HTML and SVG elements
  const setElementRef = useCallback((element: Element | null) => {
    if (lazy && element instanceof HTMLElement) {
      visibilityRef(element);
    }
  }, [lazy, visibilityRef]);

  if (isLoading && showLoadingSpinner) {
    return React.createElement(Component, {
      ref: setElementRef,
      className: cn(className, "inline-flex items-center space-x-1")
    }, fallback || [
      React.createElement(Loader2, { key: "loader", className: "h-3 w-3 animate-spin" }),
      React.createElement("span", { key: "text" }, text)
    ]);
  }

  if (hasError || translationError) {
    return React.createElement(Component, {
      ref: setElementRef,
      className: cn(className, "inline-flex items-center space-x-1"),
      title: hasError ? 'Translation failed, showing original text' : translationError || undefined
    }, [
      React.createElement("span", { 
        key: "text",
        className: hasError ? "text-orange-600" : undefined 
      }, localizedText),
      showRetryButton && retryCount < maxRetries && React.createElement(Button, {
        key: "retry",
        variant: "ghost",
        size: "sm",
        onClick: handleRetry,
        className: "h-4 w-4 p-0 ml-1",
        title: "Retry translation"
      }, React.createElement(RefreshCw, { className: "h-3 w-3" })),
      hasError && React.createElement(AlertTriangle, { 
        key: "error", 
        className: "h-3 w-3 text-orange-500" 
      })
    ]);
  }

  return React.createElement(Component, {
    ref: setElementRef,
    className
  }, localizedText);
};

// Export with legacy names for compatibility
export const LocalizedText = OptimizedLocalizedText;
export const EnhancedLocalizedText = OptimizedLocalizedText;
