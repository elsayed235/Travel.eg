import React from 'react';
import { 
  Building, 
  Car, 
  Waves, 
  Compass, 
  CheckCircle2, 
  Check 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MyTripStatusBadgeProps {
  onViewBookings?: () => void;
}

export const MyTripStatusBadge: React.FC<MyTripStatusBadgeProps> = ({
  onViewBookings,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      id="mytrip-compact-status-card"
      className={`rounded-3xl p-5 sm:p-6 border shadow-lg space-y-3.5 ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      {/* Header Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#20A89A] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#20A89A]">
            Trip Status
          </span>
        </div>

        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold border ${
          isDark ? 'bg-[#13312B] text-[#52C4B7] border-white/10' : 'bg-[#20A89A]/10 text-[#0E2520] border-[#20A89A]/20'
        }`}>
          <Check className="w-3 h-3 text-[#20A89A] stroke-[2.5]" />
          <span>Trip confirmed</span>
        </span>
      </div>

      {/* 4 Compact Service Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
          isDark ? 'bg-[#13312B] border-white/10 hover:border-white/20' : 'bg-[#F2EFE9] border-[#122420]/10'
        }`}>
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-[#EA8E75]" />
            <span className={`font-semibold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Hotel</span>
          </div>
          <span className="font-bold text-[#20A89A] text-[12px]">✓</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
          isDark ? 'bg-[#13312B] border-white/10 hover:border-white/20' : 'bg-[#F2EFE9] border-[#122420]/10'
        }`}>
          <div className="flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-[#20A89A]" />
            <span className={`font-semibold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Transfer</span>
          </div>
          <span className="font-bold text-[#20A89A] text-[12px]">✓</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
          isDark ? 'bg-[#13312B] border-white/10 hover:border-white/20' : 'bg-[#F2EFE9] border-[#122420]/10'
        }`}>
          <div className="flex items-center gap-2">
            <Waves className="w-3.5 h-3.5 text-[#20A89A]" />
            <span className={`font-semibold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Diving</span>
          </div>
          <span className="font-bold text-[#20A89A] text-[12px]">✓</span>
        </div>

        <div className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
          isDark ? 'bg-[#13312B] border-white/10 hover:border-white/20' : 'bg-[#F2EFE9] border-[#122420]/10'
        }`}>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#EA8E75]" />
            <span className={`font-semibold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Safari</span>
          </div>
          <span className="font-bold text-[#20A89A] text-[12px]">✓</span>
        </div>
      </div>

      {onViewBookings && (
        <div className={`pt-1 flex items-center justify-between text-[12px] ${
          isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
        }`}>
          <span>All 4 components coordinated</span>
          <button
            type="button"
            onClick={onViewBookings}
            className={`font-bold hover:underline underline-offset-4 cursor-pointer ${
              isDark ? 'text-[#F4C36C]' : 'text-[#0E2520]'
            }`}
          >
            Review all bookings
          </button>
        </div>
      )}
    </div>
  );
};
