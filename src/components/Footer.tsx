import React from 'react';
import { Globe, Heart } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onPlanTripClick: () => void;
  onExploreClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlanTripClick, onExploreClick }) => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer id="main-footer" dir={isRTL ? 'rtl' : 'ltr'} className="bg-[#04171D] text-[#F7F3EA] pt-20 pb-14 border-t border-[#20A89A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-[#20A89A]/20">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <a
              href="#"
              id="footer-logo-link"
              className="text-2xl font-black tracking-tighter text-[#F7F3EA] font-['Outfit',sans-serif] hover:opacity-85 transition-opacity block"
            >
              DAHAB
            </a>
            <p className="text-sm text-[#E7D3AE]/70 max-w-sm leading-relaxed font-normal">
              {language === 'ar'
                ? 'منصة دهب الرقمية المصممة لمساعدة المسافرين على استكشاف وتخطيط وخوض تجارب دهب الأصيلة في جنوب سيناء.'
                : 'A premium digital travel platform crafted to help travelers discover, plan, and experience the authentic magic of Dahab, South Sinai.'}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                id="footer-lang-toggle"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#062C35] hover:bg-[#0A3A46] text-[#E7A83B] transition-colors cursor-pointer border border-[#20A89A]/30 shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#E7A83B]" />
                <span>{language === 'en' ? 'Language: العربية' : 'اللغة: English'}</span>
              </button>
            </div>
          </div>

          {/* Group 1: Explore */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E7D3AE]/40 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'استكشف' : 'Explore'}
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button
                  onClick={() => scrollToSection('explore-dahab')}
                  className="text-[#E7D3AE]/80 hover:text-[#F7F3EA] transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'تجارب دهب' : 'Experiences'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('explore-dahab')}
                  className="text-[#E7D3AE]/80 hover:text-[#F7F3EA] transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'المطاعم والأكل' : 'Food'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('explore-dahab')}
                  className="text-[#E7D3AE]/80 hover:text-[#F7F3EA] transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'معالم دهب' : 'Dahab'}
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: Plan */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E7D3AE]/40 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'التخطيط' : 'Plan'}
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button
                  onClick={onPlanTripClick}
                  className="text-[#E7A83B] hover:text-[#F4C36C] transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'خطط رحلتك' : 'Plan My Trip'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-[#E7D3AE]/80 hover:text-[#F7F3EA] transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'كيف تعمل المنصة' : 'How It Works'}
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: Support */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E7D3AE]/40 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'الدعم الفني' : 'Support'}
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-[#E7D3AE]/80 hover:text-[#F7F3EA] transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'المساعدة والأسئلة' : 'Help'}
                </button>
              </li>
              <li>
                <a
                  href="#ops"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#ops';
                    // Trigger custom navigation if available
                  }}
                  className="text-[#52C4B7] hover:text-[#20A89A] transition-colors"
                >
                  {language === 'ar' ? 'لوحة العمليات (T01)' : 'Operations Console (T01)'}
                </a>
              </li>
              <li>
                <a
                  href="#supplier"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#supplier';
                  }}
                  className="text-[#E7A83B] hover:text-[#F4C36C] transition-colors"
                >
                  {language === 'ar' ? 'بوابة الموردين (S01)' : 'Supplier OS Portal (S01)'}
                </a>
              </li>
            </ul>
          </div>

          {/* Group 4: Company */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E7D3AE]/40 font-['Outfit',sans-serif]">
              {language === 'ar' ? 'عن الشركة' : 'Company'}
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <span className="text-[#E7D3AE]/60 hover:text-[#F7F3EA] transition-colors cursor-pointer">
                  {language === 'ar' ? 'عن المنصة' : 'About'}
                </span>
              </li>
              <li>
                <span className="text-[#E7D3AE]/60 hover:text-[#F7F3EA] transition-colors cursor-pointer">
                  {language === 'ar' ? 'الخصوصية' : 'Privacy'}
                </span>
              </li>
              <li>
                <span className="text-[#E7D3AE]/60 hover:text-[#F7F3EA] transition-colors cursor-pointer">
                  {language === 'ar' ? 'الشروط' : 'Terms'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E7D3AE]/50 gap-4 font-medium">
          <div>
            © {new Date().getFullYear()} DAHAB. {language === 'ar' ? 'جميع الحقوق محفوظة. صُممت للمسافرين إلى جنوب سيناء، مصر.' : 'All rights reserved. Crafted for travelers to South Sinai, Egypt.'}
          </div>
          <div className="flex items-center gap-1 text-[#E7D3AE]/50">
            <span>{language === 'ar' ? 'صُنعت بشغف محلي لدهب' : 'Built with local passion for Dahab'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
