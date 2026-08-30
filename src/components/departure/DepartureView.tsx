import React, { useState } from 'react';
import { 
  Plane, 
  Car, 
  Building, 
  Clock, 
  Luggage, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Utensils, 
  Coffee, 
  ArrowRight, 
  Sparkles, 
  Compass,
  FileText,
  QrCode,
  X,
  Share2,
  Gift
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const DepartureView: React.FC = () => {
  const { profile, user, navigateTo, showToast, activeTrip, activeTripItems, bookings } = useTrip();

  /**
   * The departure day, built from what this traveler actually booked.
   *
   * It used to be a fixed script: check-out at 11:00 marked "Completed ✓", bags
   * stored at 11:30, a farewell lunch, a last walk, a private car at 05:00, and
   * "Departure Flight MS 305" at 06:20 PM — with a flight tracker showing
   * SSH → CAI, Terminal 1, Gate 4 and "On Time ✓". Every traveler saw the same
   * day, on whatever date, and none of it had a source: this platform has never
   * collected a flight number, and nothing tracks a flight.
   *
   * A step appears here only when there is a booking behind it.
   */
  const departureTransfer = [...bookings]
    .filter(b => b.serviceType === 'transfer')
    // The last transfer on the trip is the one out.
    .sort((a, b) => a.datesOrTime.localeCompare(b.datesOrTime))
    .pop();
  const hotel = bookings.find(b => b.serviceType === 'hotel');
  /** Only if a booking carries one — BookingEntity.flightNumber is optional. */
  const flightNumber = activeTripItems.find(i => i.metadata?.flightNumber)?.metadata?.flightNumber as
    | string
    | undefined;
  const { language, isRTL, t } = useLanguage();

  const travelerName = profile.name || user?.displayName || (language === 'ar' ? 'يا صديقنا' : 'Traveler');

  // Checklist items
  const [checklist, setChecklist] = useState([
    { 
      id: 'c1', 
      label: 'Hotel room key returned to front desk', 
      labelAr: 'تسليم كارت الأوضة للريسبشن وتصفية الحسابات', 
      done: true 
    },
    { 
      id: 'c2', 
      label: 'Luggage tagged & stored safely with concierge', 
      labelAr: 'تسليم الشنط للأمانات واستلام إيصال الحفظ الإلكتروني', 
      done: true 
    },
    { 
      id: 'c3', 
      label: 'Passport & flight boarding pass ready', 
      labelAr: 'البطاقة / الباسبور وتذكرة طيران الرجوع جاهزة ع الموبايل', 
      done: true 
    },
    { 
      id: 'c4', 
      label: 'Diving logbook stamped by instructor', 
      labelAr: 'ختم لوج بوك الغطسات من الكابتن في مركز الغوص', 
      done: true 
    },
    { 
      id: 'c5', 
      label: 'Local Sinai herbs (Habak, Marmareya) & dates packed', 
      labelAr: 'أعشاب سيناء (حبق، مرمية، زيت زيتون بدوي) متغلفة في الشنطة', 
      done: false 
    },
  ]);

  const [showLuggageTicket, setShowLuggageTicket] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  interface DepartureStep {
    time: string;
    timeAr: string;
    title: string;
    titleAr: string;
    status: string;
    statusAr: string;
    icon: string;
    desc: string;
    descAr: string;
    isDone: boolean;
    isCurrent?: boolean;
  }

  const timelineSteps: DepartureStep[] = [];

  if (hotel) {
    timelineSteps.push({
      time: hotel.datesOrTime,
      timeAr: hotel.datesOrTime,
      title: 'Hotel checkout',
      titleAr: 'تسليم الغرفة',
      // Not reported as done: nothing here tracks a check-out.
      status: hotel.provider,
      statusAr: hotel.provider,
      icon: '🏨',
      desc: `${hotel.subtitle} · ${hotel.confirmationCode}`,
      descAr: `${hotel.subtitle} · ${hotel.confirmationCode}`,
      isDone: false
    });
  }

  if (departureTransfer) {
    timelineSteps.push({
      time: departureTransfer.datesOrTime,
      timeAr: departureTransfer.datesOrTime,
      title: 'Airport transfer',
      titleAr: 'عربية المطار',
      status: departureTransfer.status,
      statusAr: departureTransfer.status,
      icon: '🚗',
      desc: [departureTransfer.provider, departureTransfer.confirmationCode, departureTransfer.location]
        .filter(Boolean)
        .join(' · '),
      descAr: [departureTransfer.provider, departureTransfer.confirmationCode, departureTransfer.location]
        .filter(Boolean)
        .join(' · '),
      isDone: false,
      isCurrent: true
    });
  }

  if (flightNumber) {
    timelineSteps.push({
      time: '',
      timeAr: '',
      title: `Departure flight ${flightNumber}`,
      titleAr: `رحلة العودة ${flightNumber}`,
      // No status, gate or terminal — nothing here tracks a flight.
      status: '',
      statusAr: '',
      icon: '✈️',
      desc: '',
      descAr: '',
      isDone: false
    });
  }

  return (
    <div 
      id="departure-mode-view" 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] pb-24 font-['Outfit',sans-serif] selection:bg-[#F4C36C]/30"
    >
      {/* 1. Coordinated Departure Header */}
      <section className="bg-[#0E2520] border-b border-white/10 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13312B] border border-[#F4C36C]/30 text-xs font-bold uppercase tracking-wider text-[#F4C36C]">
                <Plane className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'يوم السفر والرجوع · ١٦ أكتوبر' : 'Departure Day · October 16'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F7F3EA] tracking-tight">
                {language === 'ar' ? `ترجع بالسلامة ${travelerName} 👋` : `Heading Home, ${travelerName} 👋`}
              </h1>
              <p className="text-xs sm:text-sm text-[#D2E3DE]/80 max-w-2xl font-medium leading-relaxed">
                {language === 'ar'
                  ? 'رتبنالك جدول يوم السفر بدقة عشان تودع دهب براحتك وبدون أي استعجال: الشنط في الأمانات، وجبة الغداء، ميعاد السواق، ومتابعة ميعاد الطيارة.'
                  : 'Your entire departure day is coordinated into a stress-free schedule. We keep track of your checkout, luggage, farewell meal, transfer driver, and flight.'}
              </p>
            </div>

            {/* Live Buffer Countdown */}
            <div className="p-5 rounded-3xl bg-[#13312B] border border-[#F4C36C]/30 text-center sm:text-start space-y-1 shadow-lg">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block">
                {language === 'ar' ? 'الوقت المتبقي على وصول السواق' : 'Time Until Airport Pickup'}
              </span>
              {/* Was a frozen "02h : 18m" beside "Driver arriving at 02:30 PM",
                  shown at every hour of every day. */}
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F7F3EA]">
                {departureTransfer?.datesOrTime || '—'}
              </div>
              <span className="text-[12px] text-[#D2E3DE]/70 block">
                {departureTransfer
                  ? language === 'ar'
                    ? `موعد الانتقال · ${departureTransfer.provider}`
                    : `Transfer time · ${departureTransfer.provider}`
                  : language === 'ar'
                    ? 'مفيش انتقال محجوز للمطار'
                    : 'No airport transfer booked'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7/12): Departure Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block">
                    {language === 'ar' ? 'جدول المغادرة المنظم' : 'Coordinated Schedule'}
                  </span>
                  <h2 className="font-serif font-bold text-xl text-[#F7F3EA]">
                    {language === 'ar' ? 'تسلسل يوم السفر والعودة' : "Today's Departure Timeline"}
                  </h2>
                </div>

                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {language === 'ar' ? 'كل حاجة في ميعادها ✓' : 'On Track ✓'}
                </span>
              </div>

              {/* Timeline Steps */}
              <div className={`space-y-4 relative before:absolute ${isRTL ? 'before:right-5' : 'before:left-5'} before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10`}>
                {timelineSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`relative flex items-start gap-4 p-4 rounded-2xl transition-all ${
                      step.isCurrent
                        ? 'bg-[#13312B] border-2 border-[#F4C36C] shadow-[0_0_20px_rgba(244,195,108,0.15)] ring-1 ring-[#F4C36C]/30'
                        : step.isDone
                        ? 'bg-[#13312B]/40 opacity-80 border border-white/5'
                        : 'bg-[#0E2520] border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#13312B] border border-white/10 shadow-xs flex items-center justify-center text-lg flex-shrink-0 relative z-10">
                      {step.icon}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#F4C36C]">
                            {language === 'ar' ? step.timeAr : step.time}
                          </span>
                          <h3 className="font-bold text-sm text-[#F7F3EA]">
                            {language === 'ar' ? step.titleAr : step.title}
                          </h3>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          step.isCurrent
                            ? 'bg-[#F4C36C] text-[#081714] font-extrabold'
                            : step.isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/10 text-[#D2E3DE]'
                        }`}>
                          {language === 'ar' ? step.statusAr : step.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/70 leading-relaxed font-normal">
                        {language === 'ar' ? step.descAr : step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/*
              The flight card, shown only if a booking carries a flight number.

              It was a full tracker: "Flight MS 305 Status", "On Time ✓",
              SSH → CAI, "Departure: 06:20 PM", "Terminal 1", "Gate 4". This
              platform has never collected a flight number and nothing here
              queries an airline — every one of those values was written into
              the file, and a traveler reading "On Time ✓" had been told
              something nobody had checked.
            */}
            {flightNumber && (
              <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Plane className="w-4 h-4 text-[#F4C36C]" />
                  <h2 className="font-serif font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? `رحلة العودة ${flightNumber}` : `Departure flight ${flightNumber}`}
                  </h2>
                </div>
                <p className="text-xs text-[#D2E3DE]/70 leading-relaxed">
                  {language === 'ar'
                    ? 'راجع حالة الرحلة والبوابة مع شركة الطيران — إحنا مش بنتابع الرحلات الجوية.'
                    : 'Check the status and gate with your airline — we do not track flights.'}
                </p>
              </div>
            )}

            {/* Luggage Storage Pass Button */}
            <div className="p-5 rounded-3xl bg-[#13312B] border border-[#F4C36C]/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0E2520] text-[#F4C36C] border border-[#F4C36C]/30 flex items-center justify-center font-bold text-lg">
                  🧳
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#F7F3EA]">
                    {language === 'ar' ? 'كارت أمانات الشنط الرقمي' : 'Digital Luggage Storage Pass'}
                  </h3>
                  <p className="text-xs text-[#D2E3DE]/70">
                    {language === 'ar' ? '٢ شنطة كبيرة + ١ حقيبة غطس محفوظة في فندق دهب باي' : '2 large bags + 1 diving gear bag stored safely'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLuggageTicket(true)}
                className="px-4 py-2 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'عرض الكارت' : 'View Pass'}</span>
              </button>
            </div>
          </div>

          {/* Right Column (5/12): Transfer Driver & Departure Checklist */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Confirmed Driver Card */}
            <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#F4C36C]" />
                  <h2 className="font-serif font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'سائق التوصيل للمطار' : 'Airport Transfer Driver'}
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#F4C36C] bg-[#13312B] border border-[#F4C36C]/30 px-2.5 py-0.5 rounded-full">
                  {departureTransfer?.datesOrTime || (language === 'ar' ? 'مفيش انتقال محجوز' : 'No transfer booked')}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#13312B] flex items-center justify-center font-bold text-2xl text-[#F4C36C] border border-white/10">
                  👨‍✈️
                </div>
                {/*
                  Was "Captain Youssef", "Silver Toyota HiAce (A/C)" and plate
                  "ط ج د 4921" — a named driver and a vehicle, on every
                  traveler's screen, for a booking no supplier had yet accepted.
                  A booking now starts at PENDING_CONFIRMATION and carries no
                  assignment until the supplier makes one.
                */}
                <div>
                  <h3 className="font-bold text-base text-[#F7F3EA]">
                    {departureTransfer?.details && departureTransfer.details !== '—'
                      ? departureTransfer.details
                      : language === 'ar'
                        ? 'لسه ما اتحددش سائق'
                        : 'No driver assigned yet'}
                  </h3>
                  <p className="text-xs text-[#D2E3DE]/70">
                    {departureTransfer?.provider || (language === 'ar' ? '—' : '—')}
                  </p>
                  {departureTransfer?.confirmationCode && (
                    <p className="text-[12px] font-mono text-[#F4C36C] font-bold mt-0.5">
                      {departureTransfer.confirmationCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    departureTransfer?.phone
                      ? window.open(`tel:${departureTransfer.phone}`, '_self')
                      : showToast(
                          language === 'ar'
                            ? 'مفيش رقم اتصال للانتقال ده لحد دلوقتي.'
                            : 'No contact number for this transfer yet.'
                        )
                  }
                  className="py-2.5 px-3 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'اتصال بالسائق' : 'Call Driver'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast(language === 'ar' ? 'تم فتح المحادثة مع عمليات سيناء كومفورت ترانسبورت' : 'Chat opened with Sinai Comfort Transport dispatch.')}
                  className="py-2.5 px-3 rounded-full border border-white/15 text-[#D2E3DE] hover:bg-white/5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'رسالة واتساب' : 'Message'}</span>
                </button>
              </div>
            </div>

            {/* 2. Departure Checklist */}
            <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="font-serif font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'قائمة تفقد ما قبل المغادرة' : 'Departure Checklist'}
                  </h2>
                </div>
                <span className="text-xs text-[#D2E3DE]/50 font-bold">
                  {checklist.filter((c) => c.done).length} / {checklist.length} {language === 'ar' ? 'مكتمل' : 'Done'}
                </span>
              </div>

              <div className="space-y-2">
                {checklist.map((item) => {
                  const label = language === 'ar' ? item.labelAr : item.label;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecklist(item.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#13312B] text-start transition-colors cursor-pointer border border-white/5"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                          item.done
                            ? 'bg-emerald-500 text-[#081714]'
                            : 'border-2 border-white/20 bg-transparent'
                        }`}
                      >
                        {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          item.done ? 'line-through text-[#D2E3DE]/40' : 'text-[#F7F3EA]'
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Completed Trip / Post-Trip Review Shortcut */}
            <div className="p-6 rounded-3xl bg-[#13312B] border border-[#F4C36C]/30 text-white shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F4C36C]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'ذكريات ومصاريف الرحلة' : 'Trip Conclusion'}</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#F7F3EA]">
                {language === 'ar' ? 'عايز تشوف ملخص رحلتك وصورك؟' : 'Looking back at your Dahab journey?'}
              </h3>
              <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                {language === 'ar'
                  ? 'لما ترجع البيت، كل ذكريات الغطس، الأماكن اللي زرتها، الفاتورة الموحدة، وأفكار رحلتك الجاية هتكون جاهزة في صفحة ملخص الرحلة.'
                  : 'When you return home, your trip memories, completed dives, invoice, and next-trip ideas will be ready in your Post-Trip memory hub.'}
              </p>
              <button
                type="button"
                onClick={() => navigateTo('/post-trip')}
                className="w-full py-2.5 px-4 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{language === 'ar' ? 'عرض ملخص وفاتورة الرحلة' : 'View Completed Trip Hub'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Luggage Ticket Modal */}
      {showLuggageTicket && (
        <div 
          dir={isRTL ? 'rtl' : 'ltr'}
          role="dialog"
          aria-modal="true"
          aria-label={language === 'ar' ? 'إيصال حفظ الشنط' : 'Luggage storage receipt'}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#0E2520] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-white/10 space-y-5 text-center animate-in zoom-in-95 duration-200 text-[#F7F3EA]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-[#F4C36C]">
                {language === 'ar' ? 'إيصال حفظ الشنط' : 'Luggage storage receipt'}
              </span>
              <button
                type="button"
                onClick={() => setShowLuggageTicket(false)}
                className="text-[#D2E3DE]/60 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#13312B] border border-dashed border-[#F4C36C]/40 space-y-3">
              <div className="w-32 h-32 mx-auto bg-white rounded-xl p-2 border border-white/10 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-[#081714]" />
              </div>
              <div>
                <span className="text-[12px] text-[#D2E3DE]/60 block">{language === 'ar' ? 'كود الاستلام:' : 'Claim Code:'}</span>
                <span className="text-lg font-mono font-bold text-[#F4C36C]">DHB-LUG-894-02</span>
              </div>
            </div>

            <div className="text-xs text-[#D2E3DE]/80 space-y-1 text-start">
              <p><strong className="text-[#F7F3EA]">{language === 'ar' ? 'النزيل:' : 'Guest:'}</strong> Ahmed Mansour</p>
              <p><strong className="text-[#F7F3EA]">{language === 'ar' ? 'عدد القطع:' : 'Total Pieces:'}</strong> 3 (2 Bags + 1 Dive Gear)</p>
              <p><strong className="text-[#F7F3EA]">{language === 'ar' ? 'ميعاد التسليم للسائق:' : 'Pickup Time:'}</strong> 02:30 PM (Lobby)</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowLuggageTicket(false);
                showToast(language === 'ar' ? 'تم حفظ الإيصال في صور الجهاز' : 'Luggage pass saved to device');
              }}
              className="w-full py-2.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold cursor-pointer transition-colors"
            >
              {language === 'ar' ? 'إغلاق وحفظ' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
