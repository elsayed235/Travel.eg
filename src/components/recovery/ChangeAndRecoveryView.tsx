import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  RefreshCw, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Waves, 
  Compass, 
  MapPin, 
  Coffee, 
  Sun, 
  Info,
  X,
  MessageSquare
} from 'lucide-react';
import { TravelerNav } from '../mytrip/TravelerNav';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../services/api';

interface ChangeAndRecoveryViewProps {
  onBackToMyTrip: () => void;
  onBackToCompanion?: () => void;
  onExploreClick?: () => void;
  onOpenHelp?: (topic?: string) => void;
  onTripUpdated?: (updatedDetails: {
    activity: string;
    newTime: string;
    day: string;
  }) => void;
}

export type AlternativeOptionId = 'option-a' | 'option-b' | 'option-c';

export interface AlternativeOption {
  id: AlternativeOptionId;
  label: string;
  labelAr: string;
  title: string;
  titleAr: string;
  timeSlot: string;
  timeSlotAr: string;
  dayLabel: string;
  dayLabelAr: string;
  badge: 'Recommended' | 'More flexible' | 'Alternative';
  badgeAr: 'الأفضل لجدولك' | 'أكثر مرونة' | 'بديل مميز';
  badgeStyle: 'emerald' | 'amber' | 'blue';
  description: string;
  descriptionAr: string;
  keyPoints: string[];
  keyPointsAr: string[];
  warning?: string;
  warningAr?: string;
  hasConflict?: boolean;
  conflictDetails?: {
    conflictingActivity: string;
    conflictingActivityAr: string;
    conflictingTime: string;
    conflictingTimeAr: string;
    explanation: string;
    explanationAr: string;
  };
}

