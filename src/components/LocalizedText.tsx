
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
  const { localizeText, currentLanguage, translationKey } = useLocalization();
  const [localizedText, setLocalizedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const localize = async () => {
      if (!text || !text.trim()) {
        if (isMounted) {
          setLocalizedText('');
        }
        return;
      }
      
      const target = targetLanguage || currentLanguage.code;
      
      console.log('LocalizedText: Processing text:', text.substring(0, 30), 'to', target);
      
      // Always start with original text
      if (isMounted) {
        setLocalizedText(text);
        setHasError(false);
      }
      
      if (target === 'en') {
        console.log('LocalizedText: Target is English, using original text');
        return;
      }

      if (isMounted) {
        setIsLoading(true);
      }
      
      try {
        const result = await localizeText(text.trim(), target);
        if (isMounted) {
          console.log('LocalizedText: Translation completed for:', text.substring(0, 30));
          setLocalizedText(result);
        }
      } catch (error) {
        console.error('LocalizedText: Translation error for:', text.substring(0, 30), error);
        if (isMounted) {
          setLocalizedText(text);
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    localize();
    
    return () => {
      isMounted = false;
    };
  }, [text, currentLanguage.code, targetLanguage, translationKey, localizeText]);

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
