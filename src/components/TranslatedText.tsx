import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Loader2 } from 'lucide-react';

interface TranslatedTextProps {
  text: string;
  targetLanguage?: string;
  className?: string;
  fallback?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  targetLanguage,
  className,
  fallback,
  as: Component = 'span',
}) => {
  const { translateText, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (!text) return;
      
      const target = targetLanguage || currentLanguage.code;
      if (target === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      try {
        const result = await translateText(text, target);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [text, currentLanguage.code, targetLanguage, translateText]);

  if (isLoading) {
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

  return <Component className={className}>{translatedText}</Component>;
}