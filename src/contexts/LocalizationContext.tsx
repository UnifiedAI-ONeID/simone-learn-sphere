
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

interface LocalizationContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  getTranslation: (text: string, targetLanguage?: string) => Promise<string>;
  isLocalizing: boolean;
  translationError: string | null;
  clearTranslationError: () => void;
  translationKey: number;
  forceRefresh: () => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

const detectUserLanguage = (): SupportedLanguage => {
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
  
  let detectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLanguage);
  
  if (!detectedLanguage) {
    const mainLanguageCode = browserLanguage.split('-')[0];
    detectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code.split('-')[0] === mainLanguageCode);
  }
  
  return detectedLanguage || SUPPORTED_LANGUAGES[0];
};

const getInitialLanguage = (): SupportedLanguage => {
  try {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        console.log('LocalizationProvider: Loaded saved language:', language.code);
        return language;
      }
    }
  } catch (error) {
    console.warn('LocalizationProvider: Error reading from localStorage:', error);
  }
  
  const detectedLanguage = detectUserLanguage();
  console.log('LocalizationProvider: Using detected language:', detectedLanguage.code);
  return detectedLanguage;
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getInitialLanguage);
  const [isLocalizing, setIsLocalizing] = useState(false);
  const [localizations, setLocalizations] = useState<Record<string, string>>({});
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translationKey, setTranslationKey] = useState(0);

  const setLanguage = useCallback((language: SupportedLanguage) => {
    console.log('LocalizationProvider: Setting language to:', language.code);
    setCurrentLanguage(language);
    
    try {
      localStorage.setItem('selectedLanguage', language.code);
    } catch (error) {
      console.warn('LocalizationProvider: Error saving to localStorage:', error);
    }
    
    setTranslationError(null);
    
    // Clear cache and force re-translation immediately
    setLocalizations({});
    setTranslationKey(prev => prev + 1);
    console.log('LocalizationProvider: Cache cleared, translation key incremented');
  }, []);

  const forceRefresh = useCallback(() => {
    console.log('LocalizationProvider: Force refreshing translations');
    setLocalizations({});
    setTranslationKey(prev => prev + 1);
  }, []);

  const clearTranslationError = useCallback(() => {
    setTranslationError(null);
  }, []);

  const getTranslation = useCallback(async (
    text: string, 
    targetLanguage?: string
  ): Promise<string> => {
    if (!text || !text.trim()) {
      console.log('LocalizationProvider: Empty text, returning as-is');
      return text;
    }
    
    const target = targetLanguage || currentLanguage.code;
    if (target === 'en') {
      console.log('LocalizationProvider: Target is English, returning original text');
      return text;
    }

    const cacheKey = `${text.trim()}_${target}`;
    
    if (localizations[cacheKey]) {
      console.log('LocalizationProvider: Using cached translation for:', text.substring(0, 30));
      return localizations[cacheKey];
    }

    console.log('LocalizationProvider: Starting translation for:', text.substring(0, 30), 'to', target);
    setIsLocalizing(true);
    setTranslationError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('localize-text', {
        body: { 
          text: text.trim(), 
          targetLanguage: target
        }
      });

      if (error) {
        console.error('LocalizationProvider: Translation service error:', error);
        setTranslationError('Translation service temporarily unavailable');
        return text;
      }

      const localizedText = data?.localizedText || text;
      console.log('LocalizationProvider: Translation result:', localizedText.substring(0, 30));
      
      // Update cache
      setLocalizations(prev => ({ ...prev, [cacheKey]: localizedText }));
      return localizedText;
    } catch (error) {
      console.error('LocalizationProvider: Localization error:', error);
      setTranslationError('Failed to translate text');
      return text;
    } finally {
      setIsLocalizing(false);
    }
  }, [currentLanguage.code, localizations]);

  return (
    <LocalizationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        getTranslation,
        isLocalizing,
        translationError,
        clearTranslationError,
        translationKey,
        forceRefresh,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
