import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translate, TVars } from './translations';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: {
    (key: string): string;
    (key: string, fallback?: string): string;
    (key: string, vars: TVars, fallback?: string): string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('dahab_os_lang');
      if (saved === 'ar' || saved === 'en') return saved;
      // Default to Arabic if browser is Arabic, otherwise English
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) return 'ar';
    } catch {
      // Fallback
    }
    return 'en';
  });

  const isRTL = language === 'ar';

  const applyLanguageAttributes = (lang: Language) => {
    const isArabic = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    if (isArabic) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  };

  useEffect(() => {
    applyLanguageAttributes(language);
    try {
      localStorage.setItem('dahab_os_lang', language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = useCallback(
    (key: string, arg2?: TVars | string, arg3?: string): string => {
      if (typeof arg2 === 'object') {
        return translate(key, language, arg2, arg3);
      }
      return translate(key, language, undefined, typeof arg2 === 'string' ? arg2 : undefined);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
