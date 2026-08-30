import React from 'react';
import { 
  Building, 
  Car, 
  Users, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Calendar, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { HotelOption, TransferOption } from './bookingData';
import { useLanguage } from '../../i18n/LanguageContext';

interface BookingTransferSummarySidebarProps {
  selectedHotel: HotelOption | null;
  selectedTransfer: TransferOption | null;
  flightNumber: string;
  onContinue: () => void;
  onBack: () => void;
}

export const BookingTransferSummarySidebar: React.FC<BookingTransferSummarySidebarProps> = ({
  selectedHotel,
  selectedTransfer,
  flightNumber,
  onContinue,
  onBack,
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const hotelName = selectedHotel ? (isAr && selectedHotel.nameAr ? selectedHotel.nameAr : selectedHotel.name) : (isAr ? 'فندق خليج دهب' : 'Dahab Bay Hotel');
  const hotelRoomType = selectedHotel ? (isAr && selectedHotel.roomTypeAr ? selectedHotel.roomTypeAr : selectedHotel.roomType) : (isAr ? 'غرفة مزدوجة قياسية' : 'Standard Double Room');
  
  const transferTitle = selectedTransfer ? (isAr && selectedTransfer.titleAr ? selectedTransfer.titleAr : selectedTransfer.title) : '';
  const transferEstTime = selectedTransfer ? (isAr && selectedTransfer.estimatedTimeAr ? selectedTransfer.estimatedTimeAr : selectedTransfer.estimatedTime) : '';

  return (
    <div
      id="booking-transfer-summary-sidebar"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-sm space-y-6 text-[#F7F3EA]"
    >
      {/* 1. Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#52C4B7] bg-[#13312B] border border-white/10 px-2.5 py-0.5 rounded-full">
            {isAr ? 'تنسيق الرحلة' : 'Trip Coordination'}
          </span>
          <span className="text-xs text-[#D2E3DE]/50 font-medium">{isAr ? 'الخطوة ٠٢ من ٠٤' : 'Step 02 of 04'}</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-[#F7F3EA] mt-2">
          {isAr ? 'رحلتك إلى دهب' : 'Your Dahab trip'}
        </h3>
        <p className="text-xs text-[#D2E3DE]/60 mt-0.5">
          {isAr ? 'دهب، مصر · ٥ أيام · فردين' : 'Dahab, Egypt · 5 days · 2 adults'}
        </p>
      </div>

      {/* 2. Step 01 Saved: Hotel Component */}
      <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
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
            {hotelName}
          </div>
          <div className="text-[12px] text-[#D2E3DE]/60">
            {hotelRoomType} · {isAr ? '٥ ليالي' : '5 nights'}
          </div>
        </div>
      </div>

      {/* 3. Step 02 Active: Transfer Component */}
      <div className="p-3.5 rounded-2xl bg-[#13312B] border border-[#20A89A]/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#52C4B7] uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#20A89A]" />
            <span>{isAr ? '٠٢ الانتقالات' : '02 Transfer'}</span>
          </span>
          <span className="text-[12px] font-bold text-[#20A89A] bg-[#20A89A]/15 border border-[#20A89A]/30 px-2 py-0.5 rounded-full">
            {isAr ? 'قيد الاختيار' : 'Active selection'}
          </span>
        </div>

        {selectedTransfer ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-[#F7F3EA]">
              <span>{transferTitle}</span>
              <span className="text-sm font-black text-[#F7F3EA]">
                {selectedTransfer.priceEGP.toLocaleString()} {isAr ? 'جنيه' : 'EGP'}
              </span>
            </div>

            <div className="space-y-1 text-[12px] text-[#D2E3DE]/70">
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'المسار' : 'Route'}</span>
                <span className="font-semibold text-[#F7F3EA]">
                  {isAr ? 'شرم الشيخ ← دهب' : 'Sharm El Sheikh → Dahab'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'المسافرون' : 'Travelers'}</span>
                <span className="font-semibold text-[#F7F3EA]">{isAr ? 'فردين بالغين' : '2 adults'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#D2E3DE]/50">{isAr ? 'المدة التقديرية' : 'Est. Travel Time'}</span>
                <span className="font-semibold text-[#F7F3EA]">{transferEstTime}</span>
              </div>
              {flightNumber.trim() && (
                <div className="flex items-center justify-between">
                  <span className="text-[#D2E3DE]/50">{isAr ? 'رقم الرحلة' : 'Flight'}</span>
                  <span className="font-mono font-bold text-[#F7F3EA] uppercase">
                    {flightNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#D2E3DE]/60 italic py-1">
            {isAr ? 'يرجى اختيار وسيلة الانتقال' : 'Please choose a transfer option'}
          </div>
        )}
      </div>

      {/* 4. Upcoming Steps Preview */}
      <div className="space-y-2 text-xs border-t border-white/10 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
          {isAr ? 'الخطوات القادمة في الحجز' : 'Upcoming In Trip Booking'}
        </span>
        <div className="flex items-center justify-between text-[12px] text-[#D2E3DE]/60">
          <span>{isAr ? '٠٣ باقة الغطس' : '03 Diving Package'}</span>
          <span>{isAr ? 'الخطوة التالية' : 'Next step'}</span>
        </div>
        <div className="flex items-center justify-between text-[12px] text-white/40">
          <span>{isAr ? '٠٤ سفاري صحراء البدو' : '04 Bedouin Desert Safari'}</span>
          <span>{isAr ? 'لاحقاً' : 'Pending'}</span>
        </div>
      </div>

      {/* 5. Transfer Cost Summary Box */}
      <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-[#F7F3EA]">{isAr ? 'تكلفة الانتقال' : 'Transfer cost'}</span>
          <span className="text-xl font-black text-[#F7F3EA]">
            {selectedTransfer
              ? `${selectedTransfer.priceEGP.toLocaleString()} ${isAr ? 'جنيه' : 'EGP'}`
              : '—'}
          </span>
        </div>
        <p className="text-[11px] text-[#D2E3DE]/50 italic">
          {isAr ? 'سعر تقديري توضيحي شامل للمسافرين.' : 'Sample price shown for demonstration.'}
        </p>
      </div>

      {/* 6. Primary and Secondary Actions */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          id="continue-to-diving-btn"
          disabled={!selectedTransfer}
          onClick={onContinue}
          className={`w-full py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            selectedTransfer
              ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] font-bold active:scale-98'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <span>{isAr ? 'المتابعة لاختيار الغطس' : 'Continue to Diving'}</span>
          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        <button
          type="button"
          id="back-to-hotel-btn"
          onClick={onBack}
          className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-[#D2E3DE] hover:text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'العودة لاختيار الفندق' : 'Back to Hotel Selection'}</span>
        </button>
      </div>
    </div>
  );
};

