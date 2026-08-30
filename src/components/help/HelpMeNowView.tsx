import React, { useState } from 'react';
import { 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Clock, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  CheckCircle2, 
  RefreshCw, 
  PhoneCall, 
  Car, 
  Building2, 
  Utensils, 
  Compass, 
  ChevronRight, 
  FileText, 
  X, 
  UserCheck, 
  Navigation,
  Mail,
  LocateFixed,
  PhoneForwarded
} from 'lucide-react';
import { TravelerNav } from '../mytrip/TravelerNav';
import { useTrip } from '../../context/TripContext';
import { api } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import { sanitizeText } from '../../utils/sanitize';

export type HelpCategory = 'booking' | 'transport' | 'food' | 'hotel' | 'activity' | 'other';

export type HelpStep = 
  | 'categories' 
  | 'select_booking' 
  | 'specific_issue' 
  | 'custom_input' 
  | 'diagnosis' 
  | 'self_service_result' 
  | 'escalate_expert' 
  | 'expert_chat' 
  | 'resolved' 
  | 'in_progress';

interface HelpMeNowViewProps {
  onBackToMyTrip: () => void;
  onBackToCompanion?: () => void;
  onNavigateToChangeRecovery?: () => void;
  onNavigateToArrival?: () => void;
  onExploreClick?: () => void;
  initialCategory?: HelpCategory;
  initialTopic?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ahmed' | 'expert';
  senderName: string;
  senderNameAr: string;
  text: string;
  textAr: string;
  time: string;
  attachment?: string;
}

