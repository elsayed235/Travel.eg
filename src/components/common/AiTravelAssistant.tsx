import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Compass,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  Sun,
  Waves,
  UtensilsCrossed,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface AiSuggestionCard {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  timeEstimate: string;
  timeEstimateAr: string;
  location: string;
  locationAr: string;
  summary: string;
  summaryAr: string;
  actionText: string;
  actionTextAr: string;
  activityToAdd?: {
    time: string;
    title: string;
    titleAr: string;
    type: 'Activity' | 'Dining' | 'Leisure' | 'Experience';
    location: string;
    locationAr: string;
    notes: string;
    notesAr: string;
    duration: string;
    durationAr: string;
  };
}

const PRESET_PROMPTS = [
  {
    en: 'What should I do after my 11:30 AM dive?',
    ar: 'أعمل إيه بعد غطسة الساعة ١١:٣٠ الصبح؟',
  },
  {
    en: 'Find me a quiet spot for sunset & Bedouin tea',
    ar: 'مكان رايق وهادي للغروب مع شاي بدوي ع الفحم',
  },
  {
    en: 'Best seafood dinner spots with waterfront tables',
    ar: 'أحسن مطاعم سي فود على البحر مباشرة',
  },
  {
    en: 'Plan a relaxing 3-hour afternoon schedule',
    ar: 'رتبلي جدول روقان ٣ ساعات بعد الظهر',
  },
];

