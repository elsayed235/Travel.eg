import React from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Check, 
  MapPin, 
  Waves, 
  Sun, 
  Car,
  Bell
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PreparationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreparationPreviewModal: React.FC<PreparationPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`rounded-3xl max-w-lg w-full p-6 sm:p-7 border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-[#0E2520] text-[#F7F3EA] border-white/10' : 'bg-white text-[#122420] border-[#122420]/10'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className={`flex items-start justify-between border-b pb-4 ${
          isDark ? 'border-white/10' : 'border-[#122420]/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-stone-100 text-[#0E2520] border-[#122420]/10'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block font-['Outfit',sans-serif] ${
                isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
              }`}>
                Pre-Trip Preparation
              </span>
              <h3 className={`text-xl font-bold font-['Outfit',sans-serif] ${
                isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
              }`}>
                Prepare for Dahab
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-[#D2E3DE]/70 hover:text-[#F7F3EA] border-white/10' : 'bg-stone-100 hover:bg-stone-200 text-[#4A635D] hover:text-[#122420] border-[#122420]/10'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pre-arrival Briefing Countdown Notice */}
        <div className={`p-4 rounded-2xl border space-y-1.5 ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${
              isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Full Briefing Unlocks in 2 Days</span>
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              isDark ? 'text-[#52C4B7] bg-[#0E2520] border-white/10' : 'text-[#0E2520] bg-emerald-50 border-emerald-200'
            }`}>
              Automated
            </span>
          </div>
          <p className={`text-xs leading-relaxed ${
            isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
          }`}>
            Your detailed <strong>Pre-Arrival Briefing</strong> will open 24 hours before your flight (Oct 11) with live weather, exact driver contact, and quick arrival guidelines.
          </p>
        </div>

        {/* Essential Pre-Trip Packing & Tips */}
        <div className="space-y-2.5">
          <span className={`text-xs font-bold uppercase tracking-wider block font-['Outfit',sans-serif] ${
            isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
          }`}>
            Essential Checklist for Ahmed &amp; Companion
          </span>

          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <Waves className="w-4 h-4 text-[#20A89A] mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-0.5">
              <span className={`font-bold block ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Diving Gear &amp; Certification</span>
              <p className={isDark ? 'text-[#D2E3DE]/75' : 'text-[#4A635D]'}>Bring your digital or physical dive cards. Premium BCD, wetsuits &amp; tanks are reserved at Red Sea Explorers.</p>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <Sun className="w-4 h-4 text-[#EA8E75] mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-0.5">
              <span className={`font-bold block ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Sinai Desert &amp; Sun Protection</span>
              <p className={isDark ? 'text-[#D2E3DE]/75' : 'text-[#4A635D]'}>Reef-safe sunscreen, comfortable canyon walking shoes, and a light layer for evening desert breeze.</p>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <Car className="w-4 h-4 text-[#20A89A] mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-0.5">
              <span className={`font-bold block ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Arrival Airport Greeter</span>
              <p className={isDark ? 'text-[#D2E3DE]/75' : 'text-[#4A635D]'}>Flight MS 304 is tracked. Driver will hold a Dahab welcome placard right outside SSH baggage claim.</p>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer font-['Outfit',sans-serif]"
          >
            I'm Ready for Dahab
          </button>
        </div>
      </div>
    </div>
  );
};
