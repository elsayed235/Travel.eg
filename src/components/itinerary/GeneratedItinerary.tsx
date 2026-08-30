import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Gauge, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  SlidersHorizontal, 
  Info, 
  Waves, 
  Tag, 
  Share2, 
  Check, 
  ShieldCheck, 
  Download, 
  Heart,
  MessageSquareQuote,
  Clock
} from 'lucide-react';
import { ItineraryDayCard, DayItinerary } from './ItineraryDayCard';
import { ActivityDetailModal, ActivityDetailData } from './ActivityDetailModal';
import { AlternativesModal, AlternativeItem } from './AlternativesModal';
import { TripCustomizeModal } from './TripCustomizeModal';
import { TripDynamicType } from '../planner/StepTravelers';
import { BudgetTier } from '../planner/StepBudget';
import { InterestId } from '../planner/StepInterests';
import { PaceType } from '../planner/StepPace';
import { TripBriefCard } from '../tripos/TripBriefCard';
import { TripBriefModal } from '../tripos/TripBriefModal';
import { TripHealthModal } from '../tripos/TripHealthModal';
import { BudgetBreakdownModal } from '../tripos/BudgetBreakdownModal';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface GeneratedItineraryProps {
  durationLabel: string;
  adultsCount: number;
  childrenCount: number;
  tripDynamic: TripDynamicType | null;
  selectedBudget: BudgetTier;
  selectedInterests: InterestId[];
  selectedPace: PaceType;
  onEditPreferences: () => void;
  onReturnHome: () => void;
  onContinueToBooking: () => void;
}

