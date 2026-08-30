import React from 'react';
import {
  Luggage,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Plane,
  Car,
  Award,
  Sparkles,
  Camera,
  Star,
  FileText,
  RefreshCw,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';

export const PreArrivalPrepCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { navigateTo, profile } = useTrip();

  return (
    <section aria-label="Pre-Arrival Preparation" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062C35] to-[#0B4553] text-white p-6 sm:p-8 shadow-xl border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'باقي ٢٤ ساعة على وصولك لدهب' : '24 Hours Until Dahab Arrival'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'جاهز لرحلتك؟ جهز شنطتك وتأكيد الشاتل' : 'Ready for Dahab? Check Packing & Transfer'}
            </h2>
            <p className="text-sm text-cyan-100 leading-relaxed font-normal">
              {language === 'ar'
                ? 'تأكيد شاتل مطار شرم الشيخ جاهز مع كابتن محمود، والطقس مشمس ومناسب للغطس من أول يوم.'
                : 'Your Sharm Airport private shuttle is confirmed with Captain Mahmoud. Water temp 24°C, perfect for Day 1 dive.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/my-trip')}
              className="px-6 py-3 rounded-2xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#062C35] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'عرض تجهيزات السفر الكاملة' : 'View Pre-Arrival Checklist'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const EarlyArrivalHubCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { navigateTo } = useTrip();

  return (
    <section aria-label="Early Arrival & Luggage Hub" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062C35] via-[#0D4B59] to-[#041A20] text-white p-6 sm:p-8 shadow-xl border border-cyan-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'وصلت دهب قبل معاد التسكين؟' : 'Early in Dahab Before Check-in?'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'سيب الشنط واشرب شاي في لايتهاوس هاب' : 'Drop Luggage & Relax at Lighthouse Hub'}
            </h2>
            <p className="text-sm text-cyan-100 leading-relaxed font-normal">
              {language === 'ar'
                ? 'فندق علي بابا موفر لك حفظ شنط مجاني ودخول لقعدة الشاطئ لحد ميعاد غرفتك الساعة ٢:٠٠ الظهر.'
                : 'Ali Baba Hotel offers free secured luggage holding and beachfront lounge access until your 14:00 check-in.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/arrive')}
              className="px-6 py-3 rounded-2xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#062C35] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'دليل أول ساعتين في دهب' : 'First 2 Hours Guide'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const RecoverySpotlightCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { navigateTo } = useTrip();

  return (
    <section aria-label="Trip Recovery Spotlight" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3D1414] via-[#5C1D1D] to-[#2B0E0E] text-white p-6 sm:p-8 shadow-xl border border-red-500/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? 'تحديث طقس: هواء شديد بالبحر' : 'Weather Alert: 22kt Offshore Wind'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'تم تأجيل غطسة القارب · اختر بديلاً فورياً' : 'Boat Dive Paused · 3 Instant Alternatives'}
            </h2>
            <p className="text-sm text-red-100 leading-relaxed font-normal">
              {language === 'ar'
                ? 'لحمايتك تم تأجيل غطسة البلو هول بالقارب. يمكنك استبدالها برحلة سفاري وادي قناي أو غوص شاطئي هادئ بدون أي رسوم إضافية.'
                : 'Due to safety protocols, boat dives are paused today. Switch to a sheltered shore dive or Wadi Gnai desert safari at zero fee variance.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/change-recovery')}
              className="px-6 py-3 rounded-2xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#062C35] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{language === 'ar' ? 'عرض البدائل والتأكيد' : 'Review Alternatives'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const DepartureHubCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { navigateTo } = useTrip();

  return (
    <section aria-label="Departure Hub" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062C35] to-[#123842] text-white p-6 sm:p-8 shadow-xl border border-cyan-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
              <Plane className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'يوم المغادرة · نتمنى لك رحلة آمنة' : 'Departure Day · Safe Travels'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'شاتل المطار الساعة ٣:٣٠ عصراً' : 'Airport Shuttle Pick-up at 15:30'}
            </h2>
            <p className="text-sm text-cyan-100 leading-relaxed font-normal">
              {language === 'ar'
                ? 'تأكد من استلام كل أمتعتك من الفندق، وسداد حساب المطاعم، وفحص جواز السفر قبل التحرك لشرم الشيخ.'
                : 'Confirm luggage packing, room key return at Ali Baba Hotel, and review flight MS-028 SSH departure status.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/departure')}
              className="px-6 py-3 rounded-2xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#062C35] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'قائمة المغادرة وتتبع الشاتل' : 'Departure Checklist & Live Van'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const PostTripHubCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { navigateTo } = useTrip();

  return (
    <section aria-label="Post-Trip Memories" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062C35] via-[#0D4B59] to-[#041A20] text-white p-6 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'حمد الله ع السلامة! رحلتك اكتملت' : 'Welcome Home! Trip Completed'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'ذكريات دهب، الفاتورة الضريبية، وشارات الإنجاز' : 'Your Dahab Memories, Invoice & Badges'}
            </h2>
            <p className="text-sm text-cyan-100 leading-relaxed font-normal">
              {language === 'ar'
                ? 'استرجع أجمل صور الأيام الـ ٥ في دهب، نزل الفاتورة الضريبية المجمعة، وشارك تقييمك لمقدمي الخدمات المحليين.'
                : 'Explore your 5-day memory book, download consolidated EGP tax invoice, and leave feedback for local Sinai guides.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/post-trip')}
              className="px-6 py-3 rounded-2xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#062C35] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'ar' ? 'فتح ألبوم الذكريات والفواتير' : 'Open Memories & Invoices'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const InTransitTrackerCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { transferTracking, navigateTo } = useTrip();

  return (
    <section aria-label="In-Transit Shuttle & Highway Tracker" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062C35] via-[#0E3D48] to-[#041A20] text-white p-6 sm:p-8 shadow-xl border border-cyan-500/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold border border-cyan-400/30">
              <Car className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
              <span>{language === 'ar' ? 'أنت في الطريق إلى دهب · متابعة الشاتل المباشرة' : 'On Your Way to Dahab · Live Shuttle Telemetry'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif]">
              {language === 'ar' ? 'الكابتن محمود في الطريق · الوصول المتوقع بعد ٤٥ دقيقة' : 'Captain Mahmoud is En Route · ETA ~45 Mins'}
            </h2>
            <p className="text-sm text-cyan-100 leading-relaxed font-normal">
              {language === 'ar'
                ? `السيارة: ${transferTracking?.vehicleModel || 'Toyota HiAce Comfort'} (${transferTracking?.vehiclePlate || 'ط ج د 4821'}). طريق شرم - دهب السريع سالك والأجواء صافية.`
                : `Vehicle: ${transferTracking?.vehicleModel || 'Toyota HiAce Comfort'} (${transferTracking?.vehiclePlate || 'ط ج د 4821'}). Sharm-Dahab highway conditions clear.`}
            </p>
            <div className="text-xs text-amber-300/90 font-mono pt-1">
              📍 {transferTracking?.lastGpsUpdate || 'Nabq checkpoint northbound'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${transferTracking?.driverPhone || '+201008765432'}`}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <span>📞</span>
              <span>{language === 'ar' ? 'اتصال بالسائق' : 'Call Driver'}</span>
            </a>
            <button
              type="button"
              onClick={() => navigateTo('/my-trip')}
              className="px-6 py-3 rounded-2xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#062C35] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'متابعة مسار الوصول' : 'View Arrival Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ActiveActivityCockpitCard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { travelerContext, navigateTo } = useTrip();

  const activityTitle = travelerContext?.availability?.nextActivityTitle || 'Guided Coral Reef Dive';
  const activityTitleAr = travelerContext?.availability?.nextActivityTitleAr || 'غطسة الشعاب المرجانية الإرشادية';

  return (
    <section aria-label="Active Activity Live Cockpit" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062C35] via-[#104854] to-[#041A20] text-white p-6 sm:p-8 shadow-xl border border-teal-400/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-200 text-xs font-bold border border-teal-400/30">
              <Compass className="w-3.5 h-3.5 animate-spin text-teal-300" />
              <span>{language === 'ar' ? 'نشاط جاري الآن · في الميدان' : 'Active Activity · In Progress'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit',sans-serif]">
              {language === 'ar' ? activityTitleAr : activityTitle}
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed font-normal">
              {language === 'ar'
                ? 'استمتع بوقتك في المياه. معدات السلامة وفريق الغوص المعتمد يتابعون حالتك. الوجبة القادمة واستراحة الشاي جاهزة بعد الانتهاء.'
                : 'Enjoy the water. CDWS verified guide and safety protocols active. Post-dive hydration and Bedouin tea ready upon return.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/my-trip', { dayId: 2 })}
              className="px-6 py-3 rounded-2xl bg-[#20A89A] hover:bg-[#28BDB0] text-[#04231F] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ar' ? 'عرض تفاصيل النشاط وموقع العودة' : 'Activity Route & Details'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const EmergencyQuickCallCard: React.FC = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section aria-label="Sinai Emergency Medical & Dispatch" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#4A0E0E] via-[#661616] to-[#360909] text-white p-6 sm:p-8 shadow-2xl border-2 border-red-500/60 animate-pulse-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-400/20 text-red-200 text-xs font-bold border border-red-400/40">
              <ShieldCheck className="w-3.5 h-3.5 text-red-300" />
              <span>
                {language === 'ar'
                  ? 'طوارئ سيناء ٢٤ ساعة · خطوط اتصال مباشرة ومعتمدة'
                  : '24/7 Sinai Emergency Dispatch · Authoritative Hotlines'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-white tracking-tight">
              {language === 'ar'
                ? 'طوارئ الإسعاف وغرفة الضغط العالي ومستشفى دهب'
                : 'Direct Ambulance, Hyperbaric Chamber & Emergency Hospital'}
            </h2>
            <p className="text-sm text-red-100/90 leading-relaxed font-normal">
              {language === 'ar'
                ? 'اتصال فوري مباشر بدون انتظار. غرفة علاج حوادث الغوص ومستشفى دهب المركزي متاحين على مدار الساعة مع مسعفين معتمدين.'
                : 'Immediate one-tap direct call. Dahab Hyperbaric Chamber and Central Hospital on-call trauma teams are available 24/7.'}
            </p>
            <div className="text-[12px] text-red-300/80 font-mono pt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'ar' ? 'مصدر موثق: هيئة الرعاية الصحية بجنوب سيناء' : 'Verified: South Sinai Health & Tourism Authority'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <a
              href="tel:123"
              className="px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 min-h-[48px] border border-red-300/40 cursor-pointer active:scale-95"
            >
              <span>🚑</span>
              <span>{language === 'ar' ? 'إسعاف سيناء (١٢٣)' : 'Ambulance (123)'}</span>
            </a>

            <a
              href="tel:+20693640535"
              className="px-5 py-3.5 rounded-2xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#062C35] font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 min-h-[48px] border border-amber-300/40 cursor-pointer active:scale-95"
            >
              <span>🤿</span>
              <span>{language === 'ar' ? 'غرفة الضغط (+20693640535)' : 'Hyperbaric Chamber'}</span>
            </a>

            <a
              href="tel:126"
              className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 min-h-[48px] border border-white/30 cursor-pointer active:scale-95"
            >
              <span>👮</span>
              <span>{language === 'ar' ? 'شرطة السياحة (١٢٦)' : 'Tourism Police (126)'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

