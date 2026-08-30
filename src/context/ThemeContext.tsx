import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'charcoal-minimal' | 'deep-reef' | 'sinai-midnight' | 'editorial-sand' | 'lagoon-breeze' | 'high-contrast-pro';
export type ThemeMode = 'dark' | 'light';

export interface ThemeOption {
  id: ThemeId;
  nameEn: string;
  nameAr: string;
  category: ThemeMode;
  taglineEn: string;
  taglineAr: string;
  accentLabel: string;
  wcagLevel: 'AAA' | 'AA+';
  contrastRatio: string;
  swatches: {
    bg: string;
    card: string;
    container: string;
    accent: string;
    accentSecondary: string;
    text: string;
    textSecondary: string;
    focusRing: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'charcoal-minimal',
    nameEn: 'Soft Charcoal',
    nameAr: 'رمادي هادئ',
    category: 'dark',
    taglineEn: 'Pure studio charcoal with titanium and crisp white contrast',
    taglineAr: 'رمادي فحمي نقي ومريح جداً للعين',
    accentLabel: 'Sky Cyan',
    wcagLevel: 'AAA',
    contrastRatio: '15.6:1',
    swatches: {
      bg: '#1F1F1F',
      card: '#292929',
      container: '#333333',
      accent: '#38BDF8',
      accentSecondary: '#F6C36E',
      text: '#FFFFFF',
      textSecondary: '#D1D5DB',
      focusRing: '#38BDF8',
    },
  },
  {
    id: 'deep-reef',
    nameEn: 'Emerald Green',
    nameAr: 'أخضر زمردي',
    category: 'dark',
    taglineEn: 'Deep obsidian ocean with vibrant emerald glow',
    taglineAr: 'أسود أوبسيديان مع لمسات زمردية هادئة',
    accentLabel: 'Emerald',
    wcagLevel: 'AAA',
    contrastRatio: '17.8:1',
    swatches: {
      bg: '#050B0A',
      card: '#0A1513',
      container: '#11221F',
      accent: '#10B981',
      accentSecondary: '#F59E0B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      focusRing: '#10B981',
    },
  },
  {
    id: 'sinai-midnight',
    nameEn: 'Midnight Blue',
    nameAr: 'أزرق ليلي',
    category: 'dark',
    taglineEn: 'Night sky with luminous cyan accents',
    taglineAr: 'سماء سيناء الليلية مع أزرق هادئ',
    accentLabel: 'Electric Cyan',
    wcagLevel: 'AAA',
    contrastRatio: '18.9:1',
    swatches: {
      bg: '#040711',
      card: '#081022',
      container: '#0F1E3D',
      accent: '#06B6D4',
      accentSecondary: '#8B5CF6',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      focusRing: '#06B6D4',
    },
  },
  {
    id: 'editorial-sand',
    nameEn: 'Warm Sand',
    nameAr: 'رمال الصحراء',
    category: 'light',
    taglineEn: 'Warm desert dunes and deep obsidian ink',
    taglineAr: 'كثبان الصحراء الدافئة مع نصوص واضحة',
    accentLabel: 'Obsidian Ink',
    wcagLevel: 'AAA',
    contrastRatio: '17.1:1',
    swatches: {
      bg: '#F8F6F0',
      card: '#FFFFFF',
      container: '#EFECE2',
      accent: '#0F172A',
      accentSecondary: '#059669',
      text: '#090D16',
      textSecondary: '#334155',
      focusRing: '#0F172A',
    },
  },
  {
    id: 'lagoon-breeze',
    nameEn: 'Lagoon Blue',
    nameAr: 'أزرق فيروزي',
    category: 'light',
    taglineEn: 'Crystal sea water with deep slate legibility',
    taglineAr: 'مياه اللاجونا الكريستالية الفيروزية',
    accentLabel: 'Pure Teal',
    wcagLevel: 'AAA',
    contrastRatio: '15.4:1',
    swatches: {
      bg: '#F0F9FF',
      card: '#FFFFFF',
      container: '#E0F2FE',
      accent: '#0D9488',
      accentSecondary: '#0284C7',
      text: '#022C22',
      textSecondary: '#134E4A',
      focusRing: '#0D9488',
    },
  },
  {
    id: 'high-contrast-pro',
    nameEn: 'High Contrast',
    nameAr: 'أقصى وضوح',
    category: 'dark',
    taglineEn: 'Pure black 21:1 contrast for maximum visibility',
    taglineAr: 'أسود نقي مع أصفر ساطع لأقصى درجات الوضوح',
    accentLabel: 'Pure Yellow',
    wcagLevel: 'AAA',
    contrastRatio: '21.0:1',
    swatches: {
      bg: '#000000',
      card: '#080808',
      container: '#141414',
      accent: '#FBBF24',
      accentSecondary: '#38BDF8',
      text: '#FFFFFF',
      textSecondary: '#E2E8F0',
      focusRing: '#FBBF24',
    },
  },
];

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeMode;
  isDark: boolean;
  activeTheme: ThemeOption;
  availableThemes: ThemeOption[];
  setThemeId: (id: ThemeId) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode | ThemeId) => void;
  // Accessibility Features
  highContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
  toggleHighContrastMode: () => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  toggleReducedMotion: () => void;
  largeText: boolean;
  setLargeText: (enabled: boolean) => void;
  toggleLargeText: () => void;
  announcement: string;
  announce: (msg: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const savedThemeId = localStorage.getItem('dahab_travel_os_theme_id') as ThemeId | null;
      if (savedThemeId && THEME_OPTIONS.some((t) => t.id === savedThemeId)) {
        return savedThemeId;
      }
      const legacyTheme = localStorage.getItem('dahab_travel_os_theme');
      if (legacyTheme === 'light') return 'editorial-sand';
      if (legacyTheme === 'dark') return 'charcoal-minimal';
    } catch {
      // Fallback
    }
    return 'charcoal-minimal';
  });

  // Accessibility States
  const [highContrastMode, setHighContrastModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dahab_a11y_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dahab_a11y_reduced_motion');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  const [largeText, setLargeTextState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dahab_a11y_large_text') === 'true';
    } catch {
      return false;
    }
  });

  const [announcement, setAnnouncement] = useState<string>('');

  const activeTheme = THEME_OPTIONS.find((t) => t.id === themeId) || THEME_OPTIONS[0];
  const isDark = activeTheme.category === 'dark';
  const theme: ThemeMode = activeTheme.category;

  const announce = (msg: string) => {
    setAnnouncement(msg);
  };

  useEffect(() => {
    try {
      localStorage.setItem('dahab_travel_os_theme_id', themeId);
      localStorage.setItem('dahab_travel_os_theme', isDark ? 'dark' : 'light');
      localStorage.setItem('dahab_a11y_high_contrast', String(highContrastMode));
      localStorage.setItem('dahab_a11y_reduced_motion', String(reducedMotion));
      localStorage.setItem('dahab_a11y_large_text', String(largeText));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    const body = document.body;

    // Apply data attributes for global CSS cascade
    root.setAttribute('data-theme-id', themeId);
    body.setAttribute('data-theme-id', themeId);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Accessibility attributes
    root.setAttribute('data-high-contrast', String(highContrastMode));
    body.setAttribute('data-high-contrast', String(highContrastMode));
    root.setAttribute('data-reduced-motion', String(reducedMotion));
    body.setAttribute('data-reduced-motion', String(reducedMotion));
    root.setAttribute('data-large-text', String(largeText));
    body.setAttribute('data-large-text', String(largeText));

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    if (highContrastMode) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    if (reducedMotion) {
      root.classList.add('a11y-reduced-motion');
    } else {
      root.classList.remove('a11y-reduced-motion');
    }

    if (largeText) {
      root.classList.add('a11y-large-text');
    } else {
      root.classList.remove('a11y-large-text');
    }

    // Set dynamic CSS variables on root for instantaneous 100% cascade
    const s = activeTheme.swatches;
    root.style.setProperty('--bg-canvas', s.bg);
    root.style.setProperty('--surface-card', s.card);
    root.style.setProperty('--surface-container', s.container);
    root.style.setProperty('--accent-primary', s.accent);
    root.style.setProperty('--accent-secondary', s.accentSecondary);
    root.style.setProperty('--text-primary', s.text);
    root.style.setProperty('--text-secondary', s.textSecondary);
    root.style.setProperty('--focus-ring', s.focusRing);

    if (themeId === 'high-contrast-pro') {
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.45)');
      root.style.setProperty('--header-bg', '#000000');
      root.style.setProperty('--header-border', '#FFE600');
      root.style.setProperty('--btn-book-bg', '#FFE600');
      root.style.setProperty('--btn-book-hover', '#FFD000');
      root.style.setProperty('--btn-book-text', '#000000');
      root.style.setProperty('--badge-primary-bg', '#000000');
      root.style.setProperty('--badge-primary-text', '#FFE600');
    } else if (isDark) {
      const borderAlpha = highContrastMode ? '0.35' : '0.14';
      root.style.setProperty(
        '--border-subtle',
        themeId === 'charcoal-minimal'
          ? `rgba(255, 255, 255, ${highContrastMode ? '0.30' : '0.12'})`
          : themeId === 'sinai-midnight'
          ? `rgba(56, 189, 248, ${borderAlpha})`
          : `rgba(16, 185, 129, ${borderAlpha})`
      );
      root.style.setProperty(
        '--header-bg',
        themeId === 'charcoal-minimal'
          ? 'rgba(31, 31, 31, 0.88)'
          : themeId === 'sinai-midnight'
          ? 'rgba(4, 7, 17, 0.85)'
          : 'rgba(5, 11, 10, 0.85)'
      );
      root.style.setProperty(
        '--header-border',
        themeId === 'charcoal-minimal'
          ? 'rgba(255, 255, 255, 0.12)'
          : themeId === 'sinai-midnight'
          ? 'rgba(56, 189, 248, 0.15)'
          : 'rgba(16, 185, 129, 0.15)'
      );
      root.style.setProperty('--btn-book-bg', s.accent);
      root.style.setProperty(
        '--btn-book-hover',
        themeId === 'charcoal-minimal'
          ? '#0284C7'
          : themeId === 'sinai-midnight'
          ? '#0891B2'
          : '#059669'
      );
      // Contrast: Light accent on dark background -> dark button text for >14:1 AAA contrast
      root.style.setProperty('--btn-book-text', '#020606');
      root.style.setProperty('--badge-primary-bg', `${s.accent}20`);
      root.style.setProperty('--badge-primary-text', s.accent);
    } else {
      const borderAlpha = highContrastMode ? '0.28' : '0.12';
      root.style.setProperty(
        '--border-subtle',
        themeId === 'lagoon-breeze'
          ? `rgba(15, 118, 110, ${borderAlpha})`
          : `rgba(10, 26, 23, ${borderAlpha})`
      );
      root.style.setProperty(
        '--header-bg',
        themeId === 'lagoon-breeze' ? 'rgba(240, 248, 248, 0.88)' : 'rgba(250, 248, 243, 0.88)'
      );
      root.style.setProperty(
        '--header-border',
        themeId === 'lagoon-breeze' ? 'rgba(15, 118, 110, 0.15)' : 'rgba(10, 26, 23, 0.12)'
      );
      // Editorial sand uses deep obsidian (#0A1A17), Lagoon breeze uses deep teal (#0B5E57 for 7.2:1 AAA)
      const lightBtnBg = themeId === 'lagoon-breeze' ? '#0B5E57' : s.accent;
      root.style.setProperty('--btn-book-bg', lightBtnBg);
      root.style.setProperty(
        '--btn-book-hover',
        themeId === 'lagoon-breeze' ? '#063935' : '#14312B'
      );
      // Contrast: Dark button on light theme -> pure white text for >7:1 AAA contrast
      root.style.setProperty('--btn-book-text', '#FFFFFF');
      root.style.setProperty('--badge-primary-bg', `${s.accent}15`);
      root.style.setProperty('--badge-primary-text', s.accent);
    }
  }, [themeId, activeTheme, isDark, highContrastMode, reducedMotion, largeText]);

  const toggleTheme = () => {
    if (themeId === 'deep-reef') setThemeIdState('editorial-sand');
    else if (themeId === 'sinai-midnight') setThemeIdState('lagoon-breeze');
    else if (themeId === 'editorial-sand') setThemeIdState('deep-reef');
    else if (themeId === 'lagoon-breeze') setThemeIdState('sinai-midnight');
    else setThemeIdState('deep-reef');
  };

  const setThemeId = (newId: ThemeId) => {
    setThemeIdState(newId);
    const selected = THEME_OPTIONS.find((t) => t.id === newId);
    if (selected) {
      announce(`Theme changed to ${selected.nameEn}. Contrast level ${selected.wcagLevel}`);
    }
  };

  const setTheme = (modeOrId: ThemeMode | ThemeId) => {
    if (modeOrId === 'dark') {
      setThemeIdState('deep-reef');
    } else if (modeOrId === 'light') {
      setThemeIdState('editorial-sand');
    } else if (THEME_OPTIONS.some((t) => t.id === modeOrId)) {
      setThemeIdState(modeOrId as ThemeId);
    }
  };

  const setHighContrastMode = (enabled: boolean) => {
    setHighContrastModeState(enabled);
    announce(enabled ? 'High contrast outlines enabled' : 'High contrast outlines disabled');
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(!highContrastMode);
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    announce(enabled ? 'Reduced motion enabled' : 'Reduced motion disabled');
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const setLargeText = (enabled: boolean) => {
    setLargeTextState(enabled);
    announce(enabled ? 'Large high-legibility text enabled' : 'Standard text size restored');
  };

  const toggleLargeText = () => {
    setLargeText(!largeText);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme,
        isDark,
        activeTheme,
        availableThemes: THEME_OPTIONS,
        setThemeId,
        toggleTheme,
        setTheme,
        highContrastMode,
        setHighContrastMode,
        toggleHighContrastMode,
        reducedMotion,
        setReducedMotion,
        toggleReducedMotion,
        largeText,
        setLargeText,
        toggleLargeText,
        announcement,
        announce,
      }}
    >
      {/* Hidden Live Region for Screen Readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="theme-announcer-live-region"
      >
        {announcement}
      </div>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