const KNOWLEDGE_RESPONSES: Record<string, { answerEn: string; answerAr: string; card?: AiSuggestionCard }> = {
  'after-dive': {
    answerEn:
      'After surfacing from The Canyon around 11:30 AM, your nitrogen levels will be dropping. A relaxed lunch at Ralph’s German Bakery courtyard (fresh minted lemonade and sourdough) followed by shaded hammocks at Everyday Art Café is the ideal decompression flow.',
    answerAr:
      'بعد الانتهاء من غطسة الكانيون حوالي ١١:٣٠ ص، جسمك محتاج وقت للاسترخاء والتخلص من النيتروجين. غداء خفيف في حديقة مخبز رالف الألماني (ليمون نعناع طازج ومخبوزات ساخنة) يليه استرخاء في أراجيح كافيه إيفري داي هو البرنامج الأمثل للاستشفاء.',
    card: {
      id: 'ai-rec-1',
      title: "Ralph's Bakery & Seaside Hammocks",
      titleAr: 'مخبز رالف وأراجيح ممشى البحر',
      category: 'Decompression & Lunch',
      categoryAr: 'استرخاء وغداء بعد الغطس',
      timeEstimate: '12:15 PM – 02:00 PM',
      timeEstimateAr: '١٢:١٥ م – ٠٢:٠٠ م',
      location: 'Lighthouse Promenade',
      locationAr: 'ممشى اللايتهاوس',
      summary: 'Shaded garden courtyard with fresh mint tea and quiet sea-view reading loungers.',
      summaryAr: 'حديقة مظللة مع شاي بالنعناع الطازج وإطلالة هادئة على البحر للقراءة والاستجمام.',
      actionText: 'Add to Day 2 Timeline',
      actionTextAr: 'أضف لجدول اليوم الثاني',
      activityToAdd: {
        time: '12:30 PM',
        title: "Post-Dive Lunch at Ralph's & Hammocks",
        titleAr: 'غداء واسترخاء في رالف وإيفري داي كافيه',
        type: 'Dining',
        location: 'Lighthouse Promenade',
        locationAr: 'ممشى اللايتهاوس',
        notes: 'Mint lemonade, hummus platter & shaded seaside lounge.',
        notesAr: 'ليمون ونعناع، طبق حمص طازج وجلسة استرخاء مظللة ع البحر.',
        duration: '1.5 hours',
        durationAr: '١.٥ ساعة',
      },
    },
  },
  'sunset-tea': {
    answerEn:
      'For the most majestic sunset with zero crowds, head to the Coral Coast Wooden Jetty or take a 12-minute taxi to Wadi Gnai’s rock amphitheater where the desert mountains glow in deep amber.',
    answerAr:
      'لأجمل مشهد غروب بعيداً عن الزحام، توجه إلى ممشى كورال كوست الخشبي أو خذ تاكسي ١٢ دقيقة لوادي قني حيث تتوهج الجبال بلون الكهرمان الذهبي تحت الشفق.',
    card: {
      id: 'ai-rec-2',
      title: 'Coral Coast Jetty Golden Hour',
      titleAr: 'الساعة الذهبية في ممشى كورال كوست',
      category: 'Sunset & Reflection',
      categoryAr: 'غروب وتأمل',
      timeEstimate: '05:15 PM – 06:15 PM',
      timeEstimateAr: '٠٥:١٥ م – ٠٦:١٥ م',
      location: 'Coral Coast Deck',
      locationAr: 'دك كورال كوست',
      summary: 'Direct panoramic view of Saudi Arabia mountain silhouettes across the calm Gulf of Aqaba.',
      summaryAr: 'إطلالة بانورامية مباشرة على سلاسل جبال الحجاز المقابلة عبر خليج العقبة الهادئ.',
      actionText: 'Schedule for 05:15 PM',
      actionTextAr: 'جدولة الساعة ٠٥:١٥ م',
      activityToAdd: {
        time: '05:15 PM',
        title: 'Sunset Tea at Coral Coast Jetty',
        titleAr: 'شاي بدوي وقت الغروب في كورال كوست',
        type: 'Leisure',
        location: 'Coral Coast Deck',
        locationAr: 'دك كورال كوست',
        notes: 'Bedouin habak tea and golden hour photography.',
        notesAr: 'شاي حبق بدوي وتصوير الساعة الذهبية.',
        duration: '1 hour',
        durationAr: 'ساعة واحدة',
      },
    },
  },
  seafood: {
    answerEn:
      'Ali Baba Waterfront is the benchmark tonight: their fresh red mullet and sea bass were caught early this morning by Dahab Bedouin fishermen. They charcoal-grill it with garlic, cumin, and lemon oil.',
    answerAr:
      'مطعم علي بابا على البحر هو الخيار المثالي الليلة: أسماك البوري والقاروص صيد صباح اليوم من صيادين دهب. يتم شوائها على الفحم مع الثوم والكمون وزيت الليمون السيناوي.',
    card: {
      id: 'ai-rec-3',
      title: 'Ali Baba Charcoal Catch of the Day',
      titleAr: 'صيد اليوم مشوي على الفحم في علي بابا',
      category: 'Seaside Dining',
      categoryAr: 'عشاء على الشاطئ',
      timeEstimate: '07:30 PM – 09:30 PM',
      timeEstimateAr: '٠٧:٣٠ م – ٠٩:٣٠ م',
      location: 'Lighthouse Waterfront',
      locationAr: 'واجهة اللايتهاوس البحرية',
      summary: 'Pick your whole fish from the ice display, grilled over glowing charcoal coals by the sea.',
      summaryAr: 'اختر سمكتك بنفسك من عرض الثلج الطازج، مشوية على الفحم بجوار أمواج البحر.',
      actionText: 'Add Dinner to Day 2',
      actionTextAr: 'أضف العشاء لليوم الثاني',
      activityToAdd: {
        time: '07:30 PM',
        title: 'Charcoal Seafood Dinner at Ali Baba',
        titleAr: 'عشاء مأكولات بحرية في علي بابا',
        type: 'Dining',
        location: 'Ali Baba Waterfront',
        locationAr: 'واجهة اللايتهاوس البحرية',
        notes: 'Table reserved right by the water lapping against the stone wall.',
        notesAr: 'طاولة مميزة على حافة الماء مباشرة.',
        duration: '2 hours',
        durationAr: 'ساعتان',
      },
    },
  },
  '3-hour': {
    answerEn:
      'Here is a tailored 3-hour Sinai recharge: 1) 30m swim at Lighthouse reef, 2) Fresh mango smoothie at Al Fanar, 3) 45-minute stroll through Assalah spice bazaar.',
    answerAr:
      'إليك خطة شحن طاقة لـ ٣ ساعات: ١) سباحة ٣٠ دقيقة عند شعاب اللايتهاوس، ٢) سموذي مانجو طازج في الفنار، ٣) جولة ٤٥ دقيقة في سوق توابل وأعشاب العصلة التراثي.',
    card: {
      id: 'ai-rec-4',
      title: 'Lighthouse Swim & Assalah Spice Walk',
      titleAr: 'سباحة اللايتهاوس وجولة سوق العصلة',
      category: 'Local Vibe Flow',
      categoryAr: 'تجربة محلية أصيلة',
      timeEstimate: '03:00 PM – 06:00 PM',
      timeEstimateAr: '٠٣:٠٠ م – ٠٦:٠٠ م',
      location: 'Lighthouse to Assalah',
      locationAr: 'من اللايتهاوس إلى العصلة',
      summary: 'Shallow reef snorkeling followed by local Sinai date & herb market tasting.',
      summaryAr: 'سنوركلنج في الشعاب الضحلة يعقبه تذوق تمور وأعشاب جبال سيناء.',
      actionText: 'Inject 3-Hour Flow',
      actionTextAr: 'تطبيق خطة الـ ٣ ساعات',
      activityToAdd: {
        time: '03:00 PM',
        title: 'Lighthouse Swim & Assalah Spice Walk',
        titleAr: 'سباحة اللايتهاوس وجولة سوق العصلة',
        type: 'Experience',
        location: 'Assalah & Lighthouse',
        locationAr: 'العصلة واللايتهاوس',
        notes: 'Swim gear + shopping bag for organic Sinai mountain tea.',
        notesAr: 'أدوات السباحة + حقيبة تسوق لأعشاب وشاي سيناء الجبلي.',
        duration: '3 hours',
        durationAr: '٣ ساعات',
      },
    },
  },
};

