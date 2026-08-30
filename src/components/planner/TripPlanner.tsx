import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { StepDuration } from './StepDuration';
import { StepTravelers, TripDynamicType } from './StepTravelers';
import { StepBudget, BudgetTier } from './StepBudget';
import { StepInterests, InterestId } from './StepInterests';
import { StepPace, PaceType } from './StepPace';
import { BuildingTripState } from './BuildingTripState';
import { StepPlaceholder } from './StepPlaceholder';
import { GeneratedItinerary } from '../itinerary/GeneratedItinerary';
import { BookingHotelStep } from '../booking/BookingHotelStep';
import { BookingTransferStep } from '../booking/BookingTransferStep';
import { BookingDivingStep } from '../booking/BookingDivingStep';
import { BookingSafariStep } from '../booking/BookingSafariStep';
import { BookingReviewStep } from '../booking/BookingReviewStep';
import { BookingPaymentStep } from '../booking/BookingPaymentStep';
import { MyTripView } from '../mytrip/MyTripView';
import { CURATED_HOTELS, CURATED_TRANSFERS, CURATED_DIVING_OPTIONS, CURATED_SAFARI_OPTIONS } from '../booking/bookingData';
import { Compass, Sparkles, X, MapPin, ShieldCheck, Check, Users, Clock, Wallet, HeartHandshake, Gauge } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface TripPlannerProps {
  onExitToHome: () => void;
}

interface StepMeta {
  number: number;
  labelKey: string;
  defaultLabel: string;
  defaultShortLabel: string;
}

const PLANNING_STEPS: StepMeta[] = [
  { number: 1, labelKey: 'planner.step1.short', defaultLabel: 'Duration', defaultShortLabel: 'Duration' },
  { number: 2, labelKey: 'planner.step2.short', defaultLabel: 'Travelers', defaultShortLabel: 'Travelers' },
  { number: 3, labelKey: 'planner.step3.short', defaultLabel: 'Budget', defaultShortLabel: 'Budget' },
  { number: 4, labelKey: 'planner.step4.short', defaultLabel: 'Interests', defaultShortLabel: 'Interests' },
  { number: 5, labelKey: 'planner.step5.short', defaultLabel: 'Pace', defaultShortLabel: 'Pace' },
];

