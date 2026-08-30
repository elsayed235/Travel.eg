import React from 'react';
import { 
  X, 
  Building, 
  Car, 
  Waves, 
  Compass, 
  Check, 
  Calendar, 
  MapPin, 
  Users, 
  Copy, 
  FileText,
  ShieldCheck,
  Phone,
  Mail
} from 'lucide-react';
import { ConfirmedBookingItem } from './myTripData';
import { useTheme } from '../../context/ThemeContext';

interface BookingDetailModalProps {
  booking: ConfirmedBookingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);
  const { isDark } = useTheme();

  if (!isOpen || !booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(booking.confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getServiceIcon = () => {
    switch (booking.iconType) {
      case 'building':
        return <Building className="w-5 h-5 text-[#EA8E75]" />;
      case 'car':
        return <Car className="w-5 h-5 text-[#20A89A]" />;
      case 'waves':
        return <Waves className="w-5 h-5 text-[#20A89A]" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-[#EA8E75]" />;
    }
  };

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
        <div className={`flex items-start justify-between border-b pb-4 ${isDark ? 'border-white/10' : 'border-[#122420]/10'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
              isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-100 border-[#122420]/10'
            }`}>
              {getServiceIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'}`}>
                  {booking.title} Booking
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isDark ? 'text-[#52C4B7] bg-[#13312B] border-white/10' : 'text-[#0E2520] bg-emerald-50 border-emerald-200'
                }`}>
                  Confirmed ✓
                </span>
              </div>
              <h3 className={`text-xl font-bold font-['Outfit',sans-serif] mt-0.5 ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>
                {booking.subtitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDark ? 'bg-[#13312B] hover:bg-white/10 text-[#D2E3DE] hover:text-[#F7F3EA]' : 'bg-stone-100 hover:bg-stone-200 text-[#4A635D] hover:text-[#122420]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmation Code Card */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
              Voucher / Reference Code
            </span>
            <span className={`font-mono text-sm font-bold ${isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'}`}>
              {booking.confirmationCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
              isDark 
                ? 'bg-[#0E2520] border-white/15 text-[#F7F3EA] hover:bg-white/10' 
                : 'bg-white border-[#122420]/15 text-[#122420] hover:bg-stone-100'
            }`}
          >
            <Copy className={`w-3.5 h-3.5 ${isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'}`} />
            <span>{copied ? 'Copied! ✓' : 'Copy'}</span>
          </button>
        </div>

        {/* Key Info Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <span className={`font-medium flex items-center gap-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
              <Calendar className="w-3.5 h-3.5 text-[#20A89A]" />
              <span>Timing / Schedule</span>
            </span>
            <p className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{booking.datesOrTime}</p>
          </div>

          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <span className={`font-medium flex items-center gap-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
              <MapPin className="w-3.5 h-3.5 text-[#20A89A]" />
              <span>Location / Meeting Point</span>
            </span>
            <p className={`font-bold truncate ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{booking.location}</p>
          </div>

          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <span className={`font-medium flex items-center gap-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
              <Users className="w-3.5 h-3.5 text-[#20A89A]" />
              <span>Lead Guest</span>
            </span>
            <p className={`font-bold ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>Ahmed (2 Travelers)</p>
          </div>

          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <span className={`font-medium flex items-center gap-1 ${isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'}`}>
              <FileText className="w-3.5 h-3.5 text-[#20A89A]" />
              <span>Provider</span>
            </span>
            <p className={`font-bold truncate ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>{booking.provider}</p>
          </div>
        </div>

        {/* Details description */}
        <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
          isDark ? 'bg-[#13312B] border-white/10' : 'bg-stone-50 border-[#122420]/10'
        }`}>
          <span className={`font-bold block ${isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'}`}>What's Included:</span>
          <p className={`leading-relaxed ${isDark ? 'text-[#D2E3DE]' : 'text-[#4A635D]'}`}>{booking.details}</p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] font-extrabold text-xs transition-colors cursor-pointer shadow-md"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