export const AiTravelAssistant: React.FC = () => {
  const { addActivityToDay, showToast, openDayGiWithPrompt } = useTrip();
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const [inputValue, setInputValue] = useState('');
  const [activeResponseKey] = useState<string>('after-dive');
  const [isTyping] = useState(false);

  const currentResult = KNOWLEDGE_RESPONSES[activeResponseKey] || KNOWLEDGE_RESPONSES['after-dive'];

  const handleSendQuery = (query: string) => {
    openDayGiWithPrompt(query);
  };

  const handleApplyCard = (card: AiSuggestionCard) => {
    if (card.activityToAdd) {
      addActivityToDay(2, {
        id: `ai-act-${Date.now()}`,
        time: card.activityToAdd.time,
        title: isAr ? card.activityToAdd.titleAr : card.activityToAdd.title,
        type: card.activityToAdd.type,
        // status is data, not display: writing the Arabic label here produced an
      // activity whose status matched no filter or comparison anywhere else.
      status: 'Added ✓',
        location: isAr ? card.activityToAdd.locationAr : card.activityToAdd.location,
        notes: isAr ? card.activityToAdd.notesAr : card.activityToAdd.notes,
        duration: isAr ? card.activityToAdd.durationAr : card.activityToAdd.duration,
      });
      showToast(isAr ? `تمت إضافة "${card.titleAr}" إلى الجدول!` : `Added "${card.title}" to Timeline!`);
    }
  };

  return (
    <section
      id="dahab-ai-intelligence-v2"
      aria-label={isAr ? 'المساعد الذكي لرحلة دهب' : 'Dahab AI Travel Intelligence'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="relative rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-2xl space-y-6">
        <div className="relative z-10 p-6 sm:p-8 space-y-6 text-[var(--text-primary)]">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[var(--accent-secondary)] text-[var(--accent-secondary-ink)] flex items-center justify-center font-bold shadow-lg flex-shrink-0 border border-white/20">
                <Sparkles className="w-5 h-5 text-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-secondary)] font-serif">
                    {isAr ? 'المرشد الذكي لتجارب دهب' : 'Dahab Travel Intelligence Copilot'}
                  </span>
                  <span className="text-[11px] font-bold text-[var(--accent-primary)] bg-[var(--surface-container)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                    {isAr ? 'السياق المباشر: اليوم الثاني في دهب' : 'Live Context: Day 2 in Dahab'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight font-serif">
                  {isAr ? 'اسأل عن المد والجزر، المواعيد، الأماكن السرية أو الأكل' : 'Ask anything about tides, timing, hidden spots or food'}
                </h2>
              </div>
            </div>

            <span className="text-xs text-[var(--text-secondary)] hidden lg:inline bg-[var(--surface-container)] px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)]">
              {isAr ? 'مدرّب على بحر سيناء، سجلات الغواصين ومسارات البدو' : 'Trained on Sinai tides, diver logbooks & Bedouin routes'}
            </span>
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="space-y-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {isAr ? 'استفسارات مقترحة ذكية:' : 'Suggested Intelligent Inquiries:'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_PROMPTS.map((item, idx) => {
                const promptText = isAr ? item.ar : item.en;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputValue(promptText);
                      handleSendQuery(promptText);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[var(--surface-container)] hover:bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-3 h-3 text-[var(--accent-secondary)]" />
                    <span>{promptText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic AI Response & Smart Card Box */}
          <div className="bg-[var(--surface-container)] rounded-2xl p-5 border border-[var(--border-subtle)] space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--accent-primary)] text-[var(--accent-primary-ink)] flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5 shadow-xs">
                AI
              </div>
              <div className="space-y-3 flex-1">
                {isTyping ? (
                  <div className="flex items-center gap-2 text-xs text-[var(--accent-secondary)] py-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-bounce [animation-delay:0.4s]" />
                    <span>{isAr ? 'جاري فحص حالة البحر وأماكن دهب...' : 'Synthesizing Dahab reef & venue conditions...'}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed font-normal">
                      {isAr ? currentResult.answerAr : currentResult.answerEn}
                    </p>

                    {/* Inline Smart Action Card */}
                    {currentResult.card && (
                      <div className="bg-[var(--surface-card)] rounded-2xl p-4 border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 shadow-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--surface-container)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                              {isAr ? currentResult.card.categoryAr : currentResult.card.category}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[var(--accent-secondary)]" />
                              {isAr ? currentResult.card.timeEstimateAr : currentResult.card.timeEstimate}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-[var(--text-primary)] font-serif">
                            {isAr ? currentResult.card.titleAr : currentResult.card.title}
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {isAr ? currentResult.card.summaryAr : currentResult.card.summary}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyCard(currentResult.card!)}
                          className="px-4 py-2.5 rounded-xl bg-[var(--accent-secondary)] hover:brightness-110 text-[var(--accent-secondary-ink)] font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAr ? currentResult.card.actionTextAr : currentResult.card.actionText}</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputValue.trim()) {
                handleSendQuery(inputValue);
              }
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isAr ? "اكتب أي سؤال (مثال: 'أفضل وقت لسنوركلنج اللاجون', 'عشاء بدوي هادي ع البحر')..." : "Type any question (e.g. 'Best snorkeling entry at low tide', 'Romantic Bedouin dinner')..."}
              className={`w-full bg-[var(--surface-container)] hover:bg-[var(--surface-card)] focus:bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl py-3.5 ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'} text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all`}
            />
            <button
              type="submit"
              aria-label={isAr ? "إرسال الاستفسار لمساعد دهب" : "Submit inquiry to Dahab AI Assistant"}
              className={`absolute ${isRTL ? 'left-2' : 'right-2'} p-2.5 rounded-xl bg-[var(--accent-secondary)] hover:brightness-110 text-[var(--accent-secondary-ink)] font-bold transition-transform active:scale-90 cursor-pointer shadow-md`}
            >
              <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

