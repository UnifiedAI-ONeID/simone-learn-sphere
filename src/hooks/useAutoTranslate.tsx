
import { useEffect, useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface UseAutoTranslateOptions {
  enabled?: boolean;
  targetLanguage?: string;
}

export const useAutoTranslate = (text: string, options: UseAutoTranslateOptions = {}) => {
  const { enabled = true, targetLanguage } = options;
  const { localizeText, currentLanguage } = useLocalization();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !text) {
      setTranslatedText(text);
      return;
    }

    const translate = async () => {
      const target = targetLanguage || currentLanguage.code;
      if (target === 'en') {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const result = await localizeText(text, target);
        setTranslatedText(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation failed');
        setTranslatedText(text); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [text, currentLanguage.code, targetLanguage, localizeText, enabled]);

  return {
    translatedText,
    isLoading,
    error,
    originalText: text,
  };
};