export const ChangeAndRecoveryView: React.FC<ChangeAndRecoveryViewProps> = ({
  onBackToMyTrip,
  onBackToCompanion,
  onExploreClick,
  onOpenHelp,
  onTripUpdated,
}) => {
  const { language, isRTL } = useLanguage();
  const { recordLedgerEntry, shiftActivityBetweenDays, updateActivityInDay, activeTrip, profile } = useTrip();

  /**
   * The real marine reading, and whether it is actually a problem.
   *
   * This page opened with "Today's boat trip won't be as pleasant due to wind",
   * a "Marine Weather Update · 11:30 AM" badge and "Sea Condition: 24 knots ·
   * 1.4m chop" — for every traveler, on every day, whether or not they had a
   * boat trip and whether or not there was any wind. It is the screen a
   * traveler lands on when something has gone wrong, so opening it by
   * inventing what went wrong is the worst place to do it.
   *
   * 20 knots is where Dahab's boat operators start calling a day uncomfortable;
   * below that the page is a plan-change tool, which is what it always was.
   */
  const [wind, setWind] = useState<{ knots: number; direction: string; observedAt: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getWeatherTelemetry().then((w) => {
      if (cancelled || !w?.available) return;
      setWind({ knots: w.wind.speedKnots, direction: w.wind.direction, observedAt: w.observedAt });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const CHOPPY_THRESHOLD_KNOTS = 20;
  const isChoppy = wind !== null && wind.knots >= CHOPPY_THRESHOLD_KNOTS;
  const travelerFirstName = (profile.name || '').trim().split(/\s+/)[0];
  const observedLabel = wind
    ? new Date(wind.observedAt).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;
  // Was the literal 'DHB-TRIP-894' on all three recovery ledger entries.
  const recoveryTripId = activeTrip?.id || '';
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'mytrip' | 'explore' | 'bookings' | 'profile'>('mytrip');

  // Currently selected alternative for comparison & rebooking
  const [selectedOptionId, setSelectedOptionId] = useState<AlternativeOptionId>('option-a');

  // Interactive rebooking workflow state: 'viewing' | 'confirming' | 'processing' | 'success'
  const [rebookingStep, setRebookingStep] = useState<'viewing' | 'confirming' | 'processing' | 'success'>('viewing');

  // Conflict modal state for Option B
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictResolutionChoice, setConflictResolutionChoice] = useState<'unresolved' | 'move_safari'>('unresolved');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // The 3 Curated Alternatives
  const alternatives: AlternativeOption[] = [
    {
      id: 'option-a',
      label: 'Option A — Reschedule',
      labelAr: 'الخيار أ — تأجيل الرحلة لغدٍ',
      title: 'Boat Trip Tomorrow',
      titleAr: 'رحلة اليخت غداً صباحاً',
      timeSlot: '10:00 AM',
      timeSlotAr: '١٠:٠٠ صباحاً',
      dayLabel: 'Tomorrow · 10:00 AM',
      dayLabelAr: 'غداً (اليوم ٣) · ١٠:٠٠ ص',
      badge: 'Recommended',
      badgeAr: 'الأفضل لجدولك',
      badgeStyle: 'emerald',
      description: 'Keep the same experience and move it to a better weather window tomorrow morning.',
      descriptionAr: 'الاحتفاظ بنفس رحلة اليخت المميزة ونقلها لموعد طقس مثالي وهادئ تماماً صباح الغد.',
      keyPoints: [
        'Fits your itinerary seamlessly ✓',
        'Sea conditions are calm and sunny tomorrow',
        'All transport and boat bookings automatically adjusted',
      ],
      keyPointsAr: [
        'يتطابق مع جدول رحلتك بدون أي تعارض ✓',
        'حالة البحر والرياح هادئة ومشمسة جداً غداً',
        'تعديل حجز المركب والسائق تلقائياً وبدون أي جهد منك',
      ],
    },
    {
      id: 'option-b',
      label: 'Option B — Replace Today',
      labelAr: 'الخيار ب — بديل بري ممتع اليوم',
      title: 'Desert Canyon & Mountain Trek',
      titleAr: 'سفاري وادي الوشواشي وجبال دهب',
      timeSlot: '11:30 AM',
      timeSlotAr: '١١:٣٠ صباحاً',
      dayLabel: 'Today · 11:30 AM',
      dayLabelAr: 'اليوم (اليوم ٢) · ١١:٣٠ ص',
      badge: 'Alternative',
      badgeAr: 'بديل مميز',
      badgeStyle: 'blue',
      description: 'Replace the boat trip with an inland canyon safari protected from coastal winds.',
      descriptionAr: 'استبدال رحلة البحر بجولة جبلية ووديان ساحرة محمية تماماً من الرياح الساحلية.',
      keyPoints: [
        'Takes place today as planned',
        'Wind-safe desert canyon adventure',
        'Minor schedule adjustment required for afternoon activity',
      ],
      keyPointsAr: [
        'يقام اليوم في نفس توقيتك بدون فراغ',
        'مغامرة وديان جبلية ساحرة لا تتأثر بالبحر',
        'يتطلب تعديل بسيط لنشاط العصر (سفاري البيتش باجي)',
      ],
      hasConflict: true,
      conflictDetails: {
        conflictingActivity: 'Desert Quad Tour',
        conflictingActivityAr: 'سفاري البيتش باجي الصحراوي',
        conflictingTime: '03:00 PM',
        conflictingTimeAr: '٠٣:٠٠ عصراً',
        explanation: 'Option B ends at 02:45 PM, leaving only 15 min buffer before Quad tour.',
        explanationAr: 'جولة الوديان تنتهي الساعة ٢:٤٥ م، تاركة ١٥ دقيقة فقط قبل نشاط العصر.',
      },
    },
    {
      id: 'option-c',
      label: 'Option C — Relax Today',
      labelAr: 'الخيار ج — استجمام وروقان اليوم',
      title: 'Free Morning & Spa Credits',
      titleAr: 'صباح استجمام حر وسبا ع البحر',
      timeSlot: 'Flexible',
      timeSlotAr: 'وقت مرن ومفتوح',
      dayLabel: 'Today · Flexible',
      dayLabelAr: 'اليوم (اليوم ٢) · وقتك حر',
      badge: 'More flexible',
      badgeAr: 'أكثر مرونة',
      badgeStyle: 'amber',
      description: 'Take a slow, relaxed morning at your accommodation and lagoon cafes with full flexible credit.',
      descriptionAr: 'استمتع بصباح رايق على ممشى اللايتهاوس وكافيهات الشاطئ، مع رصيد مسترد كامل لأي نشاط لاحق.',
      keyPoints: [
        'Zero schedule pressure today',
        'Full activity credit saved to your trip account',
        'Keeps your 03:00 PM desert quad tour completely intact',
      ],
      keyPointsAr: [
        'بدون أي التزامات زمنية أو استعجال اليوم',
        'رصيد كامل محفوظ في حساب رحلتك لأي تجربة قادمة',
        'يحافظ على نشاط سفاري العصر في ميعاده بدقة',
      ],
    },
  ];

  const currentOption = alternatives.find(a => a.id === selectedOptionId) || alternatives[0];

  const handleSelectOption = (optionId: AlternativeOptionId) => {
    setSelectedOptionId(optionId);
  };

  const handleRebookingConfirmation = () => {
    if (currentOption.hasConflict && conflictResolutionChoice === 'unresolved') {
      setIsConflictModalOpen(true);
      return;
    }

    setRebookingStep('processing');
    setTimeout(() => {
      // Execute concrete Trip OS state shifts & Escrow settlement updates
      if (selectedOptionId === 'option-a') {
        shiftActivityBetweenDays('act-boat-trip-day2', 2, 3, '10:00 AM');
        recordLedgerEntry({
          transactionId: `TXN-REC-WTR-${Date.now().toString().slice(-4)}`,
          idempotencyKey: `IDEMP-WTR-OPT-A-${Date.now()}`,
          bookingRef: 'DHB-REC-BOAT-02',
          tripId: recoveryTripId,
          type: 'REFUND_ISSUED',
          amountEGP: 0,
          debitAccount: 'PLATFORM_ESCROW_MAIN',
          creditAccount: 'TRAVELER_ESCROW_HOLD',
          currency: 'EGP',
          status: 'SETTLED',
          metadata: {
            serviceType: 'boat',
            supplierId: 'SUP-BOAT-01',
            travelerName: 'Ahmed Mansour',
            reason: 'Weather Zero-Penalty Reschedule: Boat trip moved to Day 3 10:00 AM'
          }
        });
      } else if (selectedOptionId === 'option-b') {
        updateActivityInDay(2, 'act-boat-trip-day2', {
          title: 'Desert Canyon & Mountain Trek',
          time: '11:30 AM',
          location: 'Wadi Qnai & Dahab Canyons',
          notes: 'Weather adjustment: Inland canyon trek with Bedouin tea'
        });
        if (conflictResolutionChoice === 'move_safari') {
          updateActivityInDay(2, 'act-quad-safari-day2', {
            time: '04:00 PM',
            notes: 'Re-timed for smooth canyon buffer'
          });
        }
        recordLedgerEntry({
          transactionId: `TXN-REC-WTR-${Date.now().toString().slice(-4)}`,
          idempotencyKey: `IDEMP-WTR-OPT-B-${Date.now()}`,
          bookingRef: 'DHB-REC-CANYON-02',
          tripId: recoveryTripId,
          type: 'PAYMENT_CAPTURED',
          amountEGP: 0,
          debitAccount: 'PLATFORM_ESCROW_MAIN',
          creditAccount: 'SUPPLIER_BEDOUIN_HOLD',
          currency: 'EGP',
          status: 'SETTLED',
          metadata: {
            serviceType: 'canyon',
            supplierId: 'SUP-BEDOUIN-02',
            travelerName: 'Ahmed Mansour',
            reason: 'Weather Zero-Penalty Swap: Canyon Trek substituted for Boat Trip'
          }
        });
      } else if (selectedOptionId === 'option-c') {
        updateActivityInDay(2, 'act-boat-trip-day2', {
          title: 'Free Morning & Lighthouse Palapa Spa',
          time: 'Flexible',
          location: 'Lighthouse Bay, Dahab',
          notes: 'Full escrow credit preserved in Dahab OS wallet'
        });
        recordLedgerEntry({
          transactionId: `TXN-REC-WTR-${Date.now().toString().slice(-4)}`,
          idempotencyKey: `IDEMP-WTR-OPT-C-${Date.now()}`,
          bookingRef: 'DHB-REC-CREDIT-02',
          tripId: recoveryTripId,
          type: 'REFUND_ISSUED',
          amountEGP: 1200,
          debitAccount: 'PLATFORM_ESCROW_MAIN',
          creditAccount: 'TRAVELER_WALLET_BALANCE',
          currency: 'EGP',
          status: 'SETTLED',
          metadata: {
            serviceType: 'credit',
            supplierId: 'PLATFORM_DURABLE_ESCROW',
            travelerName: 'Ahmed Mansour',
            reason: 'Weather Recovery: 1,200 EGP Escrow Credit returned to wallet'
          }
        });
      }

      setRebookingStep('success');
      if (onTripUpdated) {
        onTripUpdated({
          activity: currentOption.title,
          newTime: currentOption.timeSlot,
          day: currentOption.dayLabel,
        });
      }
      showToast(
        language === 'ar'
          ? `تم تأكيد "${currentOption.titleAr}" بنجاح! تم تحديث جدول رحلتك وإشعار المنظمين ✓`
          : `Confirmed: ${currentOption.title}! Your trip schedule and coordinators are updated ✓`
      );
    }, 1200);
  };

  const handleResolveConflict = () => {
    setConflictResolutionChoice('move_safari');
    setIsConflictModalOpen(false);
    showToast(
      language === 'ar'
        ? 'تم ترحيل نشاط السفاري إلى ٠٤:٠٠ عصراً تلقائياً. الجدول أصبح آمناً ✓'
        : 'Quad Safari moved to 04:00 PM. Schedule conflict resolved ✓'
    );
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
      showToast('Logged in as Ahmed (ahmed.traveler@example.com)');
    }
  };

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-28 md:pb-16 selection:bg-[#F4C36C]/20"
    >
      {/*
        This view had no <h1> at all — its only h2s are the two conditional
        state messages ("Today's boat trip won't be as pleasant…" /
        "We've fixed your day"), so the page had no stable identity for
        assistive tech or search. Visually hidden because the design
        deliberately leads with the disruption message, not a page title.
      */}
      <h1 className="sr-only">
        {language === 'ar' ? 'تغيير الخطة والإنقاذ' : 'Trip Changes & Recovery'}
      </h1>

      {/* Traveler Top Navigation */}
      <TravelerNav
        activeTab={activeNavTab}
        onNavigate={handleNavigate}
        onOpenHelp={() => onOpenHelp && onOpenHelp('boat-trip-reschedule')}
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
              <span>{language === 'ar' ? 'الرجوع للمرافق اليومي (اليوم ٢)' : 'Back to Daily Companion (Day 2)'}</span>
            </button>
            <span className="text-white/20">•</span>
            <span className="text-xs font-bold text-[#F4C36C]">
              {language === 'ar' ? 'نظام الحماية وتعديل الجدول التلقائي' : 'Smart Plan Recovery'}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13312B] border border-white/10 text-xs text-[#D2E3DE]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'الحماية النشطة مفعلة لرحلة أحمد' : 'Active Plan Protection'}</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* REBOOKING STATE FLOW                                         */}
        {/* ============================================================ */}

        {rebookingStep === 'success' ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="max-w-3xl mx-auto bg-[#0E2520] rounded-3xl p-7 sm:p-9 border-2 border-emerald-500/50 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-xs">
                ✓
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'تم التعديل والتنسيق التلقائي' : 'Plan Successfully Updated'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'ظبطنالك يومك بالكامل يا أحمد ✓' : "We've fixed your day ✓"}
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#D2E3DE] leading-relaxed font-medium">
              {language === 'ar'
                ? `تم تأكيد "${currentOption.titleAr}" بنجاح وتحديث كافة تفاصيل ومواعيد رحلتك وتنسيقها مع المنظمين والسائق بدون أي مجهود منك.`
                : `Your choice (${currentOption.title}) has been locked into your live schedule. Drivers, skippers, and your itinerary are all aligned.`}
            </p>

            {/* Confirmed Details Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#13312B] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#F4C36C] uppercase font-['Outfit',sans-serif]">{language === 'ar' ? 'النشاط المعتمد الجديد' : 'New Confirmed Activity'}</span>
                  <h3 className="font-serif font-bold text-lg text-[#F7F3EA]">
                    {language === 'ar' ? currentOption.titleAr : currentOption.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  {language === 'ar' ? 'مؤكد ومنسق ✓' : 'Confirmed ✓'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#D2E3DE]">
                <div>
                  <span className="text-[#D2E3DE]/60 block font-semibold">{language === 'ar' ? 'الموعد المجدول:' : 'Scheduled Time:'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? currentOption.dayLabelAr : currentOption.dayLabel}</span>
                </div>
                <div>
                  <span className="text-[#D2E3DE]/60 block font-semibold">{language === 'ar' ? 'الموقع:' : 'Location:'}</span>
                  <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'مارينا دهب والشعب المرجانية' : 'Dahab Marina & Reefs'}</span>
                </div>
                <div>
                  <span className="text-[#D2E3DE]/60 block font-semibold">{language === 'ar' ? 'التنسيق:' : 'Coordination:'}</span>
                  <span className="font-bold text-emerald-400">{language === 'ar' ? 'تلقائي · تم إبلاغ القبطان' : 'Automated · Skipper Notified'}</span>
                </div>
              </div>
            </div>

            {/* Timeline Preview */}
            <div className="space-y-3">
              <h3 className="text-base font-serif font-bold text-[#F7F3EA]">
                {language === 'ar' ? 'الجدول المحدث لليوم وغداً' : 'Updated Trip Timeline'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-xs font-bold text-[#F4C36C]">{language === 'ar' ? 'اليوم (اليوم ٢) · ١٣ أكتوبر' : 'Today (Day 2)'}</span>
                    <span className="text-[11px] text-[#D2E3DE]/60">Oct 13</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#D2E3DE]">
                    <div className="flex items-center justify-between text-[#D2E3DE]/70">
                      <span>09:00 AM</span>
                      <span>{language === 'ar' ? 'فطار في الفندق' : 'Breakfast'}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-300 font-bold bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30">
                      <span>11:30 AM</span>
                      <span>✨ {language === 'ar' ? 'وقت حر وممشى اللايتهاوس' : 'Free Time & Beach Walk'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#D2E3DE]/70">
                      <span>01:00 PM</span>
                      <span>{language === 'ar' ? 'غداء في ممشى دهب' : 'Lunch by the Bay'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#D2E3DE]/70">
                      <span>03:00 PM</span>
                      <span>{language === 'ar' ? 'سفاري البيتش باجي في الصحراء' : 'Desert Quad Safari'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-xs font-bold text-[#F4C36C]">{language === 'ar' ? 'غداً (اليوم ٣) · ١٤ أكتوبر' : 'Tomorrow (Day 3)'}</span>
                    <span className="text-[11px] text-[#D2E3DE]/60">Oct 14</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#D2E3DE]">
                    <div className="flex items-center justify-between text-[#D2E3DE]/70">
                      <span>09:00 AM</span>
                      <span>{language === 'ar' ? 'فطار هادئ' : 'Breakfast'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#F7F3EA] font-bold bg-[#0E2520] p-2 rounded-xl border border-[#F4C36C]/40 text-[#F4C36C]">
                      <span>10:00 AM</span>
                      <span>⛵ {language === 'ar' ? 'رحلة اليخت (الموعد الجديد ✓)' : 'Boat Trip (Rescheduled ✓)'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#D2E3DE]/70">
                      <span>01:30 PM</span>
                      <span>{language === 'ar' ? 'غداء سمك طازة' : 'Seafood Lunch'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                id="view-updated-itinerary-btn"
                onClick={onBackToCompanion || onBackToMyTrip}
                className="px-6 py-3 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{language === 'ar' ? 'الرجوع للمرافق اليومي' : 'Return to Daily Companion'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>

              <button
                type="button"
                onClick={() => setRebookingStep('viewing')}
                className="text-xs font-semibold text-[#D2E3DE]/70 hover:text-[#F4C36C] transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'مراجعة الخيارات الأخرى مرة ثانية' : 'Review other alternatives again'}
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE RECOVERY WORKFLOW (7/12 vs 5/12 Layout) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAIN COLUMN (7/12) */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. ALERT & REASSURANCE BANNER */}
              <section id="change-alert-card" className="bg-[#0E2520] rounded-3xl p-6 sm:p-7 border border-amber-500/40 shadow-xl space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-2xl shadow-xs">
                    ⚠️
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {observedLabel
                          ? language === 'ar' ? `قراءة بحرية ${observedLabel}` : `Marine reading ${observedLabel}`
                          : language === 'ar' ? 'تغيير الخطة' : 'Change of plan'}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA]">
                      {isChoppy
                        ? language === 'ar'
                          ? `الرياح ${wind!.knots} عقدة دلوقتي — الخروج بالقارب مش هيكون مريح.`
                          : `Wind is ${wind!.knots} kn right now — a boat trip will not be comfortable.`
                        : language === 'ar'
                          ? 'عايز تغيّر حاجة في يومك؟'
                          : 'Want to change something about your day?'}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-300 font-semibold flex items-center gap-1.5 pt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>
                        {language === 'ar'
                          ? `${travelerFirstName ? `يا ${travelerFirstName}، ` : ''}تحت ٣ بدائل تقدر تبدّل بيها من غير رسوم.`
                          : `${travelerFirstName ? `${travelerFirstName}, t` : 'T'}here are 3 alternatives below you can switch to at no charge.`}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Weather details */}
                <div className="p-4 rounded-2xl bg-[#13312B] border border-white/10 space-y-2 text-xs text-[#D2E3DE]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F7F3EA] flex items-center gap-1.5">
                      <Waves className="w-4 h-4 text-cyan-400" />
                      <span>{language === 'ar' ? 'حالة البحر الحالية:' : 'Sea Condition:'}</span>
                    </span>
                    {/* Was "24 knots · 1.4m chop" — a wind speed and a wave
                        height, neither observed, on the page a traveler reads
                        to decide whether to go out on the water. Wave height is
                        still not reported: nothing measures it here. */}
                    <span className="font-mono text-amber-300 font-bold">
                      {wind
                        ? `${wind.knots} kn ${wind.direction}`
                        : language === 'ar' ? 'القراءة مش متاحة' : 'Reading unavailable'}
                    </span>
                  </div>
                  <p className="text-[#D2E3DE]/70 leading-relaxed">
                    {isChoppy
                      ? language === 'ar'
                        ? 'الرياح دي بتخلي القعدة في عرض البحر صعبة، بس أنشطة دهب البرية والشاطئية شغالة عادي.'
                        : 'This wind makes deep reef stops uncomfortable, but inland and coastal spots are unaffected.'
                      : language === 'ar'
                        ? 'الظروف البحرية عادية دلوقتي. لو عايز تغيّر خطتك لأي سبب تاني، البدائل تحت.'
                        : 'Marine conditions are normal right now. If you want to change your plan for another reason, the alternatives are below.'}
                  </p>
                </div>
              </section>

              {/* 2. 3 CURATED ALTERNATIVES */}
              <section id="alternatives-section" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'اختر البديل الأنسب ليك' : 'Choose Your Best Alternative'}
                  </h3>
                  <span className="text-xs text-[#D2E3DE]/60">
                    {language === 'ar' ? '٣ خيارات محسوبة' : '3 evaluated options'}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {alternatives.map((alt) => {
                    const isSelected = selectedOptionId === alt.id;
                    return (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => handleSelectOption(alt.id)}
                        aria-pressed={isSelected}
                        className={`w-full text-start rounded-3xl p-5 sm:p-6 border transition-all cursor-pointer space-y-3 ${
                          isSelected
                            ? 'bg-[#13312B] border-2 border-[#F4C36C] shadow-[0_0_20px_rgba(244,195,108,0.15)] ring-1 ring-[#F4C36C]/30'
                            : 'bg-[#0E2520] hover:bg-[#13312B] border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full ${
                              alt.badgeStyle === 'emerald'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : alt.badgeStyle === 'amber'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            }`}>
                              {language === 'ar' ? alt.badgeAr : alt.badge}
                            </span>
                            <span className="text-xs font-bold text-[#D2E3DE]">
                              {language === 'ar' ? alt.labelAr : alt.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#F4C36C] font-bold">{language === 'ar' ? alt.dayLabelAr : alt.dayLabel}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-[#F4C36C] border-[#F4C36C] text-[#081714]' : 'border-white/30'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-lg font-serif font-bold text-[#F7F3EA]">
                            {language === 'ar' ? alt.titleAr : alt.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#D2E3DE]/80 leading-relaxed">
                            {language === 'ar' ? alt.descriptionAr : alt.description}
                          </p>
                        </div>

                        {/* Bullet points */}
                        <div className="space-y-1 text-xs text-[#D2E3DE]/70 pt-1">
                          {(language === 'ar' ? alt.keyPointsAr : alt.keyPoints).map((pt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-emerald-400 text-xs">✓</span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>

                        {alt.hasConflict && (
                          <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-amber-300">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? 'تنبيه تعارض زمني بسيط:' : 'Schedule Conflict Notice:'}</span>
                            </span>
                            <p>{language === 'ar' ? alt.conflictDetails?.explanationAr : alt.conflictDetails?.explanation}</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 3. PRIMARY REBOOK CTA */}
              <div className="p-6 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#F4C36C] uppercase font-['Outfit',sans-serif]">{language === 'ar' ? 'الخيار المختار حالياً' : 'Selected Alternative'}</span>
                    <h4 className="font-serif font-bold text-base text-[#F7F3EA]">
                      {language === 'ar' ? currentOption.titleAr : currentOption.title}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{language === 'ar' ? currentOption.dayLabelAr : currentOption.dayLabel}</span>
                </div>

                <button
                  type="button"
                  id="confirm-rebooking-btn"
                  onClick={handleRebookingConfirmation}
                  className="w-full py-3.5 px-6 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <RefreshCw className="w-4 h-4 text-[#081714]" />
                  <span>{language === 'ar' ? `تأكيد التعديل (${currentOption.titleAr})` : `Confirm and Apply This Plan`}</span>
                </button>

                <p className="text-[12px] text-center text-[#D2E3DE]/60">
                  {language === 'ar'
                    ? 'مش هتحتاج تتواصل مع أي حد بنفسك. النظام هيعدل كل الحجوزات وينسق مع السائق والمركب فوراً.'
                    : "You don't need to coordinate with hotels or drivers yourself. We manage the updates."}
                </p>
              </div>

            </div>

            {/* SECONDARY SIDEBAR (5/12) */}
            <div className="lg:col-span-5 space-y-6">

              {/* 1. PEACE OF MIND GUARANTEE */}
              <div className="bg-[#0E2520] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-serif font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'ضمان راحة البال' : 'Automated Coordination'}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#D2E3DE]/80 leading-relaxed">
                  {language === 'ar'
                    ? 'أي تعديل على جدول رحلتك بيتم مزامنته فوراً وبدون أي رسوم إضافية، مع الحفاظ على تناسق باقي اليوم.'
                    : 'Any schedule change is instantly synchronized across all your activities and verified with local partners.'}
                </p>

                <div className="space-y-2 text-xs text-[#D2E3DE]">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{language === 'ar' ? 'إبلاغ قبطان اليخت والمارينا' : 'Boat & Marina notified'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{language === 'ar' ? 'تعديل مواعيد سيارة التنقل' : 'Private driver schedule synced'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#13312B] border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{language === 'ar' ? 'حماية مواعيد الغداء والأنشطة اللاحقة' : 'Afternoon activities 100% protected'}</span>
                  </div>
                </div>
              </div>

              {/* 2. NEED HUMAN EXPERT? */}
              <div className="bg-[#13312B] rounded-3xl p-6 border border-white/10 shadow-xl space-y-3.5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#F4C36C]" />
                  <h4 className="font-serif font-bold text-base text-[#F7F3EA]">
                    {language === 'ar' ? 'عايز تستشير خبير سيناء؟' : 'Need Expert Advice?'}
                  </h4>
                </div>

                <p className="text-xs text-[#D2E3DE]/80 leading-relaxed">
                  {language === 'ar'
                    ? 'فريق خبراء دهب متاح على مدار الساعة للمساعدة الفورية أو تقديم اقتراحات خاصة.'
                    : 'Our local Dahab trip experts are on standby 24/7 to answer questions or customize changes.'}
                </p>

                <button
                  type="button"
                  onClick={() => onOpenHelp && onOpenHelp('boat-weather')}
                  className="w-full py-2.5 px-4 rounded-full bg-[#0E2520] hover:bg-[#1a4038] text-[#F4C36C] font-bold text-xs border border-[#F4C36C]/40 transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'تواصل مع خبير دهب الآن' : 'Chat with Dahab Expert'}
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* CONFLICT RESOLUTION MODAL */}
      {isConflictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-[#0E2520] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-amber-500/50 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#F7F3EA]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-serif font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'حل التعارض الزمني التلقائي' : 'Schedule Conflict Detected'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConflictModalOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#D2E3DE] leading-relaxed">
              {language === 'ar'
                ? 'جولة الوديان تنتهي الساعة ٢:٤٥ م، تاركة ١٥ دقيقة فقط قبل سفاري البيتش باجي (٣:٠٠ م). نقترح ترحيل السفاري إلى ٤:٠٠ م لضمان راحتك التامة.'
                : 'Canyon trek finishes at 02:45 PM. We recommend shifting your 03:00 PM Quad safari to 04:00 PM.'}
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResolveConflict}
                className="w-full py-2.5 rounded-full bg-[#F4C36C] hover:bg-[#E5B55D] text-[#081714] text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'ar' ? 'موافق: ترحيل السفاري لـ ٤:٠٠ م وتأكيد الخطة' : 'Shift Quad Tour to 04:00 PM & Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setIsConflictModalOpen(false)}
                className="w-full py-2 rounded-full bg-transparent hover:bg-white/5 text-[#D2E3DE]/70 text-xs font-semibold cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء واختيار بديل آخر' : 'Cancel and choose another option'}
              </button>
            </div>
          </div>
        </div>
      )}

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
