import React, { useState } from 'react';
import { 
  LifeBuoy, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Compass, 
  MessageSquare,
  Waves,
  X,
  PhoneCall
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { EmergencyModal } from './EmergencyModal';
import { SinaiPassbookModal } from './SinaiPassbookModal';

export const SinaiFloatingQuickDock: React.FC = () => {
  // isAiAssistantOpen was read from the context but never existed there, and no
  // such state exists anywhere: AiTravelAssistant is an always-rendered inline
  // panel with no open/close concept. The reference was permanently undefined,
  // so it contributed nothing to isModalActive. Removed rather than invented.
  const { navigateTo, currentRoute } = useTrip();
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isPassbookOpen, setIsPassbookOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isModalActive = isEmergencyOpen || isPassbookOpen || currentRoute === '/daygi';

  return (
    <>
      {/* Floating Quick Action Pill - auto-hidden on mobile viewports when modals or DayGI are active */}
      <div 
        id="sinai-quick-dock"
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed bottom-[148px] md:bottom-6 end-4 sm:end-6 z-40 flex flex-col items-end gap-2 pointer-events-auto transition-opacity duration-300 ${
          isModalActive ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {/* Expanded Quick Drawer */}
        {isExpanded && (
          <div className={`backdrop-blur-xl border p-3 rounded-2xl shadow-2xl space-y-2 mb-1 w-64 animate-in slide-in-from-bottom-3 duration-200 ${
            isDark 
              ? 'bg-[#0E2520]/95 border-[#52C4B7]/40 text-[#F7F3EA]' 
              : 'bg-white/95 border-[#122420]/15 text-[#122420]'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 px-1 ${
              isDark ? 'border-white/10' : 'border-[#122420]/10'
            }`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider font-['Outfit',sans-serif] ${
                isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'
              }`}>
                {language === 'ar' ? 'أدوات دهب السريعة' : 'Dahab Travel Toolkit'}
              </span>
              <button 
                type="button"
                onClick={() => setIsExpanded(false)}
                className={`transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-[#4A635D] hover:text-[#122420]'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tool 1: Emergency Dial & Decompression */}
            <button
              type="button"
              onClick={() => {
                setIsEmergencyOpen(true);
                setIsExpanded(false);
              }}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl border text-xs font-bold transition-all text-start cursor-pointer ${
                isDark 
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-500/30 text-rose-300' 
                  : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
              }`}
            >
              <LifeBuoy className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <div>
                <div className={`text-[12px] font-bold ${isDark ? 'text-rose-200' : 'text-rose-900'}`}>
                  {language === 'ar' ? 'طوارئ سيناء وغرفة الضغط' : 'Sinai 24/7 Rapid Emergency'}
                </div>
                <div className={`text-[11px] font-normal ${isDark ? 'text-rose-300/80' : 'text-rose-700'}`}>
                  {language === 'ar' ? 'إسعاف (١٢٣) · أطباء غوص' : 'Ambulance · Hyperbaric Med'}
                </div>
              </div>
            </button>

            {/* Tool 2: Verified Digital Sinai Pass */}
            <button
              type="button"
              onClick={() => {
                setIsPassbookOpen(true);
                setIsExpanded(false);
              }}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl border text-xs font-bold transition-all text-start cursor-pointer ${
                isDark 
                  ? 'bg-[#20A89A]/15 hover:bg-[#20A89A]/25 border-[#20A89A]/30 text-[#52C4B7]' 
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-[#20A89A]' : 'text-[#0E2520]'}`} />
              <div>
                <div className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-[#122420]'}`}>
                  {language === 'ar' ? 'تصريح سيناء الرقمي' : 'Sinai Digital Passbook'}
                </div>
                <div className={`text-[11px] font-normal ${isDark ? 'text-white/70' : 'text-[#4A635D]'}`}>
                  {language === 'ar' ? 'كمائن سيناء · تصريح الغوص' : 'Checkpoint Clearance · QR'}
                </div>
              </div>
            </button>

            {/* Tool 3: Food & Spontaneous Discovery */}
            <button
              type="button"
              onClick={() => {
                navigateTo('/food');
                setIsExpanded(false);
              }}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl border text-xs font-bold transition-all text-start cursor-pointer ${
                isDark 
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300' 
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
              }`}
            >
              <Compass className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'}`} />
              <div>
                <div className={`text-[12px] font-bold ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                  {language === 'ar' ? 'أكل وقهاوي دلوقتي' : 'Food & Chill Now'}
                </div>
                <div className={`text-[11px] font-normal ${isDark ? 'text-amber-300/80' : 'text-amber-700'}`}>
                  {language === 'ar' ? 'أماكن مفتوحة وقريبة منك' : 'Live Curated Spots Nearby'}
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Floating Trigger Button */}
        <div className="flex items-center gap-2">
          {/* 1-Tap Emergency Trigger */}
          <button
            type="button"
            onClick={() => setIsEmergencyOpen(true)}
            aria-label="Sinai 24/7 Emergency"
            title="Sinai 24/7 Emergency Hotline"
            className={`w-11 h-11 rounded-full border-2 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
              isDark 
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 hover:bg-rose-900' 
                : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
            }`}
          >
            <LifeBuoy className="w-5 h-5 animate-pulse text-rose-500" />
          </button>

          {/* Master Sinai Quick Toolkit Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full border-2 shadow-xl transition-all hover:scale-102 active:scale-98 cursor-pointer backdrop-blur-md text-xs font-bold font-['Outfit',sans-serif] ${
              isDark 
                ? 'bg-[#0E2520]/95 text-white border-[#52C4B7]/50 hover:bg-[#13312B]' 
                : 'bg-white text-[#122420] border-[#122420]/15 hover:bg-stone-50'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'}`} />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'أدوات دهب' : 'Dahab Tools'}
            </span>
          </button>
        </div>
      </div>

      {/* Emergency Modal Instance */}
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />

      {/* Sinai Passbook Modal Instance */}
      <SinaiPassbookModal
        isOpen={isPassbookOpen}
        onClose={() => setIsPassbookOpen(false)}
      />
    </>
  );
};
