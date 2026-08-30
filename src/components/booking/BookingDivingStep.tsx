import React, { useState, useMemo } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Waves, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Calendar,
  Compass,
  CheckCircle2,
  Car,
  Building
} from 'lucide-react';
import { 
  CURATED_DIVING_OPTIONS, 
  DivingOption, 
  HotelOption, 
  TransferOption, 
  CURATED_HOTELS, 
  CURATED_TRANSFERS 
} from './bookingData';
import { DivingOptionCard } from './DivingOptionCard';
import { DivingDetailModal } from './DivingDetailModal';
import { DivingDayScheduler } from './DivingDayScheduler';
import { BookingDivingSummarySidebar } from './BookingDivingSummarySidebar';
import { useLanguage } from '../../i18n/LanguageContext';

interface BookingDivingStepProps {
  selectedHotelId: string;
  selectedTransferId: string;
  initialDivingId?: string;
  initialDivingDay?: number;
  initialDivingTime?: string;
  onBackToTransfer: () => void;
  onReturnHome: () => void;
  onContinueToSafari?: (divingId: string, day: number, time: string) => void;
}

export const BookingDivingStep: React.FC<BookingDivingStepProps> = ({
  selectedHotelId,
  selectedTransferId,
  initialDivingId = 'guided-diving',
  initialDivingDay = 2,
  initialDivingTime = '09:00 AM',
  onBackToTransfer,
  onReturnHome,
  onContinueToSafari,
}) => {
  const { language, isRTL, t } = useLanguage();
  const isAr = language === 'ar';

  // Diving selection: default to recommended 'guided-diving' for Ahmed's trip
  const [selectedDivingId, setSelectedDivingId] = useState<string>(initialDivingId);

  // Scheduling state: default to Day 2 at 09:00 AM
  const [selectedDay, setSelectedDay] = useState<number>(initialDivingDay);
  const selectedTime = initialDivingTime;

  // Detail Modal state
  const [detailModalDiving, setDetailModalDiving] = useState<DivingOption | null>(null);

  // Step 04 Confirmation Modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  // Retrieve selected hotel & transfer objects
  const selectedHotel: HotelOption | null = useMemo(() => {
    return CURATED_HOTELS.find((h) => h.id === selectedHotelId) || CURATED_HOTELS[0];
  }, [selectedHotelId]);

  const selectedTransfer: TransferOption | null = useMemo(() => {
    return CURATED_TRANSFERS.find((t) => t.id === selectedTransferId) || CURATED_TRANSFERS[0];
  }, [selectedTransferId]);

  const selectedDiving: DivingOption | null = useMemo(() => {
    return CURATED_DIVING_OPTIONS.find((d) => d.id === selectedDivingId) || null;
  }, [selectedDivingId]);

  const handleSelectDiving = (divingId: string) => {
    setSelectedDivingId(divingId);
  };

  const handleContinue = () => {
    if (!selectedDiving) return;
    setShowConfirmationModal(true);
  };

  const handleConfirmProceed = () => {
    setShowConfirmationModal(false);
    if (onContinueToSafari) {
      onContinueToSafari(selectedDivingId, selectedDay, selectedTime);
    } else {
      alert(isAr ? 'تمت إضافة الغطس إلى رحلتك!' : 'Diving added to your trip!');
    }
  };

  const hotelDisplayName = isAr && selectedHotel?.nameAr ? selectedHotel.nameAr : (selectedHotel?.name || (isAr ? 'فندق دهب باي' : 'Dahab Bay Hotel'));
  const transferDisplayName = isAr && selectedTransfer?.titleAr ? selectedTransfer.titleAr : (selectedTransfer?.title || (isAr ? 'سيارة خاصة' : 'Private Car'));
  const divingDisplayName = isAr && selectedDiving?.titleAr ? selectedDiving.titleAr : (selectedDiving?.title || (isAr ? 'غطسة إرشادية' : 'Guided Diving'));

  return (
    <div
      id="booking-diving-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-28 lg:pb-16"
    >
      {/* 1. Global Navigation & Booking Progress Header */}
      <header className="border-b border-white/10 bg-[#081714]/95 backdrop-blur-md sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReturnHome}
              className="text-xl font-black tracking-widest text-[#F7F3EA] font-['Outfit',sans-serif] hover:opacity-80 transition-opacity cursor-pointer"
            >
              {isAr ? 'دهب' : 'DAHAB'}
            </button>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#20A89A] inline-block shadow-[0_0_8px_#20A89A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#52C4B7]">
                {isAr ? 'حجز رحلتك' : 'Booking your trip'}
              </span>
            </div>
          </div>

          {/* Progress Indicator: 01 Hotel ✓ → 02 Transfer ✓ → 03 Diving ● → 04 Safari ○ */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 text-xs">
            {/* Step 01: Hotel (Completed) */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#13312B] text-[#52C4B7] border border-[#20A89A]/30 font-bold whitespace-nowrap">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isAr ? '٠١ الفندق' : '01 Hotel'}</span>
            </div>

            <span className="text-white/30 font-bold rtl:rotate-180">→</span>

            {/* Step 02: Transfer (Completed) */}
            <button
              type="button"
              onClick={onBackToTransfer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#13312B] text-[#52C4B7] border border-[#20A89A]/30 font-bold whitespace-nowrap hover:bg-[#1b433b] transition-colors cursor-pointer"
              title={isAr ? 'اضغط للرجوع لاختيار الانتقالات' : 'Click to return to transfer selection'}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isAr ? '٠٢ الانتقالات' : '02 Transfer'}</span>
            </button>

            <span className="text-white/30 font-bold rtl:rotate-180">→</span>

            {/* Step 03: Diving (ACTIVE) */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#20A89A] text-[#081714] font-bold whitespace-nowrap shadow-xs">
              <span className="w-4 h-4 rounded-full bg-[#081714]/20 text-[11px] flex items-center justify-center font-bold">
                {isAr ? '٣' : '3'}
              </span>
              <span>{isAr ? '٠٣ الغطس' : '03 Diving'}</span>
            </div>

            <span className="text-white/30 font-bold rtl:rotate-180">→</span>

            {/* Step 04: Safari */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-white/40 font-medium whitespace-nowrap">
              <span className="text-[12px] font-bold">{isAr ? '٠٤' : '04'}</span>
              <span>{isAr ? 'السفاري' : 'Safari'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Booking Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1 w-full">
        {/* Navigation & Status Header Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <button
            type="button"
            id="back-to-transfer-selection-link"
            onClick={onBackToTransfer}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#D2E3DE]/70 hover:text-white transition-colors py-1 cursor-pointer self-start"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{isAr ? 'العودة لاختيار الانتقالات' : 'Back to Transfer Selection'}</span>
          </button>

          {/* Transfer Saved Reassurance Badge */}
          <div className="flex items-center gap-2 bg-[#0E2520] px-3 py-1.5 rounded-full border border-[#20A89A]/30 shadow-xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-[#20A89A] animate-pulse" />
            <span className="text-xs font-bold text-[#52C4B7]">
              {isAr ? 'تم حفظ الانتقالات ✓' : 'Transfer selected ✓'}
            </span>
            <span className="text-xs text-[#D2E3DE]/60 font-medium hidden sm:inline">
              ({transferDisplayName})
            </span>
          </div>
        </div>

        {/* Main Header Block */}
        <div className="mb-8 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#52C4B7] bg-[#13312B] border border-white/10 px-2.5 py-1 rounded-full">
                {isAr ? 'تنسيق الأنشطة والفعاليات' : 'Activity Coordination'}
              </span>
              <span className="text-xs font-bold text-[#F4C36C] bg-[#F4C36C]/10 border border-[#F4C36C]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F4C36C] fill-[#F4C36C]" />
                <span>{isAr ? 'موصى به لرحلتك' : 'Recommended for you'}</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F7F3EA] tracking-tight">
              {isAr ? 'اجعل الغطس جزءاً أساسياً من رحلتك إلى دهب' : 'Make diving part of your Dahab trip.'}
            </h1>
            <p className="text-sm sm:text-base text-[#D2E3DE]/70 mt-1.5 max-w-2xl font-normal">
              {isAr ? 'اخترنا لك أفضل تجارب الغطس التي تناسب اهتماماتك وإيقاع رحلتك.' : 'We found diving experiences that match your interests, pace, and trip.'}
            </p>
          </div>

          {/* Personalized Recommendation Block: "Our pick for Ahmed" */}
          <div
            id="our-pick-for-ahmed"
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#13312B] via-[#0E2520] to-[#13312B] border border-[#20A89A]/40 shadow-xs relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#081714] bg-[#F4C36C] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#081714]" />
                    <span>{isAr ? 'الأكثر ملاءمة' : 'Best match'}</span>
                  </span>
                  <span className="text-xs font-bold text-[#F7F3EA]">
                    {isAr ? 'اختيارنا لرحلتك' : 'Our pick for your trip'}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-serif font-bold text-[#F7F3EA] leading-snug">
                  {isAr ? 'تجربة غطس إرشادية تمنحك وقتاً ساحراً تحت الماء دون استهلاك يومك بالكامل.' : 'A guided diving experience that gives you time underwater without taking over your entire day.'}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-2.5 text-xs text-[#D2E3DE]/90 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#081714]/60 border border-white/10 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#52C4B7]" />
                    <span>{isAr ? 'المدة: حوالي ٣–٤ ساعات' : 'Duration: Approximately 3–4 hours'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#081714]/60 border border-white/10 font-medium">
                    <Compass className="w-3.5 h-3.5 text-[#52C4B7]" />
                    <span>{isAr ? 'المستوى: مناسب للمبتدئين' : 'Level: Beginner-friendly'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#081714]/60 border border-white/10 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#52C4B7]" />
                    <span>{isAr ? 'المجموعة: صغيرة وخاصة' : 'Group: Small group'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#081714]/60 border border-white/10 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#52C4B7]" />
                    <span>{isAr ? 'الموقع: دهب' : 'Location: Dahab'}</span>
                  </span>
                </div>
              </div>

              {/* Action shortcut to select pick */}
              <div className="flex-shrink-0 self-start md:self-center">
                <button
                  type="button"
                  onClick={() => handleSelectDiving('guided-diving')}
                  className="px-5 py-2.5 rounded-full bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اختيار التجربة الموصى بها' : 'Choose recommended pick'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout (Main Options + Sticky Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Area: Diving Options & Day Scheduling (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 3 Curated Diving Options Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-lg font-serif font-bold text-[#F7F3EA]">
                  {isAr ? 'باقات الغطس المختارة' : 'Curated diving experiences'}
                </h2>
                <span className="text-xs text-[#D2E3DE]/60">
                  {isAr ? 'اختر التجربة الأنسب لخبرتك ومستوى راحتك' : 'Select the experience tailored to your comfort and interest'}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {CURATED_DIVING_OPTIONS.map((diving) => (
                  <DivingOptionCard
                    key={diving.id}
                    diving={diving}
                    isSelected={selectedDivingId === diving.id}
                    onSelect={handleSelectDiving}
                    onViewDetails={setDetailModalDiving}
                  />
                ))}
              </div>

              {/* Sample Price Disclaimer */}
              <p className="text-[12px] text-[#D2E3DE]/50 italic pl-1">
                {isAr ? 'الأسعار المعروضة توضيحية لرحلتك المنسقة.' : 'Sample price shown for demonstration.'}
              </p>
            </div>

            {/* Scheduling Section */}
            <DivingDayScheduler
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              selectedTime={selectedTime}
            />

            {/* Why Diving on Day 2 note */}
            <div className="p-6 rounded-3xl bg-[#0E2520] border border-white/10 text-xs sm:text-sm text-[#D2E3DE]/90 space-y-2">
              <h4 className="font-bold text-[#F7F3EA] flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#52C4B7]" />
                <span>{isAr ? 'مزامنة برنامج الرحلة' : 'Trip itinerary synchronization'}</span>
              </h4>
              <p className="leading-relaxed font-normal text-xs text-[#D2E3DE]/70">
                {isAr
                  ? `تمت جدولة الغطس في تمام الساعة ٠٩:٠٠ صباحاً في اليوم ${selectedDay}، لإنهاء التجربة قبل حرارة الظهيرة، ليبقى المساء متاحاً بالكامل للغداء في إيل جاردن والتجول عند الغروب.`
                  : `Your diving activity is scheduled for 09:00 AM on Day ${selectedDay}, allowing your party to finish the guided discovery before midday heat. Your afternoon remains completely open for relaxed coastal lunch at Eel Garden and sunset bay strolling.`}
              </p>
            </div>
          </div>

          {/* Desktop Sticky Summary Sidebar (4 Columns) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <BookingDivingSummarySidebar
              selectedHotel={selectedHotel}
              selectedTransfer={selectedTransfer}
              selectedDiving={selectedDiving}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              onContinue={handleContinue}
              onBack={onBackToTransfer}
            />
          </div>
        </div>
      </main>

      {/* 3. Mobile Sticky Bottom Action / Summary Bar */}
      <div
        id="mobile-diving-bottom-bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E2520]/95 backdrop-blur-md border-t border-white/10 p-3.5 sm:p-4 shadow-lg"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52C4B7] block truncate">
              {selectedDiving ? divingDisplayName : (isAr ? 'اختر الغطس' : 'Select diving')}
            </span>
            <div className="text-sm font-bold text-[#F7F3EA] truncate">
              {isAr ? `اليوم ${selectedDay} · ${selectedTime}` : `Day ${selectedDay} · ${selectedTime}`}
            </div>
            <div className="text-[12px] font-medium text-[#D2E3DE]/60">
              {selectedDiving ? (isAr ? `المجموع التقديري ${(selectedDiving.pricePerPersonEGP * 2).toLocaleString()} ج.م` : `Est. EGP ${(selectedDiving.pricePerPersonEGP * 2).toLocaleString()} total`) : ''}
            </div>
          </div>

          <button
            type="button"
            id="mobile-continue-diving-btn"
            disabled={!selectedDiving}
            onClick={handleContinue}
            className={`inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full text-xs font-bold shadow-md transition-all whitespace-nowrap ${
              selectedDiving
                ? 'bg-[#20A89A] hover:bg-[#1a8c80] text-[#081714] font-bold cursor-pointer active:scale-95'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <span>{isAr ? 'المتابعة إلى السفاري' : 'Continue to Safari'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* 4. Activity Details Modal */}
      {detailModalDiving && (
        <DivingDetailModal
          diving={detailModalDiving}
          isSelected={selectedDivingId === detailModalDiving.id}
          onSelect={handleSelectDiving}
          onClose={() => setDetailModalDiving(null)}
        />
      )}

      {/* 5. Step Confirmation State Modal: Preview of Step 04 — Safari */}
      {showConfirmationModal && selectedDiving && (
        <div
          id="diving-confirmation-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="diving-confirmation-modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirmationModal(false);
          }}
        >
          <div className="bg-[#0E2520] text-[#F7F3EA] w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/15 text-center space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="w-12 h-12 rounded-full bg-[#20A89A]/20 text-[#52C4B7] border border-[#20A89A]/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 id="diving-confirmation-modal-title" className="text-xl font-serif font-bold text-[#F7F3EA]">
                {isAr ? 'تمت إضافة الغطس لرحلتك ✓' : 'Diving added to your trip ✓'}
              </h3>
              <p className="text-sm font-semibold text-[#52C4B7]">
                {isAr ? `اليوم ${selectedDay} · ${selectedTime}` : `Day ${selectedDay} · ${selectedTime}`}
              </p>
              <p className="text-xs text-[#D2E3DE]/60 pt-0.5">
                {divingDisplayName} · {isAr ? 'فردين بالغين' : '2 adults'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 text-left rtl:text-right text-xs space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52C4B7] block">
                {isAr ? 'تقدم حجز الخدمات' : 'Trip Booking Progress'}
              </span>
              <div className="space-y-1.5 text-[12px] text-[#D2E3DE]/80">
                <div className="flex items-center justify-between">
                  <span>{isAr ? `٠١ الإقامة: ${hotelDisplayName}` : `01 Stay: ${hotelDisplayName}`}</span>
                  <span className="text-[#52C4B7] font-bold">{isAr ? 'تم الحفظ ✓' : 'Saved ✓'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isAr ? `٠٢ الانتقالات: ${transferDisplayName}` : `02 Ride: ${transferDisplayName}`}</span>
                  <span className="text-[#52C4B7] font-bold">{isAr ? 'تم الحفظ ✓' : 'Saved ✓'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isAr ? `٠٣ الغطس: ${divingDisplayName}` : `03 Dive: ${divingDisplayName}`}</span>
                  <span className="text-[#52C4B7] font-bold">{isAr ? 'تم الحفظ ✓' : 'Saved ✓'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="w-full py-3 rounded-full text-xs font-bold text-[#D2E3DE] hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                {isAr ? 'تغيير الاختيار' : 'Change selection'}
              </button>

              <button
                type="button"
                id="proceed-to-safari-btn"
                onClick={handleConfirmProceed}
                className="w-full py-3 rounded-full text-xs font-bold text-[#081714] bg-[#20A89A] hover:bg-[#1a8c80] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isAr ? 'المتابعة إلى السفاري' : 'Continue to Safari'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
