import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Coffee,
  Waves,
  Sun,
  UtensilsCrossed,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Plus,
  RefreshCw,
  Zap,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { TimelineActivity } from '../../types';

interface AiDirectorFlowStep {
  id: string;
  time: string;
  icon: string;
  title: string;
  titleAr: string;
  location: string;
  locationAr: string;
  duration: string;
  durationAr: string;
  costEGP: number;
  description: string;
  descriptionAr: string;
}

interface AiDirectorFlow {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  totalTime: string;
  totalTimeAr: string;
  totalCostEGP: number;
  highlight: string;
  highlightAr: string;
  steps: AiDirectorFlowStep[];
}

export const AiDirectorView: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { addActivityToDay, showToast, navigateTo } = useTrip();
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(0);

  const curatedFlows: AiDirectorFlow[] = [
    {
      id: 'flow-relax-lighthouse',
      title: 'Unhurried Sunset & Seaside Dining at Lighthouse',
      titleAr: 'ظهيرة استرخاء وغروب ساحر مع عشاء بحري باللايتهاوس',
      category: 'Relaxation & Food',
      categoryAr: 'استرخاء ومأكولات',
      totalTime: '3.5 Hours',
      totalTimeAr: '٣.٥ ساعات',
      totalCostEGP: 480,
      highlight: 'Best for golden hour relaxation without transportation hassle.',
      highlightAr: 'المسار الأمثل لاسترخاء ساعة الغروب دون الحاجة لمواصلات.',
      steps: [
        {
          id: 'step-1',
          time: '03:30 PM',
          icon: '☕',
          title: "Ralph's German Bakery Coffee & Apple Strudel",
          titleAr: 'قهوة وفطيرة تفاح طازجة في رالفز بيكري',
          location: 'Mashraba, Dahab',
          locationAr: 'المشربة، دهب',
          duration: '45 mins',
          durationAr: '٤٥ دقيقة',
          costEGP: 160,
          description: 'Specialty roasted espresso and warm cinnamon pastries on a quiet shaded terrace.',
          descriptionAr: 'قهوة مميزة مع مخبوزات القرفة في جلسة خارجية هادئة ومظللة.',
        },
        {
          id: 'step-2',
          time: '04:30 PM',
          icon: '🏖',
          title: 'Lighthouse Beach Lounging & Light Snorkel',
          titleAr: 'جلسة شاطئية وسنوركلينج خفيف على شعاب اللايتهاوس',
          location: 'Lighthouse Promenade',
          locationAr: 'ممشى اللايتهاوس',
          duration: '1 hour',
          durationAr: 'ساعة كاملة',
          costEGP: 0,
          description: 'Protected shallow reef teeming with parrotfish and crystal turquoise water.',
          descriptionAr: 'شعاب مرجانية محمية قريبة من الشاطئ مليئة بالأسماك الملونة والمياه الصافية.',
        },
        {
          id: 'step-3',
          time: '05:45 PM',
          icon: '🌅',
          title: 'Habak Bedouin Sunset Tea on Seafront Cushions',
          titleAr: 'شاي بدوي بالحبق على وسائد الشاطئ لمشاهدة الغروب',
          location: 'Everyday Cafe Terrace',
          locationAr: 'تراس إيفري داي كافيه',
          duration: '45 mins',
          durationAr: '٤٥ دقيقة',
          costEGP: 60,
          description: 'Watch the Sinai mountain range turn crimson-pink over the Gulf of Aqaba.',
          descriptionAr: 'مشهد تحول جبال سيناء للون الوردي وانعكاس الشفق على خليج العقبة.',
        },
        {
          id: 'step-4',
          time: '06:45 PM',
          icon: '🍽',
          title: 'Fresh Catch Seafood Dinner at Ali Baba',
          titleAr: 'عشاء سمك طازج وطواجن بحرية في مطعم علي بابا',
          location: 'Mashraba Waterfront',
          locationAr: 'كورنيش المشربة',
          duration: '1 hour',
          durationAr: 'ساعة كاملة',
          costEGP: 260,
          description: 'Grilled Red Sea sea-bass with tahina, sayadiya rice, and garlic herbs.',
          descriptionAr: 'سمك قاروص مشوي على الفحم مع أرز صيادية وطحينة وسلطات سيناوية طازجة.',
        },
      ],
    },
    {
      id: 'flow-canyon-bedouin',
      title: 'Deep Canyon Reef Dive & Bedouin Valley Campfire',
      titleAr: 'مغامرة غوص الكانيون وسهرة عشاء بدوي في الوادي',
      category: 'Adventure & Culture',
      categoryAr: 'مغامرة وتراث',
      totalTime: '5 Hours',
      totalTimeAr: '٥ ساعات',
      totalCostEGP: 950,
      highlight: 'Combines iconic underwater topography with authentic desert warmth.',
      highlightAr: 'يجمع بين عجائب أعماق البحر وسحر السهرات البدوية تحت النجوم.',
      steps: [
        {
          id: 'step-b1',
          time: '09:00 AM',
          icon: '🤿',
          title: 'The Canyon Guided Dive & Fish Bowl Reef',
          titleAr: 'غطسة استكشافية في فوهة الكانيون والشعاب',
          location: 'The Canyon, Dahab',
          locationAr: 'الكانيون، دهب',
          duration: '2 hours',
          durationAr: 'ساعتان',
          costEGP: 550,
          description: 'Dive through the magnificent natural rock rift down to 22m depth.',
          descriptionAr: 'النزول داخل الشق الصخري الطبيعي المبهر حتى عمق ٢٢ متراً مع المرشد.',
        },
        {
          id: 'step-b2',
          time: '02:00 PM',
          icon: '🍲',
          title: 'Local Fish Tagine & Fresh Mango Juice in Assala',
          titleAr: 'طاجن سمك بلدي وعصير مانجو طبيعي بالعصلة',
          location: 'Al Fanar Kitchen, Assala',
          locationAr: 'مطعم الفنار، العصلة',
          duration: '1.5 hours',
          durationAr: 'ساعة ونصف',
          costEGP: 180,
          description: 'Authentic local diner serving wood-fired tagines with freshly baked Bedouin bread.',
          descriptionAr: 'طواجن فخار بلدي مطهوة على نار الحطب مع عيش فراشيح طازج.',
        },
        {
          id: 'step-b3',
          time: '07:30 PM',
          icon: '✨',
          title: 'Wadi Gnai Stargazing & Bedouin Zarb Dinner',
          titleAr: 'سهرة مراقبة النجوم وعشاء الزرب في وادي قني',
          location: 'Wadi Gnai Desert Oasis',
          locationAr: 'واحة وادي قني',
          duration: '3 hours',
          durationAr: '٣ ساعات',
          costEGP: 220,
          description: 'Traditional slow-cooked underground dinner with live Bedouin lute music.',
          descriptionAr: 'عشاء الزرب المدفون تحت الرمال مع أنغام السمسمية وتأمل مجرة درب التبانة.',
        },
      ],
    },
    {
      id: 'flow-abu-galum-lagoon',
      title: 'Ras Abu Galum Camel Trek & Blue Lagoon Escape',
      titleAr: 'رحلة جمال محمية رأس أبو جالوم والاستجمام بالبلو لاجون',
      category: 'Untouched Wilderness',
      categoryAr: 'محميات وطبيعة بكر',
      totalTime: '7 Hours',
      totalTimeAr: '٧ ساعات',
      totalCostEGP: 850,
      highlight: 'Coastal cliff trail by camel or boat into off-grid turquoise waters.',
      highlightAr: 'ممر جبلي ساحلي بالجمال أو اللنش لمياه البلو لاجون الفيروزية الساحرة.',
      steps: [
        {
          id: 'step-c1',
          time: '09:00 AM',
          icon: '🐪',
          title: 'Blue Hole to Abu Galum Coastal Camel Trek',
          titleAr: 'ركوب الجمال بمحاذاة الشاطئ من البلو هول إلى رأس أبو جالوم',
          location: 'Ras Abu Galum Trail',
          locationAr: 'مضيق رأس أبو جالوم البحري',
          duration: '1.5 hours',
          durationAr: 'ساعة ونصف',
          costEGP: 300,
          description: 'Scenic cliffside ride between dramatic granite peaks and open Red Sea azure.',
          descriptionAr: 'مسار ساحلي خلاب بين جبال الجرانيت العالية ومياه البحر الأحمر الصافية.',
        },
        {
          id: 'step-c2',
          time: '11:30 AM',
          icon: '🌊',
          title: 'Blue Lagoon Flat-Water Swim & Kitesurf Watch',
          titleAr: 'سباحة في مياه البلو لاجون الفيروزية ومشاهدة الشراع',
          location: 'Blue Lagoon Bedouin Camp',
          locationAr: 'مخيمات البلو لاجون',
          duration: '2.5 hours',
          durationAr: 'ساعتان ونصف',
          costEGP: 0,
          description: 'Pristine, crystal-clear shallow lagoon with zero crowds or boat engines.',
          descriptionAr: 'بحيرة شاطئية بكر نقية خالية من أي محركات، مثالية للسباحة والاستجمام.',
        },
        {
          id: 'step-c3',
          time: '02:00 PM',
          icon: '🐟',
          title: 'Fresh Catch Bedouin Beach Grill & Sage Tea',
          titleAr: 'غداء سمك طازج مشوي على الحطب وشاي بالميرمية',
          location: 'Abu Galum Bedouin Huts',
          locationAr: 'عشش أبو جالوم البدوية',
          duration: '1.5 hours',
          durationAr: 'ساعة ونصف',
          costEGP: 250,
          description: 'Fresh grilled sea bream with rice, sesame salad, and traditional herbal tea.',
          descriptionAr: 'سمك دنيس طازج مشوي مع أرز وسلطات وشاي ميرمية بدوي أصيل.',
        },
      ],
    },
    {
      id: 'flow-st-catherine-sunrise',
      title: 'Mount Sinai Midnight Pilgrimage & St. Catherine',
      titleAr: 'صعود جبل موسى فجراً وزيارة دير سانت كاترين',
      category: 'Historic Summit',
      categoryAr: 'تراث وقمم جبلية',
      totalTime: '10 Hours',
      totalTimeAr: '١٠ ساعات',
      totalCostEGP: 1200,
      highlight: 'Witness spiritual sunrise atop 2,285m Sinai peak followed by 6th-century monastery.',
      highlightAr: 'مشاهدة شروق الشمس التاريخي من قمة جبل موسى ثم زيارة أقدم دير مأهول في العالم.',
      steps: [
        {
          id: 'step-d1',
          time: '01:30 AM',
          icon: '🚐',
          title: 'Midnight Transfer to Mount Sinai Base',
          titleAr: 'انطلاق حافلة ليلية من دهب إلى سفح جبل موسى',
          location: 'Sinai Highway to Catherine',
          locationAr: 'طريق سانت كاترين الدولي',
          duration: '2 hours',
          durationAr: 'ساعتان',
          costEGP: 400,
          description: 'Comfortable air-conditioned private transfer across south Sinai desert valleys.',
          descriptionAr: 'انتقال مريح عبر الوديان الصحراوية إلى نقطة بدء الصعود.',
        },
        {
          id: 'step-d2',
          time: '03:45 AM',
          icon: '🏔️',
          title: 'Guided Summit Trek & 2,285m Sunrise View',
          titleAr: 'صعود الجبل مع الدليل البدوي ومشاهدة شروق الشمس',
          location: 'Mount Sinai Summit (Jebel Musa)',
          locationAr: 'قمة جبل موسى',
          duration: '3.5 hours',
          durationAr: '٣.٥ ساعات',
          costEGP: 350,
          description: 'Ascend the historic Camel Path and 750 Steps of Repentance for panoramic sunrise.',
          descriptionAr: 'صعود طريق الجمال ودرجات التوبة التاريخية لرؤية شروق الشمس الاستثنائي.',
        },
        {
          id: 'step-d3',
          time: '08:30 AM',
          icon: '⛪',
          title: 'St. Catherine UNESCO Monastery & Burning Bush',
          titleAr: 'زيارة دير سانت كاترين والشجرة العليقة المقدسة',
          location: 'St. Catherine Monastery',
          locationAr: 'دير سانت كاترين',
          duration: '2 hours',
          durationAr: 'ساعتان',
          costEGP: 150,
          description: 'Explore the 6th-century library, ancient icons, and the sacred Burning Bush.',
          descriptionAr: 'جولة داخل أروقة الدير، شجرة العليقة، ومتحف المخطوطات والرموز التاريخية.',
        },
      ],
    },
  ];

  const currentFlow = curatedFlows[selectedFlowIndex];

  const handleAddAllToItinerary = () => {
    currentFlow.steps.forEach((step, idx) => {
      const newAct: TimelineActivity = {
        id: `director-act-${Date.now()}-${idx}`,
        time: step.time,
        title: language === 'ar' ? step.titleAr : step.title,
        type: 'Activity',
        status: 'Added ✓',
        location: language === 'ar' ? step.locationAr : step.location,
        duration: language === 'ar' ? step.durationAr : step.duration,
        priceEGP: step.costEGP,
        notes: language === 'ar' ? step.descriptionAr : step.description,
      };
      addActivityToDay(2, newAct);
    });
    showToast(
      language === 'ar'
        ? `تم إضافة كامل المسار (${currentFlow.steps.length} أنشطة) إلى جدول اليوم الثاني!`
        : `Added full 3-step flow to Day 2 Itinerary!`
    );
    navigateTo('/my-trip', { dayId: 2 });
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-slate-950 pb-28 md:pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-[#071417] via-[#0E252C] to-[#FAF8F5] text-white pt-10 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'مخرج الرحلة الذكي الخاص بك' : 'VISUAL AI TRIP DIRECTOR'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
                {t('director.title')}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                {t('director.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFlowIndex((prev) => (prev === 0 ? 1 : 0))}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15 cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تغيير نموذج المسار' : 'Switch Flow Model'}</span>
              </button>
            </div>
          </div>

          {/* Curated Flow Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2">
            {curatedFlows.map((flow, idx) => (
              <button
                key={flow.id}
                type="button"
                onClick={() => setSelectedFlowIndex(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFlowIndex === idx
                    ? 'bg-[#C49756] text-white shadow-xs'
                    : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15 border border-white/10'
                }`}
              >
                {language === 'ar' ? flow.categoryAr : flow.category} · {language === 'ar' ? flow.titleAr.slice(0, 24) + '...' : flow.title.slice(0, 28) + '...'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Visual Director Flow Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        
        {/* Active Flow Master Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {language === 'ar' ? currentFlow.categoryAr : currentFlow.category}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {language === 'ar' ? currentFlow.totalTimeAr : currentFlow.totalTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-['Outfit',sans-serif]">
                {language === 'ar' ? currentFlow.titleAr : currentFlow.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'ar' ? currentFlow.highlightAr : currentFlow.highlight}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddAllToItinerary}
              className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-black text-amber-300 font-extrabold text-xs transition-all shadow-xl cursor-pointer flex items-center gap-2 self-start sm:self-center shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>{t('director.addToTrip')}</span>
            </button>
          </div>

          {/* Visual Step-by-Step Flow Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {currentFlow.steps.map((step, idx) => (
              <div
                key={step.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all relative group"
              >
                {/* Step Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-base flex items-center justify-center shadow-xs">
                      {step.icon}
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {step.time}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 font-['Outfit',sans-serif] line-clamp-2">
                    {language === 'ar' ? step.titleAr : step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'ar' ? step.descriptionAr : step.description}
                  </p>
                </div>

                {/* Step Footer */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[12px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{language === 'ar' ? step.locationAr : step.location}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {step.costEGP > 0 ? `${step.costEGP} ${t('common.egp')}` : (language === 'ar' ? 'مجاني' : 'Free')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Assistant Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#071417] text-white flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">
                {language === 'ar' ? 'اطلب من مخرج الرحلة:' : 'Direct Travel OS:'}
              </span>
            </div>

            <div className="flex-1 w-full flex items-center gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'مثال: "اقترح لي كافيه هادئ للعمل الصباحي ثم موقع سنوركلينج قبالته..."'
                    : 'e.g. "Suggest a quiet morning cafe with reef snorkeling right in front..."'
                }
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => {
                  if (customPrompt.trim()) {
                    showToast(language === 'ar' ? 'جاري بناء المخطط الذكي...' : 'Synthesizing visual flow...');
                    setSelectedFlowIndex((prev) => (prev === 0 ? 1 : 0));
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
