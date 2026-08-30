import React from 'react';
import { 
  Building, 
  Car, 
  Waves, 
  Compass, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Plus,
  Sparkles,
  Utensils
} from 'lucide-react';
import { ConfirmedBookingItem } from './myTripData';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface BookingsSectionProps {
  onViewBooking: (booking: ConfirmedBookingItem) => void;
  bookings?: ConfirmedBookingItem[];
}

export const BookingsSection: React.FC<BookingsSectionProps> = ({
  onViewBooking,
  bookings: propBookings,
}) => {
  const { bookings: contextBookings, navigateTo } = useTrip();
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const activeBookings = propBookings && propBookings.length > 0 ? propBookings : contextBookings;

  const getBookingIcon = (iconType: ConfirmedBookingItem['iconType']) => {
    switch (iconType) {
      case 'building':
        return <Building className="w-4 h-4 text-[#EA8E75]" />;
      case 'car':
        return <Car className="w-4 h-4 text-[#20A89A]" />;
      case 'waves':
        return <Waves className="w-4 h-4 text-[#20A89A]" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-[#EA8E75]" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-[#20A89A]" />;
      case 'utensils':
        return <Utensils className="w-4 h-4 text-[#EA8E75]" />;
      default:
        return <Compass className="w-4 h-4 text-[#20A89A]" />;
    }
  };

  return (
    <div
      id="your-bookings-section"
      className={`rounded-3xl p-6 border shadow-lg space-y-4 font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-[#0E2520] border-white/10 text-[#F7F3EA]' : 'bg-white border-[#122420]/10 text-[#122420]'
      }`}
    >
      {/* Section Header */}
      <div className={`flex items-center justify-between border-b pb-3 ${
        isDark ? 'border-white/10' : 'border-[#122420]/10'
      }`}>
        <div>
          <span className={`text-[11px] font-bold uppercase tracking-wider font-['Outfit',sans-serif] block ${
            isDark ? 'text-[#52C4B7]' : 'text-[#0E2520]'
          }`}>
            {language === 'ar' ? 'المكونات المنسقة' : 'Coordinated Components'}
          </span>
          <h2 className={`text-lg font-bold font-['Outfit',sans-serif] ${
            isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
          }`}>
            {language === 'ar' ? 'حجوزاتك' : 'Your Bookings'}
          </h2>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          isDark 
            ? 'text-[#52C4B7] bg-[#13312B] border-white/10' 
            : 'text-[#0E2520] bg-[#20A89A]/10 border-[#20A89A]/20'
        }`}>
          {language === 'ar' 
            ? `${activeBookings.length} معتمد ✓` 
            : `${activeBookings.length} Confirmed ✓`}
        </span>
      </div>

      {/* Bookings List or Clean Empty State */}
      {activeBookings.length > 0 ? (
        <div className="space-y-2.5">
          {activeBookings.map((booking) => (
            <div
              key={booking.id}
              id={`booking-card-${booking.serviceType || booking.id}`}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                isDark 
                  ? 'bg-[#13312B] border-white/10 hover:border-[#52C4B7]/40' 
                  : 'bg-stone-50 border-[#122420]/10 hover:border-[#20A89A]/40'
              }`}
            >
              {/* Left Icon + Service Title + Details */}
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isDark ? 'bg-[#0E2520] border-white/10 text-[#52C4B7]' : 'bg-white border-[#122420]/10 text-[#20A89A]'
                }`}>
                  {getBookingIcon(booking.iconType)}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    {/* h4 under the section's h2 — a skipped level. It was
                        never measurable before because `bookings` was always
                        empty, so no card ever rendered. */}
                    <h3 className={`text-xs font-bold truncate font-['Outfit',sans-serif] ${
                      isDark ? 'text-[#F7F3EA]' : 'text-[#122420]'
                    }`}>
                      {booking.subtitle || booking.title}
                    </h3>
                    <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full border flex-shrink-0 ${
                      isDark ? 'text-[#52C4B7] bg-[#0E2520] border-white/10' : 'text-[#0E2520] bg-emerald-50 border-emerald-200'
                    }`}>
                      Confirmed ✓
                    </span>
                  </div>

                  <p className={`text-[12px] truncate ${
                    isDark ? 'text-[#D2E3DE]/70' : 'text-[#4A635D]'
                  }`}>
                    {booking.title} · {booking.datesOrTime}
                  </p>
                </div>
              </div>

              {/* Right Action: View booking */}
              <button
                type="button"
                id={`view-booking-btn-${booking.id}`}
                onClick={() => onViewBooking(booking)}
                className={`flex-shrink-0 text-xs font-bold flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-xl border transition-all ${
                  isDark 
                    ? 'text-[#F7F3EA] group-hover:text-[#F4C36C] bg-[#0E2520] group-hover:bg-white/10 border-white/10' 
                    : 'text-[#122420] group-hover:text-[#0E2520] bg-white group-hover:bg-stone-100 border-[#122420]/10'
                }`}
              >
                <span>{language === 'ar' ? 'القسيمة' : 'Voucher'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#EA8E75]" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={`py-6 text-center space-y-3 rounded-2xl border border-dashed p-4 ${
          isDark ? 'bg-[#13312B] border-white/20' : 'bg-stone-50 border-[#122420]/20'
        }`}>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-[#D2E3DE]/80' : 'text-[#4A635D]'}`}>
            {language === 'ar' 
              ? 'لا توجد حجوزات نشطة بعد. استكشف خدمات الغوص، الإقامة، وسيارات المطار المعتمدة.'
              : 'No active bookings yet. Explore verified stays, dive packages, or private airport transfers.'}
          </p>
          <button
            type="button"
            onClick={() => navigateTo('/bookings')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EA8E75] hover:bg-[#DE7C62] text-[#3B1B10] text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>{language === 'ar' ? 'احجز خدمات موثوقة' : 'Book Verified Services'}</span>
          </button>
        </div>
      )}

      {/* Footer Note */}
      <div className={`pt-2 text-[12px] flex items-center gap-1.5 border-t ${
        isDark ? 'text-[#D2E3DE]/70 border-white/10' : 'text-[#4A635D] border-[#122420]/10'
      }`}>
        <ShieldCheck className="w-3.5 h-3.5 text-[#20A89A] flex-shrink-0" />
        <span>{language === 'ar' ? 'تصاريح رقمية معتمدة — لا حاجة للمطبوعات الورقية' : 'Digital pass confirmed — zero paper printouts required across Sinai checkpoints'}</span>
      </div>
    </div>
  );
};
