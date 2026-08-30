import React, { useState } from 'react';
import {
  Compass,
  Luggage,
  CalendarCheck,
  UtensilsCrossed,
  HelpCircle,
  Clock,
  MapPin,
  Waves,
  Sun,
  Wind,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Star,
  Coffee,
  Heart,
  Plus,
  Navigation,
  Flame,
  ChevronRight,
  Camera,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { JourneyStage, NearMeItem } from '../../types';

interface HomeDashboardProps {
  onPlanTripClick: () => void;
  onExploreClick: () => void;
  onMyTripClick: () => void;
  onSelectSpecialStage?: (stage: JourneyStage) => void;
}

type VibeCategory = 'all' | 'dive' | 'desert' | 'bohemian' | 'wind' | 'wellness';

interface CuratedExperience {
  id: string;
  title: string;
  subtitle: string;
  category: VibeCategory;
  categoryLabel: string;
  image: string;
  /** Only where measured — which is nowhere. Was required, and every entry
   *  carried an invented 4.7–5.0. */
  rating?: number;
  reviews?: number;
  duration: string;
  price: string;
  location: string;
  distance: string;
  walkTime: string;
  highlight: string;
  tags: string[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onPlanTripClick,
  onExploreClick,
  onMyTripClick,
  onSelectSpecialStage,
}) => {
  const { profile, bookings, activeFoodOrder, navigateTo, savedItems, toggleSaveItem, addActivityToDay, showToast } = useTrip();

  const [selectedVibe, setSelectedVibe] = useState<VibeCategory>('all');

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const curatedExperiences: CuratedExperience[] = [
    {
      id: 'curated-canyon-dive',
      title: 'The Canyon & Coral Chasm',
      subtitle: 'Legendary Underwater Gorge Shore Dive',
      category: 'dive',
      categoryLabel: 'Deep Reef Diving',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
      duration: '3 hours',
      price: '$45 / dive',
      location: 'The Canyon Reserve',
      distance: '3.2 km',
      walkTime: '8 min taxi',
      highlight: 'Descend into a dramatic fissure with glassfish swirls and crystal 30m visibility.',
      tags: ['Guided 2-Tank', 'Marine Life', 'Top Rated'],
    },
    {
      id: 'curated-ralphs-bakery',
      title: "Ralph's German Bakery & Courtyard",
      subtitle: 'Artisan Sourdough & Sinai Mint Tea',
      category: 'bohemian',
      categoryLabel: 'Artisan Cafe',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop',
      duration: '1 hour',
      price: '$$',
      location: 'Lighthouse Area',
      distance: '180m',
      walkTime: '2 min walk',
      highlight: 'Fresh apple strudel, pretzels and iced organic mint tea under bougainvillea trees.',
      tags: ['Breakfast', 'Organic Tea', 'Sunny Terrace'],
    },
    {
      id: 'curated-bedouin-dinner',
      title: 'Starlit Bedouin Feast in Wadi Ginai',
      subtitle: 'Candlelight Dinner Under Desert Canyons',
      category: 'desert',
      categoryLabel: 'Bedouin Experience',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
      duration: '4 hours',
      price: '$35 / person',
      location: 'Wadi Ginai Oasis',
      distance: '7.5 km',
      walkTime: '15 min 4x4',
      highlight: 'Slow-cooked lamb mandy, freshly baked Bedouin flatbread, and astronomy by campfire.',
      tags: ['Campfire', 'Live Oud', 'Stargazing'],
    },
    {
      id: 'curated-lagoon-kite',
      title: 'Blue Lagoon Wind & Kitesurf Session',
      subtitle: 'Turquoise Flatwater & Steady Thermal Winds',
      category: 'wind',
      categoryLabel: 'Wind & Watersports',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      duration: '2.5 hours',
      price: '$55 / rental',
      location: 'Dahab South Lagoon',
      distance: '2.8 km',
      walkTime: '6 min taxi',
      highlight: 'Mirror-flat shallow turquoise bay with reliable afternoon cross-shore breezes.',
      tags: ['Kite Lagoon', 'Lessons & Gear', 'Beginner Friendly'],
    },
    {
      id: 'curated-lighthouse-yoga',
      title: 'Sunrise Flow & Ocean Sound Bath',
      subtitle: 'Mindful Morning on the Wooden Promenade',
      category: 'wellness',
      categoryLabel: 'Seaside Wellness',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop',
      duration: '75 mins',
      price: '$15',
      location: 'Coral Coast Deck',
      distance: '240m',
      walkTime: '3 min walk',
      highlight: 'Gentle vinyasa flow facing the Gulf of Aqaba and Saudi mountain silhouette.',
      tags: ['Sunrise 06:30', 'All Levels', 'Mats Provided'],
    },
    {
      id: 'curated-ali-baba',
      title: 'Ali Baba Fresh Red Sea Catch',
      subtitle: 'Waterfront Charcoal Seafood & Mezze',
      category: 'bohemian',
      categoryLabel: 'Coastal Dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      duration: '1.5 hours',
      price: '$$',
      location: 'Lighthouse Waterfront',
      distance: '320m',
      walkTime: '4 min walk',
      highlight: 'Select your whole sea bass on ice, char-grilled with garlic cumin oil over glowing coals.',
      tags: ['Fresh Fish', 'Sea Deck', 'Sunset View'],
    },
  ];

  const filteredExperiences = curatedExperiences.filter(
    (exp) => selectedVibe === 'all' || exp.category === selectedVibe
  );

  const handleAddExperienceToDay = (exp: CuratedExperience) => {
    addActivityToDay(2, {
      id: `exp-${Date.now()}`,
      time: '04:00 PM',
      title: exp.title,
      // categoryLabel is free-form marketing copy ("Iconic Dive Site",
      // "Artisan Cafe"), not a TimelineActivityType. It belongs in the notes.
      type: 'Experience',
      status: 'Added ✓',
      location: exp.location,
      notes: [exp.categoryLabel, exp.highlight].filter(Boolean).join(' · '),
      duration: exp.duration,
    });
    showToast(`Added "${exp.title}" to your Day 2 Itinerary!`);
  };

  return (
    <div id="dahab-modern-experience-view" className="w-full space-y-12 sm:space-y-16 pb-28 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* ========================================================================= */}
      {/* 1. IMMERSIVE EDITORIAL CINEMATIC HERO                                    */}
      {/* ========================================================================= */}
      <section
        id="experience-hero-section"
        aria-labelledby="hero-title"
        className="relative min-h-[540px] sm:min-h-[580px] rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-white/15 flex items-end"
      >
        {/* Cinematic Background Image with Layered Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=2000&auto=format&fit=crop"
            alt="Dahab Red Sea coral reef and Sinai coastline"
            className="w-full h-full object-cover object-center scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Subtle multi-stop gradient overlay for superior readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091B1F] via-[#091B1F]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091B1F]/80 via-transparent to-transparent hidden md:block" />
        </div>

        {/* Hero Floating Content Container */}
        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 max-w-5xl space-y-5 text-white">
          
          {/* Dynamic Live Status Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div 
              aria-label="Trip status: Day 2 of 5 in Dahab"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-amber-300 shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="tracking-widest uppercase font-['Outfit',sans-serif]">Dahab · Day 2 of 5</span>
              <span className="text-white/40" aria-hidden="true">|</span>
              <span className="text-slate-100 font-medium">October 12–16</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-950/60 backdrop-blur-md border border-teal-500/30 text-teal-200 text-xs font-semibold">
              <Waves className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
              <span>Optimal Reef Conditions Today</span>
            </div>
          </div>

          {/* Heading with Modern Display Typography */}
          <div className="space-y-2">
            <h1 
              id="hero-title"
              className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight font-['Outfit',sans-serif]"
            >
              {getGreeting()},{' '}
              <span className="font-bold text-amber-300">{profile.name}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-normal max-w-2xl leading-relaxed">
              Sinai waters are calm and crystal clear. Your guided 2-tank shore dive at <strong className="text-white font-semibold">The Canyon</strong> begins at 09:00 AM.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              id="hero-open-companion-btn"
              onClick={onMyTripClick}
              aria-label="Open Day 2 Companion Itinerary"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all shadow-xl cursor-pointer group border border-amber-300"
            >
              <Luggage className="w-4 h-4 text-slate-950" aria-hidden="true" />
              <span>Enter Day 2 Live Companion</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>

            <button
              type="button"
              id="hero-explore-btn"
              onClick={onExploreClick}
              aria-label="Explore Dahab Places & Dive Spots"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <Compass className="w-4 h-4 text-white" aria-hidden="true" />
              <span>Explore Dahab Near Me</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/food')}
              aria-label="Order Food Now to beach or hotel"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold text-teal-200 bg-teal-900/60 hover:bg-teal-900/80 border border-teal-500/40 backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <UtensilsCrossed className="w-4 h-4 text-teal-300" aria-hidden="true" />
              <span>Beach Food Delivery</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME ATMOSPHERE & SEA RADAR (SLEEK HORIZONTAL STRIP)              */}
      {/* ========================================================================= */}
      <section 
        id="sinai-atmosphere-strip"
        aria-label="Real-time Sinai Sea & Weather Conditions"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          
          {/* Header info */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
              ☀️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Outfit',sans-serif]">
                  Live Dahab Atmosphere
                </h2>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Prime Window
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Updated 8 mins ago · Calm Red Sea Swell
              </p>
            </div>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 max-w-3xl">
            <div className="bg-[#F6F0E6]/90 p-3 rounded-2xl border border-amber-900/10 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <Sun className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Ambient Air</span>
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1">28°C Sunny</div>
            </div>

            <div className="bg-[#F6F0E6]/90 p-3 rounded-2xl border border-amber-900/10 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <Waves className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                <span>Water Temp</span>
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1">24°C · Calm</div>
            </div>

            <div className="bg-[#F6F0E6]/90 p-3 rounded-2xl border border-amber-900/10 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                <span>Coral Visibility</span>
              </div>
              <div className="text-base font-extrabold text-emerald-800 mt-1">25m+ Peak</div>
            </div>

            <div className="bg-[#F6F0E6]/90 p-3 rounded-2xl border border-amber-900/10 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <Wind className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                <span>Wind Speed</span>
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1">12 km/h NE</div>
            </div>
          </div>

          {/* Quick link */}
          <button
            type="button"
            onClick={onMyTripClick}
            aria-label="View how weather affects today's dives in Day 2 Itinerary"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1.5 justify-end cursor-pointer group"
          >
            <span>See Day Timeline</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. YOUR ACTIVE DAY 2 ITINERARY CAPSULE                                   */}
      {/* ========================================================================= */}
      <section
        id="today-timeline-spotlight"
        aria-labelledby="today-spotlight-title"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-br from-[#091B1F] via-[#0F282D] to-[#13383E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/15 relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-['Outfit',sans-serif]">
                  Upcoming on Ahmed's Schedule · Day 2
                </span>
              </div>

              <h2 id="today-spotlight-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                The Canyon Guided Shore Dive &amp; Reef Chasm
              </h2>

              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                Captain Youssef has prepared your 2-tank dive setup at Dahab Divers. Dive briefing starts at <strong className="text-amber-300">08:45 AM</strong> with water entry at 09:00 AM.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-slate-100 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  09:00 AM – 11:30 AM
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  Confirmed · Ref #DHB-DIVE-882
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-slate-200">
                  📍 The Canyon (North Dahab)
                </span>
              </div>
            </div>

            {/* Quick Actions for this activity */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 w-full sm:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={onMyTripClick}
                aria-label="Open Day 2 Companion live briefing and checklist"
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer text-center"
              >
                Open Day 2 Companion →
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onSelectSpecialStage) onSelectSpecialStage('spontaneous');
                  navigateTo('/my-trip');
                }}
                aria-label="What Should I Do Now in free 2-hour window"
                className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-bold transition-all cursor-pointer text-center"
              >
                What To Do After Dive?
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/change-recovery')}
                aria-label="Adjust schedule or change dive time"
                className="px-6 py-2.5 rounded-2xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer text-center"
              >
                Change or Shift Time
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DAHAB VIBE & MOOD EXPLORER (INTERACTIVE CATEGORIES)                   */}
      {/* ========================================================================= */}
      <section 
        id="dahab-vibes-section" 
        aria-labelledby="vibes-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-teal-800 font-['Outfit',sans-serif]">
                Curated Dahab Energies
              </span>
            </div>
            <h2 id="vibes-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
              What's your Dahab mood today?
            </h2>
          </div>

          <button
            type="button"
            onClick={onExploreClick}
            aria-label="Browse all places in Dahab"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer underline underline-offset-2"
          >
            <span>Explore All 15+ Spots</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Interactive Mood Chips */}
        <div 
          role="group"
          aria-label="Filter experiences by mood"
          className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
        >
          {[
            { id: 'all', label: '✨ All Vibes', count: 6 },
            { id: 'dive', label: '🤿 Deep Reef & Freediving', count: 2 },
            { id: 'bohemian', label: '☕ Bohemian Cafés & Dining', count: 2 },
            { id: 'desert', label: '🏜️ Bedouin Desert Feasts', count: 1 },
            { id: 'wind', label: '🪁 Lagoon & Wind Adventures', count: 1 },
            { id: 'wellness', label: '🧘 Seaside Wellness & Yoga', count: 1 },
          ].map((chip) => {
            const active = selectedVibe === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedVibe(chip.id as VibeCategory)}
                aria-pressed={active}
                className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  active
                    ? 'bg-slate-950 text-white shadow-md ring-2 ring-amber-400'
                    : 'bg-white/90 text-slate-700 hover:text-slate-950 hover:bg-white border border-slate-200 shadow-2xs'
                }`}
              >
                <span>{chip.label}</span>
                <span className={`text-[11px] font-black px-1.5 py-0.2 rounded-full ${
                  active ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Curated Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {filteredExperiences.map((exp) => {
            const isSaved = savedItems.includes(exp.id);

            return (
              <article
                key={exp.id}
                role="listitem"
                aria-labelledby={`exp-heading-${exp.id}`}
                className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-400/70 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Banner with Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={exp.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" aria-hidden="true" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider border border-white/20">
                        {exp.categoryLabel}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={() => toggleSaveItem(exp.id)}
                      aria-label={isSaved ? `Remove ${exp.title} from favorites` : `Save ${exp.title} to favorites`}
                      aria-pressed={isSaved}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                        isSaved ? 'bg-rose-500 text-white' : 'bg-slate-950/60 text-white hover:bg-slate-950/80'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} aria-hidden="true" />
                    </button>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-[12px] text-amber-300 font-bold mb-0.5">
                        <MapPin className="w-3 h-3 text-amber-300" aria-hidden="true" />
                        <span>{exp.location} · {exp.distance} ({exp.walkTime})</span>
                      </div>
                      <h3 id={`exp-heading-${exp.id}`} className="font-bold text-lg leading-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                        {exp.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-700">
                      {/* Was always rendered, over invented 4.7–5.0 ratings and
                          310–890 review counts. */}
                      {typeof exp.rating === 'number' ? (
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                          <span>{exp.rating}</span>
                          {typeof exp.reviews === 'number' && (
                            <span className="text-slate-500 font-medium">({exp.reviews})</span>
                          )}
                        </div>
                      ) : (
                        <span />
                      )}
                      <span className="font-mono font-bold text-teal-800">{exp.price}</span>
                      <span className="text-slate-600 font-semibold">{exp.duration}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {exp.highlight}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1" role="list">
                      {exp.tags.map((t) => (
                        <span
                          key={t}
                          role="listitem"
                          className="px-2 py-0.5 rounded-lg bg-[#F6F0E6]/90 border border-amber-900/10 text-[11px] text-slate-800 font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={onExploreClick}
                    aria-label={`View location and details for ${exp.title}`}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer py-1"
                  >
                    <Navigation className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>View Spot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddExperienceToDay(exp)}
                    aria-label={`Add ${exp.title} to Day 2 Itinerary`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer border border-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Add to Itinerary</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOOD NOW & BEACH DELIVERY SPOTLIGHT                                    */}
      {/* ========================================================================= */}
      <section 
        id="food-delivery-spotlight"
        aria-labelledby="food-spotlight-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-[#091B1F] via-[#102A30] to-[#0A3D36] text-white rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-400 text-slate-950" aria-hidden="true">
                <UtensilsCrossed className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit',sans-serif]">
                Dahab Food Now & Beach Delivery
              </span>
            </div>
            <h3 id="food-spotlight-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Order Fresh Breakfast or Seaside Seafood Straight to Your Beach Palapa
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Bicycle riders from local Dahab kitchens deliver authentic Egyptian ful, warm pita, fresh fruit smoothies, and charcoal-grilled fish directly to your beach umbrella.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigateTo('/food')}
              aria-label="Open Food Now menus and order beach delivery"
              className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer text-center"
            >
              Browse Menus &amp; Order
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/bookings')}
              aria-label="View confirmed restaurant bookings"
              className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-bold transition-all cursor-pointer text-center"
            >
              View Bookings ({bookings.length})
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MODERN EDITORIAL FOOTER                                                */}
      {/* ========================================================================= */}
      <footer 
        role="contentinfo"
        aria-label="Dahab Experience Platform Footer"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 text-xs text-slate-600 space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs" aria-hidden="true">
              D
            </div>
            <div>
              <span className="font-bold text-slate-900 block font-['Outfit',sans-serif]">
                DAHAB DIGITAL TRAVEL EXPERIENCE
              </span>
              <span className="text-[12px] text-slate-500 block">
                South Sinai Coastline · Red Sea, Egypt
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-teal-800">
            <button type="button" onClick={() => navigateTo('/help')} className="hover:text-slate-950 cursor-pointer">
              24/7 Local Concierge
            </button>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <button type="button" onClick={() => navigateTo('/trip-builder')} className="hover:text-slate-950 cursor-pointer">
              Custom Trip Builder
            </button>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <button type="button" onClick={() => navigateTo('/departure')} className="hover:text-slate-950 cursor-pointer">
              Departure Transfers
            </button>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <button type="button" onClick={() => navigateTo('/profile')} className="hover:text-slate-950 cursor-pointer">
              Traveler Profile
            </button>
          </div>
        </div>

        <div className="pt-2 text-[12px] text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100">
          <span>Active Traveler Booking: #DHB-2026-OCT-894 (Ahmed E.)</span>
          <span>Hyperbaric Diver Chamber Hotline: +20 69 364 0400</span>
        </div>
      </footer>

    </div>
  );
};