export const INITIAL_5_DAY_ITINERARY: DayItinerary[] = [
  {
    dayNumber: 1,
    title: 'Arrival & Slow Start',
    theme: 'Arrival & Coastline Stroll',
    badge: 'Easy start',
    summary: 'Arrive in Sinai, check in by the sea, and enjoy an unhurried sunset walk along the Lighthouse promenade.',
    items: [
      {
        id: 'd1-1',
        time: '10:00 AM',
        name: 'Arrival in Sharm El Sheikh',
        description: 'Flight arrival at SSH Airport with meet-and-greet assistance.',
        location: 'Sharm El Sheikh International Airport (SSH)',
        category: 'Transfer',
        status: 'suggested',
        details: {
          fullDetails: 'Private air-conditioned transfer awaiting your arrival outside the terminal with luggage assistance.',
          included: ['Private AC vehicle', 'Driver meet-and-greet', 'Water bottles on board'],
          tips: 'Keep your passport handy for standard Sinai highway checkpoints along the coast.',
        },
      },
      {
        id: 'd1-2',
        time: '11:30 AM',
        name: 'Transfer to Dahab',
        description: 'Scenic 1-hour coastal drive winding between Sinai red granite mountains and the Gulf of Aqaba.',
        location: 'Sinai Coastal Highway',
        category: 'Transfer',
        status: 'suggested',
      },
      {
        id: 'd1-3',
        time: '1:00 PM',
        name: 'Check-in / Leave bags',
        description: 'Settle into your beachfront accommodation in the peaceful Lighthouse / Eel Garden area.',
        location: 'Lighthouse Waterfront Lodge',
        category: 'Stay',
        status: 'suggested',
      },
      {
        id: 'd1-4',
        time: '2:00 PM',
        name: 'Lunch near the hotel',
        description: 'Casual open-air lunch with fresh Egyptian meze, grilled halloumi, and fresh mango juice.',
        location: 'Seaside Promenade Cafe',
        category: 'Food',
        status: 'suggested',
      },
      {
        id: 'd1-5',
        time: '4:00 PM',
        name: 'Beach & Lighthouse walk',
        description: 'Unwind with an easy seaside walk from Lighthouse Bay to Eel Garden as the late afternoon light softens.',
        location: 'Lighthouse Bay & Coral Promenade',
        category: 'Leisure',
        status: 'free_time',
      },
      {
        id: 'd1-6',
        time: '7:30 PM',
        name: 'Local dinner',
        description: 'Authentic local dinner under warm Bedouin lanterns featuring slow-cooked lamb and freshly baked bread.',
        location: 'Ali Baba / Bedouin Lodge Restaurant',
        category: 'Food',
        status: 'suggested',
      },
    ],
  },
  {
    dayNumber: 2,
    title: 'Dive & Explore',
    theme: 'World-Class Reefs & Seaside Rhythm',
    summary: 'Discover Dahab’s legendary underwater world in the morning, followed by relaxing seaside cafes.',
    items: [
      {
        id: 'd2-1',
        time: '9:00 AM',
        name: 'Diving experience',
        description: 'Guided morning dive at Lighthouse Reef & Eel Garden with certified local dive masters.',
        location: 'Blue Hole / Lighthouse Reef Area',
        category: 'Diving',
        status: 'suggested',
        isHighlight: true,
        image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=800&auto=format&fit=crop',
        details: {
          fullDetails: 'Experience Dahab’s vibrant coral gardens and rich marine life. Includes comprehensive briefing, full scuba equipment, and dedicated dive guides suited for both certified divers and beginners.',
          included: ['Full dive gear (tanks, BCD, wetsuit, regulator)', 'Certified dive guide', 'Marine park entry permits', 'Post-dive debrief & log verification'],
          tips: 'Stay well hydrated and bring your certification card or logbook if you are certified.',
        },
      },
      {
        id: 'd2-2',
        time: '1:00 PM',
        name: 'Lunch',
        description: 'Post-dive seaside lunch with freshly caught fish, tahina, and bedouin bread right by the water.',
        location: 'Eel Garden Waterfront Restaurant',
        category: 'Food',
        status: 'suggested',
      },
      {
        id: 'd2-3',
        time: '3:00 PM',
        name: 'Free time',
        description: 'Nap in a seafront hammock, read, or take a gentle swim in the clear shallow reef pools.',
        location: 'Lighthouse Beach Huts',
        category: 'Leisure',
        status: 'free_time',
      },
      {
        id: 'd2-4',
        time: '5:00 PM',
        name: 'Coffee by the sea',
        description: 'Sip authentic Habak herbal tea or specialty espresso at an open-air bohemian seaside lounge.',
        location: 'Everyday Cafe / Ralph’s German Bakery',
        category: 'Food',
        status: 'suggested',
      },
      {
        id: 'd2-5',
        time: '8:00 PM',
        name: 'Dinner',
        description: 'Seafood barbecue along the illuminated water’s edge with relaxed acoustic music in the background.',
        location: 'El Fanar Seafood Grill',
        category: 'Food',
        status: 'suggested',
      },
    ],
  },
  {
    dayNumber: 3,
    title: 'Desert Adventure',
    theme: 'Sinai Canyons & Bedouin Campfire',
    summary: 'A lazy morning to recharge, then head deep into the Sinai mountains for a 4x4 desert canyon safari and sunset dinner.',
    items: [
      {
        id: 'd3-1',
        time: '9:00 AM',
        name: 'Slow breakfast',
        description: 'Relaxed breakfast with fresh fruit, shakshuka, and coffee listening to the morning tide.',
        location: 'Waterfront Terrace',
        category: 'Food',
        status: 'free_time',
      },
      {
        id: 'd3-2',
        time: '11:00 AM',
        name: 'Free morning',
        description: 'Free hours for snorkeling, paddleboarding, or exploring local boutique dive shops.',
        location: 'Dahab Bay',
        category: 'Leisure',
        status: 'free_time',
      },
      {
        id: 'd3-3',
        time: '2:00 PM',
        name: 'Desert Safari',
        description: '4x4 expedition through the dramatic sandstone gorges of Colored Canyon and hidden desert wadis.',
        location: 'Sinai Desert Canyons & Protected Valley',
        category: 'Adventure',
        status: 'suggested',
        isHighlight: true,
        hasAlternatives: true,
        alternativeCount: 3,
        alternativeName: 'canyon-4x4',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
        details: {
          fullDetails: 'Venture into the heart of the South Sinai mountains in a private 4x4 safari Jeep accompanied by local Bedouin trackers. Hike through sculpted natural rock passages and sandstone formations.',
          included: ['4x4 Land Cruiser transport with driver', 'Bedouin local wilderness guide', 'Desert tea brewed over acacia wood', 'Protected area conservation fees'],
          tips: 'Wear sturdy closed-toe walking shoes or trainers for the canyon walks.',
        },
      },
      {
        id: 'd3-4',
        time: '6:00 PM',
        name: 'Sunset',
        description: 'Watch the sun drop behind the jagged Sinai ridges as the desert turns shades of amber, violet, and gold.',
        location: 'Wadi Gnai Canyon Lookout',
        category: 'Adventure',
        status: 'suggested',
      },
      {
        id: 'd3-5',
        time: '8:00 PM',
        name: 'Dinner',
        description: 'Traditional Bedouin feast prepared underground and over hot desert coals under thousands of stars.',
        location: 'Bedouin Mountain Desert Camp',
        category: 'Food',
        status: 'suggested',
      },
    ],
  },
  {
    dayNumber: 4,
    title: 'Sea & Local Life',
    theme: 'Ras Abu Galum & Bedouin Coastal Living',
    summary: 'Boat ride to remote coastal lagoons, pristine coral snorkeling, and evening exploration of Dahab’s local artisan village.',
    items: [
      {
        id: 'd4-1',
        time: '9:00 AM',
        name: 'Breakfast',
        description: 'Fresh pastries, warm falafel, and freshly pressed pomegranate juice in Assalah village.',
        location: 'Assalah Local Bakery',
        category: 'Food',
        status: 'suggested',
      },
      {
        id: 'd4-2',
        time: '11:00 AM',
        name: 'Boat / snorkeling experience',
        description: 'Boat excursion from Blue Hole to Ras Abu Galum nature reserve and the crystal turquoise Blue Lagoon.',
        location: 'Ras Abu Galum & Blue Lagoon',
        category: 'Water Activities',
        status: 'suggested',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
        details: {
          fullDetails: 'Sail along the dramatic sea cliffs north of Dahab to Ras Abu Galum, a tranquil Bedouin fishing community with some of the clearest waters in Egypt. Swim and snorkel in virgin coral gardens.',
          included: ['Speedboat return transfer from Blue Hole', 'Snorkeling mask & fins', 'Bedouin shade hut access in Blue Lagoon', 'National Park conservation permit'],
          tips: 'Bring reef-safe sunscreen and a light windbreaker for the boat ride.',
        },
      },
      {
        id: 'd4-3',
        time: '2:00 PM',
        name: 'Local lunch',
        description: 'Fresh grilled fish caught by local fishermen served with Bedouin salad and rice on woven beach carpets.',
        location: 'Ras Abu Galum Beach Huts',
        category: 'Food',
        status: 'suggested',
      },
      {
        id: 'd4-4',
        time: '4:00 PM',
        name: 'Free time',
        description: 'Swim in the flat turquoise lagoon or simply unwind in the quiet desert breeze.',
        location: 'Blue Lagoon Shoreline',
        category: 'Leisure',
        status: 'free_time',
      },
      {
        id: 'd4-5',
        time: '7:00 PM',
        name: 'Explore Dahab',
        description: 'Wander through Assalah and Mashraba, discovering silver artisans, organic spices, and handmade rugs.',
        location: 'Assalah & Mashraba Markets',
        category: 'Local Life',
        status: 'suggested',
      },
    ],
  },
  {
    dayNumber: 5,
    title: 'Last Morning',
    theme: 'Farewell Swim & Smooth Departure',
    badge: 'Departure',
    summary: 'A final morning dip in the Red Sea, relaxed packing, and private airport transfer back to Sharm El Sheikh.',
    items: [
      {
        id: 'd5-1',
        time: '9:00 AM',
        name: 'Breakfast',
        description: 'Final breakfast on the seaside terrace with fresh coffee and sea breeze.',
        location: 'Lighthouse Seaside Cafe',
        category: 'Food',
        status: 'suggested',
      },
      {
        id: 'd5-2',
        time: '10:30 AM',
        name: 'Final beach time',
        description: 'Last morning swim in the clear waters of Lighthouse Bay.',
        location: 'Lighthouse Beach',
        category: 'Leisure',
        status: 'free_time',
      },
      {
        id: 'd5-3',
        time: '11:00 AM',
        name: 'Checkout',
        description: 'Pack bags and complete checkout at hotel reception.',
        location: 'Lighthouse Waterfront Lodge',
        category: 'Stay',
        status: 'suggested',
      },
      {
        id: 'd5-4',
        time: '1:00 PM',
        name: 'Transfer',
        description: 'Private transfer from Dahab back to Sharm El Sheikh International Airport for return departure.',
        location: 'Direct transfer to SSH Airport',
        category: 'Transfer',
        status: 'suggested',
      },
    ],
  },
];

