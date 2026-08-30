import React, { useState } from 'react';
import {
  Compass,
  Luggage,
  Calendar,
  Bike,
  Clock,
  Coffee,
  Waves,
  Sun,
  UtensilsCrossed,
  Sparkles,
  AlertTriangle,
  LifeBuoy,
  MapPin,
  LogOut,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Play,
  CheckCircle2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { AppRoute, JourneyStage } from '../../types';

export interface AhmedStageItem {
  id: number;
  stageKey: string;
  titleEn: string;
  titleAr: string;
  category: 'Planning' | 'Booking' | 'Companion' | 'Utility' | 'Recovery' | 'Agency';
  categoryAr: 'التخطيط' | 'الحجز' | 'الرفيق الذكي' | 'خدمات محلية' | 'الإنقاذ والبدائل' | 'وكيل السفر';
  route: AppRoute;
  overrideStage?: JourneyStage;
  icon: React.FC<{ className?: string }>;
  descriptionEn: string;
  descriptionAr: string;
  promptEn: string;
  promptAr: string;
}

export const AHMED_18_STAGES: AhmedStageItem[] = [
  {
    id: 1,
    stageKey: 'discovery_intent',
    titleEn: '1. Describe Trip Intent',
    titleAr: '١. قولنا نفسك تعيش دهب إزاي',
    category: 'Planning',
    categoryAr: 'التخطيط',
    route: '/trip-builder',
    icon: Compass,
    descriptionEn: '5 days, 2 friends, moderate budget, diving + adventure + food.',
    descriptionAr: '٥ أيام، ٢ صحاب، ميزانية مظبوطة، غطس ومغامرة وأكل رايق.',
    promptEn: '"What kind of Dahab trip are you looking for?"',
    promptAr: 'قولنا نفسك تعيش دهب إزاي.. وإحنا نرتبهالك',
  },
  {
    id: 2,
    stageKey: 'plan_for_me',
    titleEn: '2. "Plan It For Me" & Approve',
    titleAr: '٢. ظبّطلي الرحلة واعتمدها',
    category: 'Planning',
    categoryAr: 'التخطيط',
    route: '/trip-builder',
    icon: Sparkles,
    descriptionEn: 'Instant balanced 5-day itinerary with custom alternatives.',
    descriptionAr: 'جدول ٥ أيام متوازن وجاهز مع بدائل متفصلة على مزاجك.',
    promptEn: 'Approve Trip → Becomes real bookable timeline',
    promptAr: 'اعتمد الخطة ← تتحول لحجوزات حقيقية جاهزة',
  },
  {
    id: 3,
    stageKey: 'unified_booking',
    titleEn: '3. Multi-Service Booking Hub',
    titleAr: '٣. حجز مجمّع بكود واحد',
    category: 'Booking',
    categoryAr: 'الحجز',
    route: '/bookings',
    icon: Luggage,
    descriptionEn: 'Hotel + Sharm Transfer + Diving + Safari in 1 unified voucher.',
    descriptionAr: 'الفندق + توصيلة شرم + الغطس + السفاري في قسيمة واحدة.',
    promptEn: 'Single unified confirmation DHB-2026-OCT-894',
    promptAr: 'تأكيد واحد يجمع كل حجوزاتك بدون وجع دماغ',
  },
  {
    id: 4,
    stageKey: 'scooter_suggestion',
    titleEn: '4. Contextual Scooter Notice',
    titleAr: '٤. اقتراح السكوتر الذكي',
    category: 'Agency',
    categoryAr: 'وكيل السفر',
    route: '/my-trip',
    icon: Bike,
    descriptionEn: 'Platform notices 3 distant spots tomorrow → suggests scooter.',
    descriptionAr: 'لاحظنا إن أماكن بكرة بعيدة عن بعض، سكوتر هيوفرلك وقت.',
    promptEn: '"Save 1h 40m walking time between Blue Hole and Lighthouse"',
    promptAr: '"وفر ساعة و٤٠ دقيقة مشي بين البلو هول واللايتهاوس"',
  },
  {
    id: 5,
    stageKey: 'pre_arrival',
    titleEn: '5. Pre-Arrival Briefing (T-24h)',
    titleAr: '٥. ملخص ما قبل الوصول (٢٤ ساعة)',
    category: 'Agency',
    categoryAr: 'وكيل السفر',
    route: '/my-trip',
    overrideStage: 'prepare',
    icon: Clock,
    descriptionEn: 'Driver details, pickup time, bag packing check & sea forecast.',
    descriptionAr: 'بيانات الكابتن، ميعاد التحرك، شنطة السفر، وتوقعات البحر.',
    promptEn: 'Tomorrow in Dahab: Driver Karim ready at Sharm Airport',
    promptAr: 'بكرة في دهب: الكابتن كريم في انتظارك بمطار شرم',
  },
  {
    id: 6,
    stageKey: 'early_arrival_luggage',
    titleEn: '6. Early Arrival (10 AM vs 3 PM)',
    titleAr: '٦. الوصول بدري والشنط',
    category: 'Utility',
    categoryAr: 'خدمات محلية',
    route: '/my-trip',
    overrideStage: 'arrive',
    icon: Luggage,
    descriptionEn: 'Arrived at 10 AM, hotel check-in at 3 PM → Leave bags & explore.',
    descriptionAr: 'وصلت ١٠ الصبح وتسكين الفندق ٣ الظهر؟ سيب شنطك وعيش يومك.',
    promptEn: 'Do not stay stranded: Storage point at Lighthouse ready',
    promptAr: 'متقعدش محتار: سيب شنطك في أمان عند اللايتهاوس',
  },
  {
    id: 7,
    stageKey: 'first_two_hours',
    titleEn: '7. First 2 Hours in Dahab',
    titleAr: '٧. أول ساعتين في دهب',
    category: 'Utility',
    categoryAr: 'خدمات محلية',
    route: '/first-two-hours',
    icon: Coffee,
    descriptionEn: 'Exactly 3 curated choices: Breakfast, Seafront Walk, or Beach.',
    descriptionAr: '٣ اختيارات محددة ورايقة: فطور مصري، لفة ع الممشى، أو قعدة ع البحر.',
    promptEn: '3 curated options instead of 30 overwhelming choices',
    promptAr: '٣ اختيارات على مزاجك بدل الحيرة والتشتيت',
  },
  {
    id: 8,
    stageKey: 'checkin_complete',
    titleEn: '8. Check-in Complete ✅',
    titleAr: '٨. استلمت الأوضة والغداء ✅',
    category: 'Booking',
    categoryAr: 'الحجز',
    route: '/my-trip',
    icon: CheckCircle2,
    descriptionEn: 'Room key received, settled in, Day 1 evening unlocked.',
    descriptionAr: 'استلمت مفتاح الأوضة، استقريت، وبداية أنشطة المساء.',
    promptEn: 'Hotel check-in confirmed, timeline auto-progressed',
    promptAr: 'حجز الفندق اتأكد والجدول اتحدث تلقائياً',
  },
  {
    id: 9,
    stageKey: 'morning_radar',
    titleEn: '9. Good Morning & Sinai Radar',
    titleAr: '٩. صباح دهب ورادار سيناء',
    category: 'Companion',
    categoryAr: 'الرفيق الذكي',
    route: '/live',
    icon: Sun,
    descriptionEn: 'Wind 18kn, glassy sea, 30m visibility → Diving & Kitesurf peak.',
    descriptionAr: 'الهوا ١٨ عقدة، البحر مراية، ورؤية ٣٠ متر ← وقت الغطس والكايت.',
    promptEn: 'Best today: Diving Excellent · Kitesurf after 12 PM',
    promptAr: 'أحسن حاجة النهارده: الغطس توب · الكايت عالي بعد الظهر',
  },
  {
    id: 10,
    stageKey: 'what_now',
    titleEn: '10. "What Should I Do Now?"',
    titleAr: '١٠. أعمل إيه دلوقتي؟',
    category: 'Companion',
    categoryAr: 'الرفيق الذكي',
    route: '/my-trip',
    overrideStage: 'spontaneous',
    icon: Sparkles,
    descriptionEn: '2 free hours after diving → Chill, Explore, or Adventure.',
    descriptionAr: 'عندك ساعتين فاضيين بعد الغطس ← روقان، استكشاف، أو مغامرة.',
    promptEn: 'Choose 1 of 3 options → Instantly added to your trip',
    promptAr: 'اختار واحدة من ٣ ← تتضاف لجدول يومك فوراً',
  },
  {
    id: 11,
    stageKey: 'food_now',
    titleEn: '11. Food Now (Beach & Room)',
    titleAr: '١١. أكل ومطاعم (ع البحر وفي الأوضة)',
    category: 'Utility',
    categoryAr: 'خدمات محلية',
    route: '/food',
    icon: UtensilsCrossed,
    descriptionEn: 'Near you right now: Breakfast, Quick, Fresh Catch, or Delivery.',
    descriptionAr: 'قريب منك دلوقتي: فطور، أكلات سريعة، صيد اليوم، أو توصيل للشاطئ.',
    promptEn: 'Order directly to your beach chair or hotel room',
    promptAr: 'اطلب يوصلك لحد شلتك ع الشاطئ أو أوضتك',
  },
  {
    id: 12,
    stageKey: 'rider_tracking',
    titleEn: '12. Live Food Delivery Tracking',
    titleAr: '١٢. تتبع المندوب ع الخريطة',
    category: 'Utility',
    categoryAr: 'خدمات محلية',
    route: '/food',
    icon: Bike,
    descriptionEn: 'Restaurant → Prepared → Rider picked up → At Lighthouse.',
    descriptionAr: 'المطعم جهز الأكل ← المندوب استلم ← في الطريق إليك عند اللايتهاوس.',
    promptEn: 'Live tracking inside your travel companion',
    promptAr: 'تتبع لحظي داخل رفيق السفر بدون تطبيقات تانية',
  },
  {
    id: 13,
    stageKey: 'change_conditions',
    titleEn: '13. Boat Trip Condition Warning',
    titleAr: '١٣. تنبيه تغير حالة البحر',
    category: 'Recovery',
    categoryAr: 'الإنقاذ والبدائل',
    route: '/change-recovery',
    icon: AlertTriangle,
    descriptionEn: 'Waves picked up → Boat trip altered with 3 curated solutions.',
    descriptionAr: 'الموج علي عند رأس أبو جالوم ← عدلنا الخطة بـ ٣ بدائل جاهزة.',
    promptEn: 'Instead of "Cancelled", we say: "We found 3 alternatives"',
    promptAr: 'بدل "اتلغت"، بنقولك: "لقينالك ٣ بدائل مناسبة فوراً"',
  },
  {
    id: 14,
    stageKey: 'we_fixed_your_day',
    titleEn: '14. "We Fixed Your Day" Engine',
    titleAr: '١٤. محرك تظبيط اليوم التلقائي',
    category: 'Recovery',
    categoryAr: 'الإنقاذ والبدائل',
    route: '/change-recovery',
    icon: SlidersHorizontal,
    descriptionEn: 'Rebooking automatically adjusts Safari, Lunch, and Transfers.',
    descriptionAr: 'تعديل الميعاد بيظبط السفاري والغداء والتوصيلات تلقائياً.',
    promptEn: 'Agency coordination software at work',
    promptAr: 'سيستم التنسيق بيعيد ترتيب باقي يومك بدون ما تشيل هم',
  },
  {
    id: 15,
    stageKey: 'help_me_now',
    titleEn: '15. Help Me Now & Sinai Expert',
    titleAr: '١٥. محتاج مساعدة؟ كلم خبير دهب',
    category: 'Agency',
    categoryAr: 'وكيل السفر',
    route: '/help',
    icon: LifeBuoy,
    descriptionEn: 'Bookings, transport, pharmacy, decompression chamber SOS.',
    descriptionAr: 'طوارئ الغطس، الصيدليات، السائقين، وخبير محلي من دهب معاك.',
    promptEn: '1-tap access to Dahab local human expert & SOS lines',
    promptAr: 'بضغطة واحدة تتواصل مع فريق دهب وأرقام الطوارئ',
  },
  {
    id: 16,
    stageKey: 'near_me_night',
    titleEn: '16. Near Me Evening Spots',
    titleAr: '١٦. قعدات وأماكن قريبة للمساء',
    category: 'Companion',
    categoryAr: 'الرفيق الذكي',
    route: '/explore',
    icon: MapPin,
    descriptionEn: 'Cafes, live acoustic music, Bedouin fires, Eel Garden view.',
    descriptionAr: 'كافيهات ومزيكا لايف، قعدات شاي بدوي، وإطلالة إيل جاردن.',
    promptEn: 'Walk times & live distances from Lighthouse',
    promptAr: 'دقايق مشي ومسافات حقيقية من مكانك بالظبط',
  },
  {
    id: 17,
    stageKey: 'departure_mode',
    titleEn: '17. Departure Mode & Flights',
    titleAr: '١٧. ترتيب يوم الرجوع والمطار',
    category: 'Agency',
    categoryAr: 'وكيل السفر',
    route: '/departure',
    icon: LogOut,
    descriptionEn: 'Checkout 11:00, Transfer 13:30, Flight 18:20 countdown.',
    descriptionAr: 'تسليم الأوضة ١١:٠٠، العربية ٠١:٣٠، وميعاد الطيارة ٠٦:٢٠.',
    promptEn: 'Smart management of your last remaining hours in Sinai',
    promptAr: 'إدارة رايقة لآخر ساعاتك في دهب من غير قلق',
  },
  {
    id: 18,
    stageKey: 'post_trip_passport',
    titleEn: '18. Completed Trip & Summary',
    titleAr: '١٨. ملخص الرحلة وتقييم التجربة',
    category: 'Agency',
    categoryAr: 'وكيل السفر',
    route: '/post-trip',
    icon: Award,
    descriptionEn: 'Trip summary, photos, badges, ratings & next Dahab visit.',
    descriptionAr: 'ملخص الأيام والصور، الشارات اللي كسبتها، وتخطيط المرة الجاية.',
    promptEn: 'Next time: Freediving & Ras Abu Galum Camp',
    promptAr: 'المرة الجاية: فريد ايفينج وتخييم في رأس أبو جالوم',
  },
];

interface AhmedJourneyWalkthroughProps {
  onSelectStageOverride: (stage: JourneyStage | null) => void;
}

export const AhmedJourneyWalkthrough: React.FC<AhmedJourneyWalkthroughProps> = ({
  onSelectStageOverride,
}) => {
  const { navigateTo, currentRoute, showToast, loadDemoSimulation, resetToAnonymousState, authRole, isSignedIn } = useTrip();
  const { language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeStageId, setActiveStageId] = useState<number>(1);

  /**
   * This is an internal QA simulator: it calls loadDemoSimulation() to inject
   * fabricated trip data and jump between the 18 journey stages. It was pinned
   * over every page, including the public marketing homepage, where it read as
   * a half-finished product to any first-time visitor — and on mobile its
   * floating pill covered the destinations panel at the bottom of the hero.
   *
   * Restricted to staff accounts, with an env escape hatch for local demos.
   */
  // Was `Boolean(user)`; an Operations account signed in with a password never
  // satisfied it, so the simulator was unreachable by the staff it is for.
  const isStaff = isSignedIn && (authRole === 'Operations' || authRole === 'Admin');
  const demoToolsForced = import.meta.env.VITE_SHOW_JOURNEY_SIMULATOR === 'true';
  if (!isStaff && !demoToolsForced) {
    return null;
  }

  const handleStageClick = (item: AhmedStageItem) => {
    setActiveStageId(item.id);
    loadDemoSimulation();
    if (item.overrideStage) {
      onSelectStageOverride(item.overrideStage);
    } else {
      onSelectStageOverride(null);
    }
    navigateTo(item.route);
    showToast(language === 'ar' ? `المحطة ${item.id}: ${item.titleAr}` : `Stage ${item.id}: ${item.titleEn}`);
  };

  const currentActiveItem = AHMED_18_STAGES.find((s) => s.id === activeStageId) || AHMED_18_STAGES[0];

  return (
    <aside
      aria-label="Ahmed's 18-Stage Interactive Dahab Journey"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed bottom-2 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 transition-all duration-300 pointer-events-auto font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* 1. COLLAPSED FLOATING PILL */}
      {!isOpen ? (
        <div className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-full border shadow-2xl backdrop-blur-2xl transition-all ${
          isDark 
            ? 'bg-[#0E2520]/90 text-[#F7F3EA] border-white/20 ring-1 ring-white/10' 
            : 'bg-white/95 text-[#122420] border-[#122420]/15 ring-1 ring-[#122420]/5 shadow-stone-400/30'
        }`}>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer group text-start border shadow-xs ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/15' 
                : 'bg-stone-100 hover:bg-stone-200 text-[#122420] border-[#122420]/10'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E7A83B] animate-pulse shadow-xs shadow-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className={`text-[12px] sm:text-xs font-['Outfit',sans-serif] font-bold flex items-center gap-1.5 ${
                isDark ? 'text-white' : 'text-[#122420]'
              }`}>
                <span>{language === 'ar' ? 'رحلة أحمد في دهب (١٨ محطة)' : "Ahmed's 18-Stage Dahab Journey"}</span>
              </span>
              <span className={`text-[11px] hidden xs:inline font-medium ${
                isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'
              }`}>
                {language === 'ar' ? `المحطة الحالية: ${currentActiveItem.titleAr}` : `Active: ${currentActiveItem.titleEn}`}
              </span>
            </div>
            <ChevronUp className={`w-4 h-4 group-hover:-translate-y-0.5 transition-transform ms-1 ${
              isDark ? 'text-[#52C4B7]' : 'text-[#20A89A]'
            }`} />
          </button>

          <button
            type="button"
            onClick={() => {
              const nextId = activeStageId >= 18 ? 1 : activeStageId + 1;
              const nextStage = AHMED_18_STAGES.find((s) => s.id === nextId) || AHMED_18_STAGES[0];
              handleStageClick(nextStage);
            }}
            aria-label="Next Journey Stage"
            className="p-2.5 rounded-full bg-gradient-to-br from-[#F4C36C] to-[#E7A83B] hover:brightness-110 text-[#04171D] font-bold transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-lg border border-white/30"
          >
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      ) : (
        /* 2. EXPANDED JOURNEY MATRIX MODAL DRAWER */
        <div className={`border rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl space-y-4 max-h-[85vh] sm:max-h-[75vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 ring-1 ${
          isDark 
            ? 'bg-[#0E2520]/95 text-[#F7F3EA] border-white/20 ring-white/10' 
            : 'bg-white/95 text-[#122420] border-[#122420]/15 ring-[#122420]/5'
        }`}>
          
          {/* Header */}
          <div className={`flex items-center justify-between border-b pb-3 ${
            isDark ? 'border-white/15' : 'border-[#122420]/10'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F4C36C] to-[#E7A83B] text-[#04171D] flex items-center justify-center font-bold shadow-md">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className={`text-sm font-bold font-['Outfit',sans-serif] ${
                  isDark ? 'text-white' : 'text-[#122420]'
                }`}>
                  {language === 'ar' ? 'خطوات رحلة أحمد في دهب (من الوصول للرجوع)' : "Ahmed's Complete 18-Stage Simulator"}
                </h3>
                <p className={`text-[11px] ${isDark ? 'text-[#E7D3AE]' : 'text-[#4A635D]'}`}>
                  {language === 'ar' ? 'إزاي منصة دهب بتظبطلك كل تفصيلة في السفر' : 'How the full Travel Agency runs as software'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 text-[#E7D3AE] hover:text-white border-white/10' 
                  : 'bg-stone-100 hover:bg-stone-200 text-[#4A635D] hover:text-[#122420] border-[#122420]/10'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Active Preview Banner */}
          <div className={`p-3.5 rounded-2xl backdrop-blur-xl border space-y-1.5 shrink-0 shadow-inner ${
            isDark ? 'bg-white/10 border-white/15' : 'bg-stone-50 border-[#122420]/10'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold uppercase tracking-wider text-[11px] ${
                isDark ? 'text-[#F4C36C]' : 'text-[#EA8E75]'
              }`}>
                {language === 'ar' ? currentActiveItem.categoryAr : currentActiveItem.category}
              </span>
              <span className={`font-mono text-[12px] font-semibold px-2 py-0.5 rounded-full border ${
                isDark 
                  ? 'text-[#52C4B7] bg-teal-950/40 border-teal-400/30' 
                  : 'text-[#0E2520] bg-emerald-50 border-emerald-300'
              }`}>
                {activeStageId} / 18
              </span>
            </div>
            <h4 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-[#122420]'}`}>
              {language === 'ar' ? currentActiveItem.titleAr : currentActiveItem.titleEn}
            </h4>
            <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#E7D3AE]' : 'text-[#4A635D]'}`}>
              {language === 'ar' ? currentActiveItem.descriptionAr : currentActiveItem.descriptionEn}
            </p>
            <div className={`pt-1 text-[11px] font-mono italic ${isDark ? 'text-[#52C4B7]' : 'text-[#20A89A]'}`}>
              {language === 'ar' ? currentActiveItem.promptAr : currentActiveItem.promptEn}
            </div>
          </div>

          {/* Scrollable 18-Stage Grid List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pe-1 custom-scrollbar">
            {AHMED_18_STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              const IconComp = stage.icon;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageClick(stage)}
                  className={`w-full text-start p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                    isSelected
                      ? isDark
                        ? 'bg-gradient-to-r from-[#0F6F78]/50 to-[#20A89A]/40 border-teal-300/50 text-white shadow-lg backdrop-blur-md ring-1 ring-teal-300/30'
                        : 'bg-emerald-50 border-emerald-400/50 text-[#0E2520] shadow-md ring-1 ring-emerald-300'
                      : isDark
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 text-[#E7D3AE] hover:text-white'
                        : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100 text-[#4A635D] hover:text-[#122420]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#0F6F78] to-[#20A89A] text-white shadow-xs' 
                        : isDark ? 'bg-white/10 text-[#E7D3AE]' : 'bg-stone-200 text-[#4A635D]'
                    }`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">
                        {language === 'ar' ? stage.titleAr : stage.titleEn}
                      </div>
                      <div className={`text-[11px] truncate ${isDark ? 'text-white/50' : 'text-stone-500'}`}>
                        {language === 'ar' ? stage.categoryAr : stage.category}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                      isDark 
                        ? 'text-[#F4C36C] bg-amber-500/20 border-amber-400/40' 
                        : 'text-[#EA8E75] bg-amber-50 border-amber-300'
                    }`}>
                      {language === 'ar' ? 'مباشر' : 'Live'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Action */}
          <div className={`pt-2 border-t flex items-center justify-between text-xs shrink-0 gap-2 ${
            isDark ? 'border-white/15' : 'border-[#122420]/10'
          }`}>
            <button
              type="button"
              onClick={() => {
                resetToAnonymousState();
                navigateTo('/home');
                setIsOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-xl font-medium text-[12px] cursor-pointer transition-all border ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 text-[#E7D3AE] hover:text-white border-white/10' 
                  : 'bg-stone-100 hover:bg-stone-200 text-[#4A635D] hover:text-[#122420] border-[#122420]/10'
              }`}
            >
              {language === 'ar' ? 'الرجوع للوضع العام (مجهول)' : 'Reset to Anonymous'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0F6F78] to-[#20A89A] hover:brightness-110 text-white font-bold text-xs cursor-pointer transition-all shadow-md border border-teal-200/30"
            >
              {language === 'ar' ? 'قفل' : 'Close'}
            </button>
          </div>

        </div>
      )}
    </aside>
  );
};
