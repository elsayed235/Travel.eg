import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  MapPin, 
  Building, 
  Luggage, 
  Coffee, 
  Waves, 
  Footprints, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  Calendar,
  AlertCircle,
  Navigation,
  Info,
  RotateCcw,
  SlidersHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  Sun,
  Flame
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useArrivalClock } from '../../hooks/useArrivalClock';
import { addMinutes, formatClock, formatDuration, minutesBetween } from '../../utils/arrivalTime';
import { LuggageStorageModal } from './LuggageStorageModal';
import { ActivityOptionModal } from './ActivityOptionModal';

interface FirstTwoHoursViewProps {
  onBackToMyTrip: () => void;
  onBackToEarlyArrival: () => void;
  onExploreClick?: () => void;
  onOpenHelp?: () => void;
}

interface TimelineStep {
  id: string;
  /** Minutes after the traveler's arrival that this step begins. */
  offsetMinutes: number;
  time: string;
  title: string;
  desc: string;
  duration: string;
  category: string;
  icon: string;
  ctaText: string;
  ctaAction: 'luggage' | 'breakfast' | 'walk' | 'beach' | 'hotel';
  isCompleted: boolean;
}

export const FirstTwoHoursView: React.FC<FirstTwoHoursViewProps> = ({
  onBackToMyTrip,
  onBackToEarlyArrival,
  onExploreClick,
  onOpenHelp,
}) => {
  const { language, isRTL, t } = useLanguage();

  // These times used to start at a hardcoded 10:00 AM. They now run from the
  // moment this traveler actually reached the arrival flow.
  const clock = useArrivalClock();
  const lang = language === 'ar' ? 'ar' : 'en';

  // Plan variants: 'standard' (with breakfast) vs 'coffee-beach' (skip breakfast)
  const [planVariant, setPlanVariant] = useState<'standard' | 'coffee-beach'>('standard');

  /**
   * Was a `useState` driven by three buttons in the header labelled
   * "10:00 AM (2h 20m) / Early (+35m) / Late (25m left)", with toasts that said
   * "Simulated Early Finish" — an internal QA control shipped to travelers,
   * which existed only because the clock on this page was frozen. Both signals
   * behind it are real, so it is derived now.
   */
  const RUNNING_LATE_THRESHOLD_MINUTES = 30;

  // Modal states
  const [isLuggageModalOpen, setIsLuggageModalOpen] = useState<boolean>(false);
  const [activityModalType, setActivityModalType] = useState<'breakfast' | 'beach' | 'walk' | null>(null);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState<boolean>(false);

  // Completed steps tracker
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Base Timeline Items based on variant
  const standardSteps: TimelineStep[] = [
    {
      id: 'step-1-luggage',
      offsetMinutes: 0,
      time: formatClock(addMinutes(clock.arrivedAt, 0), lang),
      title: language === 'ar' ? 'حفظ الشنط والأمتعة' : 'Leave your bags',
      desc: language === 'ar' ? 'سيب شنطك بأمان في نقطة الأمانات المقترحة بالقرب منك.' : 'Drop your luggage at a nearby recommended storage point.',
      duration: language === 'ar' ? '١٥ دقيقة' : '15 min',
      category: language === 'ar' ? 'مقترح' : 'Recommended',
      icon: '🧳',
      ctaText: language === 'ar' ? 'عرض المكان' : 'View option',
      ctaAction: 'luggage',
      isCompleted: completedStepIds.includes('step-1-luggage'),
    },
    {
      id: 'step-2-breakfast',
      offsetMinutes: 20,
      time: formatClock(addMinutes(clock.arrivedAt, 20), lang),
      title: language === 'ar' ? 'الفطار الساحلي' : 'Breakfast',
      desc: language === 'ar' ? 'استمتع بفطار مصري طازج ومشروب فريش ع البحر.' : 'Grab a relaxed breakfast nearby.',
      duration: language === 'ar' ? '٤٠ دقيقة' : '40 min',
      category: language === 'ar' ? 'طعام' : 'Food',
      icon: '☕',
      ctaText: language === 'ar' ? 'عرض الأماكن' : 'See recommendation',
      ctaAction: 'breakfast',
      isCompleted: completedStepIds.includes('step-2-breakfast'),
    },
    {
      id: 'step-3-walk',
      offsetMinutes: 60,
      time: formatClock(addMinutes(clock.arrivedAt, 60), lang),
      title: language === 'ar' ? 'قهوة وتمشية خفيفة' : 'Coffee & Walk',
      desc: language === 'ar' ? 'جولة مشي لطيفة حول منطقة اللايتهاوس ووقفة قهوة بدوية.' : 'Take a short walk around the Lighthouse area and stop for coffee.',
      duration: language === 'ar' ? '٤٥ دقيقة' : '45 min',
      category: language === 'ar' ? 'استكشاف' : 'Explore',
      icon: '🚶',
      ctaText: language === 'ar' ? 'استكشف' : 'Explore',
      ctaAction: 'walk',
      isCompleted: completedStepIds.includes('step-3-walk'),
    },
    {
      id: 'step-4-beach',
      offsetMinutes: 105,
      time: formatClock(addMinutes(clock.arrivedAt, 105), lang),
      title: language === 'ar' ? 'قعدة الشاطئ والاسترخاء' : 'Beach Time',
      desc: language === 'ar' ? 'استرخِ بجانب البحر قبل العودة إلى الفندق.' : 'Relax by the sea before heading back toward your hotel.',
      duration: language === 'ar' ? '٣٠ دقيقة' : '30 min',
      category: language === 'ar' ? 'استرخاء' : 'Relax',
      icon: '🏖',
      ctaText: language === 'ar' ? 'عرض الشاطئ' : 'View spot',
      ctaAction: 'beach',
      isCompleted: completedStepIds.includes('step-4-beach'),
    },
    {
      id: 'step-5-hotel',
      offsetMinutes: 135,
      time: formatClock(addMinutes(clock.arrivedAt, 135), lang),
      title: language === 'ar' ? 'التوجه نحو الفندق' : 'Head toward your hotel',
      desc: language === 'ar' ? 'اترك وقتاً كافياً للوصول لفندقك واستلام الغرفة براحة.' : 'Leave enough time to reach your hotel before check-in.',
      duration: language === 'ar' ? '٣٠–٤٠ دقيقة' : '30–40 min',
      category: language === 'ar' ? 'مقترح' : 'Recommended',
      icon: '🏨',
      ctaText: language === 'ar' ? 'تفاصيل الفندق' : 'Hotel details',
      ctaAction: 'hotel',
      isCompleted: completedStepIds.includes('step-5-hotel'),
    },
  ];

  const coffeeBeachSteps: TimelineStep[] = [
    {
      id: 'step-1-luggage',
      offsetMinutes: 0,
      time: formatClock(addMinutes(clock.arrivedAt, 0), lang),
      title: language === 'ar' ? 'حفظ الشنط والأمتعة' : 'Leave your bags',
      desc: language === 'ar' ? 'سيب شنطك بأمان في نقطة الأمانات المقترحة بالقرب منك.' : 'Drop your luggage at a nearby recommended storage point.',
      duration: language === 'ar' ? '١٥ دقيقة' : '15 min',
      category: language === 'ar' ? 'مقترح' : 'Recommended',
      icon: '🧳',
      ctaText: language === 'ar' ? 'عرض المكان' : 'View option',
      ctaAction: 'luggage',
      isCompleted: completedStepIds.includes('step-1-luggage'),
    },
    {
      id: 'step-2-coffee',
      offsetMinutes: 20,
      time: formatClock(addMinutes(clock.arrivedAt, 20), lang),
      title: language === 'ar' ? 'قهوة مميزة وعصير فريش' : 'Artisanal Coffee & Fresh Juice',
      desc: language === 'ar' ? 'قهوة بدوية بحبّهان على المية مباشرة في كافيه شمس.' : 'Sip fresh Bedouin spiced coffee right by the water at Shams Cafe.',
      duration: language === 'ar' ? '٢٥ دقيقة' : '25 min',
      category: language === 'ar' ? 'طعام ومشروبات' : 'Food',
      icon: '☕',
      ctaText: language === 'ar' ? 'عرض المكان' : 'See spot',
      ctaAction: 'breakfast',
      isCompleted: completedStepIds.includes('step-2-coffee'),
    },
    {
      id: 'step-3-beach-long',
      offsetMinutes: 50,
      time: formatClock(addMinutes(clock.arrivedAt, 50), lang),
      title: language === 'ar' ? 'استرخاء ممتد وسباحة بالشاطئ' : 'Extended Beach Relaxation & Swim',
      desc: language === 'ar' ? 'روقان على شلتات خليج اللايتهاوس ومياه البحر الهادية.' : 'Unwind on cushioned sunbeds at Lighthouse Bay and dip your feet into the calm turquoise reef.',
      duration: language === 'ar' ? '٥٥ دقيقة' : '55 min',
      category: language === 'ar' ? 'استرخاء' : 'Relax',
      icon: '🏖',
      ctaText: language === 'ar' ? 'عرض المكان' : 'View spot',
      ctaAction: 'beach',
      isCompleted: completedStepIds.includes('step-3-beach-long'),
    },
    {
      id: 'step-4-walk-coastal',
      offsetMinutes: 105,
      time: formatClock(addMinutes(clock.arrivedAt, 105), lang),
      title: language === 'ar' ? 'تمشية ساحلية بممشى اللايتهاوس' : 'Scenic Lighthouse Promenade Walk',
      desc: language === 'ar' ? 'تصفح محلات الحرف اليدوية والسجاد البدوي على الممشى.' : 'Browse local artisan handicraft stalls along the pedestrian promenade.',
      duration: language === 'ar' ? '٣٠ دقيقة' : '30 min',
      category: language === 'ar' ? 'استكشاف' : 'Explore',
      icon: '🚶',
      ctaText: language === 'ar' ? 'استكشف' : 'Explore',
      ctaAction: 'walk',
      isCompleted: completedStepIds.includes('step-4-walk-coastal'),
    },
    {
      id: 'step-5-hotel',
      offsetMinutes: 135,
      time: formatClock(addMinutes(clock.arrivedAt, 135), lang),
      title: language === 'ar' ? 'التوجه نحو الفندق' : 'Head toward your hotel',
      desc: language === 'ar' ? 'اترك وقتاً كافياً للوصول لفندقك واستلام الغرفة براحة.' : 'Leave enough time to reach your hotel before check-in.',
      duration: language === 'ar' ? '٣٠–٤٠ دقيقة' : '30–40 min',
      category: language === 'ar' ? 'مقترح' : 'Recommended',
      icon: '🏨',
      ctaText: language === 'ar' ? 'تفاصيل الفندق' : 'Hotel details',
      ctaAction: 'hotel',
      isCompleted: completedStepIds.includes('step-5-hotel'),
    },
  ];

  const steps = planVariant === 'standard' ? standardSteps : coffeeBeachSteps;

  const totalSteps = steps.length;
  const completedCount = steps.filter(s => s.isCompleted).length;
  const currentStepNumber = Math.min(completedCount + 1, totalSteps);

  /**
   * The three states the removed simulator used to let a visitor pick. Both
   * signals behind them are real:
   *  - running late: little time left before check-in and the plan unfinished.
   *  - ahead of plan: the next step is not due for a while yet, so there is
   *    genuine surplus to offer something extra.
   */
  const AHEAD_OF_PLAN_THRESHOLD_MINUTES = 20;
  const minutesSinceArrival = minutesBetween(clock.arrivedAt, clock.now);
  const nextStep = steps.find(step => !step.isCompleted);
  const minutesAheadOfPlan = nextStep ? nextStep.offsetMinutes - minutesSinceArrival : 0;

  // The plan's own window: it ends 30 minutes after the last step begins, which
  // is where the fixed "10:00 AM -> 12:45 PM" label came from.
  const planEndsAt = addMinutes(clock.arrivedAt, (steps[steps.length - 1]?.offsetMinutes ?? 0) + 30);

  const timeMode: 'normal' | 'early_done' | 'running_late' =
    !clock.checkInReached && clock.minutesUntilCheckIn <= RUNNING_LATE_THRESHOLD_MINUTES
      ? 'running_late'
      : minutesAheadOfPlan >= AHEAD_OF_PLAN_THRESHOLD_MINUTES
        ? 'early_done'
        : 'normal';
  const isAllPlanCompleted = completedCount === totalSteps;

  const handleToggleStepCompletion = (stepId: string) => {
    if (completedStepIds.includes(stepId)) {
      setCompletedStepIds(prev => prev.filter(id => id !== stepId));
      showToast(language === 'ar' ? 'تم إلغاء التحديد.' : 'Step unmarked.');
    } else {
      setCompletedStepIds(prev => [...prev, stepId]);
      showToast(language === 'ar' ? 'تم تحديد النشاط كمكتمل ✓' : 'Activity marked as Done ✓');
    }
  };

  const handleStepCTA = (action: 'luggage' | 'breakfast' | 'walk' | 'beach' | 'hotel') => {
    if (action === 'luggage') setIsLuggageModalOpen(true);
    else if (action === 'breakfast') setActivityModalType('breakfast');
    else if (action === 'walk') setActivityModalType('walk');
    else if (action === 'beach') setActivityModalType('beach');
    else if (action === 'hotel') onBackToMyTrip();
  };

  return (
    <div className={`min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Outfit',sans-serif] pb-28 md:pb-16 selection:bg-[#F4C36C]/30 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-grow">
        
        {/* Top Breadcrumb & Live Simulation Tools */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="back-to-early-arrival-btn"
              onClick={onBackToEarlyArrival}
              className="inline-flex items-center gap-1.5 py-3.5 -my-2 text-xs font-semibold text-[#D2E3DE]/70 hover:text-[#F4C36C] transition-colors cursor-pointer"
            >
              {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{language === 'ar' ? 'الرجوع إلى وضع الوصول المبكر' : 'Back to Early Arrival'}</span>
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              id="back-to-my-trip-root-btn"
              onClick={onBackToMyTrip}
              className="text-xs font-medium text-[#D2E3DE]/60 hover:text-[#F4C36C] transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'رحلتي' : 'My Trip'}
            </button>
          </div>

          {/* Persistent Hotel Reminder Badge & Quick Switcher */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2520] border border-white/10 text-xs font-bold text-[#F7F3EA] shadow-2xs">
              <Building className="w-3.5 h-3.5 text-[#F4C36C]" />
              <span>{`${language === 'ar' ? 'استلام الغرفة بالفندق' : 'Hotel check-in'} · ${formatClock(clock.checkInAt, lang)}`}</span>
            </div>

          </div>
        </div>

        {/* 2. MAIN HEADER */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13312B] text-[#F4C36C] border border-[#F4C36C]/30 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'خطة مصغرة مخصصة · وضع الوصول المبكر' : 'Personalized Mini Itinerary · Early Arrival Mode'}</span>
            </div>

            {/* Time Visual Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13312B] text-[#F7F3EA] text-xs font-bold border border-white/10 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#F4C36C]" />
              <span>{formatClock(clock.now, lang)}</span>
              <span className="text-white/40">•</span>
              <span className="text-[#F4C36C] font-extrabold">
                {clock.checkInReached
                  ? (language === 'ar' ? 'الاستلام متاح' : 'Check-in is open')
                  : `${formatDuration(clock.minutesUntilCheckIn, lang)} ${language === 'ar' ? 'متاحة' : 'available'}`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA] tracking-tight">
              {language === 'ar' ? 'أول ساعتين لك في دهب 🌊' : 'Your first 2 hours in Dahab 🌊'}
            </h1>
            <p className="text-base sm:text-lg text-[#D2E3DE]/80 max-w-2xl font-medium">
              {language === 'ar' ? 'صممنا لك بداية هادية ورايقة بينما تنتظر تجهيز غرفتك.' : 'We planned a relaxed start while you wait for your room.'}
            </p>
          </div>

          {/* Compact Context Bar */}
          <div className="p-3.5 rounded-2xl bg-[#0E2520] border border-white/10 shadow-2xs grid grid-cols-3 gap-2 text-xs max-w-2xl">
            <div className="border-r rtl:border-r-0 rtl:border-l border-white/10 pr-2 rtl:pr-0 rtl:pl-2">
              <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block font-['Outfit',sans-serif]">{language === 'ar' ? 'استلام الغرفة' : 'Hotel check-in'}</span>
              <span className="font-bold text-[#F7F3EA]">{formatClock(clock.checkInAt, lang)}</span>
            </div>
            <div className="border-r rtl:border-r-0 rtl:border-l border-white/10 px-2">
              <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block font-['Outfit',sans-serif]">{language === 'ar' ? 'الموقع الحالي' : 'Current location'}</span>
              <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'دهب (اللايتهاوس)' : 'Dahab (Lighthouse)'}</span>
            </div>
            <div className="pl-2 rtl:pl-0 rtl:pr-2">
              <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block font-['Outfit',sans-serif]">{language === 'ar' ? 'المسافرين' : 'Travelers'}</span>
              <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? '٢ بالغين' : '2 adults'}</span>
            </div>
          </div>
        </div>

        {/* 3. RESPONSIVE GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN AREA (7/12 on Desktop) - TIMELINE */}
          <div className="lg:col-span-7 space-y-6">

            {/* A. RUNNING LATE ADAPTATION STATE */}
            {timeMode === 'running_late' ? (
              <section 
                id="running-late-adaptive-card"
              aria-label={language === 'ar' ? 'متأخر عن الخطة' : 'Running late'}
                className="bg-amber-950/30 border-2 border-amber-500/40 rounded-3xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span>{language === 'ar'
                      ? `متبقي لديك ${formatDuration(clock.minutesUntilCheckIn, lang)} قبل موعد الاستلام.`
                      : `You have ${formatDuration(clock.minutesUntilCheckIn, lang)} before check-in.`}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'تبسيط تلقائي' : 'Auto-Simplified'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'هنخلي الموضوع بسيط ومريح.' : "Let's keep it simple."}
                  </h2>
                  <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                    {language === 'ar' 
                      ? 'اختصرنا الجدول بحيث تتوجه مباشرة لفندق Dahab Bay Hotel بدون أي استعجال.'
                      : "We've trimmed the schedule so you can head straight to Dahab Bay Hotel without feeling rushed."}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-4 rounded-2xl bg-[#0E2520] border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#13312B] text-[#F4C36C] flex items-center justify-center font-bold text-lg border border-[#F4C36C]/30">
                        🏨
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#F7F3EA]">
                          {language === 'ar' ? 'التوجه نحو الفندق' : 'Head toward your hotel'}
                        </h3>
                        <p className="text-xs text-[#D2E3DE]/60">
                          {language === 'ar' ? 'فندق خليج دهب · ١٢٠م (دقيقتين مشي)' : 'Dahab Bay Hotel · 120m away (2 min walk)'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onBackToMyTrip}
                      className="px-4 py-2 rounded-full bg-[#F4C36C] text-[#081714] text-xs font-bold cursor-pointer hover:bg-[#E5B55D] transition-colors font-['Outfit',sans-serif]"
                    >
                      {language === 'ar' ? 'الذهاب للاستلام' : 'Go to Check-in'}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#13312B]/70 border border-white/10 flex items-center justify-between text-xs text-[#D2E3DE]">
                    <span className="flex items-center gap-1.5">
                      <span>🥤</span>
                      <span>{language === 'ar' ? 'اختياري: عصير مانجا فريش في السكة' : 'Optional: Grab a fresh mango juice on the way'}</span>
                    </span>
                    <span className="font-semibold text-[#F4C36C]">{language === 'ar' ? 'توقف دقيقتين' : '2 min stop'}</span>
                  </div>
                </div>
              </section>
            ) : null}

            {/* B. ALL FINISHED / COMPLETION STATE */}
            {isAllPlanCompleted ? (
              <section 
                id="mini-plan-all-completed-card"
              aria-label={language === 'ar' ? 'اكتملت الخطة' : 'Plan completed'}
                className="bg-[#0E2520] rounded-3xl p-7 border-2 border-emerald-500/40 shadow-xl space-y-4 text-center animate-in zoom-in-95 duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  👌
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'بداية ممتازة وموفقة 👌' : 'Nice start 👌'}
                  </h2>
                  <p className="text-sm text-[#D2E3DE]/80 font-medium">
                    {language === 'ar' ? 'أنت الآن جاهز تماماً لتسجيل الوصول واستلام غرفتك.' : "You're ready for check-in."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 max-w-sm mx-auto space-y-1 text-xs">
                  <span className="text-[11px] uppercase font-bold text-[#F4C36C] tracking-wider block font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'الخطوة التالية' : 'Next'}
                  </span>
                  <p className="font-bold text-[#F7F3EA] text-sm">
                    {`${formatClock(clock.checkInAt, lang)} · ${language === 'ar' ? 'استلام غرفة الفندق' : 'Hotel Check-in'}`}
                  </p>
                  <p className="text-[#D2E3DE]/60">
                    {language === 'ar' ? 'فندق خليج دهب · غرفة ديلوكس مطلة ع البحر' : 'Dahab Bay Hotel · Sea View Deluxe'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    id="continue-to-my-trip-btn"
                    onClick={onBackToMyTrip}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
                  >
                    <span>{language === 'ar' ? 'المتابعة إلى خطة رحلتي' : 'Continue to My Trip'}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </section>
            ) : null}

            {/* C. EARLY COMPLETION STATE */}
            {timeMode === 'early_done' && !isAllPlanCompleted ? (
              <section 
                id="early-completion-bonus-card"
              aria-label={language === 'ar' ? 'وقت إضافي' : 'Extra time'}
                className="bg-[#0E2520] rounded-3xl p-6 border border-[#F4C36C]/30 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-[#F4C36C] font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ar'
                    ? `لديك ${formatDuration(clock.minutesUntilCheckIn, lang)} قبل موعد الاستلام.`
                    : `You have ${formatDuration(clock.minutesUntilCheckIn, lang)} before check-in.`}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'وقت إضافي مريح' : 'Extra Free Time'}
                  </span>
                </div>

                <p className="text-xs text-[#D2E3DE]/80">
                  {language === 'ar' 
                    ? 'إيقاعك ممتاز وسريع! إليك ٣ اقتراحات لقضاء الـ ٣٥ دقيقة الفائضة براحة:' 
                    : 'You moved at a great pace! Here are 3 quick contextual ways to enjoy your surplus 35 minutes:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActivityModalType('breakfast')}
                    className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 hover:border-[#F4C36C]/50 text-left rtl:text-right space-y-1 transition-all cursor-pointer group"
                  >
                    <span className="text-lg block">☕</span>
                    <h5 className="font-bold text-xs text-[#F7F3EA] group-hover:text-[#F4C36C]">
                      {language === 'ar' ? 'قهوة بدوية' : 'Coffee'}
                    </h5>
                    <p className="text-[12px] text-[#D2E3DE]/60">
                      {language === 'ar' ? 'قهوة بحبّهان ع البحر' : 'Slow Bedouin spiced brew by the reef'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivityModalType('beach')}
                    className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 hover:border-[#F4C36C]/50 text-left rtl:text-right space-y-1 transition-all cursor-pointer group"
                  >
                    <span className="text-lg block">🏖</span>
                    <h5 className="font-bold text-xs text-[#F7F3EA] group-hover:text-[#F4C36C]">
                      {language === 'ar' ? 'قعدة شاطئ' : 'Beach'}
                    </h5>
                    <p className="text-[12px] text-[#D2E3DE]/60">
                      {language === 'ar' ? 'شلتات مظللة باللايتهاوس' : 'Shaded sunbed dip at Lighthouse'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivityModalType('walk')}
                    className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 hover:border-[#F4C36C]/50 text-left rtl:text-right space-y-1 transition-all cursor-pointer group"
                  >
                    <span className="text-lg block">🚶</span>
                    <h5 className="font-bold text-xs text-[#F7F3EA] group-hover:text-[#F4C36C]">
                      {language === 'ar' ? 'تمشية قصيرة' : 'Short Walk'}
                    </h5>
                    <p className="text-[12px] text-[#D2E3DE]/60">
                      {language === 'ar' ? 'إطلالة بحرية عند الفنار' : 'Scenic viewpoint around the beacon'}
                    </p>
                  </button>
                </div>
              </section>
            ) : null}

            {/* D. PERSONALIZED RECOMMENDATION HEADER & CONTROLS */}
            <section
              aria-label={language === 'ar' ? 'الخطة المقترحة' : 'Suggested plan'}
              className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-5"
            >
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'ترشيح مخصص لك' : 'Personalized Recommendation'}
                  </span>
                  <h2 className="text-2xl font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'إليك الخطة المقترحة' : "Here's what we'd do"}
                  </h2>
                  <p className="text-xs text-[#D2E3DE]/70 mt-0.5 font-medium">
                    {language === 'ar' 
                      ? 'خليك قريب، افطر براحتك، وسيب وقت كافي للوصول للفندق واستلام الغرفة بدون ضغط.'
                      : 'Keep it close, grab something to eat, and leave enough time to reach your hotel comfortably.'}
                  </p>
                </div>

                {/* Edit Plan quick trigger */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    id="change-plan-top-btn"
                    onClick={() => setIsEditPlanModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#13312B] hover:bg-[#13312B]/80 text-[#D2E3DE] border border-white/10 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer font-['Outfit',sans-serif]"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#F4C36C]" />
                    <span>{language === 'ar' ? 'تعديل الخطة' : 'Change this plan'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F4C36C]">
                    {language === 'ar' ? `النشاط ${currentStepNumber} من ${totalSteps}` : `Activity ${currentStepNumber} of ${totalSteps}`}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-[#D2E3DE]/70">
                    {completedCount === totalSteps 
                      ? (language === 'ar' ? 'اكتملت جميع الأنشطة' : 'All finished')
                      : (language === 'ar' ? `متبقي ${totalSteps - completedCount}` : `${totalSteps - completedCount} remaining`)}
                  </span>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center gap-1.5">
                  {steps.map((step, idx) => (
                    <div 
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        step.isCompleted 
                          ? 'w-4 bg-emerald-500' 
                          : idx === completedCount 
                            ? 'w-6 bg-[#F4C36C]' 
                            : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Alternative Quick Recommendation Pill */}
              {planVariant === 'standard' ? (
                <div className="p-3 rounded-2xl bg-[#13312B] border border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#D2E3DE]">
                    <span className="font-semibold text-[#F7F3EA]">{language === 'ar' ? 'تخطي الفطار؟' : 'Skip breakfast?'}</span>
                    <span className="text-[#D2E3DE]/60 hidden sm:inline">{language === 'ar' ? 'نقدر نحولك لخطة رايقة تشمل قهوة + شاطئ فقط.' : 'We can switch to a relaxed Coffee + Beach timeline.'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPlanVariant('coffee-beach');
                      showToast(language === 'ar' ? 'تم التبديل لخطة قهوة + شاطئ ✓' : 'Switched to Coffee + Beach plan ✓');
                    }}
                    className="px-3 py-1 rounded-full bg-[#F4C36C] text-[#081714] font-bold text-[12px] hover:bg-[#E5B55D] transition-colors cursor-pointer whitespace-nowrap font-['Outfit',sans-serif]"
                  >
                    {language === 'ar' ? 'قهوة + شاطئ' : 'Coffee + Beach'}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#13312B] border border-[#F4C36C]/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#F7F3EA]">
                    <span className="font-semibold text-[#F4C36C]">{language === 'ar' ? 'خطة قهوة + شاطئ مفعّلة' : 'Showing Coffee + Beach Plan'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPlanVariant('standard');
                      showToast(language === 'ar' ? 'تمت استعادة الخطة القياسية بالفطار ✓' : 'Restored standard breakfast plan ✓');
                    }}
                    className="px-3 py-1 rounded-full bg-[#0E2520] border border-[#F4C36C]/40 text-[#F4C36C] font-bold text-[12px] hover:bg-[#13312B] transition-colors cursor-pointer whitespace-nowrap font-['Outfit',sans-serif]"
                  >
                    {language === 'ar' ? 'استعادة خطة الفطار' : 'Restore Standard Plan'}
                  </button>
                </div>
              )}

              {/* TIMELINE ACTIVITIES LIST */}
              <div className={`space-y-4 relative ${isRTL ? 'pr-3 sm:pr-4 before:absolute before:right-7 sm:before:right-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10' : 'pl-3 sm:pl-4 before:absolute before:left-7 sm:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10'}`}>
                {steps.map((step, idx) => {
                  const isCurrentActive = idx === completedCount && !step.isCompleted;

                  return (
                    <div 
                      key={step.id}
                      id={`timeline-card-${step.id}`}
                      className={`relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-3xl border transition-all ${
                        step.isCompleted
                          ? 'bg-[#13312B]/40 border-emerald-500/40 opacity-90'
                          : isCurrentActive
                            ? 'bg-[#13312B] border-2 border-[#F4C36C] shadow-[0_0_20px_rgba(244,195,108,0.15)] ring-1 ring-[#F4C36C]/30'
                            : 'bg-[#0E2520] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Timeline Icon / Status Bullet */}
                      <button
                        type="button"
                        onClick={() => handleToggleStepCompletion(step.id)}
                        title={step.isCompleted ? (language === 'ar' ? 'إلغاء التحديد' : 'Mark as incomplete') : (language === 'ar' ? 'تحديد كمكتمل' : 'Mark as done')}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 text-base sm:text-lg transition-all cursor-pointer shadow-2xs ${
                          step.isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrentActive
                              ? 'bg-[#F4C36C] text-[#081714] font-bold ring-4 ring-[#F4C36C]/20'
                              : 'bg-[#13312B] text-[#D2E3DE] border border-white/10'
                        }`}
                      >
                        {step.isCompleted ? (
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          <span>{step.icon}</span>
                        )}
                      </button>

                      {/* Card Content */}
                      <div className="flex-1 space-y-2">
                        {/* Time & Category Header */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-mono font-bold ${
                              step.isCompleted ? 'text-emerald-400' : isCurrentActive ? 'text-[#F4C36C]' : 'text-[#D2E3DE]/60'
                            }`}>
                              {step.time}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#D2E3DE]/70">
                              {step.duration}
                            </span>
                            {step.isCompleted && (
                              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                {language === 'ar' ? 'مكتمل ✓' : 'Completed ✓'}
                              </span>
                            )}
                            {isCurrentActive && (
                              <span className="text-[11px] font-bold text-[#F4C36C] bg-[#F4C36C]/10 border border-[#F4C36C]/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-['Outfit',sans-serif]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F4C36C] animate-pulse"></span>
                                <span>{language === 'ar' ? 'النشاط الحالي' : 'Up Next'}</span>
                              </span>
                            )}
                          </div>

                          <span className="text-[12px] font-bold text-[#F4C36C]/80 font-['Outfit',sans-serif]">
                            {step.category}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className={`text-base font-['Outfit',sans-serif] font-bold ${
                            step.isCompleted ? 'text-[#D2E3DE]/60 line-through decoration-[#D2E3DE]/40' : 'text-[#F7F3EA]'
                          }`}>
                            {step.title}
                          </h3>
                          <p className="text-xs text-[#D2E3DE]/75 leading-relaxed mt-0.5">
                            {step.desc}
                          </p>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleStepCTA(step.ctaAction)}
                            className="px-3.5 py-1.5 rounded-full bg-[#13312B] hover:bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 font-['Outfit',sans-serif]"
                          >
                            <span>{step.ctaText}</span>
                            {isRTL ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStepCompletion(step.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 font-['Outfit',sans-serif] ${
                              step.isCompleted
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950'
                                : 'bg-[#13312B] hover:bg-white/10 text-[#D2E3DE] border border-white/10'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{step.isCompleted ? (language === 'ar' ? 'مكتمل' : 'Completed') : (language === 'ar' ? 'تحديد كمكتمل' : 'Mark as Done')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TIME SAFETY REASSURANCE */}
              <div className="p-4 rounded-2xl bg-[#13312B]/60 border border-white/10 flex items-center gap-3 text-xs text-[#D2E3DE]">
                <ShieldCheck className="w-5 h-5 text-[#F4C36C] flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong className="text-[#F7F3EA]">{language === 'ar' ? 'تركنا وقتاً كافياً عشان متستعجلش.' : "We've left some extra time so you don't have to rush."}</strong>{' '}
                  {language === 'ar' 
                    ? 'الجدول يتضمن من ٣٠ إلى ٤٠ دقيقة وقت أمان مريح قبل موعد استلام غرفتك في تمام الساعة ٣:٠٠ عصراً.'
                    : 'The schedule includes an unhurried 30–40 minute buffer before your 3:00 PM check-in.'}
                </p>
              </div>

            </section>

          </div>

          {/* SECONDARY AREA (5/12 on Desktop) */}
          <aside
            className="lg:col-span-5 space-y-6"
            aria-label={language === 'ar' ? 'سياق الرحلة وتفاصيل الفندق' : 'Trip context and hotel details'}
          >

            {/* 1. HOTEL REMINDER & STAY CARD */}
            <div 
              id="first2h-hotel-stay-card"
              className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#13312B] text-[#F4C36C] flex items-center justify-center font-bold">
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="font-['Outfit',sans-serif] font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'فندق خليج دهب (Dahab Bay)' : 'Dahab Bay Hotel'}
                  </h2>
                </div>

                <span className="text-[12px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-['Outfit',sans-serif]">
                  {`${language === 'ar' ? 'الاستلام' : 'Check-in'} ${formatClock(clock.checkInAt, lang)}`}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#D2E3DE]/80">
                <div className="flex items-center justify-between">
                  <span className="text-[#D2E3DE]/50">{language === 'ar' ? 'الحالة:' : 'Status:'}</span>
                  <span className="font-bold text-amber-300">{language === 'ar' ? 'تجهيز وتنظيف الغرفة جاري' : 'Room cleaning in progress'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#D2E3DE]/50">{language === 'ar' ? 'الغرفة المحجوزة:' : 'Reserved Room:'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'ديلوكس مطلة ع البحر (فردين)' : 'Sea View Deluxe (2 Guests)'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#D2E3DE]/50">{language === 'ar' ? 'الاستقبال:' : 'Front Desk:'}</span>
                  <span className="font-semibold text-emerald-300">{language === 'ar' ? 'مفتوح ٢٤/٧ (حفظ الحقائب متاح)' : 'Open 24/7 (Luggage held)'}</span>
                </div>
              </div>

              <button
                type="button"
                id="drop-luggage-sidebar-btn"
                onClick={() => setIsLuggageModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-full bg-[#13312B] hover:bg-[#F4C36C]/10 text-xs font-bold text-[#F4C36C] border border-[#F4C36C]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-['Outfit',sans-serif]"
              >
                <Luggage className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'اتجاهات حفظ الحقائب (١٢٠م)' : 'Luggage storage directions (120m)'}</span>
              </button>
            </div>

            {/* 2. LIVE TIME BUDGET BREAKDOWN */}
            <div 
              id="first2h-time-budget-card"
              className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-['Outfit',sans-serif] font-bold text-base text-[#F7F3EA]">
                  {language === 'ar' ? 'تقسيم ساعات الصباح' : 'Morning Breakdown'}
                </h2>
                <span className="text-xs font-mono font-bold text-[#F4C36C]">
                  {`${formatClock(clock.arrivedAt, lang)} ${language === 'ar' ? '←' : '→'} ${formatClock(planEndsAt, lang)}`}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] text-[#D2E3DE]">
                  <span>🧳 {language === 'ar' ? 'حفظ الأمتعة' : 'Luggage drop & setup'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? '١٥ دقيقة' : '15 min'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] text-[#D2E3DE]">
                  <span>☕ {language === 'ar' ? 'فطار وقهوة ساحلية' : 'Breakfast & coastal coffee'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? '٤٠ دقيقة' : '40 min'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13312B] text-[#D2E3DE]">
                  <span>🏖 {language === 'ar' ? 'تمشية وقعدة شاطئ' : 'Shoreline walk & sea lounge'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? '٤٥ دقيقة' : '45 min'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                  <span className="font-bold">✨ {language === 'ar' ? 'وقت أمان قبل الاستلام' : 'Time Buffer before check-in'}</span>
                  <span className="font-bold">{language === 'ar' ? '٤٠ دقيقة (آمن تماماً)' : '40 min (Safe)'}</span>
                </div>
              </div>
            </div>

            {/* 3. COMING UP ON CONFIRMED TRIP */}
            <div 
              id="first2h-itinerary-integration-card"
              className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'النشاط القادم المؤكد' : 'Upcoming Trip Milestone'}
                </span>
                <span className="text-[12px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'مؤكد ✓' : 'Confirmed ✓'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-[#F4C36C] uppercase tracking-wider font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'غداً · ٠٩:٠٠ ص' : 'Tomorrow · 09:00 AM'}
                </span>
                <h3 className="font-bold text-sm text-[#F7F3EA]">
                  {language === 'ar' ? 'تجربة الغطس الإرشادي بالبلو هول' : 'Guided Diving Experience'}
                </h3>
                <p className="text-[#D2E3DE]/65 text-[12px]">
                  {language === 'ar' ? 'شعاب الكانيون والبلو هول · تم تأكيد مدرب الغطس ومعدات الإيجار' : 'Canyon & Blue Hole reefs · Dive master briefing confirmed'}
                </p>
              </div>

              <button
                type="button"
                onClick={onBackToMyTrip}
                className="w-full py-2 px-3 rounded-full text-xs font-semibold text-[#D2E3DE]/70 hover:text-[#F4C36C] hover:bg-[#13312B] transition-colors flex items-center justify-center gap-1 cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>{language === 'ar' ? 'عرض خطة رحلة دهب ٥ أيام' : 'View 5-Day Dahab Itinerary'}</span>
                {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* 4. LOCAL CONCIERGE HELP */}
            <div className="bg-[#0E2520] rounded-3xl p-5 border border-white/10 text-xs space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#F4C36C]" />
                <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'تحب نعدل لك أي تفصيلة؟' : 'Need anything adjusted?'}</span>
              </div>
              <p className="text-[#D2E3DE]/70 leading-relaxed text-[12px]">
                {language === 'ar' 
                  ? 'فريق دهب المحلي متواجد أونلاين لتعديل مواعيد التوصيل، إضافة معدات سنوركلينج، أو الإجابة عن أي استفسار.'
                  : 'Our local Dahab team is online to adjust pickup times, add rental gear, or answer check-in queries.'}
              </p>
              <button
                type="button"
                onClick={onOpenHelp}
                className="w-full py-2 rounded-full bg-[#13312B] hover:bg-rose-950/40 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-['Outfit',sans-serif]"
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'ar' ? 'المساعدة الآن' : 'Help Me Now'}</span>
              </button>
            </div>

          </aside>

        </div>

      </main>

      {/* MOBILE STICKY BOTTOM ACTION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E2520]/95 backdrop-blur-lg border-t border-white/10 p-3 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#F7F3EA]">
          <Building className="w-4 h-4 text-[#F4C36C]" />
          <span className="font-bold">{`${language === 'ar' ? 'الاستلام' : 'Check-in'} ${formatClock(clock.checkInAt, lang)}`}</span>
        </div>

        <button
          type="button"
          id="mobile-change-plan-btn"
          onClick={() => setIsEditPlanModalOpen(true)}
          className="py-2.5 px-4 rounded-full bg-[#F4C36C] text-[#081714] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:bg-[#E5B55D] font-['Outfit',sans-serif]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'تعديل الخطة' : 'Change plan'}</span>
        </button>
      </div>

      {/* LIGHTWEIGHT EDIT PLAN MODAL */}
      {isEditPlanModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 ${isRTL ? 'rtl' : 'ltr'}`}>
          <div 
            className="bg-[#0E2520] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="first2h-edit-plan-title"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F4C36C]" />
                <h2 id="first2h-edit-plan-title" className="text-lg font-['Outfit',sans-serif] font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'تعديل خطة أول ساعتين' : 'Change this plan'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditPlanModalOpen(false)}
                aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#D2E3DE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
              {language === 'ar' ? 'اختر النمط المناسب لمستوى طاقتك الحالي:' : 'Select an alternative morning style that matches your current energy:'}
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Standard Breakfast & Walk */}
              <button
                type="button"
                aria-pressed={planVariant === 'standard'}
                onClick={() => {
                  setPlanVariant('standard');
                  setIsEditPlanModalOpen(false);
                  showToast(language === 'ar' ? 'تم تفعيل خطة الفطار والتمشية الساحلية ✓' : 'Updated to Standard Breakfast & Walk plan ✓');
                }}
                className={`w-full text-start p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  planVariant === 'standard' ? 'border-[#F4C36C] bg-[#13312B] shadow-[0_0_15px_rgba(244,195,108,0.15)]' : 'border-white/10 bg-[#13312B]/50 hover:border-[#F4C36C]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-['Outfit',sans-serif] font-bold text-sm text-[#F7F3EA]">
                    {language === 'ar' ? 'الخطة القياسية: فطار + تمشية ساحلية' : 'Standard: Breakfast + Coastal Walk'}
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F4C36C]/10 text-[#F4C36C] border border-[#F4C36C]/30 font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'متوازنة' : 'Balanced'}
                  </span>
                </div>
                <p className="text-xs text-[#D2E3DE]/70">
                  {language === 'ar' 
                    ? 'فطار مصري كامل في شمس، قهوة مريحة، وتمشية بممشى اللايتهاوس.'
                    : 'Full Egyptian breakfast at Shams, relaxed coffee, and scenic promenade stroll.'}
                </p>
              </button>

              {/* Option 2: Coffee + Beach */}
              <button
                type="button"
                aria-pressed={planVariant === 'coffee-beach'}
                onClick={() => {
                  setPlanVariant('coffee-beach');
                  setIsEditPlanModalOpen(false);
                  showToast(language === 'ar' ? 'تم تفعيل خطة روقان القهوة والشاطئ ✓' : 'Updated to Coffee + Beach Chillout plan ✓');
                }}
                className={`w-full text-start p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  planVariant === 'coffee-beach' ? 'border-[#F4C36C] bg-[#13312B] shadow-[0_0_15px_rgba(244,195,108,0.15)]' : 'border-white/10 bg-[#13312B]/50 hover:border-[#F4C36C]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-['Outfit',sans-serif] font-bold text-sm text-[#F7F3EA]">
                    {language === 'ar' ? 'تخطي الفطار: قهوة سريعة + روقان شاطئ' : 'Skip Breakfast: Coffee + Beach Chill'}
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'استرخاء' : 'Relaxed'}
                  </span>
                </div>
                <p className="text-xs text-[#D2E3DE]/70">
                  {language === 'ar' 
                    ? 'قهوة بدوية سريعة ع البحر تليها ساعة كاملة على شلتات الشاطئ المظللة.'
                    : 'Quick spiced coffee by the reef, followed by 1 hour on shaded beach cushions.'}
                </p>
              </button>

              {/* Option 3: Direct Hotel Lounge */}
              <button
                type="button"
                onClick={() => {
                  setIsLuggageModalOpen(true);
                  setIsEditPlanModalOpen(false);
                  showToast(language === 'ar' ? 'تم اختيار التوجه للفندق وحفظ الحقائب.' : 'Hotel dropoff selected.');
                }}
                className="w-full text-start p-4 rounded-2xl border border-white/10 bg-[#13312B]/50 hover:border-[#F4C36C]/40 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-['Outfit',sans-serif] font-bold text-sm text-[#F7F3EA]">
                    {language === 'ar' ? 'أقل مجهود: تسليم الشنط واستراحة بالفندق' : 'Minimal: Drop Bags & Hotel Pool Lounge'}
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#D2E3DE]/70 font-['Outfit',sans-serif]">
                    {language === 'ar' ? 'راحة' : 'Rest'}
                  </span>
                </div>
                <p className="text-xs text-[#D2E3DE]/70">
                  {language === 'ar' 
                    ? 'سيب شنطك فوراً في الاستقبال وارتاح في فناء الفندق المظلل.'
                    : 'Drop luggage immediately at reception and rest in Dahab Bay Hotel shaded courtyard.'}
                </p>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsEditPlanModalOpen(false)}
                className="w-full py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-xs font-bold text-[#D2E3DE] border border-white/10 transition-colors cursor-pointer font-['Outfit',sans-serif]"
              >
                {language === 'ar' ? 'الإبقاء على الخطة الحالية' : 'Keep Current Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#0E2520] text-[#F7F3EA] text-xs font-bold shadow-2xl border border-[#F4C36C]/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      <LuggageStorageModal
        isOpen={isLuggageModalOpen}
        onClose={() => setIsLuggageModalOpen(false)}
        onConfirmStorage={(storageName) => {
          showToast(language === 'ar' ? `تم تأكيد حفظ الشنط في ${storageName} ✓` : `Luggage drop confirmed at ${storageName} ✓`);
          if (!completedStepIds.includes('step-1-luggage')) {
            setCompletedStepIds(prev => [...prev, 'step-1-luggage']);
          }
        }}
      />

      <ActivityOptionModal
        type={activityModalType}
        onClose={() => setActivityModalType(null)}
        onSelectAction={(actionTitle) => {
          showToast(language === 'ar' ? `تم اختيار: ${actionTitle} ✓` : `${actionTitle} selected! ✓`);
        }}
      />

    </div>
  );
};

