
import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface TranslationContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  translateText: (text: string, targetLanguage?: string) => Promise<string>;
  isTranslating: boolean;
  translations: Record<string, string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Detect user's preferred language based on browser locale
const detectUserLanguage = (): SupportedLanguage => {
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
  
  // Try exact match first
  let detectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLanguage);
  
  // If no exact match, try matching the main language code
  if (!detectedLanguage) {
    const mainLanguageCode = browserLanguage.split('-')[0];
    detectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code.split('-')[0] === mainLanguageCode);
  }
  
  // Fallback to English if no match found
  return detectedLanguage || SUPPORTED_LANGUAGES[0];
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(SUPPORTED_LANGUAGES[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load saved language preference or detect from browser
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      } else {
        // If saved language is invalid, detect from browser
        const detectedLanguage = detectUserLanguage();
        setCurrentLanguage(detectedLanguage);
        localStorage.setItem('selectedLanguage', detectedLanguage.code);
      }
    } else {
      // Auto-detect language from browser
      const detectedLanguage = detectUserLanguage();
      setCurrentLanguage(detectedLanguage);
      localStorage.setItem('selectedLanguage', detectedLanguage.code);
    }
  }, []);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language.code);
  };

  const translateText = async (
    text: string, 
    targetLanguage?: string
  ): Promise<string> => {
    if (!text) return text;
    
    const target = targetLanguage || currentLanguage.code;
    if (target === 'en') return text; // No translation needed for English

    const cacheKey = `${text}_${target}`;
    
    if (translations[cacheKey]) {
      return translations[cacheKey];
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { 
          text, 
          targetLanguage: target
        }
      });

      if (error) throw error;

      const translatedText = data.translatedText || text;
      setTranslations(prev => ({ ...prev, [cacheKey]: translatedText }));
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translateText,
        isTranslating,
        translations,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
