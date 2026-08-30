import React from 'react';
import { 
  Building, 
  Car, 
  Waves, 
  Users, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Clock
} from 'lucide-react';
import { HotelOption, TransferOption, DivingOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface BookingDivingSummarySidebarProps {
  selectedHotel: HotelOption | null;
  selectedTransfer: TransferOption | null;
  selectedDiving: DivingOption | null;
  selectedDay: number;
  selectedTime: string;
  onContinue: () => void;
  onBack: () => void;
}

export const BookingDivingSummarySidebar: React.FC<BookingDivingSummarySidebarProps> = ({
  selectedHotel,
  selectedTransfer,
  selectedDiving,
  selectedDay,
  selectedTime,
  onContinue,
  onBack,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const estimatedDivingCost = selectedDiving ? selectedDiving.pricePerPersonEGP * 2 : 0;
  const hotelDisplayName = isAr && selectedHotel?.nameAr ? selectedHotel.nameAr : (selectedHotel?.name || (isAr ? 'فندق دهب باي' : 'Dahab Bay Hotel'));
  const hotelRoomType = isAr && selectedHotel?.roomTypeAr ? selectedHotel.roomTypeAr : (selectedHotel?.roomType || (isAr ? 'غرفة مزدوجة قياسية' : 'Standard Double Room'));
  const transferDisplayName = isAr && selectedTransfer?.titleAr ? selectedTransfer.titleAr : (selectedTransfer?.title || (isAr ? 'سيارة خاصة' : 'Private Car'));
  const divingDisplayName = isAr && selectedDiving?.titleAr ? selectedDiving.titleAr : (selectedDiving?.title || '');

  return (
    <div
      id="booking-diving-summary-sidebar"
      className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-sm space-y-6 text-[#F7F3EA]"
    >
      {/* 1. Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#52C4B7] bg-[#13312B] border border-white/10 px-2.5 py-0.5 rounded-full">
            {isAr ? 'تنسيق الرحلة' : 'Trip Coordination'}
          </span>
          <span className="text-xs text-[#D2E3DE]/50 font-medium">{isAr ? 'الخطوة ٠٣ من ٠٤' : 'Step 03 of 04'}</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-[#F7F3EA] mt-2">
          {isAr ? 'رحلتك إلى دهب' : 'Your Dahab trip'}
        </h3>
        <p className="text-xs text-[#D2E3DE]/60 mt-0.5">
          {isAr ? 'دهب، مصر · ٥ أيام · فردين بالغين' : 'Dahab, Egypt · 5 days · 2 adults'}
        </p>
      </div>

      {/* 2. Step 01 Saved: Hotel */}
      <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>{isAr ? '٠١ الفندق' : '01 Hotel'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>{isAr ? 'تم الاختيار ✓' : 'Selected ✓'}</span>
          </span>
        </div>
        <div>
          <div className="text-xs font-bold text-[#F7F3EA]">
            {hotelDisplayName}
          </div>
          <div className="text-[12px] text-[#D2E3DE]/60">
            {hotelRoomType} · {isAr ? '٥ ليالٍ' : '5 nights'}
          </div>
        </div>
      </div>

      {/* 3. Step 02 Saved: Transfer */}
      <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5" />
            <span>{isAr ? '٠٢ الانتقالات' : '02 Transfer'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>{isAr ? 'تم الاختيار ✓' : 'Selected ✓'}</span>
          </span>
        </div>
        <div>
          <div className="text-xs font-bold text-[#F7F3EA]">
            {transferDisplayName}
          </div>
          <div className="text-[12px] text-[#D2E3DE]/60">
            {isAr ? 'شرم الشيخ ← دهب' : 'Sharm El Sheikh → Dahab'}
          </div>
        </div>
      </div>

      {/* 4. Step 03 Active: Diving */}
      <div className="p-3.5 rounded-2xl bg-[#13312B] border border-[#20A89A]/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>{isAr ? '٠٣ الغطس' : '03 Diving'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#20A89A] bg-[#20A89A]/15 border border-[#20A89A]/30 px-2 py-0.5 rounded-full">
            {isAr ? 'الاختيار الحالي' : 'Active selection'}
          </span>
        </div>

        {selectedDiving ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-[#F7F3EA]">
              <span>{divingDisplayName}</span>
              <span className="text-sm font-black text-[#F7F3EA]">
                {estimatedDivingCost.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>

            <div className="space-y-1 text-[12px] text-[#D2E3DE]/70">
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'اليوم والوقت' : 'Day & Time'}</span>
                <span className="font-semibold text-[#F7F3EA]">
                  {isAr ? `اليوم ${selectedDay} · ${selectedTime}` : `Day ${selectedDay} · ${selectedTime}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'المسافرون' : 'Travelers'}</span>
                <span className="font-semibold text-[#F7F3EA]">{isAr ? 'فردين بالغين' : '2 adults'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'سعر الفرد' : 'Per Person'}</span>
                <span className="font-semibold text-[#F7F3EA]">
                  {selectedDiving.pricePerPersonEGP.toLocaleString()} {isAr ? 'ج.م' : 'EGP'} × 2
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#D2E3DE]/60 italic py-1">
            {isAr ? 'يرجى اختيار باقة الغطس' : 'Please choose a diving experience'}
          </div>
        )}
      </div>

      {/* 5. Upcoming Step Preview */}
      <div className="space-y-2 text-xs border-t border-white/10 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
          {isAr ? 'الخطوات القادمة في الحجز' : 'Upcoming In Trip Booking'}
        </span>
        <div className="flex items-center justify-between text-[12px] text-[#D2E3DE]/60">
          <span>{isAr ? '٠٤ رحلة سفاري صحراوية وبدوية' : '04 Bedouin Desert Safari'}</span>
          <span>{isAr ? 'الخطوة التالية' : 'Next step'}</span>
        </div>
      </div>

      {/* 6. Estimated Diving Cost Box */}
      <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-bold text-[#F7F3EA] block">
              {isAr ? 'تكلفة الغطس التقديرية' : 'Estimated diving cost'}
            </span>
            <span className="text-[11px] font-semibold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
              {isAr ? 'تقديري' : 'Estimated'}
            </span>
          </div>
          <span className="text-xl font-black text-[#F7F3EA]">
            {selectedDiving
              ? `${estimatedDivingCost.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`
              : '—'}
          </span>
        </div>
        <p className="text-[11px] text-[#D2E3DE]/50 italic">
          {isAr ? 'الأسعار المعروضة توضيحية لرحلتك المنسقة.' : 'Sample price shown for demonstration.'}
        </p>
      </div>

      {/* 7. Primary & Secondary CTA Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          id="continue-to-safari-btn"
          disabled={!selectedDiving}
          onClick={onContinue}
          className={`w-full py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            selectedDiving
              ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] active:scale-98'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <span>{isAr ? 'المتابعة إلى السفاري' : 'Continue to Safari'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>

        <button
          type="button"
          id="back-to-transfer-btn"
          onClick={onBack}
          className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-[#D2E3DE] hover:text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{isAr ? 'العودة لاختيار الانتقالات' : 'Back to Transfer Selection'}</span>
        </button>
      </div>
    </div>
  );
};