export const GeneratedItinerary: React.FC<GeneratedItineraryProps> = ({
  durationLabel,
  adultsCount,
  childrenCount,
  tripDynamic,
  selectedBudget,
  selectedInterests,
  selectedPace,
  onEditPreferences,
  onReturnHome,
  onContinueToBooking,
}) => {
  const { t, language, isRTL } = useLanguage();
  // State for Trip Approval: false = Suggested Itinerary, true = Trip Approved
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // Modals state
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [selectedActivityForDetails, setSelectedActivityForDetails] = useState<ActivityDetailData | null>(null);
  
  // Alternatives modal state
  const [alternativesModalOpen, setAlternativesModalOpen] = useState<boolean>(false);
  const [currentAlternativeActivity, setCurrentAlternativeActivity] = useState<string>('');
  const [activeAlternativeId, setActiveAlternativeId] = useState<string>('canyon-4x4');

  // Active Itinerary state
  const [itineraryDays, setItineraryDays] = useState<DayItinerary[]>(INITIAL_5_DAY_ITINERARY);

  // Trip OS Context & Modal State
  const { tripHealth, activeTrip, profile } = useTrip();

  /**
   * The blueprint panel described a fixed trip.
   *
   * Budget, pace and interests were `t()` calls with literal fallbacks —
   * "Moderate Budget", "Balanced", "Diving, Adventure, Food" — so a traveler
   * who had just chosen Premium and Relaxed with an interest in food read back
   * somebody else's blueprint on the screen that asks them to approve it.
   */
  const chosenBudget = activeTrip?.budget || profile.budget;
  const chosenPace = activeTrip?.pace || profile.pace;
  const chosenInterests = (activeTrip?.interests?.length ? activeTrip.interests : profile.interests) || [];
  const [isTripBriefModalOpen, setIsTripBriefModalOpen] = useState<boolean>(false);
  const [isTripHealthModalOpen, setIsTripHealthModalOpen] = useState<boolean>(false);
  const [isBudgetBreakdownModalOpen, setIsBudgetBreakdownModalOpen] = useState<boolean>(false);

  const handleApproveTrip = () => {
    setIsApproved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAlternative = (alt: AlternativeItem) => {
    setActiveAlternativeId(alt.id);
    // Update Day 3 safari name dynamically
    setItineraryDays((prev) =>
      prev.map((day) => {
        if (day.dayNumber === 3) {
          return {
            ...day,
            items: day.items.map((item) => {
              if (item.id === 'd3-3') {
                return {
                  ...item,
                  name: alt.title,
                  description: alt.description,
                  alternativeName: alt.id,
                };
              }
              return item;
            }),
          };
        }
        return day;
      })
    );
  };

  const travelersSummary = `${adultsCount} ${language === 'ar' ? 'أفراد' : (adultsCount > 1 ? 'Adults' : 'Adult')}${
    tripDynamic ? ` · ${tripDynamic}` : ''
  }`;

  return (
    <div
      id="generated-itinerary-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] pb-24 sm:pb-16"
    >
      {/* 1. Top Global Navigation Header */}
      <header className="border-b border-white/10 bg-[#081714]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReturnHome}
              className="text-xl font-black tracking-widest text-[#F7F3EA] font-['Outfit',sans-serif] hover:opacity-80 transition-opacity"
            >
              DAHAB
            </button>
            <span className="text-white/20">/</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4C36C] hidden sm:inline">
              {t('itinerary.badge.personalized', 'Personalized Trip')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Trip OS Health Status Pill */}
            <button
              type="button"
              id="header-trip-health-btn"
              onClick={() => setIsTripHealthModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                tripHealth.criticalCount === 0 && tripHealth.warningCount === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{tripHealth.statusLabel}</span>
            </button>

            <button
              type="button"
              id="header-edit-preferences-btn"
              onClick={onEditPreferences}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D2E3DE] hover:text-white px-3.5 py-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span>{t('itinerary.btn.editPreferences', 'Edit preferences')}</span>
            </button>

            {!isApproved ? (
              <button
                type="button"
                id="header-approve-trip-btn"
                onClick={handleApproveTrip}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F4C36C] hover:bg-amber-300 text-[#081714] text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <span>{t('itinerary.btn.approveTrip', 'Approve Trip')}</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('itinerary.btn.tripApproved', 'Trip Approved')}</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Confirmation Message */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4C36C]/10 text-[#F4C36C] border border-[#F4C36C]/20 text-xs font-bold uppercase tracking-widest mb-3.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('itinerary.badge.curatedForYou', 'Curated For Ahmed')}</span>
          </div>

          <h1
            id="itinerary-main-title"
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F3EA] tracking-tight leading-[1.12]"
          >
            {t('itinerary.mainTitle', 'We built this Dahab trip for you.')}
          </h1>

          <p
            id="itinerary-supporting-subtitle"
            className="mt-3 text-base sm:text-lg text-[#D2E3DE] leading-relaxed font-normal max-w-3xl"
          >
            {t('itinerary.subTitle', 'A balanced 5-day experience with diving, adventure, local food, and enough time to slow down.')}
          </p>
        </div>

        {/* Status Notification Banner (Suggested vs Approved) */}
        {!isApproved ? (
          <div
            id="status-suggested-banner"
            className="p-4 sm:p-5 rounded-2xl bg-[#0E2520] border border-white/10 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F4C36C]/15 text-[#F4C36C] flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4C36C]">
                    {t('itinerary.status.label', 'Status')}
                  </span>
                  <span className="text-xs font-bold text-[#F7F3EA] bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                    {t('itinerary.status.suggested', 'Suggested itinerary')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#D2E3DE] mt-0.5 font-normal">
                  {t('itinerary.status.suggestedDesc', 'Review and approve your trip before booking. Everything is fully flexible.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <button
                type="button"
                id="banner-customize-btn"
                onClick={() => setIsCustomizeOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F7F3EA] hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-full border border-white/10 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t('itinerary.btn.customize', 'Customize Trip')}</span>
              </button>

              <button
                type="button"
                id="banner-approve-btn"
                onClick={handleApproveTrip}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F4C36C] hover:bg-amber-300 text-[#081714] text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>{t('itinerary.btn.approveTrip', 'Approve Trip')}</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            id="status-approved-banner"
            className="p-5 sm:p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-[#081714] flex items-center justify-center flex-shrink-0 shadow-2xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-[#081714]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-emerald-200">
                    {t('itinerary.status.approved', 'Trip approved')}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    {t('itinerary.status.readyForBooking', 'Ready for booking')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-300/90 mt-0.5 font-normal">
                  {t('itinerary.status.readyDesc', "Your itinerary is ready. Let's take care of the bookings.")}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="approved-continue-to-booking-btn"
              onClick={onContinueToBooking}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#081714] text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap self-start sm:self-center"
            >
              <span>{t('itinerary.btn.continueBooking', 'Continue to Booking')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {/*
          Removed from this page: TripFitScoreCard, MakeItBetterBar and, below,
          DayIntelligenceHeader and TripReadinessCard.

          Each rendered a score presented as computed for this trip — an
          overall fit of 94 with "Preference Coverage 96%", a readiness of 88,
          per-day intelligence and a set of trade-offs — read from fixed
          objects in src/data/tripOsDefaults.ts. There is no engine behind any
          of them: the numbers were identical for every traveler and every
          itinerary, and no code path ever recalculated one.

          The brief below is kept because it describes the trip rather than
          scoring it, and it is bound to the traveler's own trip record now.
          Trip health is kept too, and comes from
          GET /api/daygi/health/:tripId, which genuinely derives its issues
          from the trip's items, bookings and holds.
        */}
        <div className="space-y-6 mb-8">
          <TripBriefCard
            onOpenEditModal={() => setIsTripBriefModalOpen(true)}
          />
        </div>

        {/* 3. Hero Editorial Card Header with Tags & Metrics */}
        <div className="rounded-3xl border border-white/10 bg-[#0E2520] overflow-hidden shadow-xs mb-8">
          {/* Hero Banner Image */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-black/30">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1600&auto=format&fit=crop"
              alt="Dahab coastline where South Sinai mountains meet the turquoise Red Sea waters"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E2520] via-black/40 to-transparent" />

            {/* Top Right Floating Tags */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={onEditPreferences}
                className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5"
              >
                <span>{language === 'ar' ? 'تعديل التفضيلات' : 'Edit preferences'}</span>
              </button>
            </div>

            {/* Bottom Hero Details Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F4C36C] text-[#081714] text-xs font-bold uppercase tracking-wider">
                    {language === 'ar' ? 'جنوب سيناء، مصر' : 'South Sinai, Egypt'}
                  </span>
                  <span className="text-xs font-semibold text-white/80">
                    {language === 'ar' ? `٥ أيام · ${adultsCount} مسافرين` : `5 Days · ${adultsCount} Travelers`}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F7F3EA] tracking-tight leading-none">
                  {language === 'ar' ? 'دهـب' : 'Dahab'}
                </h2>

                {/* Preference Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3.5">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#F7F3EA] text-xs font-semibold border border-white/20">
                    {language === 'ar' ? 'الغوص والشعاب' : 'Diving'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#F7F3EA] text-xs font-semibold border border-white/20">
                    {language === 'ar' ? 'مغامرات وسفاري' : 'Adventure'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#F7F3EA] text-xs font-semibold border border-white/20">
                    {language === 'ar' ? 'مأكولات وأكلات محلية' : 'Food'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F4C36C] text-[#081714] text-xs font-bold">
                    {language === 'ar' ? 'إيقاع متوازن' : 'Balanced'}
                  </span>
                </div>
              </div>

              {/* Quick Summary Pill on Desktop */}
              <div className="hidden md:flex items-center gap-3 bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-xs text-white/90">
                <div className="text-center px-2">
                  <span className="block font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? '٥ أيام' : '5 Days'}</span>
                  <span className="text-[11px] text-white/60">{language === 'ar' ? 'المدة' : 'Duration'}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="text-center px-2">
                  <span className="block font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? `${adultsCount} بالغين` : `${adultsCount} Adults`}</span>
                  <span className="text-[11px] text-white/60">{language === 'ar' ? 'المسافرين' : 'Travelers'}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="text-center px-2">
                  <span className="block font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? 'متوسطة' : 'Moderate'}</span>
                  <span className="text-[11px] text-white/60">{language === 'ar' ? 'الميزانية' : 'Budget'}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="text-center px-2">
                  <span className="block font-bold text-sm text-[#F7F3EA]">{language === 'ar' ? 'متوازن' : 'Balanced'}</span>
                  <span className="text-[11px] text-white/60">{language === 'ar' ? 'الإيقاع' : 'Pace'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Metric Strip for All Viewports */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10 border-t border-white/10 bg-[#0E2520] text-xs">
            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#13312B] border border-white/10 flex items-center justify-center text-[#F4C36C]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60 block">
                  {language === 'ar' ? 'مدة الرحلة' : 'Trip Duration'}
                </span>
                <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? '٥ أيام' : '5 Days'}</span>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#13312B] border border-white/10 flex items-center justify-center text-[#F4C36C]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60 block">
                  {language === 'ar' ? 'المسافرون' : 'Travelers'}
                </span>
                <span className="font-bold text-[#F7F3EA]">{travelersSummary}</span>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#13312B] border border-white/10 flex items-center justify-center text-[#F4C36C]">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60 block">
                  {language === 'ar' ? 'فئة الميزانية' : 'Budget Level'}
                </span>
                <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'ميزانية متوسطة' : 'Moderate Budget'}</span>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#13312B] border border-white/10 flex items-center justify-center text-[#F4C36C]">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D2E3DE]/60 block">
                  {language === 'ar' ? 'إيقاع الرحلة' : 'Daily Rhythm'}
                </span>
                <span className="font-bold text-[#F7F3EA]">{language === 'ar' ? 'إيقاع متوازن' : 'Balanced Pace'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Two-Column Layout on Desktop: Left Itinerary Timeline, Right Trip Context Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Itinerary Content (Left 8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Why This Trip AI Recommendation Box */}
            <div
              id="why-this-trip-card"
              className="p-6 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xs flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F4C36C]/10 text-[#F4C36C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-serif font-bold text-[#F7F3EA]">
                    {language === 'ar' ? 'لماذا صممنا هذا البرنامج خصيصاً لك؟' : 'Why this trip?'}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F4C36C]/15 text-[#F4C36C] px-2 py-0.5 rounded-full border border-[#F4C36C]/20">
                    {language === 'ar' ? 'تخطيط مخصص' : 'Tailored Logic'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#D2E3DE] leading-relaxed font-normal">
                  {language === 'ar'
                    ? 'بناءً على تفضيلك للغوص والمغامرة والأكل المحلي دون ازدحام جدولك، صممنا الأيام بتوازن يمنحك صباحات هادئة ووقت بحر مفتوح وسهرات بدوية أصيلة.'
                    : 'You told us you wanted diving, adventure, and great food without packing every hour. We built the days around those priorities with unhurried mornings and open sea time.'}
                </p>
              </div>
            </div>

            {/* Customize Trip Action Banner */}
            <div className="p-4 rounded-2xl bg-[#0E2520] border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-[#F4C36C]" />
                <span className="text-xs font-bold text-[#F7F3EA]">
                  {language === 'ar' ? 'ترغب في تعديل الأيام أو تبديل الأنشطة؟' : 'Want to adjust days or swap experiences?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(true)}
                className="px-4 py-1.5 rounded-full bg-[#13312B] border border-white/10 hover:border-[#F4C36C] text-xs font-bold text-[#F7F3EA] transition-colors cursor-pointer shadow-2xs"
              >
                {language === 'ar' ? 'تخصيص البرنامج' : 'Customize Trip'}
              </button>
            </div>

            {/* Vertical Timeline Day-by-Day */}
            <div className="space-y-8">
              {itineraryDays.map((day) => (
                <div key={day.dayNumber} className="space-y-3">
                  <ItineraryDayCard
                    day={day}
                    onOpenActivityDetails={(data) => setSelectedActivityForDetails(data)}
                    onOpenAlternatives={(activityTitle, currentId) => {
                      setCurrentAlternativeActivity(activityTitle);
                      setActiveAlternativeId(currentId);
                      setAlternativesModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom Trip Actions Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xs text-center flex flex-col items-center">
              {!isApproved ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#F4C36C]/10 text-[#F4C36C] flex items-center justify-center mb-3.5">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F7F3EA]">
                    {t('itinerary.bottom.readyTitle', 'Ready to lock in your Dahab journey?')}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D2E3DE] mt-1 max-w-md">
                    {t('itinerary.bottom.readyDesc', 'Review and approve this personalized blueprint. You will review accommodation and transfer booking details in the next step.')}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full sm:w-auto">
                    <button
                      type="button"
                      id="bottom-keep-editing-btn"
                      onClick={() => setIsCustomizeOpen(true)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[#D2E3DE] hover:text-[#F7F3EA] bg-[#13312B] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                    >
                      {t('itinerary.btn.keepEditing', 'Keep Editing')}
                    </button>

                    <button
                      type="button"
                      id="bottom-approve-trip-btn"
                      onClick={handleApproveTrip}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold text-[#081714] bg-[#F4C36C] hover:bg-amber-300 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                    >
                      <span>{t('itinerary.btn.approveTrip', 'Approve Trip')}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3.5 border border-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-emerald-200">
                    {t('itinerary.status.approved', 'Trip approved')}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-300/80 mt-1 max-w-md">
                    {t('itinerary.status.readyDesc', "Your itinerary is ready. Let's take care of the bookings.")}
                  </p>

                  <button
                    type="button"
                    id="bottom-continue-to-booking-btn"
                    onClick={onContinueToBooking}
                    className="mt-6 inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full text-sm font-bold text-[#081714] bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-md cursor-pointer"
                  >
                    <span>{t('itinerary.btn.continueBooking', 'Continue to Booking')}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Sticky Sidebar (Desktop 4 Columns) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
            {/* Trip Overview Panel */}
            <div className="p-6 rounded-3xl bg-[#0E2520] border border-white/10 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F4C36C]">
                  {t('itinerary.sidebar.blueprintTitle', 'Trip Blueprint')}
                </span>
                <span className="text-[12px] font-semibold text-[#D2E3DE]/70">
                  {isApproved ? t('itinerary.status.approved', 'Approved') : t('itinerary.status.suggested', 'Suggested')}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[#D2E3DE]/60">{t('itinerary.sidebar.destination', 'Destination')}</span>
                  <span className="font-bold text-[#F7F3EA]">{t('itinerary.sidebar.destinationVal', 'Dahab, South Sinai')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[#D2E3DE]/60">{t('itinerary.sidebar.duration', 'Duration')}</span>
                  <span className="font-bold text-[#F7F3EA]">{durationLabel || t('itinerary.sidebar.5days', '5 Days')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[#D2E3DE]/60">{t('itinerary.sidebar.travelers', 'Travelers')}</span>
                  <span className="font-bold text-[#F7F3EA]">{travelersSummary}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[#D2E3DE]/60">{t('itinerary.sidebar.budget', 'Budget')}</span>
                  <span className="font-bold text-[#F7F3EA]">{chosenBudget}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-[#D2E3DE]/60">{t('itinerary.sidebar.pace', 'Pace')}</span>
                  <span className="font-bold text-[#F7F3EA]">{chosenPace}</span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-[#D2E3DE]/60">{t('itinerary.sidebar.interests', 'Selected Interests')}</span>
                  <span className="font-bold text-[#F7F3EA] text-right">{chosenInterests.join(language === 'ar' ? '، ' : ', ') || '—'}</span>
                </div>
              </div>

              {/* Primary Side Action */}
              <div className="mt-6 pt-5 border-t border-white/10">
                {!isApproved ? (
                  <button
                    type="button"
                    onClick={handleApproveTrip}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold text-[#081714] bg-[#F4C36C] hover:bg-amber-300 shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <span>{t('itinerary.btn.approveTrip', 'Approve Trip')}</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onContinueToBooking}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold text-[#081714] bg-emerald-500 hover:bg-emerald-400 shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <span>{t('itinerary.btn.continueBooking', 'Continue to Booking')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsCustomizeOpen(true)}
                  className="w-full mt-2 py-2.5 text-center text-xs font-bold text-[#D2E3DE] hover:text-white bg-[#13312B] hover:bg-white/10 rounded-full transition-colors cursor-pointer border border-white/10"
                >
                  {t('itinerary.btn.customize', 'Customize Trip')}
                </button>
              </div>
            </div>

            {/* Dahab Local Support Note */}
            <div className="p-5 rounded-2xl bg-[#13312B] border border-white/10 text-xs text-[#D2E3DE]">
              <div className="flex items-center gap-2 font-bold text-[#F7F3EA] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#F4C36C]" />
                <span>{t('itinerary.sidebar.guaranteeTitle', 'Sinai Local Host Guarantee')}</span>
              </div>
              <p className="leading-relaxed font-normal text-[12px] text-[#D2E3DE]/80">
                {t('itinerary.sidebar.guaranteeDesc', 'All diving centers, desert drivers, and boat captains are vetted local Dahab professionals who prioritize safety and authentic hospitality.')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Mobile Sticky Bottom Action Bar */}
      <div 
        id="mobile-sticky-action-bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E2520]/95 backdrop-blur-md border-t border-white/10 p-3 sm:p-4 shadow-lg flex items-center justify-between gap-3"
      >
        {!isApproved ? (
          <>
            <button
              type="button"
              id="mobile-keep-editing-btn"
              onClick={() => setIsCustomizeOpen(true)}
              className="flex-1 py-3 rounded-full text-xs font-bold text-[#F7F3EA] bg-[#13312B] hover:bg-white/10 border border-white/10 transition-colors cursor-pointer text-center"
            >
              {t('itinerary.btn.keepEditing', 'Keep Editing')}
            </button>

            <button
              type="button"
              id="mobile-approve-trip-btn"
              onClick={handleApproveTrip}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-bold text-[#081714] bg-[#F4C36C] hover:bg-amber-300 shadow-xs cursor-pointer text-center"
            >
              <span>{t('itinerary.btn.approveTrip', 'Approve Trip')}</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            id="mobile-continue-booking-btn"
            onClick={onContinueToBooking}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold text-[#081714] bg-emerald-500 hover:bg-emerald-400 shadow-md cursor-pointer text-center"
          >
            <span>{t('itinerary.btn.continueBooking', 'Continue to Booking')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* 6. Modals */}
      <TripBriefModal
        isOpen={isTripBriefModalOpen}
        onClose={() => setIsTripBriefModalOpen(false)}
      />

      <TripHealthModal
        isOpen={isTripHealthModalOpen}
        onClose={() => setIsTripHealthModalOpen(false)}
      />

      <BudgetBreakdownModal
        isOpen={isBudgetBreakdownModalOpen}
        onClose={() => setIsBudgetBreakdownModalOpen(false)}
      />

      <TripCustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        onApply={() => setIsCustomizeOpen(false)}
      />

      <ActivityDetailModal
        activity={selectedActivityForDetails}
        onClose={() => setSelectedActivityForDetails(null)}
      />

      <AlternativesModal
        isOpen={alternativesModalOpen}
        activityTitle={currentAlternativeActivity}
        currentAlternativeId={activeAlternativeId}
        onSelectAlternative={handleSelectAlternative}
        onClose={() => setAlternativesModalOpen(false)}
      />

      {/* 7. Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-[#D2E3DE]/40 bg-[#081714] mt-12">
        {language === 'ar'
          ? 'منصة دهب · برنامج رحلة مخصص لك · جنوب سيناء، مصر'
          : 'Dahab Travel Platform · Personalized Itinerary for You · South Sinai, Egypt'}
      </footer>
    </div>
  );
};
