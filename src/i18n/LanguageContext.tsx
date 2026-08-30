import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from './translations';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
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

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    if (fallback) return fallback;
    return entry ? entry.en : key;
  };

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
