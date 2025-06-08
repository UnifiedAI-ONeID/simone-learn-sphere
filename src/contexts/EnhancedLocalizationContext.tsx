
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface TranslationCache {
  [key: string]: {
    translation: string;
    timestamp: number;
  };
}

interface EnhancedLocalizationContextType {
  currentLanguage: Language;
  availableLanguages: Language[];
  setCurrentLanguage: (language: Language) => void;
  getTranslation: (text: string, targetLanguage: string) => Promise<string>;
  translationKey: number;
  isTranslating: boolean;
  translationError: string | null;
  clearTranslationCache: () => void;
}

const EnhancedLocalizationContext = createContext<EnhancedLocalizationContextType | undefined>(undefined);

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const TRANSLATION_TIMEOUT = 10000; // 10 seconds

export const EnhancedLocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(AVAILABLE_LANGUAGES[0]);
  const [translationKey, setTranslationKey] = useState(0);
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = AVAILABLE_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }

    // Load translation cache
    const savedCache = localStorage.getItem('translationCache');
    if (savedCache) {
      try {
        const cache = JSON.parse(savedCache);
        // Clean expired cache entries
        const now = Date.now();
        const cleanCache: TranslationCache = {};
        Object.entries(cache).forEach(([key, value]: [string, any]) => {
          if (value.timestamp && now - value.timestamp < CACHE_DURATION) {
            cleanCache[key] = value;
          }
        });
        setTranslationCache(cleanCache);
      } catch (error) {
        console.warn('Failed to load translation cache:', error);
      }
    }
  }, []);

  const saveLanguagePreference = useCallback((language: Language) => {
    localStorage.setItem('selectedLanguage', language.code);
    setCurrentLanguage(language);
    setTranslationKey(prev => prev + 1);
  }, []);

  const saveTranslationCache = useCallback((cache: TranslationCache) => {
    try {
      localStorage.setItem('translationCache', JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save translation cache:', error);
    }
  }, []);

  const getTranslation = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    if (!text || targetLanguage === 'en') {
      return text;
    }

    const cacheKey = `${text}:${targetLanguage}`;
    
    // Check cache first
    const cached = translationCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.translation;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TRANSLATION_TIMEOUT);

      const { data, error } = await supabase.functions.invoke('translate-text-fixed', {
        body: { text, targetLanguage },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (error) {
        console.warn('Translation service error:', error);
        setTranslationError('Translation service temporarily unavailable');
        return text; // Return original text as fallback
      }

      const translatedText = data?.translatedText || text;

      // Cache the translation
      const newCache = {
        ...translationCache,
        [cacheKey]: {
          translation: translatedText,
          timestamp: Date.now()
        }
      };
      setTranslationCache(newCache);
      saveTranslationCache(newCache);

      return translatedText;
    } catch (error: any) {
      console.warn('Translation failed:', error);
      
      if (error.name === 'AbortError') {
        setTranslationError('Translation timeout');
      } else {
        setTranslationError('Translation service unavailable');
      }
      
      return text; // Return original text as fallback
    } finally {
      setIsTranslating(false);
    }
  }, [translationCache, saveTranslationCache]);

  const clearTranslationCache = useCallback(() => {
    setTranslationCache({});
    localStorage.removeItem('translationCache');
    setTranslationKey(prev => prev + 1);
  }, []);

  const value: EnhancedLocalizationContextType = {
    currentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    setCurrentLanguage: saveLanguagePreference,
    getTranslation,
    translationKey,
    isTranslating,
    translationError,
    clearTranslationCache
  };

  return (
    <EnhancedLocalizationContext.Provider value={value}>
      {children}
    </EnhancedLocalizationContext.Provider>
  );
};

export const useEnhancedLocalization = () => {
  const context = useContext(EnhancedLocalizationContext);
  if (context === undefined) {
    throw new Error('useEnhancedLocalization must be used within an EnhancedLocalizationProvider');
  }
  return context;
};
