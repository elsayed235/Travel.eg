import React from 'react';
import { 
  Building, 
  Car, 
  Waves, 
  Compass, 
  Users, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { HotelOption, TransferOption, DivingOption, SafariOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface BookingSafariSummarySidebarProps {
  selectedHotel: HotelOption | null;
  selectedTransfer: TransferOption | null;
  selectedDiving: DivingOption | null;
  selectedSafari: SafariOption | null;
  selectedSafariDay: number;
  selectedSafariTime: string;
  onReviewTrip: () => void;
  onBack: () => void;
}

export const BookingSafariSummarySidebar: React.FC<BookingSafariSummarySidebarProps> = ({
  selectedHotel,
  selectedTransfer,
  selectedDiving,
  selectedSafari,
  selectedSafariDay,
  selectedSafariTime,
  onReviewTrip,
  onBack,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const estimatedSafariCost = selectedSafari ? selectedSafari.pricePerPersonEGP * 2 : 0;

  const hotelName = isAr && selectedHotel?.nameAr ? selectedHotel.nameAr : (selectedHotel?.name || (isAr ? 'فندق دهب باي' : 'Dahab Bay Hotel'));
  const hotelRoomType = isAr && selectedHotel?.roomTypeAr ? selectedHotel.roomTypeAr : (selectedHotel?.roomType || (isAr ? 'غرفة مزدوجة قياسية' : 'Standard Double Room'));
  const transferTitle = isAr && selectedTransfer?.titleAr ? selectedTransfer.titleAr : (selectedTransfer?.title || (isAr ? 'سيارة خاصة' : 'Private Car'));
  const divingTitle = isAr && selectedDiving?.titleAr ? selectedDiving.titleAr : (selectedDiving?.title || (isAr ? 'تجربة غطس إرشادي' : 'Guided Diving Experience'));
  const safariTitle = isAr && selectedSafari?.titleAr ? selectedSafari.titleAr : (selectedSafari?.title || (isAr ? 'سفاري الصحراء' : 'Desert Safari'));

  return (
    <div
      id="booking-safari-summary-sidebar"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-sm space-y-6 text-[#F7F3EA]"
    >
      {/* 1. Header & Progress Badge */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#52C4B7]" />
            <span>{isAr ? 'تم تحديد ٤ من ٤ خدمات' : '4 of 4 trip services selected'}</span>
          </span>
          <span className="text-xs text-[#D2E3DE]/50 font-medium">{isAr ? 'الخطوة الأخيرة' : 'Final Step'}</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-[#F7F3EA] mt-2">
          {isAr ? 'رحلتك إلى دهب' : 'Your Dahab trip'}
        </h3>
        <p className="text-xs text-[#D2E3DE]/60 mt-0.5">
          {isAr ? 'دهب، مصر · ٥ أيام · شخصين بالغين' : 'Dahab, Egypt · 5 days · 2 adults'}
        </p>
      </div>

      {/* 2. Step 01 Saved: Hotel */}
      <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>{isAr ? '٠١ الفندق' : '01 Hotel'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>{isAr ? 'تم الحفظ ✓' : 'Saved ✓'}</span>
          </span>
        </div>
        <div>
          <div className="text-xs font-bold text-[#F7F3EA]">
            {hotelName}
          </div>
          <div className="text-[12px] text-[#D2E3DE]/60">
            {hotelRoomType} · {isAr ? '٥ ليالٍ' : '5 nights'}
          </div>
        </div>
      </div>

      {/* 3. Step 02 Saved: Transfer */}
      <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5" />
            <span>{isAr ? '٠٢ الانتقالات' : '02 Transfer'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>{isAr ? 'تم الحفظ ✓' : 'Saved ✓'}</span>
          </span>
        </div>
        <div>
          <div className="text-xs font-bold text-[#F7F3EA]">
            {transferTitle}
          </div>
          <div className="text-[12px] text-[#D2E3DE]/60">
            {isAr ? 'شرم الشيخ ← فندق دهب' : 'Sharm El Sheikh → Dahab Hotel'}
          </div>
        </div>
      </div>

      {/* 4. Step 03 Saved: Diving */}
      <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-[#52C4B7]" />
            <span>{isAr ? '٠٣ الغطس' : '03 Diving'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>{isAr ? 'تم الحفظ ✓' : 'Saved ✓'}</span>
          </span>
        </div>
        <div>
          <div className="text-xs font-bold text-[#F7F3EA]">
            {divingTitle}
          </div>
          <div className="text-[12px] text-[#D2E3DE]/60">
            {isAr ? 'اليوم ٢ · ٠٩:٠٠ صباحاً · شخصين' : 'Day 2 · 09:00 AM · 2 adults'}
          </div>
        </div>
      </div>

      {/* 5. Step 04 Active: Safari */}
      <div className="p-3.5 rounded-2xl bg-[#13312B] border border-[#20A89A]/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>{isAr ? '٠٤ السفاري' : '04 Safari'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#20A89A] bg-[#20A89A]/15 border border-[#20A89A]/30 px-2 py-0.5 rounded-full">
            {isAr ? 'قيد التحديد' : 'Active selection'}
          </span>
        </div>

        {selectedSafari ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-[#F7F3EA]">
              <span>{safariTitle}</span>
              <span className="text-sm font-black text-[#F7F3EA]">
                {estimatedSafariCost.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
              </span>
            </div>

            <div className="space-y-1 text-[12px] text-[#D2E3DE]/70">
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'الموعد' : 'Schedule'}</span>
                <span className="font-semibold text-[#F7F3EA]">
                  {isAr ? `اليوم ${selectedSafariDay} · ${selectedSafariTime}` : `Day ${selectedSafariDay} · ${selectedSafariTime}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'المسافرون' : 'Travelers'}</span>
                <span className="font-semibold text-[#F7F3EA]">{isAr ? 'شخصين بالغين' : '2 adults'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'للفرد' : 'Per Person'}</span>
                <span className="font-semibold text-[#F7F3EA]">
                  {selectedSafari.pricePerPersonEGP.toLocaleString()} {isAr ? 'ج.م' : 'EGP'} × 2
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#D2E3DE]/60 italic py-1">
            {isAr ? 'يرجى اختيار تجربة سفاري' : 'Please choose a safari experience'}
          </div>
        )}
      </div>

      {/* 6. Estimated Safari Cost Box */}
      <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-bold text-[#F7F3EA] block">
              {isAr ? 'التكلفة التقديرية للسفاري' : 'Estimated Safari cost'}
            </span>
            <span className="text-[11px] font-semibold text-[#52C4B7] bg-[#20A89A]/20 border border-[#20A89A]/30 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
              {isAr ? 'تقديري' : 'Estimated'}
            </span>
          </div>
          <span className="text-xl font-black text-[#F7F3EA]">
            {selectedSafari
              ? `${estimatedSafariCost.toLocaleString()} ${isAr ? 'ج.م' : 'EGP'}`
              : '—'}
          </span>
        </div>
        <p className="text-[11px] text-[#D2E3DE]/50 italic">
          {isAr ? 'سعر إرشادي شامل المسافرين الإثنين.' : 'Sample price shown for demonstration.'}
        </p>
      </div>

      {/* 7. Primary & Secondary CTA Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          id="review-trip-btn"
          disabled={!selectedSafari}
          onClick={onReviewTrip}
          className={`w-full py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            selectedSafari
              ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] active:scale-98'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <span>{isAr ? 'مراجعة وتأكيد الرحلة' : 'Review Trip'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>

        <button
          type="button"
          id="back-to-diving-btn"
          onClick={onBack}
          className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-[#D2E3DE] hover:text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{isAr ? 'العودة لاختيار باقة الغطس' : 'Back to Diving Selection'}</span>
        </button>
      </div>
    </div>
  );
};
