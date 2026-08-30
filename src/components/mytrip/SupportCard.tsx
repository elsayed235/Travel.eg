import React from 'react';
import { HelpCircle, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SupportCardProps {
  onOpenHelp: () => void;
}

export const SupportCard: React.FC<SupportCardProps> = ({
  onOpenHelp,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      id="persistent-support-card"
      className={`rounded-3xl p-6 border shadow-lg space-y-3.5 ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
          isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-emerald-50 text-[#0E2520] border-emerald-200'
        }`}>
          <HelpCircle className="w-4 h-4 text-[#20A89A]" />
        </div>
        <div>
          <span className={`text-[11px] font-bold uppercase tracking-wider block font-['Outfit',sans-serif] ${
            isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
          }`}>
            Dahab Care
          </span>
          <h2 className={`text-base font-bold font-['Outfit',sans-serif] ${
            isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
          }`}>
            Need help?
          </h2>
        </div>
      </div>

      <p className={`text-xs leading-relaxed ${isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'}`}>
        We're here if something doesn't go as planned. Fast response for transfers, diving schedules, or hotel questions.
      </p>

      <div className="pt-1">
        <button
          type="button"
          id="help-me-now-support-card-btn"
          onClick={onOpenHelp}
          className={`w-full py-2.5 px-4 rounded-full text-xs font-bold border shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isDark 
              ? 'bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] border-white/15' 
              : 'bg-stone-50 hover:bg-stone-100 text-[#122420] border-[#122420]/10'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#20A89A]" />
          <span>Help Me Now</span>
          <ArrowRight className="w-3.5 h-3.5 ml-auto text-[#EA8E75]" />
        </button>
      </div>
    </div>
  );
};
