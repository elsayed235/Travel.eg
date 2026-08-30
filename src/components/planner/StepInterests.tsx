import React from 'react';
import { Sparkles, Check, ArrowRight, ArrowLeft, Compass, Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type InterestId =
  | 'diving'
  | 'adventure'
  | 'relax'
  | 'food'
  | 'desert'
  | 'local-life'
  | 'water'
  | 'nightlife';

export interface InterestItem {
  id: InterestId;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  image: string;
  alt: string;
}

export const INTERESTS_DATA: InterestItem[] = [
  {
    id: 'diving',
    name: 'Diving',
    nameAr: 'غطس وسكوبا',
    description: 'Explore Dahab underwater.',
    descriptionAr: 'اكتشف عالم تحت المية والشعب المرجانية الأسطورية في دهب.',
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=800&auto=format&fit=crop',
    alt: 'Scuba diver exploring vibrant coral reefs in the Red Sea',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    nameAr: 'مغامرة وكانيونز',
    description: 'Desert, mountains, and exciting experiences.',
    descriptionAr: 'كانيونز، وادي قني، وتجارب مشي وتسلق في جبال سيناء.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
    alt: 'Mountain trekking and canyon exploration in Sinai',
  },
  {
    id: 'relax',
    name: 'Beach & Relax',
    nameAr: 'بحر وراحة بال',
    description: 'Slow mornings, swimming, and time by the sea.',
    descriptionAr: 'صباحيات رايقة ع البحر، عوم، وقعدة شلتات تفصل بيها عن الدنيا.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    alt: 'Serene beach and turquoise clear Red Sea shoreline',
  },
  {
    id: 'food',
    name: 'Food',
    nameAr: 'أكل ومطاعم',
    description: 'Local food, cafés, and places worth discovering.',
    descriptionAr: 'سمك طازة، مخابز مميزة، وكافيهات اللايتهاوس والممشى.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    alt: 'Fresh coastal dining and local Sinai cafe experience',
  },
  {
    id: 'desert',
    name: 'Desert & Safari',
    nameAr: 'سفاري وصحراء',
    description: 'Explore the desert beyond the coast.',
    descriptionAr: 'سفاري بالبيتش باجي، عشاء بدوي تحت النجوم، وقعدات نار حطب.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    alt: 'Expansive golden Sinai desert safari and mountain valleys',
  },
  {
    id: 'local-life',
    name: 'Local Life',
    nameAr: 'حياة دهب وأهلها',
    description: 'Discover Dahab through its people and everyday places.',
    descriptionAr: 'عيش روح دهب الأصيلة، قعدة الشاي بالحبق، وحكاوي الناس الطيبة.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop',
    alt: 'Lively Dahab promenade and authentic local village life',
  },
  {
    id: 'water',
    name: 'Water Activities',
    nameAr: 'أنشطة بحرية',
    description: 'Snorkeling, boat trips, and more.',
    descriptionAr: 'سنوركلينج، رحلات مركب للبلو لاجون، وركوب كايت سيرف.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    alt: 'Snorkeling and coastal boat excursions along Dahab waters',
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    nameAr: 'سهرات وقعدات ليلية',
    description: 'Evenings, music, cafés, and social spots.',
    descriptionAr: 'موسيقى لايف ع البحر، قعدات مزيكا رايقة، وسهرات خفيفة.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop',
    alt: 'Atmospheric Dahab seaside lounge lit with warm lanterns and music',
  },
];

interface StepInterestsProps {
  selectedInterests: InterestId[];
  onToggleInterest: (id: InterestId) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const StepInterests: React.FC<StepInterestsProps> = ({
  selectedInterests,
  onToggleInterest,
  onContinue,
  onBack,
}) => {
  const { t, isRTL, language } = useLanguage();

  const selectedInterestItems = INTERESTS_DATA.filter((item) =>
    selectedInterests.includes(item.id)
  );

  const selectedSummaryNames = selectedInterestItems
    .map((item) => (language === 'ar' ? item.nameAr || item.name : item.name))
    .join(' · ');

  return (
    <div id="step-interests-container" className="w-full">
      {/* Question Header */}
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#13312B] text-[#52C4B7] border border-white/10 text-xs font-bold uppercase tracking-widest mb-4">
          <Compass className="w-3.5 h-3.5 text-[#52C4B7]" />
          <span>{t('planner.step4.badge')}</span>
        </div>

        <h1
          id="interests-question-title"
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F7F3EA] tracking-tight leading-[1.12]"
        >
          {t('planner.step4.title')}
        </h1>

        <p
          id="interests-supporting-text"
          className="mt-3 sm:mt-4 text-base sm:text-lg text-[#D2E3DE] leading-relaxed font-normal"
        >
          {t('planner.step4.subtitle')}
        </p>
      </div>

      {/* Experience Selection Grid */}
      <div
        id="interests-grid"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6"
      >
        {INTERESTS_DATA.map((item) => {
          const isSelected = selectedInterests.includes(item.id);
          const displayName = language === 'ar' ? item.nameAr || item.name : item.name;
          const displayDesc = language === 'ar' ? item.descriptionAr || item.description : item.description;

          return (
            <button
              type="button"
              key={item.id}
              id={`interest-card-${item.id}`}
              onClick={() => onToggleInterest(item.id)}
              aria-pressed={isSelected}
              className={`group relative text-left rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#13312B] border-[#F4C36C] shadow-lg ring-2 ring-[#F4C36C]/30'
                  : 'bg-[#0E2520] hover:bg-[#13312B] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Image Preview Banner */}
              <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-[#081714]">
                <img
                  src={item.image}
                  alt={item.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2520] via-[#0E2520]/40 to-transparent" />

                {/* Selection Indicator Check Pill */}
                <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#F4C36C] text-[#081714] font-bold shadow-sm ring-2 ring-white/30'
                        : 'bg-black/40 backdrop-blur-md text-white/50 border border-white/30'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/40" />
                    )}
                  </div>
                </div>

                {/* Name Overlay in Image */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5 z-10">
                  <span className={`text-base sm:text-lg font-bold tracking-tight drop-shadow-xs ${isSelected ? 'text-[#F4C36C]' : 'text-[#F7F3EA]'}`}>
                    {displayName}
                  </span>
                </div>
              </div>

              {/* Card Footer / Short Description */}
              <div className="p-3.5 sm:p-4 bg-[#0E2520] flex-1 flex flex-col justify-center">
                <p className="text-xs sm:text-[13px] text-[#D2E3DE] font-normal leading-snug">
                  {displayDesc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Feedback & Summary */}
      <div className="space-y-3 mb-8">
        <div
          id="interests-selection-feedback"
          className="p-3.5 sm:p-4 rounded-2xl bg-[#0E2520] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F7F3EA]">
              {selectedInterests.length} {t('planner.step4.selectedCount')}
            </span>
            {selectedInterests.length > 0 && (
              <span className="text-white/30 hidden sm:inline">·</span>
            )}
            <span className="text-[#52C4B7] font-semibold truncate max-w-xs sm:max-w-md">
              {selectedSummaryNames}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer Navigation */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
        {/* Back Button */}
        <button
          type="button"
          id="planner-interests-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#D2E3DE] hover:text-[#F7F3EA] px-4 py-3 rounded-full hover:bg-white/5 transition-all cursor-pointer"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('planner.common.back')}</span>
        </button>

        {/* Primary Continue Button */}
        <button
          type="button"
          id="planner-interests-continue-btn"
          onClick={onContinue}
          disabled={selectedInterests.length === 0}
          className={`inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold tracking-tight transition-all shadow-md cursor-pointer group ${
            selectedInterests.length === 0
              ? 'bg-white/10 text-white/30 cursor-not-allowed shadow-none'
              : 'bg-[#F4C36C] hover:bg-[#E7A83B] text-[#081714] active:scale-[0.98] shadow-lg hover:shadow-xl'
          }`}
        >
          <span>{t('planner.step4.continueBtn')}</span>
          {isRTL ? (
            <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-0.5 transition-transform ${selectedInterests.length === 0 ? 'text-white/30' : 'text-[#081714]'}`} />
          ) : (
            <ArrowRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${selectedInterests.length === 0 ? 'text-white/30' : 'text-[#081714]'}`} />
          )}
        </button>
      </div>
    </div>
  );
};

