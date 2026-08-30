import React, { useState, useEffect } from 'react';
import {
  Compass,
  Luggage,
  Sparkles,
  Activity,
  Search,
  Languages,
  User,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Palette,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { AppRoute } from '../../types';
import { ThemeSelector } from './ThemeSelector';

interface V2NavbarProps {
  onOpenSearch: () => void;
  onOpenQuickBook: () => void;
}

export const V2Navbar: React.FC<V2NavbarProps> = ({ onOpenSearch, onOpenQuickBook }) => {
  const {
    currentRoute,
    navigateTo,
    user,
    sessionUser,
    isSignedIn,
    profile,
    authRole
  } = useTrip();

  // `user` is the Firebase user, and Firebase Admin has no credentials on this
  // deployment — so federated sign-in returns 503 and `user` is always null.
  // Branching on it meant a traveler who signed in with email and password (the
  // only path that works) saw "Sign In" forever, and an Operations user never
  // saw the console. The server session is what "signed in" means.
  const signedInName =
    sessionUser?.name || user?.displayName || profile.name || sessionUser?.email || user?.email || '';

  // Back-office entries were shown to everyone, including signed-out visitors.
  // Enforcement is server-side; this just stops advertising doors people
  // cannot open.
  const canSeeOps = isSignedIn && (authRole === 'Operations' || authRole === 'Admin');
  const canSeeSupplier =
    isSignedIn && (authRole === 'Supplier' || authRole === 'Operations' || authRole === 'Admin');
  const showBackOfficeLinks = canSeeOps || canSeeSupplier;
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { theme, isDark, toggleTheme, themeId, setThemeId, availableThemes } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { route: AppRoute; labelKey: string; labelEn: string; labelAr: string; icon: React.FC<{ className?: string }> }[] = [
    { route: '/home', labelKey: 'nav.discover', labelEn: 'Discover', labelAr: 'استكشف', icon: Compass },
    { route: '/my-trip', labelKey: 'nav.myTrip', labelEn: 'My Trip', labelAr: 'رحلتي', icon: Luggage },
    { route: '/daygi', labelKey: 'nav.aiDirector', labelEn: 'AI Director', labelAr: 'المخرج الذكي', icon: Sparkles },
    { route: '/live', labelKey: 'nav.dahabLive', labelEn: 'Dahab Live', labelAr: 'دهب لايف', icon: Activity },
  ];

  const isNavActive = (route: AppRoute) => {
    if (route === '/home') {
      return currentRoute === '/home' || currentRoute === '/discover' || currentRoute === '/';
    }
    if (route === '/my-trip') {
      return currentRoute.startsWith('/my-trip');
    }
    if (route === '/daygi') {
      return currentRoute === '/daygi' || currentRoute === '/ai-director';
    }
    return currentRoute === route;
  };

  return (
    <>
      {/* 1. Skip link for WCAG AA Accessibility */}
      <a href="#main-app-content" className="skip-link">
        {language === 'ar' ? 'تخطي للمحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* ========================================================================= */}
      {/* 2. 3-ZONE GLASSMORPHIC HEADER (STICKY POSITION WITH BLUR 12PX)            */}
      {/* ========================================================================= */}
      <header
        role="banner"
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${
          isScrolled ? 'pt-2 sm:pt-2.5' : 'pt-2.5 sm:pt-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav
            aria-label="DAHAB TRAVEL OS Header"
            style={{
              backgroundColor: 'var(--header-bg)',
              borderColor: 'var(--header-border)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
            className="pointer-events-auto mx-auto rounded-full transition-all duration-300 flex items-center justify-between border px-3 sm:px-5 py-2 sm:py-2.5 shadow-lg text-[var(--text-primary)]"
          >
            {/* =================================================================== */}
            {/* ZONE 1 (LEFT): BRAND IDENTIFICATION                                 */}
            {/* Clean text mark DAHAB TRAVEL OS with a minimal circular icon        */}
            {/* =================================================================== */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                id="brand-logo-btn"
                onClick={() => navigateTo('/home')}
                aria-label="DAHAB TRAVEL OS"
                className="flex items-center gap-2.5 group cursor-pointer text-start focus:outline-none select-none"
              >
                {/* Minimal circular icon */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs font-['Outfit',sans-serif] transition-transform duration-200 group-hover:scale-105 shadow-sm border bg-[var(--accent-secondary)] text-[var(--accent-secondary-ink)] border-[var(--accent-secondary)]/40 shadow-[0_0_12px_rgba(244,195,108,0.25)]"
                >
                  <span className="leading-none tracking-tighter">D</span>
                </div>

                {/* Clean text mark */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span
                      className="font-black text-sm tracking-wider font-['Outfit',sans-serif] uppercase text-[var(--text-primary)]"
                    >
                      DAHAB
                    </span>
                    {/*
                      Hidden below sm: the "TRAVEL OS" badge is brand garnish,
                      and on a 375px screen it was pushing the header's action
                      cluster past the pill's edge, clipping the menu toggle.
                    */}
                    <span
                      className="hidden sm:inline text-[11px] font-bold tracking-widest uppercase font-['JetBrains_Mono',monospace] px-1.5 py-0.5 rounded bg-[var(--surface-container)] text-[var(--accent-primary)] border border-[var(--border-subtle)]"
                    >
                      TRAVEL OS
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* =================================================================== */}
            {/* ZONE 2 (CENTER): PRIMARY NAVIGATION HUB                             */}
            {/* Horizontal nav: Discover, My Trip, AI Director, Dahab Live          */}
            {/* Subtle active pill indicator sliding smoothly behind the route      */}
            {/* =================================================================== */}
            <div
              className="hidden lg:flex items-center gap-1 p-1 rounded-full border relative bg-[var(--header-pill-bg)] border-[var(--header-pill-border)] shadow-inner"
            >
              {navLinks.map((item) => {
                const active = isNavActive(item.route);
                const Icon = item.icon;
                const label = language === 'ar' ? item.labelAr : item.labelEn;

                return (
                  <button
                    key={item.route}
                    id={`nav-link-${item.route.replace('/', '')}`}
                    type="button"
                    onClick={() => navigateTo(item.route)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 z-10 ${
                      active
                        ? 'text-[var(--text-primary)] font-bold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`}
                  >
                    {/* Active Sliding Pill Indicator (smooth motion layout) */}
                    {active && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full shadow-sm z-[-1] bg-[var(--surface-card)] border border-[var(--accent-primary)]/40 shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        active
                          ? 'text-[var(--accent-secondary)]'
                          : 'text-[var(--accent-primary)]'
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* =================================================================== */}
            {/* ZONE 3 (RIGHT): UTILITIES & CONVERSION                              */}
            {/* Multi-Theme Selector, Search, Language, Profile, and Gold Book CTA */}
            {/* =================================================================== */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              
              {/*
                Mobile crowding: the top bar carried brand + 5 controls on a
                375px screen, so the pill's content overflowed (scrollWidth 534
                vs 375) and the language chip was clipped. Theme and language are
                secondary preferences and already live in the mobile menu below,
                so they are desktop-only here. Search, Book Now and the menu
                toggle stay — those are the mobile jobs-to-be-done.
              */}
              <div className="hidden sm:block">
                <ThemeSelector />
              </div>

              {/* 2. Global Search Icon Button (⌘K Spotlight Search) */}
              <button
                type="button"
                id="header-search-btn"
                onClick={onOpenSearch}
                aria-label={t('nav.search') || 'Search'}
                title="Search destinations & experiences (⌘K)"
                className={`w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-xs ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-[#D2E3DE] hover:text-white border-white/15'
                    : 'bg-[#0E2520]/6 hover:bg-[#0E2520]/12 text-[#4A635D] hover:text-[#122420] border-[#122420]/10'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
              </button>

              {/* 3. Language Selector (العربية / EN) */}
              <button
                type="button"
                id="header-language-btn"
                onClick={toggleLanguage}
                aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
                className={`hidden sm:flex h-8 px-2.5 rounded-full items-center gap-1 text-xs font-bold transition-all cursor-pointer border shadow-xs ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-[#D2E3DE] hover:text-white border-white/15'
                    : 'bg-[#0E2520]/6 hover:bg-[#0E2520]/12 text-[#122420] border-[#122420]/10'
                }`}
              >
                <Languages className={`w-3.5 h-3.5 ${isDark ? 'text-[#F4C36C]' : 'text-[#0E2520]'}`} />
                <span className="text-[12px]">{language === 'en' ? 'العربية' : 'EN'}</span>
              </button>

              {/* 4. Sign In / Profile Avatar */}
              {isSignedIn ? (
                <button
                  type="button"
                  id="header-profile-btn"
                  onClick={() => navigateTo('/profile')}
                  title={`Signed in as ${signedInName || 'Traveler'}`}
                  className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 border-white/15 text-[#F7F3EA]'
                      : 'bg-[#0E2520]/6 hover:bg-[#0E2520]/12 border-[#122420]/10 text-[#122420]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#20A89A] animate-pulse" />
                  <span className="max-w-[70px] truncate text-[12px] font-bold">
                    {signedInName.split(' ')[0] || (language === 'ar' ? 'حسابي' : 'Account')}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  id="header-signin-btn"
                  onClick={() => navigateTo('/auth/sign-in')}
                  title={language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
                  className={`hidden sm:flex h-8 px-2.5 rounded-full items-center gap-1.5 text-xs font-bold transition-all cursor-pointer border shadow-xs ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 border-white/15 text-[#D2E3DE] hover:text-white'
                      : 'bg-[#0E2520]/6 hover:bg-[#0E2520]/12 border-[#122420]/10 text-[#122420]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="text-[12px]">{language === 'ar' ? 'دخول' : 'Sign In'}</span>
                </button>
              )}

              {/* 5. Primary Action Button: Dynamic Theme CTA button */}
              <button
                type="button"
                id="header-book-now-cta"
                onClick={onOpenQuickBook}
                className="h-11 sm:h-8 px-4 rounded-full font-bold text-xs transition-all duration-200 shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] border border-[var(--border-subtle)]"
              >
                <span>{language === 'ar' ? 'احجز الآن' : 'Book Now'}</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                id="header-mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
                className={`lg:hidden w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-[#F7F3EA] border-white/15'
                    : 'bg-[#0E2520]/6 hover:bg-[#0E2520]/12 text-[#122420] border-[#122420]/10'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto lg:hidden max-w-7xl mx-auto px-3 pt-2"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div
                style={{
                  backgroundColor: isDark ? 'rgba(14, 37, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: isDark ? 'rgba(210, 227, 222, 0.12)' : 'rgba(18, 36, 32, 0.08)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)'
                }}
                className={`rounded-3xl p-4 border shadow-2xl space-y-2 ${
                  isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
                }`}
              >
                {navLinks.map((item) => {
                  const active = isNavActive(item.route);
                  const Icon = item.icon;
                  const label = language === 'ar' ? item.labelAr : item.labelEn;

                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => {
                        navigateTo(item.route);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? isDark
                            ? 'bg-[#13312B] text-[#F7F3EA] font-bold border border-[#20A89A]/40'
                            : 'bg-[#F2EFE9] text-[#122420] font-bold border border-[#0E2520]/20'
                          : isDark
                          ? 'hover:bg-white/5 text-[#D2E3DE]'
                          : 'hover:bg-black/5 text-[#4A635D]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#F4C36C]' : 'text-[#20A89A]'}`} />
                        <span>{label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 opacity-60" />
                    </button>
                  );
                })}

                {/* Theme Selector Strip (Mobile) */}
                <div className="pt-2 border-t border-inherit/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[12px] font-bold px-1 text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'سمة التطبيق' : 'Visual Theme'}
                    </span>
                    <span className="text-[11px] font-mono opacity-80">
                      {language === 'ar' ? availableThemes.find((t) => t.id === themeId)?.nameAr : availableThemes.find((t) => t.id === themeId)?.nameEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {availableThemes.map((opt) => {
                      const isSelected = opt.id === themeId;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setThemeId(opt.id)}
                          className={`p-2 rounded-xl text-[12px] font-bold text-start flex items-center justify-between gap-1.5 border transition-all cursor-pointer ${
                            isSelected
                              ? isDark
                                ? 'bg-white/15 border-[#F4C36C] text-[#F7F3EA]'
                                : 'bg-[#0E2520]/12 border-[#0E2520] text-[#122420]'
                              : isDark
                              ? 'bg-white/5 border-white/10 text-[#D2E3DE]'
                              : 'bg-[#0E2520]/5 border-[#0E2520]/10 text-[#4A635D]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0"
                              style={{ backgroundColor: opt.swatches.accent }}
                            />
                            <span className="truncate">{language === 'ar' ? opt.nameAr : opt.nameEn}</span>
                          </div>
                          {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Back-office views — only for accounts that can use them. */}
                {showBackOfficeLinks && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-inherit/10">
                    {canSeeOps && (
                      <button
                        type="button"
                        onClick={() => {
                          navigateTo('/ops-console');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex-1 min-w-[6rem] p-2 rounded-xl text-[12px] font-bold text-center cursor-pointer border ${
                          isDark
                            ? 'bg-white/5 hover:bg-white/10 text-[#52C4B7] border-white/10'
                            : 'bg-[#0E2520]/5 hover:bg-[#0E2520]/10 text-[#0E2520] border-[#0E2520]/10'
                        }`}
                      >
                        {language === 'ar' ? 'العمليات' : 'Ops Console'}
                      </button>
                    )}
                    {canSeeSupplier && (
                      <button
                        type="button"
                        onClick={() => {
                          navigateTo('/supplier-portal');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex-1 min-w-[6rem] p-2 rounded-xl text-[12px] font-bold text-center cursor-pointer border ${
                          isDark
                            ? 'bg-white/5 hover:bg-white/10 text-[#F4C36C] border-white/10'
                            : 'bg-[#0E2520]/5 hover:bg-[#0E2520]/10 text-[#0E2520] border-[#0E2520]/10'
                        }`}
                      >
                        {language === 'ar' ? 'الموردين' : 'Suppliers'}
                      </button>
                    )}
                    {canSeeOps && (
                      <button
                        type="button"
                        onClick={() => {
                          navigateTo('/market-intelligence');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex-1 min-w-[6rem] p-2 rounded-xl text-[12px] font-bold text-center cursor-pointer border ${
                          isDark
                            ? 'bg-[#20A89A]/20 text-[#52C4B7] border-[#20A89A]/30'
                            : 'bg-[#0E2520]/10 text-[#0E2520] border-[#0E2520]/20'
                        }`}
                      >
                        {language === 'ar' ? 'استخبارات' : 'Intel'}
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile Book Now Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenQuickBook();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-2xl font-black text-xs text-center cursor-pointer shadow-md transition-transform active:scale-98 bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)]"
                  >
                    {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================================= */}
      {/* 3. MOBILE DOCK NAVIGATION BAR                                             */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation Dock"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          backgroundColor: 'var(--header-bg)',
          borderColor: 'var(--header-border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-3 py-1 flex items-center justify-around shadow-2xl text-[var(--text-primary)]"
      >
        {navLinks.map((item) => {
          const active = isNavActive(item.route);
          const Icon = item.icon;
          const label = language === 'ar' ? item.labelAr : item.labelEn;

          return (
            <button
              key={item.route}
              type="button"
              onClick={() => navigateTo(item.route)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 px-3 min-h-[44px] rounded-xl transition-all cursor-pointer ${
                active
                  ? 'text-[var(--accent-secondary)] font-bold scale-105'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-[var(--accent-secondary)] stroke-[2.5]' : 'opacity-70'}`} />
              <span className="text-[11px] font-bold leading-none">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
