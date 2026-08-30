import React, { useMemo, lazy, Suspense } from 'react';
import {
  Compass,
  Luggage,
  CalendarCheck,
  UtensilsCrossed,
  LifeBuoy,
  Clock,
  Sparkles,
  ArrowRight,
  Waves,
  Sun,
  Coffee,
  Moon,
  Award
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { CinematicVideoHero } from '../common/CinematicVideoHero';
import { TripEntrySection } from './TripEntrySection';
import { HomeSectionNav, HomeSection } from './HomeSectionNav';

/**
 * Every section the homepage composition can render, in page order. The
 * wayfinder drops the ones that are not in the DOM, so modes that hide a
 * section do not leave a dead jump target behind.
 */
const HOME_SECTIONS: HomeSection[] = [
  { id: 'cinematic-hero-cockpit', label: 'Overview', labelAr: 'نظرة عامة' },
  { id: 'how-do-you-want-to-experience-dahab', label: 'Plan your trip', labelAr: 'خطط رحلتك' },
  { id: 'ready-made-trips-subdeck', label: 'Ready trips', labelAr: 'رحلات جاهزة' },
  { id: 'sinai-sea-radar-v2', label: 'Sea & weather', labelAr: 'البحر والجو' },
  { id: 'dahab-week-companion-deck', label: 'Your week', labelAr: 'أسبوعك' },
  { id: 'curated-stories-editorial-rail', label: 'Experiences', labelAr: 'التجارب' },
  { id: 'dahab-visual-gallery', label: 'Gallery', labelAr: 'معرض الصور' },
  { id: 'dahab-spatial-context-map-section', label: 'Map', labelAr: 'الخريطة' },
  { id: 'final-cta-section', label: 'Get started', labelAr: 'ابدأ' }
];
import { SinaiRadarWidget } from '../common/SinaiRadarWidget';
import { AiTravelAssistant } from '../common/AiTravelAssistant';
import { CuratedStoriesRail } from '../common/CuratedStoriesRail';
import { DahabGallerySection } from '../gallery/DahabGallerySection';
import { DahabWeekCompanionDeck } from './DahabWeekCompanionDeck';
import { NextBestActionBanner } from './NextBestActionBanner';
import { FinalCTA } from '../FinalCTA';
import { resolveHomepageComposition } from '../../services/homepageCompositionResolver';
import { useTheme } from '../../context/ThemeContext';

/**
 * The only static importer of @vis.gl/react-google-maps was this file, and this
 * file is the homepage — which App.tsx loads eagerly. So the maps SDK sat on
 * the critical path for every visitor, including the ones who never saw a map:
 * the component below renders behind composition.flags.showSpatialMap, and the
 * SDK downloaded whether that flag was on or not.
 *
 * vite.config.ts already gives the SDK its own vendor-maps chunk and says it
 * should load "only on the pages that draw a map". A static import defeated
 * that, because a preload link is emitted for the entry's whole static graph.
 */
const DahabSpatialContextMap = lazy(() =>
  import('../maps/DahabSpatialContextMap').then(m => ({ default: m.DahabSpatialContextMap }))
);
import {
  PreArrivalPrepCard,
  EarlyArrivalHubCard,
  RecoverySpotlightCard,
  DepartureHubCard,
  PostTripHubCard,
  EmergencyQuickCallCard,
  InTransitTrackerCard,
  ActiveActivityCockpitCard
} from './ContextualStageCards';

interface V2HomeCockpitProps {
  onOpenQuickBook: () => void;
}

export const V2HomeCockpit: React.FC<V2HomeCockpitProps> = ({ onOpenQuickBook }) => {
  const {
    profile,
    tripDays,
    bookings,
    activeFoodOrder,
    navigateTo,
    activePersonaMode,
    journeyStage,
    travelerContext,
    nextBestActions,
    transferTracking,
    user,
    isSignedIn
  } = useTrip();

  const { t, language, isRTL } = useLanguage();
  const { isDark } = useTheme();
  // Removed: `const currentDay = tripDays.find(d => d.dayNumber === 2) || tripDays[0]`
  // — assigned and never read, and `tripDays[0]` is undefined for a traveler
  // with no trip now that the days come from their own itinerary.

  // Resolve state-driven homepage composition based on TravelerLifecyclePhase + 12 Journey Stages
  const composition = useMemo(() => {
    return resolveHomepageComposition({
      journeyStage,
      profile,
      tripDays,
      bookings,
      transferTracking,
      travelerContext,
      nextBestActions,
      // Was `Boolean(user)` — the Firebase user — so the homepage composition
      // resolved as anonymous for every traveler who signed in with a password,
      // which is the only sign-in that works here.
      isAuthenticated: isSignedIn
    });
  }, [journeyStage, profile, tripDays, bookings, transferTracking, travelerContext, nextBestActions, isSignedIn]);

  // Deterministic local time-of-day recommendation engine
  const timeOfDayRecommendations = useMemo(() => {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 11) {
      // Morning Window
      return {
        windowLabelEn: 'Morning Window · 06:00 - 11:00',
        windowLabelAr: 'فترة الصباح · ٠٦:٠٠ - ١١:٠٠',
        slots: [
          {
            time: '07:30 AM',
            badgeEn: 'Calm Sea',
            badgeAr: 'بحر هادئ',
            badgeColor: 'bg-[#20A89A]/30 text-[#52C4B7] border-[#20A89A]/45',
            titleEn: 'Morning Snorkel at Lighthouse Reef',
            titleAr: 'غطسة سنوركل صباحية هادية في اللايتهاوس',
            descEn: 'Crystal clear visibility with zero wind chop before the morning breeze picks up.',
            descAr: 'رؤية ممتازة ومياه هادية جداً قبل هبوب هواء الظهر الخفيف.',
            icon: 'waves'
          },
          {
            time: '09:00 AM',
            badgeEn: 'Breakfast',
            badgeAr: 'فطار شاطئي',
            badgeColor: 'bg-[#E7A83B]/30 text-[#F4C36C] border-[#E7A83B]/45',
            titleEn: "Ralph's German Bakery Fresh Pastries",
            titleAr: 'فطار كرواسون ومخبوزات طازة عند رالف',
            descEn: 'Authentic sourdough, cinnamon rolls, and fresh espresso with seafront seating.',
            descAr: 'مخبوزات ألمانية طازة وكرواسون مع قهوة الصباح وقعدة على البحر.',
            icon: 'coffee'
          },
          {
            time: '10:30 AM',
            badgeEn: 'Coral Prep',
            badgeAr: 'تجهيز غطس',
            badgeColor: 'bg-[#20A89A]/30 text-[#52C4B7] border-[#20A89A]/45',
            titleEn: 'Blue Hole & Canyon Gear Briefing',
            titleAr: 'تجهيز تصاريح ومعدات البلو هول والكانيون',
            descEn: 'Equipment fitting and marine reserve pass validation with certified local center.',
            descAr: 'قياس البدلة والمعدات وتأكيد تصاريح المحمية مع مركز الغوص المعتمد.',
            icon: 'sun'
          }
        ]
      };
    } else if (currentHour >= 11 && currentHour < 15) {
      // Midday Window
      return {
        windowLabelEn: 'Midday Window · 11:00 - 15:00',
        windowLabelAr: 'فترة الظهيرة · ١١:٠٠ - ١٥:٠٠',
        slots: [
          {
            time: '12:15 PM',
            badgeEn: 'Shaded Palapa',
            badgeAr: 'ظل اللاجونا',
            badgeColor: 'bg-[#20A89A]/30 text-[#52C4B7] border-[#20A89A]/45',
            titleEn: 'Lagoon Shaded Beachbed & Windsurf Watch',
            titleAr: 'قعدة شمسية مظللة في اللاجونا وتأجير ويند سيرف',
            descEn: 'Breezy shaded daybed with panoramic views of freestyle kitesurfers across the bay.',
            descAr: 'قعدة مريحة تحت البرجولات مع مشاهدة عروض الكايت سيرف في خليج اللاجونا.',
            icon: 'sun'
          },
          {
            time: '01:45 PM',
            badgeEn: 'Fresh Seafood',
            badgeAr: 'غداء بحري',
            badgeColor: 'bg-[#E7A83B]/30 text-[#F4C36C] border-[#E7A83B]/45',
            titleEn: 'Shrimp Tagine & Fresh Catch at Masbat',
            titleAr: 'طاجن جمبري وسمك قاروص طازة في المسبط',
            descEn: 'Authentic Red Sea catch served with tahina, sayadiya rice, and hot Bedouin bread.',
            descAr: 'سمك طازة من بحر دهب مع أرز صيادية وسلطات وعيش بلدي سخن.',
            icon: 'food'
          },
          {
            time: '03:30 PM',
            badgeEn: 'Bedouin Tea',
            badgeAr: 'شاي حبق',
            badgeColor: 'bg-[#EA8E75]/30 text-[#F4C36C] border-[#EA8E75]/45',
            titleEn: 'Habak Mint Tea & Masraba Artisan Stroll',
            titleAr: 'شاي حبق وتمشية هادية في ممشى المشروبة',
            descEn: 'Relaxed stroll through artisan leather craft shops and Bedouin organic herb stalls.',
            descAr: 'تمشية في محلات المشغولات اليدوية وشراء زيت الزيتون والأعشاب السيناوية.',
            icon: 'coffee'
          }
        ]
      };
    } else if (currentHour >= 15 && currentHour < 19) {
      // Sunset / Afternoon Window
      return {
        windowLabelEn: 'Sunset Window · 15:00 - 19:00',
        windowLabelAr: 'وقت الغروب · ١٥:٠٠ - ١٩:٠٠',
        slots: [
          {
            time: '05:15 PM',
            badgeEn: 'Sunset View',
            badgeAr: 'غروب هادئ',
            badgeColor: 'bg-[#D96C4F]/30 text-[#F4C36C] border-[#EA8E75]/45',
            titleEn: 'Habak Bedouin Sunset Tea at Lighthouse',
            titleAr: 'شاي بالحبق وقعدة غروب رايقة ع اللايتهاوس',
            descEn: 'Unwind on seafront carpets as Sinai mountains turn soft purple across the water.',
            descAr: 'قعدة شلتة على البحر مع ألوان السما فوق جبال سيناء وانعكاس الغروب.',
            icon: 'sun'
          },
          {
            time: '06:45 PM',
            badgeEn: 'Fresh Catch',
            badgeAr: 'عشاء سمك طازة',
            badgeColor: 'bg-[#20A89A]/30 text-[#52C4B7] border-[#20A89A]/45',
            titleEn: 'Ali Baba Seafront Grilled Catch',
            titleAr: 'طاجن وسمك مشوي على البحر عند علي بابا',
            descEn: 'Locally sourced sea-bass with tahina and sayadiya rice right on the water edge.',
            descAr: 'سمك قاروص أو دنيس طازة مع رز صيادية وسلطات في قلب الممشى.',
            icon: 'food'
          },
          {
            time: '08:15 PM',
            badgeEn: 'Night Sky',
            badgeAr: 'سهرة تحت النجوم',
            badgeColor: 'bg-[#E7A83B]/30 text-[#F4C36C] border-[#E7A83B]/45',
            titleEn: 'Wadi Gnai Stargazing & Campfire',
            titleAr: 'سهرة عشاء وشاي بدوي في وادي قناي',
            descEn: 'Zero light pollution Milky Way views with live acoustic Bedouin music in the desert.',
            descAr: 'سما مليانة نجوم ومزيكا سمسمية وشاي ع الفحم في أحضان جبال وادي قناي.',
            icon: 'stars'
          }
        ]
      };
    } else {
      // Evening / Night Window (19:00+)
      return {
        windowLabelEn: 'Evening & Night · 19:00 - 02:00',
        windowLabelAr: 'سهرة المساء · ١٩:٠٠ - ٠٢:٠٠',
        slots: [
          {
            time: '07:30 PM',
            badgeEn: 'Candlelight Dinner',
            badgeAr: 'عشاء شاطئي',
            badgeColor: 'bg-[#20A89A]/30 text-[#52C4B7] border-[#20A89A]/45',
            titleEn: 'Fresh Seafront Catch & Candlelight',
            titleAr: 'عشاء سمك طازة ع الشاطئ في ضوء الشموع',
            descEn: 'Catch of the day grilled over olive charcoal with seaside lantern seating.',
            descAr: 'سمك مشوي على فحم الزيتون مع جلسات الفوانيس على شاطئ المسبط.',
            icon: 'food'
          },
          {
            time: '09:00 PM',
            badgeEn: 'Desert Stars',
            badgeAr: 'نجوم الصحراء',
            badgeColor: 'bg-[#E7A83B]/30 text-[#F4C36C] border-[#E7A83B]/45',
            titleEn: 'Wadi Gnai Bedouin Fire & Stargazing',
            titleAr: 'قعدة نار وشاي بدوي تحت نجوم وادي قناي',
            descEn: 'Milky Way clarity away from ambient lights with acoustic Bedouin simsimiyya.',
            descAr: 'صفاء مجرة درب التبانة بعيداً عن أضواء المدينة وشاي سيناوي ع الفحم.',
            icon: 'stars'
          },
          {
            time: '10:30 PM',
            badgeEn: 'Acoustic Unwind',
            badgeAr: 'روقان ليلي',
            badgeColor: 'bg-[#EA8E75]/30 text-[#F4C36C] border-[#EA8E75]/45',
            titleEn: 'Lighthouse Seafront Acoustic Chill',
            titleAr: 'سهرة شاي ومزيكا هادية على البحر باللايتهاوس',
            descEn: 'Quiet acoustic rhythms and fresh herbal infusion with the gentle Red Sea tide.',
            descAr: 'نغمات هادية وشاي أعشاب سيناوية مع صوت تلاطم أمواج البحر الأحمر.',
            icon: 'moon'
          }
        ]
      };
    }
  }, []);

  return (
    <div
      className="w-full pb-28 md:pb-20 transition-colors duration-300 bg-[var(--bg-canvas)] text-[var(--text-primary)]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      
      {/* ========================================================================= */}
      {/* 0. SECTION WAYFINDER                                                      */}
      {/*                                                                           */}
      {/* This page is eight screens long with six headings, one pair of them       */}
      {/* 1,837px apart — two and a half screens of scrolling with nothing saying   */}
      {/* which part you are in. The URL never changes either, so scroll position   */}
      {/* was the only orientation a reader had. Entries are filtered to the        */}
      {/* sections the composition actually rendered.                               */}
      {/* ========================================================================= */}
      <HomeSectionNav sections={HOME_SECTIONS} />

      {/*
        The page's own title, for the compositions that do not render the hero.

        The cinematic hero carries the <h1> and is deliberately suppressed once
        a trip is booked — "to prioritize operational trip readiness" — which
        left the homepage with no h1 at all in that mode. That path had never
        actually run before: the composition resolver was told
        `isAuthenticated: Boolean(user)`, the Firebase user, which is
        permanently null here, so every traveler got PUBLIC_ANONYMOUS and the
        hero always rendered. Visually hidden, because the composition below
        leads with the trip cockpit rather than a title.
      */}
      {!composition.flags.showHero && (
        <h1 className="sr-only">
          {language === 'ar' ? 'رحلتك في دهب' : 'Your Dahab trip'}
        </h1>
      )}

      {/* ========================================================================= */}
      {/* 1. IMMERSIVE CINEMATIC HERO COCKPIT (SECTION 1: FIRST VISUAL ANCHOR)     */}
      {/* ========================================================================= */}
      {composition.flags.showHero && (
        <CinematicVideoHero
          profile={profile}
          onOpenMyTrip={() => navigateTo('/my-trip', { dayId: 2 })}
          onOpenExplore={() => navigateTo('/explore')}
          onOpenFood={() => navigateTo('/food')}
          onOpenPlanner={() => {
            const el = document.getElementById('how-do-you-want-to-experience-dahab');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              navigateTo('/trip-builder');
            }
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. TRIP ENTRY & BOOKING SYSTEM (SECTION 2: "HOW DO YOU WANT TO EXPERIENCE DAHAB?") */}
      {/* ========================================================================= */}
      {composition.flags.showTripEntry && (
        <TripEntrySection
          onStartCustomPlanner={() => navigateTo('/trip-builder')}
          onOpenItinerary={() => navigateTo('/my-trip', { dayId: 2 })}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. UNIFIED JOURNEY NEXT BEST ACTION & PERSONA MODE SWITCHER               */}
      {/*                                                                           */}
      {/* Suppressed for first-time visitors (PRE_BOOKING). This was the only        */}
      {/* section rendered unconditionally while every other one is composition-     */}
      {/* driven, and for an anonymous visitor its two CTAs ("start designing your   */}
      {/* trip", "browse ready programs") simply repeated the Build-Myself and       */}
      {/* Ready-Trips doorways from six screens earlier — a third planner entry for  */}
      {/* the same destination. It also surfaced the internal "Golden Journeys A–G"  */}
      {/* test-suite launcher. Once a traveler actually has a trip, "next best       */}
      {/* action" is genuinely the most useful thing on the page, so it stays.       */}
      {/* ========================================================================= */}
      {composition.mode !== 'PRE_BOOKING' && (
        <NextBestActionBanner onOpenQuickBook={onOpenQuickBook} />
      )}

      {/* ========================================================================= */}
      {/* CONTEXTUAL PRIMARY STAGE CARDS                                            */}
      {/* ========================================================================= */}
      {composition.flags.showTransitTracker && <InTransitTrackerCard />}
      {composition.flags.showActiveActivityCockpit && <ActiveActivityCockpitCard />}
      {composition.flags.showPreArrivalPrep && <PreArrivalPrepCard />}
      {composition.flags.showEarlyArrivalHub && <EarlyArrivalHubCard />}
      {composition.flags.showRecoverySpotlight && <RecoverySpotlightCard />}
      {composition.flags.showDepartureHub && <DepartureHubCard />}
      {composition.flags.showPostTripHub && <PostTripHubCard />}
      {journeyStage === 'help' && <EmergencyQuickCallCard />}

      {/* ========================================================================= */}
      {/* 4. REAL-TIME SINAI MARINE & WEATHER RADAR                                 */}
      {/* ========================================================================= */}
      {composition.flags.showRadar && (
        <div className="relative z-20 my-4">
          <SinaiRadarWidget />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. WHAT SHOULD I DO NOW? (PROMINENT CONTEXT-AWARE INTELLIGENCE WIDGET)    */}
      {/* ========================================================================= */}
      {composition.flags.showWhatNow && (
        <section
          aria-label="What Should I Do Now Intelligence"
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-2xl transition-all">
            <div className="relative z-10 p-6 sm:p-8 space-y-6 text-[var(--text-primary)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-secondary)]">
                      {t('whatNow.perfectForYou')}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--surface-container)]">
                      {language === 'ar' ? timeOfDayRecommendations.windowLabelAr : timeOfDayRecommendations.windowLabelEn}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
                    {t('whatNow.title')}
                  </h2>
                  <p className="text-xs sm:text-sm max-w-2xl font-normal text-[var(--text-secondary)]">
                    {t('whatNow.timeInsight')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('/ai-director')}
                    className="px-6 py-3 rounded-2xl bg-[var(--btn-book-bg)] hover:bg-[var(--btn-book-hover)] text-[var(--btn-book-text)] font-extrabold text-xs transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 shrink-0 group active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--btn-book-text)] group-hover:rotate-12 transition-transform" />
                    <span>{t('whatNow.buildNext3Hours')}</span>
                  </button>
                </div>
              </div>

              {/* Real-time 3-Step Instant Decision Flow with Time-of-Day Context */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timeOfDayRecommendations.slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-container)] hover:border-[var(--accent-primary)] space-y-3 transition-all duration-300 shadow-md group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--accent-primary)] flex items-center gap-1.5">
                        {slot.icon === 'waves' && <Waves className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />}
                        {slot.icon === 'coffee' && <Coffee className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                        {slot.icon === 'sun' && <Sun className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                        {slot.icon === 'food' && <UtensilsCrossed className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />}
                        {slot.icon === 'stars' && <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                        {slot.icon === 'moon' && <Moon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />}
                        <span className="text-[var(--accent-primary)] font-bold">{slot.time}</span>
                      </span>
                      <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)]">
                        {language === 'ar' ? slot.badgeAr : slot.badgeEn}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {language === 'ar' ? slot.titleAr : slot.titleEn}
                    </h3>
                    <p className="text-xs leading-relaxed font-normal text-[var(--text-secondary)]">
                      {language === 'ar' ? slot.descAr : slot.descEn}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. DAHAB 7-DAY WEEK COMPANION & ACCESSIBLE 1-TAP ACTION DOCK               */}
      {/* ========================================================================= */}
      {composition.flags.showCompanionDeck && (
        <DahabWeekCompanionDeck onOpenQuickBook={onOpenQuickBook} />
      )}

      {/* ========================================================================= */}
      {/* 6. CURATED STORIES & EDITORIAL EXPERIENCES                                */}
      {/* ========================================================================= */}
      {composition.flags.showStories && <CuratedStoriesRail />}

      {/* ========================================================================= */}
      {/* 7. DAHAB HIGH-DEFINITION PHOTO GALLERY & SCENIC ARCHIVE                   */}
      {/* ========================================================================= */}
      {composition.flags.showGallery && <DahabGallerySection />}

      {/* ========================================================================= */}
      {/* 8. DAHAB SPATIAL CONTEXT & REAL-TIME TERRAIN RADAR                        */}
      {/* ========================================================================= */}
      {composition.flags.showSpatialMap && (
        <Suspense fallback={null}>
          <DahabSpatialContextMap />
        </Suspense>
      )}

      {/* ========================================================================= */}
      {/* 9. EMBEDDED SINAI TRAVEL INTELLIGENCE ASSISTANT                           */}
      {/* ========================================================================= */}
      {composition.flags.showAiAssistant && <AiTravelAssistant />}

      {/* ========================================================================= */}
      {/* 10. QUICK ACTION TRIP TOOL GRID                                           */}
      {/* ========================================================================= */}
      {composition.flags.showQuickServices && (
        <section
          id="quick-trip-services-grid"
          aria-label="Dahab Concierge & Travel Modules"
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-2xl p-6 sm:p-8">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-secondary)]">
                    {language === 'ar' ? 'خدمات ورحلات دهب السريعة' : 'Direct Sinai Concierge Services'}
                  </span>
                  <h2 className="text-2xl font-serif font-bold tracking-tight mt-1 text-[var(--text-primary)]">
                    {language === 'ar' ? 'كل اللي هتحتاجه في رحلتك بضغطة واحدة' : 'Essential Trip Tools & Direct Bookings'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <button
                  type="button"
                  onClick={() => onOpenQuickBook()}
                  className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container)] hover:border-[var(--accent-secondary)] shadow-lg hover:-translate-y-1 transition-all duration-300 text-start cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                    <Waves className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {language === 'ar' ? 'حجز غطس ورحلات بحرية' : 'Book Dive & Marine Trip'}
                  </h3>
                  <p className="text-xs font-normal leading-relaxed text-[var(--text-secondary)]">
                    {language === 'ar' ? 'البلو هول، الكانيون، الغوص الحر وتصاريح رأس أبو جالوم.' : 'Blue Hole, The Canyon, guided freediving sessions & marine permits.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/food')}
                  className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container)] hover:border-[var(--accent-primary)] shadow-lg hover:-translate-y-1 transition-all duration-300 text-start cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {language === 'ar' ? 'أكل ومميزات واصلة للشاطئ' : 'Palapa Beach Food Delivery'}
                  </h3>
                  <p className="text-xs font-normal leading-relaxed text-[var(--text-secondary)]">
                    {language === 'ar' ? 'يوصلك لحد شلتك ع البحر أو أوضتك في اللاجونا.' : 'Direct delivery to your beach chair, lagoon palapa or seafront room.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/post-trip')}
                  className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container)] hover:border-[var(--accent-secondary)] shadow-lg hover:-translate-y-1 transition-all duration-300 text-start cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {language === 'ar' ? 'جواز مستكشف دهب والذكريات' : 'Dahab Passport & Memories'}
                  </h3>
                  <p className="text-xs font-normal leading-relaxed text-[var(--text-secondary)]">
                    {language === 'ar' ? 'الشارات اللي جمعتها، ألبوم الصور، وتفاصيل أيامك.' : 'Unlocked experience badges, photo stories & trip statistics.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('/help')}
                  className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-container)] hover:border-[var(--accent-primary)] shadow-lg hover:-translate-y-1 transition-all duration-300 text-start cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {language === 'ar' ? 'طوارئ دهب وغرفة الضغط ٢٤ ساعة' : '24/7 Sinai Concierge & Med'}
                  </h3>
                  <p className="text-xs font-normal leading-relaxed text-[var(--text-secondary)]">
                    {language === 'ar' ? 'طبيب أعماق مناوب، مساعدة سريعة، وخط طوارئ مباشر.' : 'Hyperbaric chamber doctor on call, local assistance and SOS hotline.'}
                  </p>
                </button>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 10.5 CLOSING CONVERSION MOMENT                                            */}
      {/*                                                                           */}
      {/* The page previously ended on the terrain map: a visitor who scrolled all   */}
      {/* the way down reached a dead end with no next step. FinalCTA already        */}
      {/* existed, fully built, and was never rendered anywhere in the app. Shown    */}
      {/* only to visitors who have not booked — for a traveler mid-trip, "ready to  */}
      {/* discover Dahab?" is the wrong question.                                    */}
      {/* ========================================================================= */}
      {composition.mode === 'PRE_BOOKING' && (
        <FinalCTA
          onPlanTripClick={() => {
            const el = document.getElementById('how-do-you-want-to-experience-dahab');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else navigateTo('/trip-builder');
          }}
          onExploreClick={() => navigateTo('/explore')}
        />
      )}

      {/* ========================================================================= */}
      {/* 11. WORLD-CLASS EDITORIAL FOOTER                                          */}
      {/* ========================================================================= */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-[var(--border-subtle)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[var(--accent-primary)] text-[var(--bg-canvas)] flex items-center justify-center text-xs font-bold">
                D
              </div>
              <span className="font-serif font-bold tracking-wide text-[var(--text-primary)]">
                {t('brand.name')}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">· {t('brand.tagline')}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'ar'
                ? 'كل تفصيلة في رحلتك لدهب متظبطة مع ناس ثقة من أهل البلد.'
                : 'Crafted for unhurried Red Sea journeys, coral exploration, and Sinai desert wonder.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[var(--text-secondary)]">
            <button type="button" onClick={() => navigateTo('/my-trip')} className="cursor-pointer hover:text-[var(--text-primary)]">
              {t('nav.myTrip')}
            </button>
            <button type="button" onClick={() => navigateTo('/live')} className="cursor-pointer hover:text-[var(--text-primary)]">
              {t('nav.dahabLive')}
            </button>
            <button type="button" onClick={() => navigateTo('/ai-director')} className="cursor-pointer hover:text-[var(--text-primary)]">
              {t('nav.aiDirector')}
            </button>
            <button type="button" onClick={() => navigateTo('/post-trip')} className="cursor-pointer hover:text-[var(--text-primary)]">
              {t('nav.memories')}
            </button>
            <button type="button" onClick={() => navigateTo('/food')} className="cursor-pointer hover:text-[var(--text-primary)]">
              {t('food.title')}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

