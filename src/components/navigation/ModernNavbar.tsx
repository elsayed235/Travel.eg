import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Luggage,
  CalendarCheck,
  UtensilsCrossed,
  HelpCircle,
  Sun,
  Waves,
  Sparkles,
  User,
  ChevronDown,
  Menu,
  X,
  Clock,
  ShieldCheck,
  PlaneTakeoff,
  Award,
  Layers,
  MapPin,
  Heart,
  Globe
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { AppRoute, JourneyStage } from '../../types';
import { JOURNEY_STAGES } from './JourneyStageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';

interface ModernNavbarProps {
  onOpenHelp?: () => void;
  onSelectSpecialStage?: (stage: JourneyStage) => void;
}

export const ModernNavbar: React.FC<ModernNavbarProps> = ({
  onOpenHelp,
  onSelectSpecialStage,
}) => {
  const { currentRoute, navigateTo, profile, bookings, activeFoodOrder, journeyStage, setJourneyStage, showToast } = useTrip();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const isAr = language === 'ar';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const stageMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Detect scroll for dynamic glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStageMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks: { label: string; route: AppRoute; icon: React.ElementType; badge?: string; stageOverride?: JourneyStage }[] = [
    { label: isAr ? 'الرئيسية' : 'Discover', route: '/home', icon: Compass },
    { label: isAr ? 'جدول الرحلة' : 'My Itinerary', route: '/my-trip', icon: Luggage, badge: isAr ? 'اليوم ٢' : 'Day 2' },
    { label: isAr ? 'استكشاف الأماكن' : 'Explore Spots', route: '/explore', icon: MapPin },
    { label: isAr ? 'طلب أكل' : 'Food Now', route: '/food', icon: UtensilsCrossed, badge: activeFoodOrder ? (isAr ? 'طلب نشط' : '1 Active') : undefined },
    { label: isAr ? 'الحجوزات' : 'Bookings', route: '/bookings', icon: CalendarCheck, badge: `${bookings.length}` },
    { label: isAr ? 'دعم ٢٤/٧' : '24/7 Help', route: '/help', icon: HelpCircle },
  ];

  const currentStageObj = JOURNEY_STAGES.find((s) => s.id === journeyStage) || JOURNEY_STAGES[5];

  const handleStageSelect = (stageId: JourneyStage) => {
    setJourneyStage(stageId);
    if (onSelectSpecialStage) {
      onSelectSpecialStage(stageId);
    }
    const targetStage = JOURNEY_STAGES.find((s) => s.id === stageId);
    if (targetStage) {
      navigateTo(targetStage.route);
    }
    setIsStageMenuOpen(false);
    showToast(isAr ? `تم التبديل إلى: ${targetStage?.label}` : `Switched to: ${targetStage?.label}`);
  };

  const isLinkActive = (route: AppRoute) => {
    if (route === currentRoute) return true;
    if (route === '/my-trip' && (currentRoute === '/my-trip/day' || currentRoute === '/my-trip/activity')) return true;
    return false;
  };

  return (
    <header
      role="banner"
      id="modern-app-header"
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`sticky top-0 z-40 transition-all duration-300 w-full ${
        isScrolled
          ? 'bg-[#091B1F]/95 backdrop-blur-2xl shadow-xl border-b border-white/10 py-2.5'
          : 'bg-[#091B1F]/90 backdrop-blur-xl border-b border-white/10 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* ================================================================= */}
        {/* 1. BRAND LOGO & TAGLINE                                           */}
        {/* ================================================================= */}
        <button
          type="button"
          onClick={() => navigateTo('/home')}
          aria-label={isAr ? 'الذهاب إلى الرئيسية' : 'Go to Dahab Travel Experience Home'}
          className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl p-1"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            D
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black tracking-widest uppercase text-white font-['Outfit',sans-serif] group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              {isAr ? 'دهـب' : 'DAHAB'}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            </span>
            <span className="text-[11px] sm:text-[12px] font-semibold text-slate-300 tracking-wide uppercase -mt-0.5">
              {isAr ? 'جنوب سيناء · البحر الأحمر' : 'South Sinai · Red Sea'}
            </span>
          </div>
        </button>

        {/* ================================================================= */}
        {/* 2. CENTER: SLEEK FLOATING PILL NAVIGATION (DESKTOP)               */}
        {/* ================================================================= */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1 bg-white/8 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-inner"
        >
          {navLinks.map((link) => {
            const active = isLinkActive(link.route);
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  if (link.stageOverride && onSelectSpecialStage) {
                    onSelectSpecialStage(link.stageOverride);
                  }
                  navigateTo(link.route);
                }}
                aria-current={active ? 'page' : undefined}
                aria-label={`${link.label}${link.badge ? ` (${link.badge})` : ''}`}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-slate-300'}`} aria-hidden="true" />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[11px] font-black px-1.5 py-0.2 rounded-full leading-tight ${
                      active
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ================================================================= */}
        {/* 3. RIGHT ACTIONS: LANGUAGE, WEATHER, STAGE SELECTOR & PROFILE    */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Toggle */}
          <button
            type="button"
            id="modern-nav-lang-toggle"
            onClick={toggleLanguage}
            aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[12px] uppercase">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Live Sea & Weather Capsule */}
          <div
            aria-label="Weather: 28°C sunny, Water temperature 24°C"
            className="hidden xl:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xs"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>28°C</span>
            <span className="text-white/30" aria-hidden="true">|</span>
            <Waves className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
            <span className="text-slate-200">{isAr ? 'البحر ٢٤°م' : 'Water 24°C'}</span>
          </div>

          {/* Quick Journey Stage Selector Dropdown */}
          <div className="relative" ref={stageMenuRef}>
            <button
              type="button"
              id="header-stage-switcher-btn"
              onClick={() => setIsStageMenuOpen(!isStageMenuOpen)}
              aria-expanded={isStageMenuOpen}
              aria-haspopup="menu"
              aria-label={`Trip lifecycle stage: ${currentStageObj.label}. Click to switch stages`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
            >
              <span className="text-sm" aria-hidden="true">{currentStageObj.icon}</span>
              <span className="hidden sm:inline text-amber-300 font-bold">{currentStageObj.shortLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isStageMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {/* Stage Selector Dropdown Menu */}
            {isStageMenuOpen && (
              <div
                role="menu"
                aria-label="Select Trip Stage"
                className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-72 sm:w-80 bg-[#091B1F]/98 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-white`}
              >
                <div className="p-2 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    <span className="text-xs font-black uppercase tracking-wider text-white font-['Outfit',sans-serif]">
                      {isAr ? 'مراحل الرحلة (١–١٢)' : 'Trip Stages (1–12)'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    {isAr ? 'نشط: اليوم ٢' : 'Active: Day 2'}
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto py-1.5 space-y-1 no-scrollbar">
                  {JOURNEY_STAGES.map((stg) => {
                    const isCurrent = journeyStage === stg.id;
                    return (
                      <button
                        key={stg.id}
                        type="button"
                        role="menuitem"
                        onClick={() => handleStageSelect(stg.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'text-slate-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{stg.icon}</span>
                          <span>{stg.label}</span>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                            isCurrent
                              ? 'bg-slate-950 text-amber-300'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {stg.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Traveler Profile Pill */}
          <button
            type="button"
            onClick={() => navigateTo('/profile')}
            aria-label={`Open traveler profile for ${profile.name}`}
            className="flex items-center gap-2 pl-1 pr-2.5 sm:pr-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer shadow-xs group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {profile.name.charAt(0)}
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors hidden sm:inline">
              {profile.name}
            </span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            id="mobile-nav-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isAr ? 'فتح قائمة التنقل' : 'Open mobile navigation menu'}
            className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. MOBILE SLIDE DOWN MENU                                         */}
      {/* ================================================================= */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'قائمة التنقل' : 'Mobile Navigation Menu'}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="md:hidden bg-[#091B1F]/98 backdrop-blur-2xl border-b border-white/15 px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-2xl"
        >
          <div className="grid grid-cols-2 gap-2" role="list">
            {navLinks.map((link) => {
              const active = isLinkActive(link.route);
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    if (link.stageOverride && onSelectSpecialStage) {
                      onSelectSpecialStage(link.stageOverride);
                    }
                    navigateTo(link.route);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <span className="truncate block">{link.label}</span>
                    {link.badge && (
                      <span className="text-[11px] font-bold opacity-80 block -mt-0.5">
                        {link.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                navigateTo('/help');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>{isAr ? 'خط طوارئ ومساعدة الكونسيرج ٢٤/٧' : '24/7 Emergency & Concierge Hotline'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

