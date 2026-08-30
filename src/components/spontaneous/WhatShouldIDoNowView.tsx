import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  ChevronDown, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  Utensils, 
  Info, 
  X,
  Plus
} from 'lucide-react';
import { TravelerNav } from '../mytrip/TravelerNav';
import { useLanguage } from '../../i18n/LanguageContext';

interface WhatShouldIDoNowViewProps {
  onBackToMyTrip: () => void;
  onBackToCompanion?: () => void;
  onNavigateToFoodNow?: () => void;
  onExploreClick?: () => void;
  onOpenHelp?: () => void;
  onActivityAddedToTrip?: (activity: {
    id: string;
    title: string;
    time: string;
    duration: string;
    tag: string;
  }) => void;
}

export type RecommendationMood = 'chill' | 'explore' | 'adventure';

export interface SpontaneousOption {
  id: string;
  mood: RecommendationMood;
  tag: 'Chill' | 'Explore' | 'Adventure';
  tagAr: 'روقان' | 'استكشاف' | 'مغامرة';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  duration: string;
  durationAr: string;
  durationMinutes: number;
  priceLevel: 'Low' | 'Moderate';
  priceEstimate: string;
  priceEstimateAr: string;
  distance: string;
  distanceAr: string;
  distanceKm: string;
  pace: string;
  paceAr: string;
  icon: string;
  timeSlot: string;
  whyItFits: string;
  whyItFitsAr: string;
  whyThisDetailed: string;
  whyThisDetailedAr: string;
  whyItWorks: string;
  whyItWorksAr: string;
  isTightFit?: boolean;
  timeBufferMinutes?: number;
}

