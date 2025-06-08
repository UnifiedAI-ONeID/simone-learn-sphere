
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SupportedLanguage = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

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

interface UnifiedLocalizationContextType {
  // Enhanced features
  currentLanguage: SupportedLanguage;
  availableLanguages: SupportedLanguage[];
  setCurrentLanguage: (language: SupportedLanguage) => void;
  getTranslation: (text: string, targetLanguage?: string) => Promise<string>;
  translationKey: number;
  isTranslating: boolean;
  translationError: string | null;
  clearTranslationCache: () => void;
  downloadLanguageContent: (languageCode: string) => Promise<boolean>;
  isLanguageDownloaded: (languageCode: string) => boolean;
  getOfflineTranslation: (text: string, targetLanguage: string) => string | null;
  
  // Legacy compatibility
  setLanguage: (language: SupportedLanguage) => void;
  isLocalizing: boolean;
  clearTranslationError: () => void;
  forceRefresh: () => void;
}

const UnifiedLocalizationContext = createContext<UnifiedLocalizationContextType | undefined>(undefined);

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const detectUserLanguage = (): SupportedLanguage => {
  // Always default to English first
  const defaultLanguage = SUPPORTED_LANGUAGES[0]; // English
  
  try {
    // Get browser language preferences
    const browserLanguages = navigator.languages || [navigator.language || 'en'];
    console.log('UnifiedLocalization: Browser languages detected:', browserLanguages);
    
    // Try to find exact match first
    for (const browserLang of browserLanguages) {
      const exactMatch = SUPPORTED_LANGUAGES.find(lang => 
        lang.code.toLowerCase() === browserLang.toLowerCase()
      );
      if (exactMatch) {
        console.log('UnifiedLocalization: Exact language match found:', exactMatch.code);
        return exactMatch;
      }
    }
    
    // Try to find language family match (e.g., 'en-US' -> 'en')
    for (const browserLang of browserLanguages) {
      const mainLanguageCode = browserLang.split('-')[0].toLowerCase();
      const familyMatch = SUPPORTED_LANGUAGES.find(lang => 
        lang.code.split('-')[0].toLowerCase() === mainLanguageCode
      );
      if (familyMatch) {
        console.log('UnifiedLocalization: Language family match found:', familyMatch.code);
        return familyMatch;
      }
    }
    
    console.log('UnifiedLocalization: No language match found, using default English');
    return defaultLanguage;
  } catch (error) {
    console.warn('UnifiedLocalization: Error detecting language, using default English:', error);
    return defaultLanguage;
  }
};

const getInitialLanguage = (): SupportedLanguage => {
  try {
    // First check if user has saved a language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        console.log('UnifiedLocalization: Loaded saved language preference:', language.code);
        return language;
      }
    }
  } catch (error) {
    console.warn('UnifiedLocalization: Error reading saved language preference:', error);
  }
  
  // If no saved preference, detect from browser
  const detectedLanguage = detectUserLanguage();
  console.log('UnifiedLocalization: Using detected language:', detectedLanguage.code);
  return detectedLanguage;
};