export const TripPlanner: React.FC<TripPlannerProps> = ({ onExitToHome }) => {
  const { t, isRTL, language } = useLanguage();
  const { isSignedIn, setIntendedRoute, navigateTo, showToast } = useTrip();
  // Current active planning step (1 = Duration, 2 = Travelers, 3 = Budget, 4 = Interests, 5 = Pace Placeholder)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 1: Selected duration state (Default to '4-5' for Ahmed's scenario)
  const [selectedDurationId, setSelectedDurationId] = useState<string>('4-5');
  const [selectedDurationLabel, setSelectedDurationLabel] = useState<string>('4–5 days');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Step 2: Travelers state (Default to 2 adults, 0 children, 'Friends' for Ahmed)
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [tripDynamic, setTripDynamic] = useState<TripDynamicType | null>('Friends');

  // Step 3: Budget state (Default to 'moderate' for Ahmed)
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('moderate');

  // Step 4: Interests state (Preselect 'diving', 'adventure', 'food' for Ahmed)
  const [selectedInterests, setSelectedInterests] = useState<InterestId[]>([
    'diving',
    'adventure',
    'food',
  ]);

  // Step 5: Pace state (Default to 'balanced' for Ahmed)
  const [selectedPace, setSelectedPace] = useState<PaceType>('balanced');

  // Building trip state transition flag
  const [isBuildingTrip, setIsBuildingTrip] = useState<boolean>(false);
  // Personalized Generated Itinerary screen view state
  const [showItinerary, setShowItinerary] = useState<boolean>(false);
  // Dedicated Booking Flow - Step 01: Hotel, Step 02: Transfer, Step 03: Diving, Step 04: Safari, Review, Payment, My Trip
  const [bookingStep, setBookingStep] = useState<'hotel' | 'transfer' | 'diving' | 'safari' | 'review' | 'payment' | 'mytrip' | null>(null);
  const [selectedBookingHotelId, setSelectedBookingHotelId] = useState<string>('dahab-bay-hotel');
  const [selectedBookingTransferId, setSelectedBookingTransferId] = useState<string>('private-car');
  const [bookingFlightNumber, setBookingFlightNumber] = useState<string>('');
  const [selectedBookingDivingId, setSelectedBookingDivingId] = useState<string>('guided-diving');
  const [bookingDivingDay, setBookingDivingDay] = useState<number>(2);
  const [bookingDivingTime, setBookingDivingTime] = useState<string>('09:00 AM');
  const [selectedBookingSafariId, setSelectedBookingSafariId] = useState<string>('desert-safari');
  const [bookingSafariDay, setBookingSafariDay] = useState<number>(3);
  const [bookingSafariTime, setBookingSafariTime] = useState<string>('02:00 PM');

  const handleSelectDuration = (id: string, label: string) => {
    setSelectedDurationId(id);
    setSelectedDurationLabel(label);
  };

  const handleDatesChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);
      const diffTime = e.getTime() - s.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setSelectedDurationLabel(`${diffDays} days (${start} to ${end})`);
      }
    }
  };

  const handleToggleInterest = (id: InterestId) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const goToNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onExitToHome();
    }
  };

  // Progress percentage calculation
  const progressPercent = (currentStep / totalSteps) * 100;

  // Visual assets & contextual messaging per step
  const getStepContextVisual = () => {
    switch (currentStep) {
      case 2:
        return {
          image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=85&w=1200&auto=format&fit=crop',
          alt: 'Friends enjoying a relaxing coastal journey and shared adventure along the Dahab seaside',
          badge: t('planner.visual.step2.badge', 'Dahab With Friends'),
          title: t('planner.visual.step2.title', 'Good trips start with knowing who\'s coming.'),
          quote: t('planner.visual.step2.cardText', 'Curating diving spots, seaside lounges, and Bedouin desert dinners sized perfectly for your party.'),
          cardTitle: t('planner.visual.step2.cardTitle', 'Party-Specific Curation'),
          cardText: t('planner.visual.step2.cardText', 'Accommodation layouts, boat charters, and dining spots are matched to your group dynamics.'),
        };
      case 3:
        return {
          image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=85&w=1200&auto=format&fit=crop',
          alt: 'Atmospheric Bedouin coastal fire gathering under the Sinai night sky',
          badge: t('planner.visual.step3.badge', 'Dahab Atmosphere'),
          title: t('planner.visual.step3.title', 'Comfort, adventure, and local soul.'),
          quote: t('planner.visual.step3.cardText', 'A great trip doesn\'t have to mean spending more.'),
          cardTitle: t('planner.visual.step3.cardTitle', 'Balanced Sinai Value'),
          cardText: t('planner.visual.step3.cardText', 'A great trip doesn\'t have to mean spending more. We prioritize memorable local experiences, soulful cafes, and welcoming stays.'),
        };
      case 4:
        return {
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1200&auto=format&fit=crop',
          alt: 'Dahab coastline where pristine Red Sea coral reefs meet South Sinai desert mountains',
          badge: t('planner.visual.step4.badge', 'Sinai Experiences'),
          title: t('planner.visual.step4.title', 'Diving, desert safaris, and seaside pace.'),
          quote: t('planner.visual.step4.cardText', 'Your interests shape the trip we build for you.'),
          cardTitle: t('planner.visual.step4.cardTitle', 'Tailored to Your Passions'),
          cardText: t('planner.visual.step4.cardText', 'Your interests shape the trip we build for you. We curate reef diving, canyon trekking, and seaside cafes around what you love.'),
        };
      case 5:
        return {
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1200&auto=format&fit=crop',
          alt: 'Serene Dahab coastline where the Red Sea meets Sinai mountains at golden hour',
          badge: t('planner.visual.step5.badge', 'Daily Rhythm'),
          title: t('planner.visual.step5.title', 'A little adventure. A little time to breathe.'),
          quote: t('planner.visual.step5.cardText', 'A little adventure. A little time to breathe.'),
          cardTitle: t('planner.visual.step5.cardTitle', 'Daily Rhythm & Free Time'),
          cardText: t('planner.visual.step5.cardText', 'A little adventure. A little time to breathe. We balance exciting diving and desert activities with plenty of room to unwind by the sea.'),
        };
      case 1:
      default:
        return {
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1200&auto=format&fit=crop',
          alt: 'Scenic Dahab coastline where South Sinai desert mountains meet the turquoise Red Sea waters',
          badge: t('planner.visual.step1.badge', 'Dahab, South Sinai'),
          title: t('planner.visual.step1.title', 'Where the red mountains meet the pristine coral reefs.'),
          quote: t('planner.visual.step1.cardText', 'We\'ll use your answers to build a trip that fits you.'),
          cardTitle: t('planner.visual.step1.cardTitle', 'Personalized Trip Shaping'),
          cardText: t('planner.visual.step1.cardText', 'We\'ll use your answers to build a trip that fits you.'),
        };
    }
  };

  const stepVisual = getStepContextVisual();

  if (bookingStep === 'mytrip') {
    return (
      <MyTripView
        onBackToHome={() => {
          onExitToHome();
        }}
        onExploreClick={() => {
          onExitToHome();
        }}
      />
    );
  }

  if (bookingStep === 'payment') {
    const hotelObj = CURATED_HOTELS.find((h) => h.id === selectedBookingHotelId) || CURATED_HOTELS[0];
    const transferObj = CURATED_TRANSFERS.find((t) => t.id === selectedBookingTransferId) || CURATED_TRANSFERS[0];
    const divingObj = CURATED_DIVING_OPTIONS.find((d) => d.id === selectedBookingDivingId) || CURATED_DIVING_OPTIONS[0];
    const safariObj = CURATED_SAFARI_OPTIONS.find((s) => s.id === selectedBookingSafariId) || CURATED_SAFARI_OPTIONS[0];

    return (
      <BookingPaymentStep
        selectedHotel={hotelObj}
        selectedTransfer={transferObj}
        selectedDiving={divingObj}
        selectedSafari={safariObj}
        flightNumber={bookingFlightNumber}
        divingDay={bookingDivingDay}
        divingTime={bookingDivingTime}
        safariDay={bookingSafariDay}
        safariTime={bookingSafariTime}
        onBackToReview={() => {
          setBookingStep('review');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewMyTrip={() => {
          setBookingStep('mytrip');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (bookingStep === 'review') {
    const hotelObj = CURATED_HOTELS.find((h) => h.id === selectedBookingHotelId) || CURATED_HOTELS[0];
    const transferObj = CURATED_TRANSFERS.find((t) => t.id === selectedBookingTransferId) || CURATED_TRANSFERS[0];
    const divingObj = CURATED_DIVING_OPTIONS.find((d) => d.id === selectedBookingDivingId) || CURATED_DIVING_OPTIONS[0];
    const safariObj = CURATED_SAFARI_OPTIONS.find((s) => s.id === selectedBookingSafariId) || CURATED_SAFARI_OPTIONS[0];

    return (
      <BookingReviewStep
        selectedHotel={hotelObj}
        selectedTransfer={transferObj}
        selectedDiving={divingObj}
        selectedSafari={safariObj}
        flightNumber={bookingFlightNumber}
        divingDay={bookingDivingDay}
        divingTime={bookingDivingTime}
        safariDay={bookingSafariDay}
        safariTime={bookingSafariTime}
        onEditHotel={() => {
          setBookingStep('hotel');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEditTransfer={() => {
          setBookingStep('transfer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEditDiving={() => {
          setBookingStep('diving');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEditSafari={() => {
          setBookingStep('safari');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToSafari={() => {
          setBookingStep('safari');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onContinueToPayment={() => {
          setBookingStep('payment');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (bookingStep === 'safari') {
    const hotelObj = CURATED_HOTELS.find((h) => h.id === selectedBookingHotelId) || CURATED_HOTELS[0];
    const transferObj = CURATED_TRANSFERS.find((t) => t.id === selectedBookingTransferId) || CURATED_TRANSFERS[0];
    const divingObj = CURATED_DIVING_OPTIONS.find((d) => d.id === selectedBookingDivingId) || CURATED_DIVING_OPTIONS[0];

    return (
      <BookingSafariStep
        selectedHotel={hotelObj}
        selectedTransfer={transferObj}
        selectedDiving={divingObj}
        selectedSafariId={selectedBookingSafariId}
        onSelectSafariId={setSelectedBookingSafariId}
        selectedSafariDay={bookingSafariDay}
        onSelectSafariDay={setBookingSafariDay}
        selectedSafariTime={bookingSafariTime}
        onSelectSafariTime={setBookingSafariTime}
        onBackToDiving={() => {
          setBookingStep('diving');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onContinueToReview={() => {
          setBookingStep('review');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (bookingStep === 'diving') {
    return (
      <BookingDivingStep
        selectedHotelId={selectedBookingHotelId}
        selectedTransferId={selectedBookingTransferId}
        initialDivingId={selectedBookingDivingId}
        initialDivingDay={bookingDivingDay}
        initialDivingTime={bookingDivingTime}
        onBackToTransfer={() => {
          setBookingStep('transfer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReturnHome={onExitToHome}
        onContinueToSafari={(divingId, day, time) => {
          setSelectedBookingDivingId(divingId);
          setBookingDivingDay(day);
          setBookingDivingTime(time);
          setBookingStep('safari');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (bookingStep === 'transfer') {
    return (
      <BookingTransferStep
        selectedHotelId={selectedBookingHotelId}
        initialTransferId={selectedBookingTransferId}
        initialFlightNumber={bookingFlightNumber}
        onSelectTransferId={setSelectedBookingTransferId}
        onBackToHotel={() => {
          setBookingStep('hotel');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReturnHome={onExitToHome}
        onContinueToDiving={(transferId, flight) => {
          setSelectedBookingTransferId(transferId);
          setBookingFlightNumber(flight);
          setBookingStep('diving');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (bookingStep === 'hotel') {
    return (
      <BookingHotelStep
        selectedHotelId={selectedBookingHotelId}
        onSelectHotelId={setSelectedBookingHotelId}
        onReturnToItinerary={() => {
          setBookingStep(null);
          setShowItinerary(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReturnHome={onExitToHome}
        onContinueToTransfer={(hotelId) => {
          setSelectedBookingHotelId(hotelId);
          setBookingStep('transfer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (showItinerary) {
    return (
      <GeneratedItinerary
        durationLabel={selectedDurationLabel}
        adultsCount={adultsCount}
        childrenCount={childrenCount}
        tripDynamic={tripDynamic}
        selectedBudget={selectedBudget}
        selectedInterests={selectedInterests}
        selectedPace={selectedPace}
        onEditPreferences={() => {
          setShowItinerary(false);
          setIsBuildingTrip(false);
          setCurrentStep(5);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReturnHome={onExitToHome}
        onContinueToBooking={() => {
          // Every commerce endpoint requires a session. Without this gate a
          // traveller configured a whole trip, walked four booking steps and
          // only found out at the payment endpoint — which then returned 401
          // and, before the fix above, still told them it was confirmed.
          if (!isSignedIn) {
            setIntendedRoute('/trip-builder');
            showToast(
              isRTL
                ? 'سجّل دخولك عشان نكمّل الحجز — اختياراتك محفوظة.'
                : 'Sign in to complete your booking — your selections are kept.'
            );
            navigateTo('/auth/sign-in');
            return;
          }
          setShowItinerary(false);
          setBookingStep('hotel');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }


  if (isBuildingTrip) {
    return (
      <BuildingTripState
        durationLabel={selectedDurationLabel}
        adultsCount={adultsCount}
        childrenCount={childrenCount}
        tripDynamic={tripDynamic}
        selectedBudget={selectedBudget}
        selectedInterests={selectedInterests}
        selectedPace={selectedPace}
        onComplete={() => {
          setIsBuildingTrip(false);
          setShowItinerary(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToPlanner={() => setIsBuildingTrip(false)}
        onReturnHome={onExitToHome}
      />
    );
  }

  return (
    <div
      id="trip-planner-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#081714] text-[#F7F3EA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* 1. Planning Experience Top Header */}
      <header
        id="planner-header"
        className="sticky top-0 z-40 bg-[#081714]/95 backdrop-blur-md border-b border-white/10 transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* DAHAB Branding Logo */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={onExitToHome}
                id="planner-logo-home-btn"
                className="text-2xl font-black tracking-tighter text-[#F7F3EA] hover:text-[#F4C36C] transition-colors font-['Outfit',sans-serif] cursor-pointer"
                title={language === 'ar' ? 'الرجوع للرئيسية' : 'Return to homepage'}
              >
                DAHAB
              </button>

              <div className="hidden md:block h-5 w-[1px] bg-white/10" />

              {/* Progress Title & Step Trail Indicator */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#52C4B7]">
                    {t('planner.header.title', 'Plan your Dahab trip')}
                  </span>
                  <span className="text-xs text-[#D2E3DE]/70 font-semibold">
                    {t('planner.header.stepOf', 'Step')} {currentStep} {t('planner.header.of', 'of')} {totalSteps}
                  </span>
                </div>

                {/* Subtle Visual Step Indicator Trail */}
                <div className="flex items-center gap-2 pl-4 border-l border-white/10 text-xs font-semibold text-[#D2E3DE]/60 rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:pl-0">
                  {PLANNING_STEPS.map((step, idx) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;
                    return (
                      <React.Fragment key={step.number}>
                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            isCurrent
                              ? 'text-[#F4C36C] font-bold'
                              : isCompleted
                              ? 'text-[#52C4B7] font-bold'
                              : 'text-[#D2E3DE]/40'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] ${
                              isCompleted
                                ? 'bg-[#52C4B7] text-[#081714] font-bold'
                                : isCurrent
                                ? 'bg-[#F4C36C] text-[#081714] font-bold'
                                : 'bg-[#13312B] text-[#D2E3DE]/60 border border-white/10'
                            }`}
                          >
                            {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : step.number}
                          </span>
                          <span>{t(step.labelKey, step.defaultShortLabel)}</span>
                        </div>
                        {idx < PLANNING_STEPS.length - 1 && (
                          <span className="text-white/20 rtl:rotate-180">→</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile compact step counter */}
            <div className="md:hidden flex items-center gap-1.5 text-xs font-bold text-[#52C4B7]">
              <span>{t('planner.header.stepOf', 'Step')} {currentStep}</span>
              <span className="text-white/40">/ {totalSteps}</span>
            </div>

            {/* Exit Action */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                id="planner-exit-btn"
                onClick={onExitToHome}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D2E3DE] hover:text-[#F7F3EA] px-3.5 py-2 rounded-full hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
              >
                <span>{t('planner.header.exit', 'Exit')}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Progress Bar */}
        <div className="w-full bg-white/5 h-1">
          <div
            id="planner-progress-bar"
            className="bg-[#F4C36C] h-1 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(244,195,108,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 2. Main Planning Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Focused Interactive Step Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {currentStep === 1 && (
              <StepDuration
                selectedDurationId={selectedDurationId}
                onSelectDuration={handleSelectDuration}
                startDate={startDate}
                endDate={endDate}
                onDatesChange={handleDatesChange}
                onContinue={goToNextStep}
                onBack={onExitToHome}
              />
            )}

            {currentStep === 2 && (
              <StepTravelers
                adultsCount={adultsCount}
                childrenCount={childrenCount}
                tripDynamic={tripDynamic}
                onAdultsChange={setAdultsCount}
                onChildrenChange={setChildrenCount}
                onTripDynamicChange={setTripDynamic}
                onContinue={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === 3 && (
              <StepBudget
                selectedBudget={selectedBudget}
                onSelectBudget={setSelectedBudget}
                onContinue={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === 4 && (
              <StepInterests
                selectedInterests={selectedInterests}
                onToggleInterest={handleToggleInterest}
                onContinue={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === 5 && (
              <StepPace
                selectedPace={selectedPace}
                onSelectPace={setSelectedPace}
                onBuildTrip={() => {
                  setIsBuildingTrip(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={goToPreviousStep}
              />
            )}
          </div>

          {/* Right Column: Visual Representation of Dahab */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 bg-[#0E2520] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
              
              {/* Authentic High-Quality Dahab Imagery */}
              <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-[#081714]">
                <img
                  key={stepVisual.image}
                  src={stepVisual.image}
                  alt={stepVisual.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700 ease-out opacity-90 animate-in fade-in duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2520] via-[#0E2520]/40 to-transparent" />

                {/* Location / Dynamic Badge */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#081714]/80 backdrop-blur-md border border-white/20 text-[#F7F3EA] text-[12px] font-bold uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-[#F4C36C]" />
                    <span>{stepVisual.badge}</span>
                  </div>
                </div>

                {/* Bottom Overlay Info in Image */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#F4C36C] block mb-1">
                    {t('planner.common.authenticSinai', 'Authentic Sinai Travel')}
                  </span>
                  <p className="text-sm sm:text-base font-serif italic text-[#F7F3EA] leading-snug">
                    {stepVisual.title}
                  </p>
                </div>
              </div>

              {/* Contextual Value Card */}
              <div className="p-6 sm:p-7 bg-[#0E2520]">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-9 h-9 rounded-2xl bg-[#13312B] border border-white/10 text-[#52C4B7] flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#F7F3EA]">
                      {stepVisual.cardTitle}
                    </h2>
                    <p className="text-xs text-[#D2E3DE] mt-1 leading-relaxed font-normal">
                      {stepVisual.cardText}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#13312B] border border-white/10 flex items-center gap-2.5 text-xs text-[#D2E3DE] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#52C4B7] flex-shrink-0" />
                  <span>{t('planner.common.flexiblePromise', 'No rigid tour packages · Tailored to your pace & preferences')}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 3. Simple Planning Footer */}
      <footer className="border-t border-white/10 py-6 bg-[#081714] text-center text-xs text-[#D2E3DE]/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} DAHAB Travel Experience Platform</span>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#52C4B7]" />
            <span>{t('planner.common.curatedExpertise', 'Curated with local Sinai expertise')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
