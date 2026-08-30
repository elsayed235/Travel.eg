import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Check,
  ChevronDown,
  Palette,
  Eye,
  Compass,
  Waves,
  Sliders,
  Type,
  ZapOff,
  CheckCircle2,
  Monitor,
  Droplets,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, ThemeId, ThemeOption } from '../../context/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface ThemeSelectorProps {
  compact?: boolean;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  compact = false,
  className = '',
}) => {
  const {
    themeId,
    activeTheme,
    availableThemes,
    setThemeId,
    isDark,
    highContrastMode,
    toggleHighContrastMode,
    reducedMotion,
    toggleReducedMotion,
    largeText,
    toggleLargeText,
  } = useTheme();
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'accessibility'>('themes');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const darkThemes = availableThemes.filter((t) => t.category === 'dark' && t.id !== 'high-contrast-pro');
  const lightThemes = availableThemes.filter((t) => t.category === 'light');
  const proTheme = availableThemes.find((t) => t.id === 'high-contrast-pro');

  const getThemeIcon = (id: ThemeId) => {
    switch (id) {
      case 'charcoal-minimal':
        return Sparkles;
      case 'deep-reef':
        return Waves;
      case 'sinai-midnight':
        return Moon;
      case 'editorial-sand':
        return Sun;
      case 'lagoon-breeze':
        return Droplets;
      case 'high-contrast-pro':
        return Eye;
      default:
        return Palette;
    }
  };

  const getShortName = (theme: ThemeOption) => {
    if (theme.id === 'charcoal-minimal') return language === 'ar' ? 'رمادي هادئ' : 'Soft Charcoal';
    if (theme.id === 'deep-reef') return language === 'ar' ? 'أخضر زمردي' : 'Emerald Green';
    if (theme.id === 'sinai-midnight') return language === 'ar' ? 'أزرق ليلي' : 'Midnight Blue';
    if (theme.id === 'editorial-sand') return language === 'ar' ? 'رمال الصحراء' : 'Warm Sand';
    if (theme.id === 'lagoon-breeze') return language === 'ar' ? 'أزرق فيروزي' : 'Lagoon Blue';
    if (theme.id === 'high-contrast-pro') return language === 'ar' ? 'أقصى وضوح' : 'High Contrast';
    return language === 'ar' ? theme.nameAr : theme.nameEn;
  };

  const ActiveIcon = getThemeIcon(themeId);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Sleek Minimalist Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        id="theme-selector-trigger-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Theme: ${getShortName(activeTheme)}. Open Theme Menu.`}
        title={language === 'ar' ? `السمة: ${getShortName(activeTheme)}` : `Theme: ${getShortName(activeTheme)}`}
        className={`group relative h-9 px-2.5 sm:px-3 rounded-full flex items-center gap-2 transition-all duration-200 cursor-pointer border shadow-sm select-none ${
          isDark
            ? 'bg-[#292929]/90 hover:bg-[#333333] border-white/12 text-white hover:border-white/20'
            : 'bg-white/90 hover:bg-[#F2EFE9] border-[#122420]/12 text-[#091815] hover:border-[#122420]/20'
        } ${isOpen ? 'ring-2 ring-[var(--focus-ring)]' : ''}`}
      >
        {/* Dynamic Theme Icon with Glowing Dot */}
        <div className="relative flex items-center justify-center">
          <ActiveIcon
            className="w-4 h-4 transition-transform group-hover:scale-110"
            style={{ color: activeTheme.swatches.accent }}
          />
          <span
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-black"
            style={{ backgroundColor: activeTheme.swatches.accentSecondary }}
          />
        </div>

        {/* Short Clean Name */}
        <span className="text-xs font-semibold tracking-tight hidden md:inline whitespace-nowrap">
          {getShortName(activeTheme)}
        </span>

        {/* Color Palette Duo Dot */}
        <div className="flex items-center -space-x-1">
          <div
            className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-xs"
            style={{ backgroundColor: activeTheme.swatches.bg }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-xs"
            style={{ backgroundColor: activeTheme.swatches.accent }}
          />
        </div>

        {/* Subtle Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${
            isOpen ? 'rotate-180 opacity-100' : 'group-hover:opacity-90'
          }`}
        />
      </button>

      {/* Modern Compact Floating Glass Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            dir={isRTL ? 'rtl' : 'ltr'}
            role="dialog"
            aria-modal="true"
            aria-label="Theme Selector"
            className={`absolute mt-2 w-72 sm:w-80 z-50 rounded-2xl p-3 shadow-2xl border backdrop-blur-2xl transition-all ${
              isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
            } ${
              isDark
                ? 'bg-[#1F1F1F]/98 border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                : 'bg-white/98 border-[#122420]/15 text-[#091815] shadow-[0_20px_50px_rgba(18,36,32,0.15)]'
            }`}
          >
            {/* Header: Minimal Icon Tabs */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-xs font-bold font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'مظهر التطبيق' : 'Appearance'}
                </span>
              </div>

              {/* Segmented Switcher */}
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('themes')}
                  className={`px-2.5 py-1 rounded-md text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'themes'
                      ? 'bg-[var(--surface-card)] text-[var(--text-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Palette className="w-3 h-3" />
                  <span>{language === 'ar' ? 'السمات' : 'Themes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('accessibility')}
                  className={`px-2.5 py-1 rounded-md text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'accessibility'
                      ? 'bg-[var(--surface-card)] text-[var(--text-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>{language === 'ar' ? 'الإتاحة' : 'A11y'}</span>
                </button>
              </div>
            </div>

            {/* TAB 1: THEMES SELECTION (CLEAN ICONIC GRID & NO NOISY PARAGRAPHS) */}
            {activeTab === 'themes' && (
              <div className="space-y-3" role="radiogroup" aria-label="Themes">
                {/* 1. Dark Modes Section */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 px-1">
                    <Moon className="w-3 h-3 text-[#38BDF8]" />
                    <span>{language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {darkThemes.map((opt) => renderCleanThemePill(opt))}
                  </div>
                </div>

                {/* 2. Light Modes Section */}
                <div className="pt-2 border-t border-white/8 dark:border-white/8">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 px-1">
                    <Sun className="w-3 h-3 text-[#F59E0B]" />
                    <span>{language === 'ar' ? 'الوضع النهاري' : 'Light Mode'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {lightThemes.map((opt) => renderCleanThemePill(opt))}
                  </div>
                </div>

                {/* 3. Ultra High Contrast Mode (Single Sleek Pill) */}
                {proTheme && (
                  <div className="pt-2 border-t border-white/8 dark:border-white/8">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5 px-1">
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>{language === 'ar' ? 'أقصى وضوح' : 'High Contrast'}</span>
                    </div>
                    {renderCleanThemePill(proTheme, true)}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ACCESSIBILITY CONTROLS (CLEAN ICONIC TOGGLES) */}
            {activeTab === 'accessibility' && (
              <div className="space-y-2 py-1 animate-in fade-in duration-150">
                {/* Toggle 1: High Contrast Outlines */}
                <button
                  type="button"
                  onClick={toggleHighContrastMode}
                  className={`w-full p-2 rounded-xl border text-start flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    highContrastMode
                      ? 'bg-amber-500/15 border-amber-500 text-[var(--text-primary)]'
                      : 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${highContrastMode ? 'bg-amber-500 text-black' : 'bg-black/10 dark:bg-white/10'}`}>
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold">
                      {language === 'ar' ? 'حدود عالية التباين (2px)' : 'High Contrast Outlines'}
                    </span>
                  </div>
                  <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${highContrastMode ? 'bg-amber-500' : 'bg-gray-400/40'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${highContrastMode ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* Toggle 2: Large Text */}
                <button
                  type="button"
                  onClick={toggleLargeText}
                  className={`w-full p-2 rounded-xl border text-start flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    largeText
                      ? 'bg-teal-500/15 border-teal-500 text-[var(--text-primary)]'
                      : 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${largeText ? 'bg-teal-500 text-white' : 'bg-black/10 dark:bg-white/10'}`}>
                      <Type className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold">
                      {language === 'ar' ? 'تكبير النصوص' : 'Large Text (110%)'}
                    </span>
                  </div>
                  <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${largeText ? 'bg-teal-500' : 'bg-gray-400/40'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${largeText ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* Toggle 3: Reduced Motion */}
                <button
                  type="button"
                  onClick={toggleReducedMotion}
                  className={`w-full p-2 rounded-xl border text-start flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    reducedMotion
                      ? 'bg-rose-500/15 border-rose-500 text-[var(--text-primary)]'
                      : 'bg-[var(--surface-container)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${reducedMotion ? 'bg-rose-500 text-white' : 'bg-black/10 dark:bg-white/10'}`}>
                      <ZapOff className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold">
                      {language === 'ar' ? 'تقليل الحركة' : 'Reduce Motion'}
                    </span>
                  </div>
                  <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${reducedMotion ? 'bg-rose-500' : 'bg-gray-400/40'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
            )}

            {/* Minimalist Micro Footer */}
            <div className="pt-2 mt-2.5 border-t border-white/8 dark:border-white/8 flex items-center justify-between text-[11px] text-[var(--text-secondary)] px-1">
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>WCAG AAA</span>
              </span>
              <span className="font-mono text-[11px] opacity-70">
                {activeTheme.contrastRatio}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Clean Iconic Pill Render function (No clutter, No multi-line noise)
  function renderCleanThemePill(opt: ThemeOption, isSpecial = false) {
    const isSelected = opt.id === themeId;
    const Icon = getThemeIcon(opt.id);

    return (
      <button
        key={opt.id}
        type="button"
        role="radio"
        aria-checked={isSelected}
        id={`theme-option-${opt.id}`}
        onClick={() => setThemeId(opt.id)}
        className={`w-full h-10 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer border relative group ${
          isSelected
            ? 'bg-[var(--surface-container)] border-[var(--focus-ring)] shadow-xs ring-1 ring-[var(--focus-ring)]'
            : isSpecial
            ? 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/30'
            : 'bg-[var(--surface-card)] hover:bg-[var(--surface-container)] border-[var(--border-subtle)] hover:border-white/20'
        }`}
      >
        {/* Left: Icon & Clean Short Label */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${opt.swatches.accent}18`,
              color: opt.swatches.accent,
            }}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>

          <span
            className={`text-xs truncate ${
              isSelected
                ? 'font-bold text-[var(--text-primary)]'
                : 'font-medium text-[var(--text-primary)] opacity-90 group-hover:opacity-100'
            }`}
          >
            {getShortName(opt)}
          </span>
        </div>

        {/* Right: Color Palette Preview & Selection Check */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 3-Dot Swatch Capsule */}
          <div
            className="flex items-center p-0.5 rounded-full border border-white/10 gap-0.5"
            style={{ backgroundColor: opt.swatches.bg }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: opt.swatches.card }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: opt.swatches.accent }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: opt.swatches.accentSecondary }}
            />
          </div>

          {/* Active Check Indicator */}
          {isSelected && (
            <div
              className="w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: opt.swatches.accent,
                color: opt.swatches.bg,
              }}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}
        </div>
      </button>
    );
  }
};
