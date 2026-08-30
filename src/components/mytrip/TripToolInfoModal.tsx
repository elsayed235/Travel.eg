import React from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Utensils, 
  HelpCircle, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TripToolInfoModalProps {
  tool: {
    id: string;
    title: string;
    description: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TripToolInfoModal: React.FC<TripToolInfoModalProps> = ({
  tool,
  isOpen,
  onClose,
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`rounded-3xl max-w-md w-full p-6 sm:p-7 border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 ${
          isDark ? 'bg-[#0E2520] text-[#F7F3EA] border-white/10' : 'bg-white text-[#122420] border-[#122420]/10'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-3.5 ${
          isDark ? 'border-white/10' : 'border-[#122420]/10'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-stone-100 text-[#0E2520] border-[#122420]/10'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block font-['Outfit',sans-serif] ${
                isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
              }`}>
                Trip Tool
              </span>
              <h3 className={`text-lg font-bold font-['Outfit',sans-serif] ${
                isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
              }`}>
                {tool.title}
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

        {/* Content */}
        <div className="space-y-3">
          <p className={`text-xs sm:text-sm leading-relaxed ${
            isDark ? 'text-[#D2E3DE]/90' : 'text-[#4A635D]'
          }`}>
            {tool.description}
          </p>

          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <div className={`flex items-center gap-2 font-bold ${
              isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Pre-Trip Stage Status</span>
            </div>
            <p className={`leading-relaxed ${
              isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'
            }`}>
              This interactive tool activates dynamically as you progress through Dahab, unlocking contextual recommendations and live assistance.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer font-['Outfit',sans-serif]"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
