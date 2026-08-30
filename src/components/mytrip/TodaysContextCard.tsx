import React from 'react';
import { 
  SunMedium, 
  MapPin, 
  ArrowRight, 
  Luggage,
  Sparkles,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TodaysContextCardProps {
  onPrepareForDahab: () => void;
}

export const TodaysContextCard: React.FC<TodaysContextCardProps> = ({
  onPrepareForDahab,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      id="todays-context-section-card"
      className={`rounded-3xl p-6 sm:p-7 border space-y-4 shadow-lg ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
            isDark ? 'bg-[#13312B] text-[#F4C36C] border-white/10' : 'bg-[#20A89A]/10 text-[#20A89A] border-[#20A89A]/20'
          }`}>
            <SunMedium className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#20A89A] block font-['Outfit',sans-serif]">
              Trip Preparation
            </span>
            <h3 className={`text-lg font-bold font-['Outfit',sans-serif] ${
              isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
            }`}>
              Your trip starts tomorrow
            </h3>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${
          isDark ? 'text-[#52C4B7] bg-[#13312B] border-white/10' : 'text-[#0E2520] bg-stone-100 border-[#122420]/10'
        }`}>
          <MapPin className="w-3 h-3 text-[#EA8E75]" />
          <span>Dahab 28°C · Sunny</span>
        </span>
      </div>

      <p className={`text-xs sm:text-sm leading-relaxed ${
        isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
      }`}>
        We'll help you get ready before you arrive. Learn what to pack for Red Sea diving, currency tips for Bedouin cafes, and your seamless airport greeting.
      </p>

      <div className={`pt-2 flex items-center justify-between gap-3 border-t ${
        isDark ? 'border-white/10' : 'border-[#122420]/10'
      }`}>
        <div className={`flex items-center gap-2 text-xs ${
          isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
        }`}>
          <Info className="w-3.5 h-3.5 text-[#20A89A]" />
          <span>Pre-arrival briefing is ready to review</span>
        </div>

        <button
          type="button"
          id="prepare-for-dahab-btn"
          onClick={onPrepareForDahab}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border shadow-xs transition-all cursor-pointer ${
            isDark
              ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/15'
              : 'bg-white hover:bg-stone-100 text-[#122420] border-[#122420]/15'
          }`}
        >
          <span>Prepare for Dahab</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#20A89A]" />
        </button>
      </div>
    </div>
  );
};
