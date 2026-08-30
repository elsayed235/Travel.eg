import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  onPlanTripClick: () => void;
  onExploreClick: () => void;
  onMyTripClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPlanTripClick, onExploreClick, onMyTripClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFBF7]/90 backdrop-blur-md shadow-xs border-b border-[#1A1A1A]/8'
          : 'bg-[#FDFBF7]/80 backdrop-blur-xs border-b border-[#1A1A1A]/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <a
              href="#"
              id="header-logo-link"
              className="text-2xl font-black tracking-tighter text-[#1A1A1A] hover:opacity-85 transition-opacity font-['Outfit',sans-serif]"
            >
              DAHAB
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
              <button
                id="nav-explore"
                onClick={() => scrollToSection('explore-dahab')}
                className="text-sm font-semibold text-[#1A1A1A] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {language === 'ar' ? 'استكشف' : 'Explore'}
              </button>
              <button
                id="nav-experiences"
                onClick={() => scrollToSection('explore-dahab')}
                className="text-sm font-semibold text-[#1A1A1A] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {language === 'ar' ? 'تجارب دهب' : 'Experiences'}
              </button>
              <button
                id="nav-food"
                onClick={() => scrollToSection('explore-dahab')}
                className="text-sm font-semibold text-[#1A1A1A] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {language === 'ar' ? 'المطاعم والأكل' : 'Food'}
              </button>
              <button
                id="nav-how-it-works"
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-semibold text-[#1A1A1A] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {language === 'ar' ? 'كيف تعمل المنصة' : 'How It Works'}
              </button>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              id="header-help-btn"
              onClick={() => scrollToSection('how-it-works')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] opacity-40 hover:opacity-100 transition-opacity cursor-pointer px-1 py-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مساعدة' : 'Help'}</span>
            </button>

            {/* Language Switch */}
            <button
              id="header-lang-btn"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] opacity-40 hover:opacity-100 transition-opacity cursor-pointer px-1.5 py-1 rounded-md"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              id="header-mytrip-shortcut-btn"
              onClick={onMyTripClick || onPlanTripClick}
              className="text-xs font-bold text-[#5A5A40] bg-[#5A5A40]/10 hover:bg-[#5A5A40]/15 px-3 py-1.5 rounded-full transition-all cursor-pointer border border-[#5A5A40]/20 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{language === 'ar' ? 'رحلتي' : 'My Trip'}</span>
            </button>

            {/* Primary CTA */}
            <button
              id="header-plan-trip-cta"
              onClick={onPlanTripClick}
              className="relative group inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold tracking-tight text-white bg-[#5A5A40] hover:bg-[#4A4A35] active:scale-[0.98] transition-all shadow-md shadow-[#5A5A40]/15 cursor-pointer"
            >
              <span>{language === 'ar' ? 'خطط رحلتك' : 'Plan My Trip'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              id="header-mobile-plan-cta"
              onClick={onPlanTripClick}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold text-white bg-[#5A5A40] hover:bg-[#4A4A35] cursor-pointer shadow-xs"
            >
              {language === 'ar' ? 'خطط رحلتك' : 'Plan Trip'}
            </button>
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-[#FDFBF7] border-b border-[#1A1A1A]/10 px-6 pt-4 pb-8 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            <button
              id="mobile-nav-explore"
              onClick={() => scrollToSection('explore-dahab')}
              className="text-start py-2.5 text-base font-bold text-[#1A1A1A] hover:text-[#5A5A40] border-b border-[#1A1A1A]/5"
            >
              {language === 'ar' ? 'استكشف' : 'Explore'}
            </button>
            <button
              id="mobile-nav-experiences"
              onClick={() => scrollToSection('explore-dahab')}
              className="text-start py-2.5 text-base font-bold text-[#1A1A1A] hover:text-[#5A5A40] border-b border-[#1A1A1A]/5"
            >
              {language === 'ar' ? 'تجارب دهب' : 'Experiences'}
            </button>
            <button
              id="mobile-nav-food"
              onClick={() => scrollToSection('explore-dahab')}
              className="text-start py-2.5 text-base font-bold text-[#1A1A1A] hover:text-[#5A5A40] border-b border-[#1A1A1A]/5"
            >
              {language === 'ar' ? 'المطاعم والأكل' : 'Food'}
            </button>
            <button
              id="mobile-nav-how-it-works"
              onClick={() => scrollToSection('how-it-works')}
              className="text-start py-2.5 text-base font-bold text-[#1A1A1A] hover:text-[#5A5A40] border-b border-[#1A1A1A]/5"
            >
              {language === 'ar' ? 'كيف تعمل المنصة' : 'How It Works'}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#1A1A1A]/5">
            <div className="flex items-center gap-4">
              <button
                id="mobile-lang-btn"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] px-2.5 py-1.5 rounded-md bg-[#1A1A1A]/5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'AR' : 'EN'}</span>
              </button>
              <button
                id="mobile-help-btn"
                onClick={() => scrollToSection('how-it-works')}
                className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/60"
              >
                {language === 'ar' ? 'مساعدة' : 'Help'}
              </button>
            </div>
            <button
              id="mobile-mytrip-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onMyTripClick) onMyTripClick();
                else onPlanTripClick();
              }}
              className="text-xs font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-3 py-1.5 rounded-full"
            >
              {language === 'ar' ? 'رحلتي ✓' : 'My Trip ✓'}
            </button>
          </div>

          <div className="pt-2">
            <button
              id="mobile-menu-plan-trip-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                onPlanTripClick();
              }}
              className="w-full py-3.5 rounded-full text-center font-bold text-sm text-white bg-[#5A5A40] hover:bg-[#4A4A35] cursor-pointer shadow-md shadow-[#5A5A40]/15"
            >
              {language === 'ar' ? 'خطط رحلتك' : 'Plan My Trip'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