export const HelpMeNowView: React.FC<HelpMeNowViewProps> = ({
  onBackToMyTrip,
  onBackToCompanion,
  onNavigateToChangeRecovery,
  onNavigateToArrival,
  onExploreClick,
  initialCategory,
  initialTopic,
}) => {
  const { language, isRTL } = useLanguage();
  // Every message in this panel used to address the traveler as "Ahmed" in
  // both languages. The name comes from the session now, and is simply omitted
  // when there is none.
  const { profile, user, sessionUser, activeTrip } = useTrip();
  const [isSendingSupport, setIsSendingSupport] = useState<boolean>(false);
  // First name only: a greeting reads as a greeting, not as a record
  // lookup. "جعان يا Ahmed Mansour؟" is not how anyone is addressed.
  const travelerName = (profile.name || user?.displayName || sessionUser?.name || '').trim().split(/\s+/)[0] || '';
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'mytrip' | 'explore' | 'bookings' | 'profile'>('mytrip');
  
  // Current step in the Help Me Now interactive flow
  const [currentStep, setCurrentStep] = useState<HelpStep>(
    initialCategory ? 'specific_issue' : 'categories'
  );

  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(initialCategory || null);
  const [selectedBooking, setSelectedBooking] = useState<string>('Boat Trip');
  const [selectedIssue, setSelectedIssue] = useState<string>(initialTopic || '');
  const [customText, setCustomText] = useState<string>('');
  const [hasPhotoAttached, setHasPhotoAttached] = useState<boolean>(false);

  // Time-sensitive urgency flag
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  // Live chat messages with the Dahab Expert
  // Starts empty.
  //
  // It used to be seeded with a two-message exchange in which a "Dahab Expert"
  // named Kareem told the traveler their boat booking was already being
  // checked with the captain and would be confirmed within five minutes. There
  // is no support backend of any kind — no endpoint, no queue, no agent — so
  // that was a promise of action nobody was taking, shown to a traveler with a
  // real problem. Whatever is typed here still gets an acknowledgement, but the
  // panel no longer opens by claiming work is under way.
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatInput, setNewChatInput] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active bookings in Ahmed's current Dahab trip
  const activeBookings = [
    { id: 'boat', name: 'Boat Trip', nameAr: 'رحلة اليخت والسنوركلينج', time: 'Tomorrow · 10:00 AM', timeAr: 'غداً · ١٠:٠٠ ص', status: 'Pending Provider Check', statusAr: 'جاري التحقق مع المورد', icon: '⛵' },
    { id: 'diving', name: 'Blue Hole Scuba & Reef Diving', nameAr: 'غوص البلوهول والشعب المرجانية', time: 'Day 4 · 08:30 AM', timeAr: 'اليوم ٤ · ٠٨:٣٠ ص', status: 'Confirmed ✓', statusAr: 'مؤكد ✓', icon: '🤿' },
    { id: 'safari', name: 'Desert Quad & Canyon Safari', nameAr: 'سفاري البيتش باجي في الصحراء', time: 'Day 3 · 03:30 PM', timeAr: 'اليوم ٣ · ٠٣:٣٠ م', status: 'Confirmed ✓', statusAr: 'مؤكد ✓', icon: '🏜️' },
    { id: 'hotel', name: 'Dahab Bay Hotel (Deluxe Sea View)', nameAr: 'فندق خليج دهب (غرفة ديلوكس)', time: 'Check-out Oct 16', timeAr: 'المغادرة ١٦ أكتوبر', status: 'Confirmed ✓', statusAr: 'مؤكد ✓', icon: '🏨' },
    { id: 'transfer', name: 'Private Transfer to SSH Airport', nameAr: 'توصيلة خاصة لمطار شرم الشيخ', time: 'Day 5 · 02:00 PM', timeAr: 'اليوم ٥ · ٠٢:٠٠ م', status: 'Confirmed ✓', statusAr: 'مؤكد ✓', icon: '🚗' },
  ];

  // Specific options mapped per category
  const categoryIssues: Record<HelpCategory, { title: string; titleAr: string; options: { en: string; ar: string }[] }> = {
    booking: {
      title: 'What happened with your booking?',
      titleAr: 'إيه المشكلة اللي واجهتك في الحجز؟',
      options: [
        { en: "It's pending", ar: 'الحجز معلق (Pending)' },
        { en: 'I want to change it', ar: 'عايز أغير موعد الحجز' },
        { en: "I can't find it", ar: 'مش لاقي تفاصيل الحجز' },
        { en: 'Something else', ar: 'حاجة تانية' },
      ],
    },
    transport: {
      title: 'What do you need help with?',
      titleAr: 'محتاج مساعدة في إيه بخصوص المواصلات؟',
      options: [
        { en: 'My driver is late', ar: 'السائق اتأخر عن الميعاد' },
        { en: 'Where is my driver?', ar: 'مكان السائق فين دلوقتي؟' },
        { en: "I can't find the pickup point", ar: 'مش لاقي نقطة الركوب' },
        { en: 'I need another ride', ar: 'عايز توصيلة تانية فورية' },
        { en: 'Something else', ar: 'حاجة تانية' },
      ],
    },
    food: {
      title: "What's wrong with your order?",
      titleAr: 'إيه المشكلة في طلب الأكل؟',
      options: [
        { en: 'Order is late', ar: 'الدليفري اتأخر' },
        { en: 'Wrong order', ar: 'الأوردر وصل مختلف' },
        { en: 'Missing item', ar: 'في صنف ناقص' },
        { en: 'Restaurant issue', ar: 'مشكلة مع المطعم' },
        { en: 'Something else', ar: 'حاجة تانية' },
      ],
    },
    hotel: {
      title: 'What happened with the hotel?',
      titleAr: 'إيه المشكلة في الفندق أو الإقامة؟',
      options: [
        { en: 'Check-in problem', ar: 'مشكلة في استلام الغرفة (Check-in)' },
        { en: 'Room problem', ar: 'مشكلة في نظافة أو تكييف الغرفة' },
        { en: 'I need hotel information', ar: 'محتاج معلومات عن الفندق' },
        { en: 'I need to contact the hotel', ar: 'عايز أتواصل مع الاستقبال' },
        { en: 'Something else', ar: 'حاجة تانية' },
      ],
    },
    activity: {
      title: "What's happening with your activity?",
      titleAr: 'إيه اللي حصل في النشاط أو التجربة؟',
      options: [
        { en: 'Activity changed', ar: 'النشاط اتغير أو اتأجل' },
        { en: 'Activity is delayed', ar: 'بداية النشاط اتأخرت' },
        { en: "I can't find the meeting point", ar: 'مش لاقي نقطة التجمع' },
        { en: 'I want to change the activity', ar: 'عايز أبدل النشاط بنشاط تاني' },
        { en: 'Something else', ar: 'حاجة تانية' },
      ],
    },
    other: {
      title: 'Tell us what happened',
      titleAr: 'احكيلنا إيه اللي حصل بالضبط',
      options: [],
    },
  };

  // Category selection handler
  const handleSelectCategory = (cat: HelpCategory) => {
    setSelectedCategory(cat);
    if (cat === 'booking') {
      setCurrentStep('select_booking');
    } else if (cat === 'other') {
      setCurrentStep('custom_input');
    } else {
      if (cat === 'transport') {
        setIsUrgent(true);
      } else {
        setIsUrgent(false);
      }
      setCurrentStep('specific_issue');
    }
  };

  // Booking selection handler
  const handleSelectBooking = (bookingName: string) => {
    setSelectedBooking(bookingName);
    setCurrentStep('specific_issue');
  };

  // Specific issue choice handler
  const handleSelectIssue = (issue: string) => {
    setSelectedIssue(issue);
    if (issue === 'Something else' || issue === 'حاجة تانية') {
      setCurrentStep('custom_input');
      return;
    }

    if (
      issue === 'My driver is late' || 
      issue === "I can't find the pickup point" || 
      issue === "I can't find the meeting point" ||
      issue.includes('السائق') ||
      issue.includes('نقطة')
    ) {
      setIsUrgent(true);
    }

    runDiagnosis(issue);
  };

  // Custom text submit
  const handleSubmitCustomText = () => {
    const clean = sanitizeText(customText);
    if (!clean) {
      showToast(language === 'ar' ? 'من فضلك اوصف المشكلة باختصار.' : 'Please describe the issue briefly.');
      return;
    }
    setSelectedIssue(clean);
    runDiagnosis(clean);
  };

  // Simulate smart diagnosis
  const runDiagnosis = (issueText: string) => {
    setCurrentStep('diagnosis');

    setTimeout(() => {
      if (
        issueText === "It's pending" ||
        issueText === 'My driver is late' ||
        issueText === 'Where is my driver?' ||
        issueText === 'Check-in problem' ||
        issueText === 'Activity changed' ||
        issueText.toLowerCase().includes('change') ||
        issueText.includes('معلق') ||
        issueText.includes('اتأخر') ||
        issueText.includes('اتغير')
      ) {
        setCurrentStep('self_service_result');
      } else {
        setCurrentStep('escalate_expert');
      }
    }, 1200);
  };

  /**
   * Sends the message to support, for real.
   *
   * It used to append the traveler's line locally and then, after a 1.2s
   * setTimeout, append a canned acknowledgement — with no request of any kind.
   * POST /api/support/messages stores it, and the reply below reports what
   * actually happened, including when it failed.
   */
  const handleSendMessage = async () => {
    const clean = sanitizeText(newChatInput);
    if (!clean || isSendingSupport) return;

    const stamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ahmed',
      senderName: travelerName || 'You',
      senderNameAr: travelerName || 'أنت',
      text: clean,
      textAr: clean,
      time: stamp(),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setNewChatInput('');
    setIsSendingSupport(true);

    try {
      const { message } = await api.sendSupportMessage({
        message: clean,
        travelerName: travelerName || undefined,
        travelerPhone: profile.phone || undefined,
        travelerEmail: profile.email || undefined,
        tripId: activeTrip?.id,
        category: selectedCategory || undefined,
        bookingRef: selectedBooking || undefined,
        urgent: isUrgent
      });

      setChatMessages(prev => [...prev, {
        id: `msg-${message.id}`,
        sender: 'expert',
        senderName: 'Dahab Support',
        senderNameAr: 'دعم دهب',
        // The reference is the traveler's evidence that the message exists.
        text: `Received — reference ${message.id}. Operations can see this now. Call the number above if it cannot wait.`,
        textAr: `وصلت — رقم المرجع ${message.id}. فريق العمليات شايفها دلوقتي. لو مش مستني، اتصل بالرقم فوق.`,
        time: stamp(),
      }]);
    } catch (err: unknown) {
      // A failure is said plainly rather than hidden behind an acknowledgement.
      const detail = err instanceof Error ? err.message : '';
      setChatMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        sender: 'expert',
        senderName: 'Dahab Support',
        senderNameAr: 'دعم دهب',
        text: `Your message was not sent${detail ? `: ${detail}` : ''}. Please call the number above.`,
        textAr: `رسالتك مبعتتش${detail ? `: ${detail}` : ''}. من فضلك اتصل بالرقم فوق.`,
        time: stamp(),
      }]);
    } finally {
      setIsSendingSupport(false);
    }
  };

  const handleNavigate = (tab: 'home' | 'mytrip' | 'explore' | 'bookings' | 'profile') => {
    setActiveNavTab(tab);
    if (tab === 'home' || tab === 'mytrip') {
      onBackToMyTrip();
    } else if (tab === 'explore' && onExploreClick) {
      onExploreClick();
    } else if (tab === 'bookings') {
      onBackToMyTrip();
    } else if (tab === 'profile') {
      showToast(
        sessionUser
          ? `Signed in as ${sessionUser.name || sessionUser.email}`
          : language === 'ar'
            ? 'مش مسجّل دخول'
            : 'Not signed in'
      );
    }
  };

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-28 md:pb-16 selection:bg-[#F4C36C]/20"
    >
      {/* Traveler Top Navigation */}
      <TravelerNav
        activeTab={activeNavTab}
        onNavigate={handleNavigate}
        onOpenHelp={() => setCurrentStep('categories')}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-grow">
        
        {/* Top Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="back-to-companion-btn"
              onClick={onBackToCompanion || onBackToMyTrip}
              className="inline-flex items-center gap-1.5 py-3.5 -my-2 text-xs font-semibold text-[#D2E3DE]/70 hover:text-[#F4C36C] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{language === 'ar' ? 'الرجوع للمرافق اليومي' : 'Back to Daily Companion'}</span>
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={onBackToMyTrip}
              className="text-xs font-bold text-[#52C4B7] hover:text-[#F4C36C] transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'الجدول الكامل' : 'Full Itinerary'}
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#13312B] border border-white/10 text-xs text-[#D2E3DE] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#52C4B7] animate-pulse"></span>
            <span>{language === 'ar' ? 'دعم دهب المباشر ٢٤/٧' : 'Dahab Live Support 24/7'}</span>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Area (7/12) */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. Header Banner */}
            <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F4C36C]/15 text-[#F4C36C] border border-[#F4C36C]/30 text-[11px] font-bold uppercase tracking-wider font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'كونسيرج وخبير سيناء' : 'Sinai Expert Concierge'}
                </span>
                <span className="text-xs text-[#D2E3DE]/50 font-mono">{language === 'ar' ? 'استجابة فورية' : 'Real-time response'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA] tracking-tight">
                {language === 'ar'
                  ? travelerName
                    ? `محتاج مساعدة يا ${travelerName}؟ 🤝`
                    : 'محتاج مساعدة؟ 🤝'
                  : travelerName
                    ? `Need help, ${travelerName}? 🤝`
                    : 'Need help? 🤝'}
              </h1>
              <p className="text-xs sm:text-sm text-[#D2E3DE]/80 leading-relaxed font-medium">
                {language === 'ar'
                  ? 'قولنا إيه اللي حصل وإحنا هنتصرف فوراً علشان يومك يفضل ماشي بسلاسة.'
                  : "Tell us what happened and we'll resolve it immediately to keep your day relaxed."}
              </p>
            </div>

            {/* Urgency Alert */}
            {isUrgent && (
              <div 
                id="urgency-alert-banner"
                className="p-4 sm:p-5 rounded-3xl bg-amber-950/70 border border-amber-500/50 flex items-start gap-3.5 animate-in fade-in duration-200 text-amber-200"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
                  ⚠️
                </div>
                <div className="space-y-1 text-xs">
                  <h2 className="font-bold text-amber-200 text-sm">
                    {language === 'ar' ? 'حالة طارئة تتطلب تدخلاً سريعاً' : 'Time-sensitive issue'}
                  </h2>
                  <p className="text-amber-200/80 leading-relaxed">
                    {language === 'ar'
                      ? 'فريق خفر دهب والمشرف الميداني تم إشعارهم بالأولوية القصوى.'
                      : 'Our local coordinator is prioritizing this for immediate resolution.'}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 1: CATEGORIES SELECTOR */}
            {currentStep === 'categories' && (
              <div className="space-y-4">
                <h2 className="text-lg font-serif font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'الموضوع متعلق بإيه؟' : 'What is your issue related to?'}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'booking' as HelpCategory, icon: '📅', title: 'A booking', titleAr: 'حجز نشاط' },
                    { id: 'transport' as HelpCategory, icon: '🚗', title: 'Transport / Driver', titleAr: 'مواصلات وسائق' },
                    { id: 'food' as HelpCategory, icon: '🍽️', title: 'Food & Dining', titleAr: 'أكل ومطاعم' },
                    { id: 'hotel' as HelpCategory, icon: '🏨', title: 'Hotel / Stay', titleAr: 'فندق وإقامة' },
                    { id: 'activity' as HelpCategory, icon: '⛵', title: 'Activity on trip', titleAr: 'تجارب وأنشطة' },
                    { id: 'other' as HelpCategory, icon: '💬', title: 'Something else', titleAr: 'حاجة تانية' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className="p-4 rounded-2xl bg-[#0E2520] hover:bg-[#13312B] border border-white/10 hover:border-[#F4C36C]/40 transition-all text-start rtl:text-right space-y-2 cursor-pointer group"
                    >
                      <span className="text-2xl block">{cat.icon}</span>
                      <span className="font-bold text-xs sm:text-sm text-[#F7F3EA] group-hover:text-[#F4C36C]">
                        {language === 'ar' ? cat.titleAr : cat.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SELECT BOOKING */}
            {currentStep === 'select_booking' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'أي حجز تقصد؟' : 'Which booking is this about?'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('categories')}
                    className="text-xs text-[#F4C36C] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'تغيير القسم' : 'Change category'}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeBookings.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBooking(b.name)}
                      className="w-full p-4 rounded-2xl bg-[#0E2520] hover:bg-[#13312B] border border-white/10 hover:border-[#F4C36C]/40 transition-all flex items-center justify-between text-start rtl:text-right cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{b.icon}</span>
                        <div>
                          <h3 className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? b.nameAr : b.name}</h3>
                          <span className="text-xs text-[#D2E3DE]/60">{language === 'ar' ? b.timeAr : b.time}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        b.status.includes('Pending')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {language === 'ar' ? b.statusAr : b.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: SPECIFIC ISSUE OPTIONS */}
            {currentStep === 'specific_issue' && selectedCategory && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar' ? categoryIssues[selectedCategory].titleAr : categoryIssues[selectedCategory].title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('categories')}
                    className="text-xs text-[#F4C36C] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'تغيير' : 'Back'}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {categoryIssues[selectedCategory].options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectIssue(opt.en)}
                      className="w-full p-4 rounded-2xl bg-[#0E2520] hover:bg-[#13312B] border border-white/10 hover:border-[#F4C36C]/40 transition-all flex items-center justify-between text-start rtl:text-right cursor-pointer"
                    >
                      <span className="font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? opt.ar : opt.en}</span>
                      <ChevronRight className="w-4 h-4 text-[#F4C36C] rtl:rotate-180" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: CUSTOM TEXT INPUT */}
            {currentStep === 'custom_input' && (
              <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                <h2 className="text-lg font-serif font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'اكتب تفاصيل المشكلة' : 'Describe the issue in your own words'}
                </h2>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: السائق مش ظاهر عند الفندق ورقم تليفونه مغلق...' : 'e.g., Driver is not at the meeting point and phone is unreachable...'}
                  rows={4}
                  className="w-full p-3.5 rounded-2xl bg-[#13312B] border border-white/10 text-xs sm:text-sm text-[#F7F3EA] placeholder:text-[#D2E3DE]/40 focus:border-[#F4C36C] focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setHasPhotoAttached(!hasPhotoAttached)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      hasPhotoAttached
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#13312B] text-[#D2E3DE] border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{hasPhotoAttached ? (language === 'ar' ? 'تم إرفاق صورة ✓' : 'Photo Attached ✓') : (language === 'ar' ? 'إرفاق صورة أو سكرين شوت' : 'Attach photo/screenshot')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitCustomText}
                    className="px-5 py-2 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {language === 'ar' ? 'متابعة وفحص الحلول' : 'Check Solutions'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: DIAGNOSIS ANIMATION */}
            {currentStep === 'diagnosis' && (
              <div className="bg-[#0E2520] rounded-3xl p-8 border border-white/10 shadow-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#13312B] border border-[#F4C36C]/40 text-[#F4C36C] flex items-center justify-center mx-auto animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-serif font-bold text-lg text-[#F7F3EA]">
                    {language === 'ar' ? 'جاري فحص الحجز والتنسيق المباشر...' : 'Diagnosing and verifying live status...'}
                  </h2>
                  <p className="text-xs text-[#D2E3DE]/70">
                    {language === 'ar' ? 'بنتواصل مع النظام والمورد المحلي في دهب' : 'Checking providers and telemetry in Dahab'}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 6: SELF SERVICE RESULT (Automated resolution) */}
            {currentStep === 'self_service_result' && (
              <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  {/*
                    This panel used to open with a green tick, "Instant Solution
                    Available", and the claim "We reviewed your booking status
                    and found the right solution" — followed by a specific
                    diagnosis: the boat trip was pending "due to today's winds"
                    and alternatives had been "prepared". None of it was true
                    for anyone. It rendered identically whatever the traveler
                    picked, for whatever booking, in whatever weather, with no
                    review of anything having taken place.

                    What is real is the two routes out: the Change & Recovery
                    flow, and support. The panel offers those.
                  */}
                  <div className="w-10 h-10 rounded-2xl bg-[#13312B] text-[#F4C36C] border border-white/10 flex items-center justify-center text-xl">
                    →
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#52C4B7] block font-['Outfit',sans-serif]">
                      {language === 'ar' ? 'الخطوة الجاية' : 'What you can do'}
                    </span>
                    <h2 className="font-serif font-bold text-lg text-[#F7F3EA]">
                      {language === 'ar' ? 'فيه طريقتين نحلها بيهم' : 'Two ways to sort this out'}
                    </h2>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2 text-xs text-[#D2E3DE]">
                  <p className="font-bold text-[#F7F3EA]">
                    {language === 'ar'
                      ? 'تقدر تشوف بدائل الحجز وتغيّر بنفسك، أو تبعتلنا التفاصيل ونتابعها معاك.'
                      : 'You can look at alternatives and change the booking yourself, or send us the details and we will follow it up.'}
                  </p>
                  <p className="text-[#D2E3DE]/70">
                    {language === 'ar'
                      ? 'لو الموضوع مستعجل، رقم الدعم تحت وشغّال على مدار اليوم.'
                      : 'If it cannot wait, the support number is below.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToChangeRecovery) onNavigateToChangeRecovery();
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'شوف البدائل وغيّر الحجز' : 'Open Change & Recovery'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('expert_chat')}
                    className="text-xs font-semibold text-[#D2E3DE] hover:text-[#F4C36C] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'ابعت التفاصيل للدعم' : 'Send the details to support'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: ESCALATE TO EXPERT */}
            {currentStep === 'escalate_expert' && (
              <div className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-[#F4C36C]/40 shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F4C36C]/20 text-[#F4C36C] border border-[#F4C36C]/40 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#F4C36C] block font-['Outfit',sans-serif]">
                      {language === 'ar' ? 'تحويل لخبير دهب وسيناء' : 'Escalating to Sinai Expert'}
                    </span>
                    <h2 className="font-serif font-bold text-lg text-[#F7F3EA]">
                      {/* Was "Kareem from Dahab Support is taking over" —
                          stated as an accomplished fact while nothing had been
                          sent anywhere. It now describes what the traveler can
                          do, which is what actually exists. */}
                      {language === 'ar' ? 'محتاج تواصل مباشر مع المزوّد' : 'This needs the provider directly'}
                    </h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#D2E3DE] leading-relaxed">
                  {language === 'ar'
                    ? 'الحالة دي محتاجة تواصل مباشر مع السائق أو الفندق. ابعت التفاصيل هنا أو اتصل بخط الدعم فوق، وهنرجعلك بالرد.'
                    : 'This needs direct coordination with your driver or hotel. Send the details here, or call the support line above, and we will come back to you.'}
                </p>

                <button
                  type="button"
                  onClick={() => setCurrentStep('expert_chat')}
                  className="w-full py-3 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{language === 'ar' ? 'افتح محادثة الدعم' : 'Open support chat'}</span>
                </button>
              </div>
            )}

            {/* STEP 8: LIVE EXPERT CHAT */}
            {currentStep === 'expert_chat' && (
              <div className="bg-[#0E2520] rounded-3xl border border-white/10 shadow-xl overflow-hidden flex flex-col h-[480px]">
                {/* Chat Header */}
                <div className="p-4 bg-[#13312B] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#F4C36C] text-[#081714] font-bold flex items-center justify-center text-xs">
                      K
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#F7F3EA]">{language === 'ar' ? 'دعم دهب' : 'Dahab Support'}</h3>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{language === 'ar' ? 'متصل الآن ومتاح' : 'Online now'}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('categories')}
                    className="text-xs text-[#D2E3DE]/60 hover:text-white cursor-pointer"
                  >
                    {language === 'ar' ? 'إنهاء' : 'Close'}
                  </button>
                </div>

                {/* Messages List */}
                <div className="p-4 overflow-y-auto space-y-3 flex-grow text-xs">
                  {chatMessages.map((msg) => {
                    const isMe = msg.sender === 'ahmed';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                            isMe
                              ? 'bg-[#F4C36C] text-[#081714] font-semibold rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none'
                              : 'bg-[#13312B] text-[#F7F3EA] border border-white/10 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none'
                          }`}
                        >
                          {language === 'ar' ? msg.textAr : msg.text}
                        </div>
                        <span className="text-[11px] text-[#D2E3DE]/40 mt-1 px-1">
                          {msg.time}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-[#13312B] border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={newChatInput}
                    onChange={(e) => setNewChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') void handleSendMessage(); }}
                    placeholder={language === 'ar' ? 'اكتب رسالتك للدعم...' : 'Type your message to support...'}
                    className="flex-1 p-2.5 rounded-xl bg-[#081714] border border-white/10 text-xs text-[#F7F3EA] placeholder:text-[#D2E3DE]/40 focus:border-[#F4C36C] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={isSendingSupport || !newChatInput.trim()}
                    aria-label={language === 'ar' ? 'إرسال الرسالة للدعم' : 'Send message to support'}
                    className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#F4C36C] hover:bg-[#E5B55D] disabled:opacity-40 disabled:cursor-not-allowed text-[#081714] font-bold cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Secondary Context Sidebar (5/12) */}
          <div className="lg:col-span-5 space-y-6">

            {/* 1. Direct Hotline */}
            <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <PhoneCall className="w-5 h-5 text-[#F4C36C]" />
                <h2 className="font-serif font-bold text-base text-[#F7F3EA]">
                  {language === 'ar' ? 'الخط الساخن المباشر وغرفة الطوارئ' : 'Emergency & Driver Hotline'}
                </h2>
              </div>

              <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                {language === 'ar'
                  ? 'لو في حاجة طارئة ومحتاج مكالمة صوتية فورية، فريق دهب الميداني وكابتن النقل متاحون على مدار الساعة بنقرة واحدة.'
                  : 'If you need immediate voice assistance or roadside coordination, connect directly to our 24/7 Dahab dispatch desk.'}
              </p>

              {/* Ops Desk Dialer */}
              <a 
                href="tel:+20693640991"
                className="p-3.5 rounded-2xl bg-[#13312B] hover:bg-[#1b423a] border border-white/10 flex items-center justify-between transition-colors block cursor-pointer group"
              >
                <div>
                  <span className="text-[11px] text-[#D2E3DE]/60 uppercase font-bold block">{language === 'ar' ? 'رقم العمليات والطوارئ (مكتب دهب):' : 'Local Ops Desk Number:'}</span>
                  <span className="font-mono text-base font-bold text-[#F4C36C] group-hover:text-amber-300 transition-colors">+20 (0) 69 364 0991</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#F4C36C]/20 text-[#F4C36C] flex items-center justify-center">
                  <PhoneForwarded className="w-4 h-4" />
                </div>
              </a>

              {/* Bedouin Lead Driver Dialer */}
              <a 
                href="tel:+201008765432"
                className="p-3.5 rounded-2xl bg-[#13312B] hover:bg-[#1b423a] border border-white/10 flex items-center justify-between transition-colors block cursor-pointer group"
              >
                <div>
                  <span className="text-[11px] text-[#D2E3DE]/60 uppercase font-bold block">{language === 'ar' ? 'كابتن النقل البدوي (محمود سالم):' : 'Bedouin Lead Driver (Capt. Mahmoud):'}</span>
                  <span className="font-mono text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">+20 100 876 5432</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
              </a>

              {/* Email & GPS Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a 
                  href="mailto:ops@dahabtravelos.com?subject=Urgent%20Dahab%20Assistance%20Request%20-%20Ahmed"
                  className="p-2.5 rounded-xl bg-[#13312B] hover:bg-white/10 border border-white/10 text-xs font-bold text-[#D2E3DE] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#F4C36C]" />
                  <span>{language === 'ar' ? 'إرسال بريد' : 'Email Ops'}</span>
                </a>
                <a 
                  href="https://maps.google.com/?q=28.5097,34.5136"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#13312B] hover:bg-white/10 border border-white/10 text-xs font-bold text-[#D2E3DE] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LocateFixed className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'إحداثيات دهب' : 'Dahab GPS'}</span>
                </a>
              </div>
            </div>

            {/* 2. Peace of Mind Guarantee */}
            <div className="bg-[#13312B] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-base text-[#F7F3EA]">
                  {language === 'ar' ? 'ضمان حماية المسافر' : 'Traveler Protection Guarantee'}
                </h3>
              </div>

              <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                {language === 'ar'
                  ? 'أي تأخير في المواصلات أو تغيير في الأنشطة بيتم تعويضه فورياً وتعديل الجدول تلقائياً بدون أي تكلفة إضافية.'
                  : 'All transport delays and activity changes are backed by our real-time rescheduling guarantee.'}
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#13312B] text-[#F7F3EA] border border-[#F4C36C]/40 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
