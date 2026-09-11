import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { interpolate } from './interpolate';
import { ensureDictionarySync, getInstalledView, translateFrom, type I18nLang } from './translator';
import { getBootLanguage } from './boot';
import type { DictView, TVars } from './resolve';

interface LanguageContextType {
  language: I18nLang;
  isRTL: boolean;
  setLanguage: (lang: I18nLang) => void;
  toggleLanguage: () => void;
  t: {
    (key: string): string;
    (key: string, fallback?: string): string;
    (key: string, vars: TVars, fallback?: string): string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type StringOverrides = Record<string, { en: string; ar: string }>;

const STRINGS_CACHE_KEY = 'dahab_strings_bundle_v1';

function readCachedBundle(): { version: string; strings: StringOverrides } | null {
  try {
    const raw = localStorage.getItem(STRINGS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.version !== 'string' || typeof parsed?.strings !== 'object' || !parsed.strings) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Views kept for the synchronous switch path (see below). The boot language's
 * view is guaranteed installed by main.tsx BEFORE App is imported; the other
 * view is filled by the idle preload and makes EN available as the
 * cross-language fallback and AR switches instant.
 */
const views: { [K in I18nLang]: DictView | undefined } = { en: undefined, ar: undefined };

function rememberView(lang: I18nLang): DictView | undefined {
  const view = getInstalledView(lang);
  if (view) views[lang] = view;
  return views[lang];
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // main.tsx already decided the boot language (and installed its dictionary)
  // through boot.ts; reusing getBootLanguage() here means both sites agree by
  // construction instead of re-reading storage with a second decision tree.
  const [language, setLanguageState] = useState<I18nLang>(() => getBootLanguage());

  // Dashboard-published copy overrides (merged over compiled defaults by t()).
  // Loaded lazily so first paint never waits on it; the cached bundle applies
  // synchronously on the next visit.
  const [overrides, setOverrides] = useState<StringOverrides>(() => readCachedBundle()?.strings || {});

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedBundle();
    const url = cached?.version
      ? `/api/content/strings?v=${encodeURIComponent(cached.version)}`
      : '/api/content/strings';
    fetch(url)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (cancelled || !data || data.status !== 'success') return;
        if (data.unchanged) return;
        const strings = (data.strings || {}) as StringOverrides;
        setOverrides(strings);
        try {
          localStorage.setItem(STRINGS_CACHE_KEY, JSON.stringify({ version: data.version, strings }));
        } catch {
          // Storage full or blocked — the live bundle is already in state.
        }
      })
      .catch(() => {
        // Offline or server unreachable: compiled defaults + cache still render.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isRTL = language === 'ar';

  // Capture the installed view for the current language (mount + switches).
  // After a switch to the other language this picks up the idle-preloaded
  // view, so the NEXT switch back is synchronous. Runs after render on
  // purpose: reading the registry here, not during it.
  useEffect(() => {
    rememberView(language);
  }, [language]);

  const applyLanguageAttributes = (lang: I18nLang) => {
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

  /**
   * Switches install the target dictionary SYNCHRONOUSLY inside the state
   * updater: the idle preload has already loaded the other language's view
   * (held in `views`), so the toggle commit re-renders from a fully installed
   * dictionary — a missing string can never be visible for a frame. If the
   * view is somehow absent (preload cancelled before a rapid toggle), the
   * switch still happens; t() then degrades to the per-call fallback / EN
   * cross-language fallback and the preload's setDictionary lands before the
   * next paint via the context-value change.
   */
  const setLanguage = (lang: I18nLang) => {
    setLanguageState((prev) => {
      const view = views[lang];
      if (view) ensureDictionarySync(lang, view);
      return lang;
    });
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      const view = views[next];
      if (view) ensureDictionarySync(next, view);
      return next;
    });
  };

  const t = useCallback(
    (key: string, arg2?: TVars | string, arg3?: string): string => {
      // Dashboard override wins over the compiled default in both languages.
      // An override is the editor's explicit value, so it also wins over the
      // per-call fallback string.
      const override = overrides[key]?.[language];
      if (override) {
        if (typeof arg2 === 'object') return interpolate(override, arg2);
        return override;
      }
      // Registry-backed resolution: active language's view with the EN view
      // (when installed) as the cross-language fallback — same contract as
      // the compiled translate(), from per-language data.
      const active = rememberView(language);
      const enView = language === 'en' ? active : rememberView('en');
      if (typeof arg2 === 'object') {
        return translateFrom(active, enView, key, language, arg2, arg3);
      }
      return translateFrom(
        active,
        enView,
        key,
        language,
        undefined,
        typeof arg2 === 'string' ? arg2 : undefined
      );
    },
    [language, overrides]
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
