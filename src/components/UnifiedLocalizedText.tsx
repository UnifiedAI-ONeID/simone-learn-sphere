
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '@/contexts/UnifiedLocalizationContext';
import { useContentReadyState } from '@/hooks/useContentReadyState';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UnifiedLocalizedTextProps {
  text: string;
  targetLanguage?: string;
  className?: string;
  fallback?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  showLoadingSpinner?: boolean;
  showRetryButton?: boolean;
  maxRetries?: number;
}

export const UnifiedLocalizedText: React.FC<UnifiedLocalizedTextProps> = ({
  text,
  targetLanguage,
  className,
  fallback,
  as: Component = 'span',
  showLoadingSpinner = false,
  showRetryButton = false,
  maxRetries = 3,
}) => {
  const { currentLanguage, translationKey, getTranslation, isTranslating, translationError } = useLocalization();
  const { isContentReady } = useContentReadyState({ delay: 100, timeout: 2000 });
  const [localizedText, setLocalizedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const translateText = useCallback(async (textToTranslate: string, target: string) => {
    if (!textToTranslate || !textToTranslate.trim()) {
      setLocalizedText('');
      return;
    }
    
    if (target === 'en') {
      setLocalizedText(textToTranslate);
      return;
    }

    // Show original text immediately
    setLocalizedText(textToTranslate);

    // Don't translate if content isn't ready yet
    if (!isContentReady) {
      return;
    }

    setHasError(false);
    setIsLoading(true);
    
    try {
      console.log('UnifiedLocalizedText: Translating after content ready:', textToTranslate.substring(0, 30), 'to', target);
      const result = await getTranslation(textToTranslate.trim(), target);
      setLocalizedText(result);
      setRetryCount(0);
      console.log('UnifiedLocalizedText: Translation result:', result.substring(0, 30));
    } catch (error) {
      console.warn('UnifiedLocalizedText: Translation error for:', textToTranslate.substring(0, 30), error);
      setLocalizedText(textToTranslate); // Keep original text on error
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [getTranslation, isContentReady]);

  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      const target = targetLanguage || currentLanguage.code;
      translateText(text, target);
    }
  }, [retryCount, maxRetries, targetLanguage, currentLanguage.code, text, translateText]);

  useEffect(() => {
    const target = targetLanguage || currentLanguage.code;
    translateText(text, target);
  }, [text, targetLanguage, currentLanguage.code, translationKey, translateText]);

  if (isLoading && showLoadingSpinner) {
    return (
      <Component className={cn(className, "inline-flex items-center space-x-1")}>
        {fallback || (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{text}</span>
          </>
        )}
      </Component>
    );
  }

  if (hasError || translationError) {
    return (
      <Component 
        className={cn(className, "inline-flex items-center space-x-1")} 
        title={hasError ? 'Translation failed, showing original text' : translationError || undefined}
      >
        <span className={hasError ? "text-orange-600" : undefined}>
          {localizedText}
        </span>
        {showRetryButton && retryCount < maxRetries && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            className="h-4 w-4 p-0 ml-1"
            title="Retry translation"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
        {hasError && (
          <AlertTriangle className="h-3 w-3 text-orange-500" />
        )}
      </Component>
    );
  }

  return (
    <Component className={className}>
      {localizedText}
    </Component>
  );
};

// Export with legacy names for compatibility
export const LocalizedText = UnifiedLocalizedText;
export const EnhancedLocalizedText = UnifiedLocalizedText;
