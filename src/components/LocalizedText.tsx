
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Loader2 } from 'lucide-react';
import { TranslationErrorBoundary } from '@/components/TranslationErrorBoundary';

interface LocalizedTextProps {
  text: string;
  targetLanguage?: string;
  className?: string;
  fallback?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  showLoadingSpinner?: boolean;
}

const LocalizedTextContent: React.FC<LocalizedTextProps> = ({
  text,
  targetLanguage,
  className,
  fallback,
  as: Component = 'span',
  showLoadingSpinner = true,
}) => {
  const { currentLanguage, translationKey, getTranslation } = useLocalization();
  const [localizedText, setLocalizedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const translateText = useCallback(async (textToTranslate: string, target: string) => {
    if (!textToTranslate || !textToTranslate.trim()) {
      setLocalizedText('');
      return;
    }
    
    if (target === 'en') {
      setLocalizedText(textToTranslate);
      return;
    }

    setLocalizedText(textToTranslate);
    setHasError(false);
    setIsLoading(true);
    
    try {
      const result = await getTranslation(textToTranslate.trim(), target);
      setLocalizedText(result);
    } catch (error) {
      console.error('LocalizedText: Translation error for:', textToTranslate.substring(0, 30), error);
      setLocalizedText(textToTranslate);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [getTranslation]);

  useEffect(() => {
    const target = targetLanguage || currentLanguage.code;
    translateText(text, target);
  }, [text, targetLanguage, currentLanguage.code, translationKey, translateText]);

  if (isLoading && showLoadingSpinner) {
    return (
      <Component className={className}>
        {fallback || (
          <span className="inline-flex items-center space-x-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{text}</span>
          </span>
        )}
      </Component>
    );
  }

  return (
    <Component className={className} title={hasError ? 'Translation failed, showing original text' : undefined}>
      {localizedText}
    </Component>
  );
};

export const LocalizedText: React.FC<LocalizedTextProps> = (props) => {
  return (
    <TranslationErrorBoundary fallback={<span className="text-red-500 text-xs">[Translation Error]</span>}>
      <LocalizedTextContent {...props} />
    </TranslationErrorBoundary>
  );
};
