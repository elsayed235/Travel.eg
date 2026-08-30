import React from 'react';
import { 
  Check, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  BedDouble, 
  ShieldCheck, 
  Sparkles, 
  Lock,
  Compass,
  CheckCircle2,
  Info
} from 'lucide-react';
import { HotelOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface BookingSummarySidebarProps {
  selectedHotel: HotelOption | null;
  onContinue: () => void;
  onViewSelectedHotelDetails?: () => void;
}

export const BookingSummarySidebar: React.FC<BookingSummarySidebarProps> = ({
  selectedHotel,
  onContinue,
  onViewSelectedHotelDetails,
}) => {
  const isSelected = selectedHotel !== null;
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const hotelName = isSelected && isAr && selectedHotel.nameAr ? selectedHotel.nameAr : selectedHotel?.name;
  const hotelNeighborhood = isSelected && isAr && selectedHotel.neighborhoodAr ? selectedHotel.neighborhoodAr : selectedHotel?.neighborhood;
  const hotelRoomType = isSelected && isAr && selectedHotel.roomTypeAr ? selectedHotel.roomTypeAr : selectedHotel?.roomType;

  return (
    <div className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Primary Trip Booking Summary Card */}
      <div
        id="desktop-booking-summary-card"
        className="rounded-3xl bg-[#0E2520] border border-white/10 p-6 shadow-md space-y-5 text-[#F7F3EA]"
      >
        {/* Header Title */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#52C4B7] block">
              {isAr ? 'ضمن رحلتك لدهب' : 'Part of your Dahab trip'}
            </span>
            <h3 className="text-lg font-serif font-bold text-[#F7F3EA] mt-0.5">
              {isAr ? 'ملخص رحلتك' : 'Your trip'}
            </h3>
          </div>
          <span className="text-xs font-bold text-[#52C4B7] bg-[#13312B] border border-white/10 px-2.5 py-1 rounded-full">
            {isAr ? 'دهب' : 'Dahab'}
          </span>
        </div>

        {/* Trip Baseline Specs */}
        <div className="space-y-2.5 text-xs text-[#D2E3DE]/80">
          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-[#D2E3DE]/60 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#52C4B7]" />
              <span>{isAr ? 'المدة' : 'Duration'}</span>
            </span>
            <span className="font-bold text-[#F7F3EA]">{isAr ? '٥ أيام' : '5 days'}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-[#D2E3DE]/60 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#52C4B7]" />
              <span>{isAr ? 'المسافرون' : 'Travelers'}</span>
            </span>
            <span className="font-bold text-[#F7F3EA]">{isAr ? 'فردين بالغين' : '2 adults'}</span>
          </div>
        </div>

        {/* Selected Component: Hotel Block */}
        <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60">
              {isAr ? '٠١ الإقامة والفندق' : '01 Accommodation'}
            </span>
            {isSelected ? (
              <span className="text-[12px] font-bold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Check className="w-3 h-3 text-[#52C4B7]" />
                {isAr ? 'تم اختيار الفندق ✓' : 'Hotel selected ✓'}
              </span>
            ) : (
              <span className="text-[12px] font-medium text-[#F4C36C] bg-[#F4C36C]/15 border border-[#F4C36C]/30 px-2 py-0.5 rounded-full">
                {isAr ? 'لم يتم الاختيار بعد' : 'No hotel selected'}
              </span>
            )}
          </div>

          {isSelected && selectedHotel ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#F7F3EA] leading-snug">
                    {hotelName}
                  </h4>
                  <p className="text-[12px] text-[#D2E3DE]/60 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#52C4B7]" />
                    <span>{hotelNeighborhood}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#D2E3DE]/60">{isAr ? 'الغرفة:' : 'Room:'}</span>
                <span className="font-semibold text-[#F7F3EA] text-start truncate max-w-[170px]">
                  {hotelRoomType}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#D2E3DE]/60">{isAr ? 'الإقامة:' : 'Stay:'}</span>
                <span className="font-semibold text-[#F7F3EA]">{isAr ? '٥ ليالي' : '5 nights'}</span>
              </div>

              {onViewSelectedHotelDetails && (
                <button
                  type="button"
                  onClick={onViewSelectedHotelDetails}
                  className="text-[12px] font-semibold text-[#F4C36C] hover:underline pt-1 inline-block cursor-pointer"
                >
                  {isAr ? 'عرض تفاصيل الفندق' : 'View stay details'}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#D2E3DE]/70 leading-relaxed font-normal py-1">
              {isAr ? 'اختر أحد الفنادق المرشحة لرحلتك من القائمة للمتابعة.' : 'Choose one of the 3 curated stays on the left that matches your approved 5-day pace.'}
            </p>
          )}
        </div>

        {/* Pricing Subtotal Section */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D2E3DE]/60">
              {isAr ? 'إجمالي تكلفة الإقامة' : 'Total Hotel Cost'}
            </span>
            <div className="text-start">
              <span className="text-xl font-black text-[#F4C36C]">
                {isSelected && selectedHotel ? `${selectedHotel.priceTotalEGP.toLocaleString()} ${isAr ? 'جنيه' : 'EGP'}` : '—'}
              </span>
            </div>
          </div>

          <div className="text-[12px] text-[#D2E3DE]/50 flex items-center justify-between">
            <span>{isAr ? '٥ ليالي · فردين' : '5 nights · 2 adults'}</span>
            <span>{isSelected ? (isAr ? 'شامل الضرائب والإفطار' : 'Taxes & breakfast included') : (isAr ? 'في انتظار الاختيار' : 'Pending selection')}</span>
          </div>
        </div>

        {/* Primary Continue CTA */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            id="desktop-sidebar-continue-btn"
            disabled={!isSelected}
            onClick={onContinue}
            className={`w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-full text-sm font-bold shadow-md transition-all ${
              isSelected
                ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] font-bold cursor-pointer active:scale-[0.98]'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <span>{isAr ? 'متابعة الخطوة التالية' : 'Continue'}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>

          {!isSelected && (
            <p className="text-center text-[12px] text-[#D2E3DE]/50">
              {isAr ? 'يرجى اختيار الفندق للانتقال للخطوة الثانية' : 'Please select a stay above to proceed to step 02'}
            </p>
          )}
        </div>
      </div>

      {/* Trust & Next Steps Info Box */}
      <div className="p-5 rounded-2xl bg-[#0E2520] border border-white/10 space-y-2.5 text-xs text-[#D2E3DE]">
        <div className="flex items-center gap-2 font-bold text-[#F7F3EA]">
          <ShieldCheck className="w-4 h-4 text-[#52C4B7]" />
          <span>{isAr ? 'حجز واضح ومضمون' : 'Transparent Dahab Journey'}</span>
        </div>
        <p className="text-[12px] leading-relaxed text-[#D2E3DE]/70 font-normal">
          {isAr ? 'أنت تبني خدمات رحلتك خطوة بخطوة. لا يتم سداد أي مبالغ حتى تراجع جميع الخدمات الأربعة معاً.' : 'You are building your trip services step by step. No payment is taken until you review all 4 services together.'}
        </p>

        <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[12px] text-[#52C4B7] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isAr ? 'الخطوة التالية: ٠٢ توصيل المطار الخاص' : 'Next up: 02 Private Airport Transfer'}</span>
        </div>
      </div>
    </div>
  );
};