export const WhatShouldIDoNowView: React.FC<WhatShouldIDoNowViewProps> = ({
  onBackToMyTrip,
  onBackToCompanion,
  onNavigateToFoodNow,
  onExploreClick,
  onOpenHelp,
  onActivityAddedToTrip,
}) => {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'mytrip' | 'explore' | 'bookings' | 'profile'>('mytrip');

  // Currently selected recommendation for focused detail view
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-chill');

  // Expanded "Why this?" accordion states
  const [expandedWhyThis, setExpandedWhyThis] = useState<Record<string, boolean>>({
    'opt-chill': true,
    'opt-explore': false,
    'opt-adventure': false,
  });

  // State to simulate "No good options / low time window (< 30 min)" state
  const [isLowTimeWindowMode, setIsLowTimeWindowMode] = useState<boolean>(false);

  // Time protection modal state for tight fits (like Adventure)
  const [tightFitModalOption, setTightFitModalOption] = useState<SpontaneousOption | null>(null);

  // Success state: added activity to trip
  const [addedActivity, setAddedActivity] = useState<SpontaneousOption | null>(null);

  // Preference feedback tracking (More like this / Not my style)
  const [preferenceFeedback, setPreferenceFeedback] = useState<Record<string, 'liked' | 'disliked'>>({});

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3 Primary Curated Recommendations based on Ahmed's exact situation:
  // 11:30 AM, Diving finished early, 2h available, moderate budget, balanced pace, Lunch at 01:30 PM
  const options: SpontaneousOption[] = [
    {
      id: 'opt-chill',
      mood: 'chill',
      tag: 'Chill',
      tagAr: 'روقان',
      title: 'Lighthouse + Coffee',
      titleAr: 'قعدة قهوة وشاي ع ممشى اللايتهاوس',
      description: 'Take a relaxed walk around the Lighthouse area and stop for a coffee with a sea view.',
      descriptionAr: 'تمشية خفيفة على ممشى اللايتهاوس وقعدة شاي بالحبق أو قهوة مثلجة بإطلالة مباشرة ع البحر.',
      duration: '60–90 min (75 min)',
      durationAr: '٦٠–٩٠ دقيقة (٧٥ دقيقة)',
      durationMinutes: 75,
      priceLevel: 'Low',
      priceEstimate: 'EGP 250–400 for 2',
      priceEstimateAr: '٢٥٠–٤٠٠ ج لفردين',
      distance: 'Nearby (0.8 km)',
      distanceAr: 'قريب جداً (٨٠٠ متر)',
      distanceKm: '0.8 km',
      pace: 'Relaxed',
      paceAr: 'روقان وهدوء',
      icon: '☕',
      timeSlot: '12:00 PM – 01:15 PM',
      whyItFits: 'Perfect for your balanced pace.',
      whyItFitsAr: 'مناسب تماماً لنمط يومك الهادي بعد الغطس.',
      whyThisDetailed: "It's nearby, fits your remaining time, and won't make your day feel rushed.",
      whyThisDetailedAr: 'قريب من مكانك، يملأ الساعتين بالراحة التامة، وهيخليك جاهز لوجبة الغداء ١:٣٠ م بدون أي استعجال.',
      whyItWorks: "You'll still have enough time to reach lunch without rushing.",
      whyItWorksAr: 'هتخلص الساعة ١:١٥ م، ومعاك ١٥ دقيقة كاملة راحة قبل ميعاد الغداء المؤكد.',
      isTightFit: false,
      timeBufferMinutes: 30,
    },
    {
      id: 'opt-explore',
      mood: 'explore',
      tag: 'Explore',
      tagAr: 'استكشاف',
      title: 'Local Walk & Souk Artisans',
      titleAr: 'تمشية محلية واكتشاف حرفيي دهب',
      description: 'Explore a local area, discover small shops, and experience a different side of Dahab.',
      descriptionAr: 'لفة بين محلات الفضة البدوية، الأعشاب الجبلية، والزيوت الطبيعية في أزقة دهب الهادية.',
      duration: '60–90 min (75 min)',
      durationAr: '٦٠–٩٠ دقيقة (٧٥ دقيقة)',
      durationMinutes: 75,
      priceLevel: 'Low',
      priceEstimate: 'Free / EGP 50–150 for snacks',
      priceEstimateAr: 'مجاناً / ٥٠–١٥٠ ج للتسالي',
      distance: 'Nearby (0.5 km)',
      distanceAr: 'على بعد ٥٠٠ متر',
      distanceKm: '0.5 km',
      pace: 'Easy Stroll',
      paceAr: 'تمشية خفيفة',
      icon: '🚶',
      timeSlot: '12:00 PM – 01:15 PM',
      whyItFits: 'Easy to fit before lunch.',
      whyItFitsAr: 'مسار دائري ممتع يوصلك في النهاية لباب المطعم.',
      whyThisDetailed: "An easy-going stroll through artisan alleys that naturally loops back right next to your 1:30 PM lunch spot.",
      whyThisDetailedAr: 'مسار ممشى ومتاجر محلية لطيف بين بيوت دهب، بينتهي مباشرة عند مطعم علي بابا ع البحر.',
      whyItWorks: "You discover local hidden corners while staying within a 5-minute walk of the restaurant.",
      whyItWorksAr: 'بتستكشف طابع دهب الحقيقي وأنت على مسافة ٥ دقايق مشي بس من مكان غداك.',
      isTightFit: false,
      timeBufferMinutes: 25,
    },
    {
      id: 'opt-adventure',
      mood: 'adventure',
      tag: 'Adventure',
      tagAr: 'مغامرة',
      title: 'Snorkeling Reef Loop',
      titleAr: 'غطسة سنوركلينج سريعة في اللايتهاوس',
      description: 'Hop in for an easy shallow reef snorkel. Coral entry is right at the bay.',
      descriptionAr: 'نزلة سنوركلينج خفيفة عند طرف شعب اللايتهاوس مع رؤية ٣٠ متر وأسماك الببغاء والراي.',
      duration: '60–75 min',
      durationAr: '٦٠–٧٥ دقيقة',
      durationMinutes: 75,
      priceLevel: 'Low',
      priceEstimate: 'EGP 150 (Gear rental)',
      priceEstimateAr: '١٥٠ ج (إيجار الماسك والزعانف)',
      distance: 'On site (0.2 km)',
      distanceAr: 'في مكانك (٢٠٠ متر)',
      distanceKm: '0.2 km',
      pace: 'Active',
      paceAr: 'نشاط وحركة',
      icon: '🤿',
      timeSlot: '12:00 PM – 01:15 PM',
      whyItFits: 'High energy, close to water.',
      whyItFitsAr: 'استغلال للرؤية الممتازة ونقاء البحر النهارده.',
      whyThisDetailed: "A refreshing reef snorkel right off the shore. Finishes at 1:15 PM, leaving 15 min buffer to dry off before lunch.",
      whyThisDetailedAr: 'نزلة بحر منعشة من الشاطئ مباشرة. هتخلص ١:١٥ م، ومعاك ١٥ دقيقة للتنشيف وتغيير الهدوم قبل الغداء.',
      whyItWorks: "Takes advantage of current glassy water conditions while keeping lunch time protected.",
      whyItWorksAr: 'البحر رايق جداً وهادئ، والمطعم على بعد دقيقتين بس من الشاطئ.',
      isTightFit: true,
      timeBufferMinutes: 15,
    },
  ];

  const selectedOption = options.find(o => o.id === selectedOptionId) || options[0];

  const toggleWhyThis = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedWhyThis(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  const handleSelectOption = (option: SpontaneousOption) => {
    setSelectedOptionId(option.id);
  };

  const handleTriggerAddToTrip = (option: SpontaneousOption) => {
    if (option.isTightFit) {
      setTightFitModalOption(option);
      return;
    }

    commitAddToTrip(option);
  };

  const commitAddToTrip = (option: SpontaneousOption) => {
    setAddedActivity(option);
    setTightFitModalOption(null);
    showToast(language === 'ar' ? `تمت إضافة "${option.titleAr}" لجدول يومك بنجاح ✓` : `Added "${option.title}" to your trip ✓`);
    
    if (onActivityAddedToTrip) {
      onActivityAddedToTrip({
        id: option.id,
        title: language === 'ar' ? option.titleAr : option.title,
        time: '12:00 PM',
        duration: option.duration,
        tag: option.tag,
      });
    }
  };

  const handleFeedback = (optionId: string, type: 'liked' | 'disliked', e: React.MouseEvent) => {
    e.stopPropagation();
    setPreferenceFeedback(prev => ({ ...prev, [optionId]: type }));
    if (type === 'liked') {
      showToast(language === 'ar' ? 'تم الحفظ: سنرشح لك المزيد من الأنشطة الهادئة المشابهة ✓' : 'Saved: We will suggest more relaxed options like this ✓');
    } else {
      showToast(language === 'ar' ? 'تم الحفظ: سنضبط الترشيحات المستقبلية بعيداً عن هذا النمط' : 'Saved: We will adjust future suggestions away from this style');
    }
  };

  const handleNavigate = (tab: 'home' | 'mytrip' | 'explore' | 'bookings' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home' || tab === 'mytrip') {
      onBackToMyTrip();
    } else if (tab === 'explore' && onExploreClick) {
      onExploreClick();
    } else if (tab === 'bookings') {
      onBackToMyTrip();
    } else if (tab === 'profile') {
      showToast(language === 'ar' ? 'مسجل الدخول كـ أحمد منصور (ahmed.traveler@example.com)' : 'Logged in as Ahmed (ahmed.traveler@example.com)');
    }
  };

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Outfit',sans-serif] pb-28 md:pb-16 selection:bg-[#F4C36C]/30"
    >
      
      {/* 1. TRAVELER TOP NAVIGATION (My Trip is active) */}
      <TravelerNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenHelp={onOpenHelp}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-grow">
        
        {/* Top Breadcrumb & Quick Nav */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="back-to-companion-btn"
              onClick={onBackToCompanion || onBackToMyTrip}
              className="inline-flex items-center gap-1.5 py-3.5 -my-2 text-xs font-semibold text-[#D2E3DE]/70 hover:text-[#F4C36C] transition-colors cursor-pointer"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{language === 'ar' ? 'الرجوع للرفيق اليومي (اليوم ٢)' : 'Back to Daily Companion (Day 2)'}</span>
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              id="back-to-mytrip-overview-link"
              onClick={onBackToMyTrip}
              className="text-xs font-medium text-[#D2E3DE]/50 hover:text-white transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'الجدول الكامل' : 'Full Itinerary'}
            </button>
            {onNavigateToFoodNow && (
              <>
                <span className="text-white/20">•</span>
                <button
                  type="button"
                  id="go-to-food-now-btn"
                  onClick={onNavigateToFoodNow}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#F4C36C] hover:underline cursor-pointer"
                >
                  <Utensils className="w-3 h-3" />
                  <span>{language === 'ar' ? 'جعان؟ اطلب أكل دلوقتي ←' : 'Hungry? Food Now →'}</span>
                </button>
              </>
            )}
          </div>

          {/* Prototype Switcher: Normal 2h Window vs Low Time Window (< 30 min) */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 bg-[#0E2520] border border-white/10 p-1 rounded-full text-[12px] font-semibold text-[#D2E3DE]/80">
              <button
                type="button"
                onClick={() => {
                  setIsLowTimeWindowMode(false);
                  showToast(language === 'ar' ? 'الوضع: وقت فراغ ساعتين (٣ اختيارات متناسقة)' : 'Mode: 2h free window (3 curated options)');
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${!isLowTimeWindowMode ? 'bg-[#F4C36C] text-[#081714] font-bold shadow-md' : 'hover:text-white'}`}
              >
                {language === 'ar' ? 'ساعتين فراغ' : '2h Free Time'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLowTimeWindowMode(true);
                  showToast(language === 'ar' ? 'الوضع: وقت ضيق (< ٣٠ دقيقة) — نصيحة بالراحة' : 'Mode: Short window (< 30 min) — Low-opportunity state');
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${isLowTimeWindowMode ? 'bg-[#F4C36C] text-[#081714] font-bold shadow-md' : 'hover:text-white'}`}
              >
                {language === 'ar' ? 'وقت قصير (< ٣٠ د)' : 'Short Window (<30m)'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. PAGE HEADER */}
        <div className="space-y-4 mb-8">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13312B] text-[#F4C36C] border border-[#F4C36C]/30 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'دعم القرارات التلقائية الفورية' : 'Spontaneous Decision Support'}</span>
            </div>

            {/* Constraints Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13312B] border border-white/10 text-[#F7F3EA] shadow-xs">
                <Clock className="w-3.5 h-3.5 text-[#F4C36C]" />
                <span>{isLowTimeWindowMode ? (language === 'ar' ? 'متاح ٢٥ دقيقة' : '25 min available') : (language === 'ar' ? 'متاح ساعتين' : '2h available')}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'التالي: وجبة الغداء · ٠١:٣٠ م' : 'Next: Lunch · 1:30 PM'}</span>
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F7F3EA] tracking-tight">
              {language === 'ar' ? 'تحب تعمل إيه دلوقتي يا أحمد؟' : 'What should you do now, Ahmed?'}
            </h1>
            <p className="text-base sm:text-lg text-[#D2E3DE]/80 max-w-3xl font-medium leading-relaxed">
              {language === 'ar' 
                ? 'خلصت الغطس بدري ومعاك وقت رايق. جهزنالك بالظبط ٣ اختيارات متفصلة على مكانك والوقت الفاضي.'
                : "You finished diving early. We've found a few things that fit the exact time you have before lunch."}
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW BODY: NORMAL 2-HOUR WINDOW vs LOW-OPPORTUNITY STATE */}
        {/* ============================================================ */}

        {isLowTimeWindowMode ? (
          /* ------------------------------------------------------------ */
          /* LOW OPPORTUNITY / SHORT WINDOW STATE (< 30 min)              */
          /* ------------------------------------------------------------ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-[#0E2520] rounded-3xl p-7 sm:p-9 border border-white/10 shadow-xl space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-[#13312B] border border-[#F4C36C]/30 text-[#F4C36C] flex items-center justify-center text-2xl shadow-md">
                  ☕
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'مفيش داعي تستعجل على أي حاجة دلوقتي.' : 'Nothing worth rushing for right now.'}
                  </h2>
                  <p className="text-sm sm:text-base text-[#D2E3DE]/80 leading-relaxed">
                    {language === 'ar'
                      ? 'فاضل أقل من نصف ساعة على نشاطك التالي. الأفضل تستمتع بقعدة روقان هادية.'
                      : 'You have a short window before your next activity. We recommend keeping it easy and resting.'}
                  </p>
                </div>

                {/* 3 Low-friction easy options */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block">
                    {language === 'ar' ? 'خيارات مريحة وسريعة بدون مجهود' : 'Recommended Easy Moves'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">☕</span>
                        <h4 className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? 'شاي أو قهوة قريبة' : 'Coffee nearby'}</h4>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/70">
                        {language === 'ar' ? 'كوب شاي بالحبق على تراس شمس على بعد ٦٠ متر بس.' : 'Grab a quick mint tea at Shams terrace just 60m away.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌊</span>
                        <h4 className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? 'استرخاء ع البحر' : 'Relax by the sea'}</h4>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/70">
                        {language === 'ar' ? 'افرد جسمك على شلتة بدوية واستمتع بنسيم البحر.' : 'Unwind on a Bedouin cushion and enjoy the breeze.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🍽️</span>
                        <h4 className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? 'التحرك للغداء' : 'Head toward lunch'}</h4>
                      </div>
                      <p className="text-xs text-[#D2E3DE]/70">
                        {language === 'ar' ? 'تمشية هادية جداً في اتجاه طاولة الغداء المحجوزة.' : 'Stroll casually to your 1:30 PM waterfront table.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#D2E3DE]/50 font-medium">
                    {language === 'ar' ? 'التركيز على الراحة بدل التشتيت' : 'Relevance > Discovery Overload'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLowTimeWindowMode(false)}
                    className="text-xs font-bold text-[#F4C36C] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'عرض ترشيحات الساعتين القياسية ←' : 'View standard 2h recommendations →'}
                  </button>
                </div>
              </div>

            </div>

            {/* Sidebar Context */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block">
                    {language === 'ar' ? 'السياق الحالي' : 'Current Context'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F4C36C]">11:30 AM</span>
                </div>
                <div className="space-y-2.5 text-xs text-[#D2E3DE]/80">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/50">{language === 'ar' ? 'الموقع:' : 'Location:'}</span>
                    <span className="font-bold text-[#F7F3EA]">📍 {language === 'ar' ? 'اللايتهاوس، دهب' : 'Dahab Lighthouse'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/50">{language === 'ar' ? 'النشاط التالي:' : 'Next Activity:'}</span>
                    <span className="font-bold text-emerald-300">{language === 'ar' ? 'غداء البحر (٠١:٣٠ م)' : 'Lunch (01:30 PM)'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/50">{language === 'ar' ? 'النمط المفضل:' : 'Pace Target:'}</span>
                    <span className="font-bold text-[#F4C36C]">{language === 'ar' ? 'متوازن ومريح' : 'Balanced'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : (

          /* ------------------------------------------------------------ */
          /* STANDARD 2-HOUR WINDOW MODE                                  */
          /* ------------------------------------------------------------ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN COLUMN: 3 CURATED CHOICES */}
            <div className="lg:col-span-7 space-y-6">

              {/* Added to trip confirmation banner if active */}
              {addedActivity && (
                <div 
                  id="added-activity-success-banner"
                  className="bg-[#13312B] border-2 border-emerald-500/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-[#081714] flex items-center justify-center text-xl font-bold shadow-md">
                        ✓
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 block">
                          {language === 'ar' ? 'تم تحديث الجدول' : 'Trip Updated'}
                        </span>
                        <h3 className="text-lg font-serif font-bold text-[#F7F3EA]">
                          {language === 'ar' ? 'اتضافت لجدول رحلتك بنجاح ✓' : 'Added to your trip ✓'}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAddedActivity(null)}
                      className="text-[#D2E3DE]/60 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#D2E3DE] leading-relaxed font-medium">
                    <strong>{language === 'ar' ? addedActivity.titleAr : addedActivity.title}</strong> {language === 'ar' ? 'اتضافت لجدولك الساعة ١٢:٠٠ ظهراً، وهتخلص ١:١٥ م قبل ميعاد غداك بـ ١٥ دقيقة كاملة.' : 'has been added to your schedule at 12:00 PM. You will finish by 1:15 PM with ample time before your 1:30 PM lunch.'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={onBackToCompanion || onBackToMyTrip}
                      className="px-4 py-2 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      {language === 'ar' ? 'عرض في الرفيق اليومي ←' : 'View in Daily Companion →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddedActivity(null)}
                      className="text-xs font-semibold text-[#F4C36C] hover:underline cursor-pointer"
                    >
                      {language === 'ar' ? 'اختيار نشاط تاني بداله' : 'Pick another option instead'}
                    </button>
                  </div>
                </div>
              )}

              {/* 3 RECOMMENDATION CHOICES */}
              <section id="three-recommendations-section" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block">
                      {language === 'ar' ? 'ترشيحات متوافقة مع وقتك ومكانك' : 'Contextual Decision Support'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA]">
                      {language === 'ar' ? '٣ اختيارات تناسبك دلوقتي بالظبط' : '3 Choices for Right Now'}
                    </h2>
                  </div>

                  <span className="text-xs text-[#D2E3DE]/50 font-medium">
                    {language === 'ar' ? 'مرتبة حسب أولوياتك' : 'Ranked for you'}
                  </span>
                </div>

                {/* The 3 Cards */}
                <div className="space-y-4">
                  {options.map((option, idx) => {
                    const isSelected = selectedOptionId === option.id;
                    const isWhyExpanded = !!expandedWhyThis[option.id];
                    const feedback = preferenceFeedback[option.id];
                    const isAdded = addedActivity?.id === option.id;

                    return (
                      <div
                        key={option.id}
                        id={`recommendation-card-${option.id}`}
                        onClick={() => handleSelectOption(option)}
                        className={`bg-[#0E2520] rounded-3xl p-5 sm:p-6 border transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'border-2 border-[#F4C36C] shadow-[0_0_25px_rgba(244,195,108,0.15)] ring-1 ring-[#F4C36C]/30 bg-[#13312B]'
                            : 'border-white/10 shadow-xl hover:border-white/20'
                        }`}
                      >
                        {/* Card Header & Tag Pill */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            {/* Mood Tag */}
                            <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full ${
                              option.mood === 'chill'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : option.mood === 'explore'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {language === 'ar' ? `الخيار ${idx + 1} — ${option.tagAr}` : `Option ${idx + 1} — ${option.tag}`}
                            </span>

                            {idx === 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F4C36C] bg-[#0E2520] border border-[#F4C36C]/30 px-2.5 py-0.5 rounded-full">
                                <Sparkles className="w-3 h-3 text-[#F4C36C]" />
                                <span>{language === 'ar' ? 'الأكثر ملاءمة' : 'Top Pick'}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#F4C36C]">
                              {language === 'ar' ? option.durationAr : option.duration}
                            </span>
                            <span className="text-white/20 text-xs">•</span>
                            <span className="text-xs text-[#D2E3DE]/70 font-medium">
                              {language === 'ar' ? option.distanceAr : option.distance}
                            </span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="py-3.5 flex items-start gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-md ${
                            isSelected ? 'bg-[#F4C36C] text-[#081714]' : 'bg-[#13312B] text-[#F7F3EA] border border-white/10'
                          }`}>
                            <span>{option.icon}</span>
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F7F3EA]">
                                {language === 'ar' ? option.titleAr : option.title}
                              </h3>
                              <span className="text-xs font-bold text-[#F4C36C]">
                                {language === 'ar' ? option.priceEstimateAr : option.priceEstimate}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#D2E3DE]/80 leading-relaxed">
                              {language === 'ar' ? option.descriptionAr : option.description}
                            </p>
                          </div>
                        </div>

                        {/* Why it fits pill */}
                        <div className="p-2.5 rounded-2xl bg-[#081714]/60 border border-white/5 flex items-center justify-between text-xs">
                          <span className="text-[#D2E3DE]/80 font-medium">
                            <strong className="text-[#F4C36C]">{language === 'ar' ? 'ليه متفصلة ليك:' : 'Why it fits:'}</strong> {language === 'ar' ? option.whyItFitsAr : option.whyItFits}
                          </span>
                        </div>

                        {/* "Why This?" Expandable explanation */}
                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={(e) => toggleWhyThis(option.id, e)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F4C36C] hover:text-[#E5B55D] cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'تفاصيل التوافق الزمني' : 'Why this?'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isWhyExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          {isWhyExpanded && (
                            <div className="mt-2 p-3.5 rounded-2xl bg-[#081714]/80 border border-white/10 text-xs text-[#D2E3DE] leading-relaxed animate-in fade-in duration-150 space-y-1">
                              <p>{language === 'ar' ? option.whyThisDetailedAr : option.whyThisDetailed}</p>
                              {option.isTightFit && (
                                <p className="text-amber-300 font-semibold pt-1">
                                  ⏱ {language === 'ar' ? 'ملاحظة: النشاط بينتهي ٠١:١٥ م، وبيسيب ١٥ دقيقة راحة للوصول لطاولة الغداء.' : '⏱ Note: Finishes at 1:15 PM, leaving 15 min to reach your 1:30 PM lunch.'}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Bar & CTA */}
                        <div className="pt-4 border-t border-white/10 mt-3 flex flex-wrap items-center justify-between gap-3">
                          {/* Basic Preference Feedback Buttons */}
                          <div className="flex items-center gap-1.5 text-xs text-[#D2E3DE]/60">
                            <span className="text-[12px]">{language === 'ar' ? 'رأيك:' : 'Feedback:'}</span>
                            <button
                              type="button"
                              id={`feedback-more-${option.id}`}
                              onClick={(e) => handleFeedback(option.id, 'liked', e)}
                              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                feedback === 'liked'
                                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                                  : 'hover:bg-white/10 text-[#D2E3DE]/60'
                              }`}
                              title={language === 'ar' ? 'عايز حاجات شبه دي' : 'More like this'}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              id={`feedback-less-${option.id}`}
                              onClick={(e) => handleFeedback(option.id, 'disliked', e)}
                              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                feedback === 'disliked'
                                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                                  : 'hover:bg-white/10 text-[#D2E3DE]/60'
                              }`}
                              title={language === 'ar' ? 'مش ذوقي' : 'Not my style'}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Primary CTA */}
                          <div className="flex items-center gap-2">
                            {isAdded ? (
                              <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{language === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓'}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                id={`choose-option-btn-${option.mood}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectOption(option);
                                  handleTriggerAddToTrip(option);
                                }}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714]'
                                    : 'bg-[#13312B] hover:bg-white/10 text-[#F4C36C] border border-[#F4C36C]/30'
                                }`}
                              >
                                <span>{language === 'ar' ? `اختر ${option.tagAr}` : `Choose ${option.tag}`}</span>
                                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </section>

              {/* FOCUSED ACTIVITY DETAIL VIEW */}
              <section 
                id="selected-activity-detail-card"
                className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block">
                      {language === 'ar' ? 'تفاصيل النشاط المحدد' : 'Activity Details'}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#F7F3EA]">
                      {language === 'ar' ? selectedOption.titleAr : selectedOption.title}
                    </h3>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedOption.mood === 'chill'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : selectedOption.mood === 'explore'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {language === 'ar' ? `نمط ${selectedOption.tagAr}` : `${selectedOption.tag} Mode`}
                  </span>
                </div>

                {/* 5 Key Attribute Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/5 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block">{language === 'ar' ? 'المدة' : 'Duration'}</span>
                    <span className="font-bold text-sm text-[#F7F3EA]">{selectedOption.durationMinutes} min</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/5 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block">{language === 'ar' ? 'المسافة' : 'Distance'}</span>
                    <span className="font-bold text-sm text-[#F7F3EA]">{selectedOption.distanceKm}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/5 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block">{language === 'ar' ? 'التكلفة' : 'Est. Cost'}</span>
                    <span className="font-bold text-xs text-[#F4C36C]">{language === 'ar' ? selectedOption.priceEstimateAr : selectedOption.priceEstimate}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/5 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block">{language === 'ar' ? 'أفضل وقت' : 'Best Time'}</span>
                    <span className="font-bold text-sm text-emerald-300">{language === 'ar' ? 'دلوقتي' : 'Now'}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#13312B] border border-white/5 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[11px] uppercase font-bold text-[#D2E3DE]/50 block">{language === 'ar' ? 'الإيقاع' : 'Pace'}</span>
                    <span className="font-bold text-sm text-[#F4C36C]">{language === 'ar' ? selectedOption.paceAr : selectedOption.pace}</span>
                  </div>
                </div>

                {/* "Why it works" Block */}
                <div className="p-4 rounded-2xl bg-[#13312B] border border-emerald-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'ar' ? 'لماذا يناسب جدولك تماماً' : 'Why it works'}</span>
                  </div>
                  <p className="text-[#D2E3DE] leading-relaxed font-medium">
                    {language === 'ar' ? selectedOption.whyItWorksAr : selectedOption.whyItWorks}
                  </p>
                </div>

                {/* Proposed Schedule Preview */}
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block">
                    {language === 'ar' ? 'مسار الجدول المقترح' : 'Updated Schedule Flow'}
                  </span>
                  
                  <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[#D2E3DE]/60">
                      <span>11:30 AM</span>
                      <span className="font-semibold text-emerald-300 flex items-center gap-1">
                        {language === 'ar' ? 'تجربة الغطس' : 'Diving Experience'} <Check className="w-3.5 h-3.5" /> ({language === 'ar' ? 'انتهت بدري' : 'Finished early'})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#F7F3EA] font-bold py-1 border-y border-white/10">
                      <span className="text-[#F4C36C]">12:00 PM</span>
                      <span className="text-[#F4C36C] flex items-center gap-1">
                        <span>{selectedOption.icon}</span>
                        <span>{language === 'ar' ? selectedOption.titleAr : selectedOption.title} ({language === 'ar' ? 'مقترح' : 'Proposed'})</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#D2E3DE]">
                      <span>01:30 PM</span>
                      <span className="font-semibold text-[#F7F3EA]">
                        🍽️ {language === 'ar' ? 'غداء البحر في علي بابا (مؤكد)' : 'Lunch by the Bay (Confirmed)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary CTAs */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      showToast(language === 'ar' ? 'تم تخطي الترشيح' : 'Selection dismissed');
                    }}
                    className="text-xs font-semibold text-[#D2E3DE]/60 hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'مش دلوقتي' : 'Not now'}
                  </button>

                  <button
                    type="button"
                    id="add-to-my-trip-main-btn"
                    onClick={() => handleTriggerAddToTrip(selectedOption)}
                    className="px-6 py-3 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إضافة إلى جدول رحلتي' : 'Add to My Trip'}</span>
                  </button>
                </div>
              </section>

            </div>

            {/* SECONDARY COLUMN (5/12): CONTEXT CARD + SCHEDULE + MAP */}
            <div className="lg:col-span-5 space-y-6">

              {/* 1. COMPACT "RIGHT NOW" CONTEXT CARD */}
              <div 
                id="current-context-card"
                className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="font-serif font-bold text-base text-[#F7F3EA]">
                      {language === 'ar' ? 'سياقك اللحظي' : 'Right Now'}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#F4C36C] bg-[#13312B] border border-[#F4C36C]/30 px-2.5 py-0.5 rounded-full">
                    11:30 AM
                  </span>
                </div>

                {/* 5 Context Rows */}
                <div className="space-y-2.5 text-xs text-[#D2E3DE]/80">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F4C36C]" />
                      <span>{language === 'ar' ? 'الموقع' : 'Location'}</span>
                    </span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'قرب شاطئ اللايتهاوس' : 'Near Dahab Lighthouse'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#F4C36C]" />
                      <span>{language === 'ar' ? 'الوقت المتاح' : 'Available Time'}</span>
                    </span>
                    <span className="font-bold text-[#F4C36C]">{language === 'ar' ? 'ساعتين تقريباً' : 'Approx. 2 hours'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">💰 {language === 'ar' ? 'الميزانية' : 'Budget'}</span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'متوسطة' : 'Moderate'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">🎯 {language === 'ar' ? 'الاهتمامات' : 'Interests'}</span>
                    <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'غطس · مغامرة · أكل رايق' : 'Diving · Adventure · Food'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#13312B] border border-white/5">
                    <span className="text-[#D2E3DE]/60">⚖️ {language === 'ar' ? 'الإيقاع' : 'Pace'}</span>
                    <span className="font-bold text-[#F4C36C]">{language === 'ar' ? 'متوازن ومرن' : 'Balanced pace'}</span>
                  </div>
                </div>

                {/* Reassurance text */}
                <p className="text-[12px] text-[#D2E3DE]/60 leading-relaxed italic text-center pt-1">
                  {language === 'ar'
                    ? 'الترشيحات مفلترة حسب مكانك الحالي، راحة ما بعد الغطس، وميعاد غداء الساعة ١:٣٠ م.'
                    : 'Recommendations filtered by your current position, morning dive recovery, and upcoming 1:30 PM lunch.'}
                </p>
              </div>

              {/* 2. TIME PROTECTION CARD */}
              <div 
                id="next-planned-activity-card"
                className="bg-[#0E2520] rounded-3xl p-6 border-2 border-emerald-500/40 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-serif font-bold text-base text-[#F7F3EA]">
                      {language === 'ar' ? 'النشاط القادم المحمي' : 'Next Scheduled Activity'}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {language === 'ar' ? 'محمي ومؤكد' : 'Protected'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#13312B] border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {language === 'ar' ? '٠١:٣٠ م (بعد ساعتين)' : '01:30 PM (in 2 hours)'}
                    </span>
                    <h4 className="font-bold text-sm text-[#F7F3EA]">
                      {language === 'ar' ? 'غداء الوداع ع البحر' : 'Lunch by the Bay'}
                    </h4>
                    <p className="text-xs text-[#D2E3DE]/70">
                      {language === 'ar' ? 'علي بابا للأسماك والمقبلات البدوية' : 'Ali Baba Seafood & Bedouin Mezze'}
                    </p>
                  </div>
                  <span className="text-2xl">🍽️</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#081714]/60 border border-white/5 space-y-1 text-xs text-[#D2E3DE]/80">
                  <div className="flex items-center gap-1.5 text-[#F4C36C] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F4C36C]" />
                    <span>{language === 'ar' ? 'نظام حماية التوقيت مفعّل' : 'Time Protection Active'}</span>
                  </div>
                  <p>
                    {language === 'ar'
                      ? 'جميع الخيارات تنتهي قبل الساعة ٠١:١٥ م لتضمن وصولك لغدائك بكل راحة وهدوء.'
                      : 'All recommendations are calculated to finish before 1:15 PM so your lunch remains relaxed and on time.'}
                  </p>
                </div>
              </div>

              {/* 3. LIGHTWEIGHT ORIENTATION MAP PREVIEW */}
              <div 
                id="orientation-map-preview-card"
                className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F4C36C]" />
                    <h4 className="font-serif font-bold text-sm text-[#F7F3EA]">
                      {language === 'ar' ? 'الخريطة القريبة منك' : 'Near You (Orientation)'}
                    </h4>
                  </div>
                  <span className="text-[12px] text-[#D2E3DE]/50 font-medium">
                    {language === 'ar' ? 'خليج اللايتهاوس' : 'Lighthouse Bay'}
                  </span>
                </div>

                {/* Stylized lightweight schematic map */}
                <div className="h-44 rounded-2xl bg-[#081714] border border-white/10 relative overflow-hidden flex flex-col justify-between p-3">
                  {/* Sea background representation */}
                  <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-[#13312B]/80 border-l border-teal-500/20 flex items-center justify-center">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-300/60 rotate-90">
                      {language === 'ar' ? 'البحر الأحمر' : 'Red Sea (Bay)'}
                    </span>
                  </div>

                  {/* You are here marker */}
                  <div className="relative z-10 inline-flex items-center gap-1 bg-[#13312B] text-[#F7F3EA] border border-white/10 px-2 py-1 rounded-full text-[11px] font-bold shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{language === 'ar' ? 'مكانك الآن (١١:٣٠ ص)' : 'You are here (11:30 AM)'}</span>
                  </div>

                  {/* Landmarks representation */}
                  <div className="relative z-10 space-y-1 text-[11px]">
                    <div className="inline-flex items-center gap-1 bg-[#0E2520] border border-white/10 px-2 py-0.5 rounded-md font-bold text-[#F7F3EA] shadow-sm">
                      <span>☕ {language === 'ar' ? 'كافيه اللايتهاوس (٨٠٠م)' : 'Lighthouse Cafe (0.8km)'}</span>
                    </div>
                    <br />
                    <div className="inline-flex items-center gap-1 bg-[#0E2520] border border-white/10 px-2 py-0.5 rounded-md font-bold text-[#F7F3EA] shadow-sm">
                      <span>🍽️ {language === 'ar' ? 'علي بابا (غداء · ٠١:٣٠ م)' : 'Ali Baba (Lunch · 1:30 PM)'}</span>
                    </div>
                  </div>

                  <div className="relative z-10 text-[11px] text-[#D2E3DE]/60 bg-[#0E2520]/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/5 self-start">
                    {language === 'ar' ? 'جميع الخيارات على بُعد ٥–١٠ دقائق مشي' : 'All options within 5–10 min walking radius'}
                  </div>
                </div>
              </div>

            </div>

          </div>

        )}

      </main>

      {/* ============================================================ */}
      {/* TIME PROTECTION CONFIRMATION MODAL (For Adventure Option)    */}
      {/* ============================================================ */}
      {tightFitModalOption && (
        <div 
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            className="bg-[#0E2520] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-serif font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'النشاط مناسب لكن وقته أضيق شوية' : "This fits, but it'll be a little tighter."}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTightFitModalOption(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#D2E3DE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#D2E3DE]/80">
              <p className="leading-relaxed">
                {language === 'ar' 
                  ? `أنت اخترت ${tightFitModalOption.titleAr}. ده هيكون تسلسل الوقت:`
                  : `You selected ${tightFitModalOption.title}. Here is how the timeline will look:`}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                <div className="flex items-center justify-between font-bold text-[#F7F3EA]">
                  <span>🤿 {language === 'ar' ? 'السنوركلينج' : 'Snorkeling'}</span>
                  <span className="font-mono text-[#F4C36C]">12:00 PM – 01:15 PM</span>
                </div>
                <div className="flex items-center justify-between font-bold text-emerald-300 pt-1 border-t border-white/10">
                  <span>🍽️ {language === 'ar' ? 'غداء البحر' : 'Lunch by the Bay'}</span>
                  <span className="font-mono text-emerald-300">01:30 PM</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <span className="font-bold block">⏱ {language === 'ar' ? 'فارق الوقت: ١٥ دقيقة' : 'Buffer: 15 minutes'}</span>
                <p className="text-[12px] leading-relaxed pt-0.5 text-amber-200/90">
                  {language === 'ar' ? 'هيكون معاك حوالي ١٥ دقيقة لتغيير الهدوم والوصول لمكان الغداء.' : "You'll have about 15 minutes to dry off and get to your lunch table."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                id="add-anyway-btn"
                onClick={() => commitAddToTrip(tightFitModalOption)}
                className="w-full sm:flex-1 py-2.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إضافة على أي حال' : 'Add Anyway'}
              </button>

              <button
                type="button"
                id="choose-something-easier-btn"
                onClick={() => {
                  setTightFitModalOption(null);
                  setSelectedOptionId('opt-chill');
                }}
                className="w-full sm:flex-1 py-2.5 rounded-full bg-[#13312B] hover:bg-white/10 text-[#F7F3EA] font-bold text-xs border border-white/10 transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'اختيار نشاط أهدى' : 'Choose Something Easier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 bg-[#0E2520] text-[#F7F3EA] border border-white/10 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-2 duration-150 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F4C36C] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