export const UnifiedLocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => getInitialLanguage());
  const [translationKey, setTranslationKey] = useState(0);
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [offlineTranslations, setOfflineTranslations] = useState<OfflineTranslations>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Load saved data on initialization
  useEffect(() => {
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
        console.warn('UnifiedLocalization: Failed to load translation cache:', error);
      }
    }

    const savedOfflineTranslations = localStorage.getItem('offlineTranslations');
    if (savedOfflineTranslations) {
      try {
        setOfflineTranslations(JSON.parse(savedOfflineTranslations));
      } catch (error) {
        console.warn('UnifiedLocalization: Failed to load offline translations:', error);
      }
    }
  }, []);

  // Re-detect language on component mount for dynamic detection
  useEffect(() => {
    const detectedLanguage = detectUserLanguage();
    const savedLanguage = localStorage.getItem('selectedLanguage');
    
    // Only update if no saved preference exists and detected language is different
    if (!savedLanguage && detectedLanguage.code !== currentLanguage.code) {
      console.log('UnifiedLocalization: Updating to newly detected language:', detectedLanguage.code);
      setCurrentLanguage(detectedLanguage);
      setTranslationKey(prev => prev + 1);
    }
  }, [currentLanguage.code]);

  const saveLanguagePreference = useCallback((language: SupportedLanguage) => {
    console.log('UnifiedLocalization: Setting language to:', language.code);
    localStorage.setItem('selectedLanguage', language.code);
    setCurrentLanguage(language);
    setTranslationKey(prev => prev + 1);
    setTranslationError(null);
  }, []);

  const saveTranslationCache = useCallback((cache: TranslationCache) => {
    try {
      localStorage.setItem('translationCache', JSON.stringify(cache));
    } catch (error) {
      console.warn('UnifiedLocalization: Failed to save translation cache:', error);
    }
  }, []);

  const saveOfflineTranslations = useCallback((translations: OfflineTranslations) => {
    try {
      localStorage.setItem('offlineTranslations', JSON.stringify(translations));
    } catch (error) {
      console.warn('UnifiedLocalization: Failed to save offline translations:', error);
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

  const getTranslation = useCallback(async (text: string, targetLanguage?: string): Promise<string> => {
    if (!text || !text.trim()) {
      return text;
    }
    
    const target = targetLanguage || currentLanguage.code;
    if (target === 'en') {
      return text;
    }

    const cacheKey = `${text.trim()}:${target}`;
    
    // Check cache first
    const cached = translationCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.translation;
    }

    // Check offline translations
    const offlineTranslation = getOfflineTranslation(text, target);
    if (offlineTranslation) {
      return offlineTranslation;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const translationOperation = async () => {
        const { data, error } = await supabase.functions.invoke('translate-text-fixed', {
          body: { text: text.trim(), targetLanguage: target }
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
        [target]: {
          ...offlineTranslations[target],
          [text]: translatedText
        }
      };
      setOfflineTranslations(newOfflineTranslations);
      saveOfflineTranslations(newOfflineTranslations);

      return translatedText;
    } catch (error: any) {
      console.warn('UnifiedLocalization: Translation failed:', error);
      
      const fallbackTranslation = getOfflineTranslation(text, target);
      if (fallbackTranslation) {
        return fallbackTranslation;
      }
      
      setTranslationError('Translation service temporarily unavailable');
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [translationCache, offlineTranslations, currentLanguage.code, saveTranslationCache, saveOfflineTranslations, getOfflineTranslation]);

  const downloadLanguageContent = useCallback(async (languageCode: string): Promise<boolean> => {
    if (languageCode === 'en') return true;
    
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
          translations[phrase] = phrase;
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

  const forceRefresh = useCallback(() => {
    console.log('UnifiedLocalization: Force refreshing translations');
    setTranslationCache({});
    setTranslationKey(prev => prev + 1);
  }, []);

  const clearTranslationError = useCallback(() => {
    setTranslationError(null);
  }, []);

  const value: UnifiedLocalizationContextType = {
    // Enhanced features
    currentLanguage,
    availableLanguages: SUPPORTED_LANGUAGES,
    setCurrentLanguage: saveLanguagePreference,
    getTranslation,
    translationKey,
    isTranslating,
    translationError,
    clearTranslationCache,
    downloadLanguageContent,
    isLanguageDownloaded,
    getOfflineTranslation,
    
    // Legacy compatibility
    setLanguage: saveLanguagePreference,
    isLocalizing: isTranslating,
    clearTranslationError,
    forceRefresh,
  };

  return (
    <UnifiedLocalizationContext.Provider value={value}>
      {children}
    </UnifiedLocalizationContext.Provider>
  );
};

// Export both hooks for compatibility
export const useLocalization = () => {
  const context = useContext(UnifiedLocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a UnifiedLocalizationProvider');
  }
  return context;
};

export const useEnhancedLocalization = () => {
  const context = useContext(UnifiedLocalizationContext);
  if (context === undefined) {
    throw new Error('useEnhancedLocalization must be used within a UnifiedLocalizationProvider');
  }
  return context;
};
