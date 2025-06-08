
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

interface OfflineTranslations {
  [languageCode: string]: {
    [text: string]: string;
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
  downloadLanguageContent: (languageCode: string) => Promise<boolean>;
  isLanguageDownloaded: (languageCode: string) => boolean;
  getOfflineTranslation: (text: string, targetLanguage: string) => string | null;
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

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const TRANSLATION_TIMEOUT = 8000; // 8 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const EnhancedLocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(AVAILABLE_LANGUAGES[0]);
  const [translationKey, setTranslationKey] = useState(0);
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [offlineTranslations, setOfflineTranslations] = useState<OfflineTranslations>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Load saved data on initialization
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

    // Load offline translations
    const savedOfflineTranslations = localStorage.getItem('offlineTranslations');
    if (savedOfflineTranslations) {
      try {
        setOfflineTranslations(JSON.parse(savedOfflineTranslations));
      } catch (error) {
        console.warn('Failed to load offline translations:', error);
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

  const saveOfflineTranslations = useCallback((translations: OfflineTranslations) => {
    try {
      localStorage.setItem('offlineTranslations', JSON.stringify(translations));
    } catch (error) {
      console.warn('Failed to save offline translations:', error);
    }
  }, []);

  const getOfflineTranslation = useCallback((text: string, targetLanguage: string): string | null => {
    return offlineTranslations[targetLanguage]?.[text] || null;
  }, [offlineTranslations]);

  const retryOperation = async <T,>(
    operation: () => Promise<T>,
    maxRetries: number = MAX_RETRIES,
    delay: number = RETRY_DELAY
  ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  };

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

    // Check offline translations
    const offlineTranslation = getOfflineTranslation(text, targetLanguage);
    if (offlineTranslation) {
      return offlineTranslation;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const translationOperation = async () => {
        const { data, error } = await supabase.functions.invoke('translate-text-fixed', {
          body: { text, targetLanguage }
        });

        if (error) {
          throw new Error(`Translation service error: ${error.message}`);
        }

        return data?.translatedText || text;
      };

      const translatedText = await retryOperation(translationOperation);

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

      // Also save to offline translations
      const newOfflineTranslations = {
        ...offlineTranslations,
        [targetLanguage]: {
          ...offlineTranslations[targetLanguage],
          [text]: translatedText
        }
      };
      setOfflineTranslations(newOfflineTranslations);
      saveOfflineTranslations(newOfflineTranslations);

      return translatedText;
    } catch (error: any) {
      console.warn('Translation failed:', error);
      
      // Check if we have any offline fallback
      const fallbackTranslation = getOfflineTranslation(text, targetLanguage);
      if (fallbackTranslation) {
        return fallbackTranslation;
      }
      
      setTranslationError('Translation service temporarily unavailable');
      return text; // Return original text as final fallback
    } finally {
      setIsTranslating(false);
    }
  }, [translationCache, offlineTranslations, saveTranslationCache, saveOfflineTranslations, getOfflineTranslation]);

  const downloadLanguageContent = useCallback(async (languageCode: string): Promise<boolean> => {
    if (languageCode === 'en') return true; // English is the base language
    
    const commonPhrases = [
      'Welcome', 'Sign In', 'Sign Up', 'Dashboard', 'Profile', 'Settings',
      'Courses', 'Lessons', 'Student', 'Educator', 'Admin', 'Loading...',
      'Error', 'Success', 'Cancel', 'Save', 'Delete', 'Edit', 'Create',
      'Search', 'Filter', 'Sort', 'Home', 'About', 'Contact', 'Help',
      'Account', 'Password', 'Email', 'Name', 'Language', 'Theme'
    ];

    try {
      const translations: { [key: string]: string } = {};
      
      for (const phrase of commonPhrases) {
        try {
          const translation = await getTranslation(phrase, languageCode);
          translations[phrase] = translation;
        } catch (error) {
          console.warn(`Failed to translate "${phrase}" to ${languageCode}:`, error);
          translations[phrase] = phrase; // Fallback to original
        }
      }

      const newOfflineTranslations = {
        ...offlineTranslations,
        [languageCode]: {
          ...offlineTranslations[languageCode],
          ...translations
        }
      };
      
      setOfflineTranslations(newOfflineTranslations);
      saveOfflineTranslations(newOfflineTranslations);
      
      return true;
    } catch (error) {
      console.error('Failed to download language content:', error);
      return false;
    }
  }, [getTranslation, offlineTranslations, saveOfflineTranslations]);

  const isLanguageDownloaded = useCallback((languageCode: string): boolean => {
    if (languageCode === 'en') return true;
    return Object.keys(offlineTranslations[languageCode] || {}).length > 10;
  }, [offlineTranslations]);

  const clearTranslationCache = useCallback(() => {
    setTranslationCache({});
    localStorage.removeItem('translationCache');
    localStorage.removeItem('offlineTranslations');
    setOfflineTranslations({});
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
    clearTranslationCache,
    downloadLanguageContent,
    isLanguageDownloaded,
    getOfflineTranslation
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
