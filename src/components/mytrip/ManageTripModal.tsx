import React from 'react';
import { 
  X, 
  Edit3, 
  PlusCircle, 
  RefreshCw, 
  FileText, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ManageTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

export const ManageTripModal: React.FC<ManageTripModalProps> = ({
  isOpen,
  onClose,
  onSelectOption,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const manageOptions = [
    {
      id: 'edit-itinerary',
      title: 'Edit itinerary',
      desc: 'Rearrange free time, adjust morning pacing, or swap suggested dining spots.',
      icon: <Edit3 className="w-4 h-4 text-[#EA8E75]" />,
    },
    {
      id: 'add-activity',
      title: 'Add activity',
      desc: 'Browse optional yoga sessions, windsurfing lessons, or Ras Abu Galum boat trips.',
      icon: <PlusCircle className="w-4 h-4 text-[#20A89A]" />,
    },
    {
      id: 'change-booking',
      title: 'Change booking',
      desc: 'Request date shifts, room category upgrades, or change transfer pickup times.',
      icon: <RefreshCw className="w-4 h-4 text-[#EA8E75]" />,
    },
    {
      id: 'view-booking-details',
      title: 'View booking details',
      desc: 'Access unified voucher codes, operator contact cards, and payment receipts.',
      icon: <FileText className="w-4 h-4 text-[#20A89A]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`rounded-3xl max-w-lg w-full p-6 sm:p-7 border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 ${
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
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block font-['Outfit',sans-serif] ${
                isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
              }`}>
                Trip Options
              </span>
              <h3 className={`text-lg font-bold font-['Outfit',sans-serif] ${
                isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
              }`}>
                Manage Trip
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

        {/* Options List */}
        <div className="space-y-2.5">
          {manageOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              id={`manage-option-${opt.id}`}
              onClick={() => {
                onSelectOption(opt.title);
                onClose();
              }}
              className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left group cursor-pointer ${
                isDark 
                  ? 'bg-[#13312B] border-white/10 hover:border-white/20 hover:bg-[#13312B]/90' 
                  : 'bg-stone-50 border-[#122420]/10 hover:border-[#122420]/20 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${
                  isDark ? 'bg-[#0E2520] border-white/10' : 'bg-white border-[#122420]/10'
                }`}>
                  {opt.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold transition-colors ${
                    isDark ? 'text-[#F7F3EA] group-hover:text-[#F4C36C]' : 'text-[#122420] group-hover:text-[#EA8E75]'
                  }`}>
                    {opt.title}
                  </h4>
                  <p className={`text-[12px] leading-relaxed ${
                    isDark ? 'text-[#D2E3DE]/75' : 'text-[#4A635D]'
                  }`}>
                    {opt.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-all flex-shrink-0 ${
                isDark ? 'text-[#D2E3DE]/40 group-hover:text-[#F7F3EA]' : 'text-[#4A635D]/50 group-hover:text-[#122420]'
              }`} />
            </button>
          ))}
        </div>

        {/* Footer reassurance */}
        <div className={`pt-2 text-center text-xs flex items-center justify-center gap-1.5 border-t ${
          isDark ? 'text-[#D2E3DE]/70 border-white/10' : 'text-[#4A635D] border-[#122420]/10'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-[#20A89A]" />
          <span>Changes are protected by Dahab Booking Care</span>
        </div>
      </div>
    </div>
  );
};
