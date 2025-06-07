
import React, { useState, useEffect } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Loader2 } from 'lucide-react';

interface LocalizedTextProps {
  text: string;
  targetLanguage?: string;
  className?: string;
  fallback?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  showLoadingSpinner?: boolean;
}

export const LocalizedText: React.FC<LocalizedTextProps> = ({
  text,
  targetLanguage,
  className,
  fallback,
  as: Component = 'span',
  showLoadingSpinner = true,
}) => {
  const { localizeText, currentLanguage } = useLocalization();
  const [localizedText, setLocalizedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const localize = async () => {
      if (!text) {
        setLocalizedText('');
        return;
      }
      
      const target = targetLanguage || currentLanguage.code;
      
      // Reset to original text first to avoid showing stale translations
      setLocalizedText(text);
      setHasError(false);
      
      if (target === 'en') {
        setLocalizedText(text);
        return;
      }

      setIsLoading(true);
      
      try {
        const result = await localizeText(text, target);
        setLocalizedText(result);
      } catch (error) {
        console.error('Localization error:', error);
        setLocalizedText(text);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    localize();
  }, [text, currentLanguage.code, targetLanguage, localizeText]);

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
