import React from 'react';
import { api } from '../../services/api';
import { useApiResource } from '../../hooks/useApiResource';
import {
  Sparkles,
  Heart,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Compass,
  Check
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface StoryExperience {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  tagline: string;
  taglineAr: string;
  duration: string;
  durationAr: string;
  location: string;
  locationAr: string;
  /** Absent: nothing measures a rating. Was an invented 4.8–5.0. */
  rating?: number;
  image: string;
  description: string;
  descriptionAr: string;
  activityToAdd: {
    time: string;
    title: string;
    titleAr: string;
    type: 'Activity' | 'Experience' | 'Dining' | 'Leisure';
    location: string;
    locationAr: string;
    notes: string;
    notesAr: string;
    duration: string;
    durationAr: string;
  };
}

/**
 * The offline fallback. These come from GET /api/dahab/content/stories now,
 * served from server/db/seeds/editorialContent.ts.
 */
const DAHAB_STORIES: StoryExperience[] = [
  {
    id: 'story-blue-lagoon',
    title: 'The Blue Lagoon Boat & Hammock Retreat',
    titleAr: 'ملاذ البلو لاجون بالقارب والأرجوحة',
    category: 'Coastal Secret',
    categoryAr: 'أسرار الساحل',
    tagline: 'Turquoise solitude beneath Sinai peaks',
    taglineAr: 'عزلة فيروزية ساحرة أسفل قمم سيناء',
    duration: 'Full Afternoon (4 hrs)',
    durationAr: 'فترة بعد الظهر (٤ ساعات)',
    location: 'Ras Abu Galum Protected Reserve',
    locationAr: 'محمية رأس أبو جالوم',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    description: 'Cruise past rugged granite sea cliffs on a local wooden boat to arrive at the crystal shallows of the Blue Lagoon. Swim, unwind in shaded palm palapas, and enjoy fresh baked Bedouin flatbread.',
    descriptionAr: 'انطلق بقارب خشبي محلي بمحاذاة منحدرات الجرانيت الشاهقة لتصل إلى مياه البلو لاجون الفيروزية الصافية. استمتع بالسباحة والاسترخاء في العشش البدوية وتناول خبز الفراشيح الطازج.',
    activityToAdd: {
      time: '01:30 PM',
      title: 'Blue Lagoon Boat Cruise & Hammock Relax',
      titleAr: 'رحلة قارب للبلو لاجون واستجمام الأراجيح',
      type: 'Experience',
      location: 'Ras Abu Galum / Blue Lagoon',
      locationAr: 'رأس أبو جالوم / البلو لاجون',
      notes: 'Boat transfer from Blue Hole pier. Pack snorkel, sunscreen and water.',
      notesAr: 'الانطلاق بالقارب من مرسى البلو هول. احرص على إحضار نظارة السنوركل والواقي والمياه.',
      duration: '4 hours',
      durationAr: '٤ ساعات',
    },
  },
  {
    id: 'story-desert-dinner',
    title: 'Wadi Gnai Stargazing & Bedouin Fire BBQ',
    titleAr: 'سهرة نجوم وعشاء بدوي على الفحم في وادي قني',
    category: 'Desert Magic',
    categoryAr: 'سحر الصحراء',
    tagline: 'Candlelight and ancient Sinai acoustics',
    taglineAr: 'ضوء الشموع ونغمات سيناء العريقة',
    duration: 'Evening (3.5 hrs)',
    durationAr: 'سهرة المساء (٣.٥ ساعات)',
    location: 'Wadi Gnai Desert Canyon',
    locationAr: 'وادي قني الصحراوي',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    description: 'Ride into the deep canyon by 4x4 as the granite mountains turn purple and amber at dusk. Gather around a crackling acacia wood fire for Bedouin-grilled meats, habak tea, and acoustic oud melodies.',
    descriptionAr: 'انطلق بسيارة الدفع الرباعي في أعماق الوادي مع تحول ألوان الجرانيت للوردي والكهرماني عند الغروب. استمتع بعشاء مشويات على حطب السنط، وشاي بالحبق ونغمات العود والسمسمية.',
    activityToAdd: {
      time: '06:00 PM',
      title: 'Wadi Gnai Stargazing & Bedouin Campfire Dinner',
      titleAr: 'سهرة النجوم وعشاء المشويات في وادي قني',
      type: 'Experience',
      location: 'Wadi Gnai Canyon',
      locationAr: 'وادي قني',
      notes: '4x4 pickup at hotel lobby. Warm desert layer recommended for evening.',
      notesAr: 'التحرك بسيارة الدفع الرباعي من الفندق. ينصح بارتداء سترة خفيفة للمساء.',
      duration: '3.5 hours',
      durationAr: '٣.٥ ساعات',
    },
  },
  {
    id: 'story-canyon-dive',
    title: 'The Canyon Submarine Rift Exploration',
    titleAr: 'استكشاف صدع الكانيون البحري الفريد',
    category: 'World-Class Dive',
    categoryAr: 'غطسة عالمية',
    tagline: 'Sun rays cutting through deep coral fissures',
    taglineAr: 'أشعة الشمس تخترق شقوق المرجان السحيقة',
    duration: 'Morning (2.5 hrs)',
    durationAr: 'الصباح (٢.٥ ساعة)',
    location: 'The Canyon Shore Entry',
    locationAr: 'مدخل شاطئ الكانيون',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
    description: 'Enter through a natural coral chimney into a spectacular underwater volcanic dome. Millions of glassy sweepers hover in the blue light as sunlight streams from above.',
    descriptionAr: 'ادخل عبر مدخنة مرجانية طبيعية إلى قبة بركانية مذهلة تحت الماء. ملايين الأسماك الزجاجية تسبح في الضوء الأزرق مع تدفق أشعة الشمس الساحرة من الأعلى.',
    activityToAdd: {
      time: '08:45 AM',
      title: 'The Canyon Guided Coral Rift Dive',
      titleAr: 'غطسة إرشادية في صدع الكانيون المرجاني',
      type: 'Activity',
      location: 'The Canyon Dive Site',
      locationAr: 'موقع غوص الكانيون',
      notes: 'Dive gear fitted. Briefing by Master Diver Youssef.',
      notesAr: 'تجهيز المعدات وجلسة توجيه مع كابتن يوسف.',
      duration: '2.5 hours',
      durationAr: '٢.٥ ساعة',
    },
  },
  {
    id: 'story-assalah-food',
    title: 'Assalah Spice & Seaside Mezzes Tour',
    titleAr: 'جولة بهارات ومقبلات العصلة الساحلية',
    category: 'Sinai Flavors',
    categoryAr: 'نكهات سيناء',
    tagline: 'Artisan sourdough, roasted dates & sea herbs',
    taglineAr: 'مخبوزات بلدية، تمور فاخرة وأعشاب برية',
    duration: 'Late Afternoon (2 hrs)',
    durationAr: 'أواخر العصر (ساعتان)',
    location: 'Assalah Square & Lighthouse',
    locationAr: 'ميدان العصلة وممشى اللايتهاوس',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    description: 'Taste authentic Dahab street delicacies: freshly fried herb falafel, warm tahini bread from brick ovens, mountain oregano teas, and freshly squeezed mango nectars.',
    descriptionAr: 'تذوق أشهى مأكولات دهب الأصيلة: فلافل الأعشاب المقرمشة، خبز الأفران الساخن مع الطحينة، شاي الزعتر الجبلي وعصائر المانجو الطازجة.',
    activityToAdd: {
      time: '04:00 PM',
      title: 'Assalah Local Bakery & Herb Tasting Stroll',
      titleAr: 'جولة مخابز وتذوق الأعشاب في العصلة',
      type: 'Dining',
      location: 'Assalah Market',
      locationAr: 'سوق العصلة',
      notes: 'Sample local mountain tea, fresh dates, and artisanal pastries.',
      notesAr: 'تذوق الشاي الجبلي، التمور الطازجة والمخبوزات المحلية.',
      duration: '2 hours',
      durationAr: 'ساعتان',
    },
  },
];

/** Stable so useApiResource does not re-request on every render. */
const fetchCuratedStories = (signal: AbortSignal) => api.getCuratedStories(signal);

export const CuratedStoriesRail: React.FC = () => {
  /** Served content, with the compiled copy above as the offline fallback. */
  const remote = useApiResource(fetchCuratedStories);
  const stories = remote.data?.stories?.length
    ? (remote.data.stories as unknown as StoryExperience[])
    : DAHAB_STORIES;

  const { addActivityToDay, savedItems, toggleSaveItem } = useTrip();
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const handleAddStory = (story: StoryExperience) => {
    addActivityToDay(2, {
      id: `story-act-${Date.now()}`,
      time: story.activityToAdd.time,
      title: isAr ? story.activityToAdd.titleAr : story.activityToAdd.title,
      type: story.activityToAdd.type,
      // status is data, not display: writing the Arabic label here produced an
      // activity whose status matched no filter or comparison anywhere else.
      status: 'Added ✓',
      location: isAr ? story.activityToAdd.locationAr : story.activityToAdd.location,
      notes: isAr ? story.activityToAdd.notesAr : story.activityToAdd.notes,
      duration: isAr ? story.activityToAdd.durationAr : story.activityToAdd.duration,
    });
  };

  return (
    <section
      id="curated-stories-editorial-rail"
      aria-label={isAr ? 'تجارب وقصص دهب المنتقاة' : 'Curated Dahab Stories and Experiences'}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="relative rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-[1.5px] bg-[var(--accent-secondary)]" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)] font-serif">
                  {isAr ? 'مختارات تحريرية' : 'Editorial Highlights'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight font-serif">
                {isAr ? 'تجارب سيناء المنتقاة' : 'Curated Sinai Experiences'}
              </h2>
            </div>

            <span className="text-xs text-[var(--text-secondary)] font-medium bg-[var(--surface-container)] px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)]">
              {isAr ? 'منتقاة بعناية بواسطة مستكشفي ومرشدي دهب المحليين' : 'Hand-picked by Dahab resident explorers & guides'}
            </span>
          </div>

          {/* Grid of Editorial Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.map((story) => {
              const isSaved = savedItems.includes(story.id);
              const cardTitle = isAr ? story.titleAr : story.title;
              const cardCategory = isAr ? story.categoryAr : story.category;
              const cardDesc = isAr ? story.descriptionAr : story.description;
              const cardLocation = isAr ? story.locationAr : story.location;
              const cardDuration = isAr ? story.durationAr : story.duration;

              return (
                <article
                  key={story.id}
                  className="bg-[var(--surface-container)] hover:bg-[var(--surface-card)] rounded-3xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Card Image Container */}
                  <div className="relative h-52 w-full overflow-hidden bg-[var(--bg-canvas)]">
                    <img
                      src={story.image}
                      alt={cardTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-[var(--surface-card)]/40 to-transparent" />

                    {/* Top Category Badge */}
                    <div className="absolute top-3.5 start-3.5">
                      <span className="px-3 py-1 rounded-full bg-[var(--bg-canvas)]/90 text-[var(--accent-secondary)] text-[11px] font-bold uppercase tracking-wider border border-[var(--border-subtle)] shadow-xs">
                        {cardCategory}
                      </span>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={() => toggleSaveItem(story.id)}
                      aria-label={isSaved ? (isAr ? 'إزالة من المحفوظات' : 'Remove from saved') : (isAr ? 'حفظ التجربة' : 'Save experience')}
                      className={`absolute top-3.5 end-3.5 p-2 rounded-full transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-[var(--bg-canvas)]/80 text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    {/* Bottom Card Title & Rating */}
                    <div className="absolute bottom-3.5 start-3.5 end-3.5 text-[var(--text-primary)]">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--accent-secondary)] font-bold mb-1">
                        {/* The star and its number are gone: the rating was an
                            invented 4.8–5.0. The duration beside it is real. */}
                        {typeof story.rating === 'number' && (
                          <>
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{story.rating}</span>
                            <span className="text-[var(--text-secondary)] font-normal">·</span>
                          </>
                        )}
                        <span className="text-[var(--text-secondary)] font-normal">{cardDuration}</span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] font-serif leading-tight">
                        {cardTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body & Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                      {cardDesc}
                    </p>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)]">
                        <MapPin className="w-3.5 h-3.5 text-current shrink-0" />
                        <span className="truncate max-w-[120px]">{cardLocation}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddStory(story)}
                        className="px-3.5 py-2 rounded-xl bg-[var(--accent-secondary)] hover:brightness-110 text-[var(--accent-secondary-ink)] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md flex-shrink-0 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 text-current" />
                        <span>{isAr ? 'أضف لليوم ٢' : 'Add to Day 2'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

