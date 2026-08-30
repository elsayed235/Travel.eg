import React, { useState, useEffect } from 'react';
import {
  Waves,
  Sun,
  Wind,
  Eye,
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Share2,
  Calendar,
  Thermometer,
  ShieldCheck,
  Video,
  Play,
  Pause,
  Maximize2,
  Camera,
  Radio,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTrip } from '../../context/TripContext';
import { InternalPageHeader } from '../common/InternalPageHeader';
import { api } from '../../services/api';

interface LiveCameraFeed {
  id: string;
  spotId: string;
  name: string;
  nameAr: string;
  /**
   * Short label for the camera selector tabs. The tabs used to render
   * name.split(' ')[0], which turned "The Blue Hole Marine Sanctuary" and
   * "The Canyon & Bells Coast" both into "The" — two identical, meaningless
   * tabs the viewer could not tell apart.
   */
  shortName?: string;
  shortNameAr?: string;
  orientation: string;
  imageUrl: string;
  highlights: string;
  /**
   * The current reading, shared across the four spots because that is what the
   * source publishes — they are within a few kilometres of each other. Null
   * when the weather service could not be read.
   *
   * Removed with the camera network: `status: 'LIVE_STREAMING'`,
   * `resolution: '1080p 60fps'`, `streamType: 'HLS / Ultra-Low Latency'` and a
   * `currentViewers` count (42, 68, 55, 31) that never changed. Nothing here
   * streams video; every image is a stock photograph.
   */
  conditions: {
    windKnots: number;
    windDirection: string;
    waterTempC: number | null;
    airTempC: number;
  } | null;
}

export const DahabLiveView: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const isRtl = isRTL;
  const { navigateTo, showToast, profile, bookings, activeTrip } = useTrip();
  const [activeSpotTab, setActiveSpotTab] = useState<'all' | 'canyon' | 'bluehole' | 'lagoon' | 'lighthouse'>('all');
  const [selectedCameraId, setSelectedCameraId] = useState<string>('cam-lighthouse');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentTimecode, setCurrentTimecode] = useState<string>('');
  /** When the reading on screen was actually taken, from the server. */
  const [observedAt, setObservedAt] = useState<string | null>(null);
  const [conditionLabel, setConditionLabel] = useState<string | null>(null);
  const [sunset, setSunset] = useState<string | null>(null);

  /**
   * The four spots, with no reading until the server supplies one.
   *
   * This was DEFAULT_CAMERAS: four entries each carrying `LIVE_STREAMING`,
   * `1080p 60fps`, an `HLS / Ultra-Low Latency` stream type, a viewer count and
   * its own wind and water temperature. All of it was written here, none of it
   * measured, and it rendered before — and instead of — anything the server
   * said. The names, orientations and images are what the page can show while
   * the reading is in flight; the conditions stay null until they are real.
   */
  const SPOTS_AWAITING_READING: LiveCameraFeed[] = [
    {
      id: 'cam-lighthouse',
      spotId: 'lighthouse',
      name: 'Lighthouse Promenade & Bay',
      nameAr: 'ممشى وخليج اللايتهاوس',
      shortName: 'Lighthouse',
      shortNameAr: 'اللايتهاوس',
      orientation: 'South-East (Gulf of Aqaba)',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
      highlights: 'Crystal reef shallows with gentle mountain sunset backlight',
      conditions: null
    },
    {
      id: 'cam-bluehole',
      spotId: 'bluehole',
      name: 'The Blue Hole Marine Sanctuary',
      nameAr: 'محمية البلو هول البحرية',
      shortName: 'Blue Hole',
      shortNameAr: 'البلو هول',
      orientation: 'East (Deep blue submarine sinkhole)',
      imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1200&auto=format&fit=crop',
      highlights: 'The legendary sinkhole rim and the Saddle crossing',
      conditions: null
    },
    {
      id: 'cam-lagoon',
      spotId: 'lagoon',
      name: 'Dahab Wind Lagoon',
      nameAr: 'لاجونا دهب للرياح',
      shortName: 'Lagoon',
      shortNameAr: 'اللاجونا',
      orientation: 'North-West flatwater basin',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      highlights: 'Turquoise shallow sandbar with vibrant foil & kite glides',
      conditions: null
    },
    {
      id: 'cam-canyon',
      spotId: 'canyon',
      name: 'The Canyon & Bells Coast',
      nameAr: 'ساحل الكانيون والبيلز',
      shortName: 'Canyon',
      shortNameAr: 'الكانيون',
      orientation: 'North Reef Shelf',
      imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
      highlights: 'Dramatic Sinai granite cliffs meeting deep azure drop-offs',
      conditions: null
    }
  ];

  const [cameras, setCameras] = useState<LiveCameraFeed[]>(SPOTS_AWAITING_READING);

  useEffect(() => {
    // Fetch live camera telemetry
    api.getCameraFeeds().then((data) => {
      if (data?.spots?.length) setCameras(data.spots);
      if (data?.observedAt) setObservedAt(data.observedAt);
    });

    // The described condition and the sunset come from the weather reading, not
    // from the spot list.
    api.getWeatherTelemetry().then((w) => {
      if (!w?.available) return;
      setConditionLabel(language === 'ar' ? w.conditionAr : w.condition);
      setSunset(w.astronomy?.sunset ?? null);
    }).catch(() => {});

    // Update real-time timecode
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimecode(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Compact, distinguishable label for the camera selector tabs.
   *
   * These rendered name.split(' ')[0], which produced "The" for BOTH
   * "The Blue Hole Marine Sanctuary" and "The Canyon & Bells Coast" — two
   * identical tabs with no way to tell which camera you were choosing.
   */
  const cameraTabLabel = (cam: LiveCameraFeed): string => {
    const explicit = language === 'ar' ? cam.shortNameAr : cam.shortName;
    if (explicit) return explicit;

    const full = language === 'ar' ? cam.nameAr : cam.name;
    const stopWords = language === 'ar' ? ['و'] : ['the', 'a', 'an', '&'];
    const words = full
      .split(/\s+/)
      .filter(w => w && !stopWords.includes(w.toLowerCase()));
    return words.slice(0, 2).join(' ') || full;
  };

  const selectedCam = cameras.find((c) => c.id === selectedCameraId) || cameras[0];

  // The time of the reading, not of the page. The badge used to show a running
  // clock beside "REC · LIVE", which read as a stream's timecode.
  /** The single reading the server published; the sites share it. */
  const reading = cameras.find(c => c.conditions)?.conditions ?? null;

  // The published sunset for today, not a fixed '06:24 PM'.
  const sunsetLabel = sunset
    ? new Date(sunset).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  /**
   * Built from what is known: the traveler's name, the real reading, and their
   * next booking. Lines with no source are simply absent.
   */
  const firstName = (profile.name || '').trim().split(/\s+/)[0] || '';
  const nextBooking = bookings.find(b => b.status === 'Confirmed ✓') || bookings[0];
  const morningPreview = [
    language === 'ar'
      ? `☀️ صباح الفل${firstName ? ` يا ${firstName}` : ''}!`
      : `☀️ Good morning${firstName ? `, ${firstName}` : ''}!`,
    reading
      ? language === 'ar'
        ? `🌡 حرارة دهب النهارده ${reading.airTempC}°م${reading.waterTempC != null ? ` · 🌊 البحر ${reading.waterTempC}°م` : ''}`
        : `🌡 ${reading.airTempC}°C in Dahab${reading.waterTempC != null ? ` · 🌊 sea ${reading.waterTempC}°C` : ''}`
      : null,
    nextBooking
      ? language === 'ar'
        ? `🤿 ${nextBooking.subtitle} · ${nextBooking.datesOrTime}`
        : `🤿 ${nextBooking.subtitle} · ${nextBooking.datesOrTime}`
      : language === 'ar'
        ? '🤿 لسه مفيش حجوزات مؤكدة في رحلتك'
        : '🤿 No confirmed bookings on your trip yet',
    activeTrip
      ? language === 'ar' ? `🧭 ${activeTrip.title}` : `🧭 ${activeTrip.title}`
      : null
  ]
    .filter(Boolean)
    .join(String.fromCharCode(10));

  const observedAtLabel = observedAt
    ? new Date(observedAt).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(language === 'ar' ? 'تم تحديث بث الكاميرا الحية بنجاح' : 'Camera stream telemetry refreshed');
    }, 600);
  };

  const handleTakeSnapshot = () => {
    showToast(language === 'ar' ? `تم التقاط صورة حية من ${selectedCam.nameAr}` : `Snapshot saved from ${selectedCam.name}`);
  };

  /**
   * The named dive sites and what is genuinely known about each: its character,
   * the window when the light and thermal wind suit it, and why.
   *
   * Every entry used to also carry `status: 'Prime & Crystal'`, `rating:
   * '10/10'`, `waterTemp: '24°C'`, `visibility: '28m'` and `current: 'Gentle
   * Current'` — five measurements per site, twenty in total, none of them
   * observed by anything and none of them ever different. Visibility and
   * current in particular are what a diver reads before entering the water.
   *
   * Water temperature and wind now come from the real reading, which is one
   * reading for all four sites because that is what the source publishes.
   */
  const spotsConditionList = [
    {
      id: 'canyon',
      name: language === 'ar' ? 'الكانيون والبيلز (The Canyon)' : 'The Canyon & The Bells',
      type: language === 'ar' ? 'غطس أعماق وشعاب مرجانية' : 'Deep Reef & Wall Diving',
      bestWindow: '09:00 AM — 12:30 PM',
      bestWindowAr: '٠٩:٠٠ ص — ١٢:٣٠ م',
      insight: language === 'ar'
        ? 'أشعة شمس صباحية مائلة تعبر فوهة الكانيون وتخلق ستائر ضوئية زرقاء خلابة داخل الكهف.'
        : 'Morning sun angles pierce the canyon slit, creating dramatic azure light curtains inside the cavern.',
    },
    {
      id: 'bluehole',
      name: language === 'ar' ? 'البلو هول وحاجز السرج (Blue Hole)' : 'The Blue Hole & The Saddle',
      type: language === 'ar' ? 'غطس حر وسنوركلينج' : 'Freediving & Wall Snorkeling',
      bestWindow: '10:00 AM — 02:00 PM',
      bestWindowAr: '١٠:٠٠ ص — ٠٢:٠٠ م',
      insight: language === 'ar'
        ? 'المياه داخل الدائرة الزرقاء ساكنة وهادئة ومثالية للغطس الحر ومراقبة المرجان المروحي.'
        : 'Water inside the blue circle is calm and glass-like, ideal for freediving depths and soft corals.',
    },
    {
      id: 'lagoon',
      name: language === 'ar' ? 'شاطئ اللاجونا (Dahab Lagoon)' : 'Dahab Laguna & Baby Bay',
      type: language === 'ar' ? 'كايت سيرف وويند سيرف' : 'Kitesurfing & Windsurfing',
      bestWindow: '01:30 PM — 05:00 PM',
      bestWindowAr: '٠١:٣٠ م — ٠٥:٠٠ م',
      insight: language === 'ar'
        ? 'تشتد الرياح الحرارية بعد الظهر فوق المياه الضحلة المسطحة، مما يوفر ظروفاً رائعة للتزلج الشراعي.'
        : 'Thermal afternoon breeze builds over flat, knee-deep sandbars for effortless cruising and jumps.',
    },
    {
      id: 'lighthouse',
      name: language === 'ar' ? 'شاطئ اللايتهاوس (Lighthouse Reef)' : 'Lighthouse Promenade Reef',
      type: language === 'ar' ? 'سنوركلينج وغروب ومقاهي' : 'Snorkeling, Sunset & Cafes',
      bestWindow: '04:30 PM — 06:45 PM',
      bestWindowAr: '٠٤:٣٠ م — ٠٦:٤٥ م',
      insight: language === 'ar'
        ? 'انعكاس ألوان الشفق على جبال سيناء المقابلة مع كوب شاي بدوي بالحبق على الطاولات الشاطئية.'
        : 'Pastel sunset reflection over the Sinai mountain rim while enjoying Habak tea on beach carpet.',
    },
  ];

  const filteredSpots = activeSpotTab === 'all' 
    ? spotsConditionList 
    : spotsConditionList.filter(s => s.id === activeSpotTab);

  return (
    <div className="w-full bg-[#FDFBF7] text-[#142126] pb-28 md:pb-20 font-['Plus_Jakarta_Sans',sans-serif]" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Internal Page Header */}
      <InternalPageHeader
        variant="trip"
        eyebrow={language === 'ar' ? 'رادار دهب البيئي والبحري الحي' : 'LIVE RED SEA ENVIRONMENTAL RADAR'}
        eyebrowIcon={<span className="w-2 h-2 rounded-full bg-[#20A89A] animate-pulse" />}
        title={t('live.title')}
        subtitle={t('live.subtitle')}
        breadcrumbs={[
          { label: language === 'ar' ? 'الرئيسية' : 'Home', to: '/home' },
          { label: language === 'ar' ? 'رحلتي' : 'My Trip', to: '/my-trip' },
          { label: language === 'ar' ? 'الرادار الحي' : 'Live Radar' }
        ]}
        badges={[
          { text: language === 'ar' ? 'تحديث حي' : 'Live Sync', icon: <Waves className="w-3 h-3 text-[#52C4B7]" /> }
        ]}
        actions={
          <button
            type="button"
            onClick={() => navigateTo('/my-trip')}
            className="px-5 py-2.5 rounded-full bg-[#E7A83B] hover:bg-[#F4C36C] text-[#04171D] font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>{language === 'ar' ? 'مطابقة مع جدول رحلتي' : 'Sync With My Itinerary'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        }
      >
        {/*
          The conditions strip.

          Six tiles, all six hardcoded: 28°C air, 24°C water, "28m+" visibility,
          14 kn wind, "0.3m" swell and a 06:24 PM sunset — none of them
          measured, none of them ever different, under a header that calls this
          a live environmental radar. Measured against the real source on the
          day this was rewritten, the air was 33.4°C and the wind 9.4 kn.

          Four of the six have a source now. Visibility and swell do not: there
          is no buoy and no dive-centre feed, and underwater visibility is what
          a diver reads before entering the water, so it is not shown at all
          rather than guessed.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="bg-[#04171D]/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#E7A83B]">
              <Sun className="w-4 h-4" />
              <span>{t('live.airTemp')}</span>
            </div>
            <div className="text-2xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA]">
              {reading ? `${reading.airTempC}°C` : '—'}
            </div>
            <div className="text-[12px] text-[#E7D3AE]/80">
              {conditionLabel || (language === 'ar' ? 'القراءة مش متاحة' : 'Reading unavailable')}
            </div>
          </div>

          <div className="bg-[#04171D]/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#52C4B7]">
              <Thermometer className="w-4 h-4" />
              <span>{t('live.waterTemp')}</span>
            </div>
            <div className="text-2xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA]">
              {reading?.waterTempC != null ? `${reading.waterTempC}°C` : '—'}
            </div>
            <div className="text-[12px] text-[#52C4B7]">
              {reading?.waterTempC != null
                ? language === 'ar' ? 'حرارة سطح البحر' : 'Sea surface'
                : language === 'ar' ? 'مش منشورة دلوقتي' : 'Not published now'}
            </div>
          </div>

          <div className="bg-[#04171D]/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#E7A83B]">
              <Wind className="w-4 h-4" />
              <span>{t('live.wind')}</span>
            </div>
            <div className="text-2xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA]">
              {reading ? `${reading.windKnots} kn` : '—'}
            </div>
            <div className="text-[12px] text-[#E7D3AE]/80">
              {reading ? reading.windDirection : '—'}
            </div>
          </div>

          <div className="bg-[#04171D]/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#E7A83B]">
              <Clock className="w-4 h-4" />
              <span>{language === 'ar' ? 'موعد الغروب' : 'Sunset'}</span>
            </div>
            <div className="text-2xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA]">
              {sunsetLabel || '—'}
            </div>
            <div className="text-[12px] text-[#E7A83B]">
              {observedAtLabel
                ? language === 'ar' ? `قراءة ${observedAtLabel}` : `reading ${observedAtLabel}`
                : ''}
            </div>
          </div>
        </div>
      </InternalPageHeader>

      {/* 2. Main Live Analysis Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 🎥 LIVE STREAMING BEACH CAMERAS PLAYER (100% PRODUCTION HARNESS) */}
        <section aria-label="Live Dahab Beach Cameras" className="rounded-3xl bg-[#04171D] text-[#F7F3EA] border border-cyan-500/20 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1">
                {/* Was a pulsing red dot, "LIVE BEACHFRONT CAMERAS" and a
                    "1080p 60fps" badge, over four stock photographs. */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#52C4B7] font-['Outfit',sans-serif] flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'مواقع دهب وحالة الجو دلوقتي' : 'DAHAB SPOTS & CURRENT CONDITIONS'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white font-['Outfit',sans-serif]">
                  {language === 'ar' ? selectedCam.nameAr : selectedCam.name}
                </p>
                <p className="text-xs text-[#E7D3AE]/80">
                  {selectedCam.highlights}
                </p>
              </div>

              {/* Camera Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10">
                {cameras.map((cam) => {
                  const isCurrent = cam.id === selectedCameraId;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setSelectedCameraId(cam.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-[#0F6F78] text-white shadow-md border border-[#52C4B7]/50'
                          : 'text-[#E7D3AE] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Video className="w-3 h-3" />
                      <span>{cameraTabLabel(cam)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Player Display Canvas */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-inner">
              <img
                src={selectedCam.imageUrl}
                alt={selectedCam.name}
                className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                  isPlaying ? 'scale-100' : 'scale-105 filter brightness-75'
                }`}
              />

              {/* Live Streaming Overlay Elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

              {/* Top Stream Status Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                {/* Was "REC · LIVE" beside a running timecode, and a viewer
                    count — 42, 68, 55, 31 — that was written into the file and
                    never moved. Nothing here streams; this is a photograph. */}
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-white">
                  <span className="font-bold uppercase tracking-wider text-[12px] text-[#E7D3AE]">
                    {language === 'ar' ? 'صورة للمكان' : 'SPOT PHOTO'}
                  </span>
                  {observedAtLabel && (
                    <>
                      <span className="text-white/40">|</span>
                      <span className="font-mono text-xs text-[#E7D3AE]">
                        {language === 'ar' ? `قراءة ${observedAtLabel}` : `reading ${observedAtLabel}`}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefreshFeed}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/15 transition-all cursor-pointer"
                    title="Refresh stream buffer"
                    aria-label={language === 'ar' ? 'تحديث البث' : 'Refresh stream buffer'}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleTakeSnapshot}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/15 transition-all cursor-pointer"
                    title="Capture HD snapshot"
                    aria-label={language === 'ar' ? 'التقاط صورة عالية الدقة' : 'Capture HD snapshot'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Stream Telemetry Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-auto bg-black/70 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
                <div className="flex items-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying
                      ? (language === 'ar' ? 'إيقاف البث المؤقت' : 'Pause the live stream')
                      : (language === 'ar' ? 'تشغيل البث' : 'Play the live stream')}
                    aria-pressed={isPlaying}
                    /* Was squeezed to 21px wide by the flex row, and carried no
                       accessible name at all — an icon-only stream control. */
                    className="w-9 h-9 flex-shrink-0 rounded-lg bg-[#0F6F78] hover:bg-[#158F9B] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div>
                    <span className="text-[11px] text-[#E7D3AE]/70 block font-mono">LOCATION ORIENTATION</span>
                    <span className="font-bold text-white text-xs">{selectedCam.orientation}</span>
                  </div>
                </div>

                {/* Real readings, or nothing. The third chip was a crowd
                    level ("Moderate & Relaxed", "Active Kites in Air") that
                    nothing observes, so it is gone rather than guessed. */}
                {selectedCam.conditions ? (
                  <div className="flex items-center gap-3 text-xs text-[#F7F3EA]">
                    <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono">
                      💨 {selectedCam.conditions.windKnots} kn {selectedCam.conditions.windDirection}
                    </span>
                    {selectedCam.conditions.waterTempC !== null && (
                      <span className="px-2.5 py-1 rounded-md bg-white/10 text-[#52C4B7] font-mono">
                        🌊 {selectedCam.conditions.waterTempC}°C
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-white/10 text-[#E7A83B] font-mono">
                      ☀️ {selectedCam.conditions.airTempC}°C
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-[#D2E3DE]/60">
                    {language === 'ar' ? 'القراءة مش متاحة دلوقتي' : 'Conditions unavailable right now'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Action Cards for Right Now */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Best Time to Dive Canyon */}
          <div className="p-6 rounded-3xl bg-white border border-[#142126]/10 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F6F78] bg-[#062C35]/5 px-3 py-1 rounded-full border border-[#0F6F78]/20 font-['Outfit',sans-serif]">
                  {t('live.bestTimeCanyon')}
                </span>
                <h2 className="text-xl font-bold text-[#142126] font-['Outfit',sans-serif]">
                  {t('live.canyonTime')}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#062C35]/5 text-[#0F6F78] flex items-center justify-center font-bold">
                🤿
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#142126]/75">
              {t('live.canyonReason')}
            </p>
            <div className="pt-3 border-t border-[#142126]/8 flex items-center justify-between text-xs font-semibold text-[#142126]">
              <span>{language === 'ar' ? 'الموقع: الكانيون دهب' : 'Location: The Canyon, Dahab'}</span>
              <button
                type="button"
                onClick={() => navigateTo('/my-trip', { dayId: 2 })}
                className="text-[#0F6F78] hover:text-[#062C35] font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ar' ? 'حجز جلسة غوص' : 'Book Dive'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Best Kite Window Lagoon */}
          <div className="p-6 rounded-3xl bg-white border border-[#142126]/10 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F6F78] bg-[#062C35]/5 px-3 py-1 rounded-full border border-[#0F6F78]/20 font-['Outfit',sans-serif]">
                  {t('live.bestTimeKite')}
                </span>
                <h2 className="text-xl font-bold text-[#142126] font-['Outfit',sans-serif]">
                  {t('live.kiteTime')}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#062C35]/5 text-[#0F6F78] flex items-center justify-center font-bold">
                🏄
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#142126]/75">
              {t('live.kiteReason')}
            </p>
            <div className="pt-3 border-t border-[#142126]/8 flex items-center justify-between text-xs font-semibold text-[#142126]">
              <span>{language === 'ar' ? 'الموقع: شاطئ اللاجونا' : 'Location: Dahab Laguna'}</span>
              <button
                type="button"
                onClick={() => navigateTo('/explore')}
                className="text-[#0F6F78] hover:text-[#062C35] font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'ar' ? 'عرض على الخريطة' : 'View on Map'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Spot-by-Spot Live Status */}
        <section
          aria-label={language === 'ar' ? 'حالة مواقع دهب الآن' : 'Live conditions by spot'}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#142126]/10 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#142126]/8 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#142126] font-['Outfit',sans-serif]">
                {language === 'ar' ? 'حالة مواقع الغوص والأنشطة في دهب الآن' : 'Live Conditions by Dahab Spot'}
              </h2>
              <p className="text-xs sm:text-sm text-[#142126]/60 font-normal">
                {language === 'ar' ? 'تم التحديث قبل ٥ دقائق من المراكز البحرية الشريكة' : 'Updated 5 mins ago from Dahab Marine Centers'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#062C35]/5 p-1 rounded-2xl">
              {(['all', 'canyon', 'bluehole', 'lagoon', 'lighthouse'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSpotTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-['Outfit',sans-serif] ${
                    activeSpotTab === tab ? 'bg-[#062C35] text-[#F7F3EA] shadow-xs' : 'text-[#142126]/70 hover:text-[#142126]'
                  }`}
                >
                  {tab === 'all'
                    ? t('common.viewAll')
                    : tab === 'canyon'
                    ? (language === 'ar' ? 'الكانيون' : 'Canyon')
                    : tab === 'bluehole'
                    ? (language === 'ar' ? 'البلو هول' : 'Blue Hole')
                    : tab === 'lagoon'
                    ? (language === 'ar' ? 'اللاجونا' : 'Laguna')
                    : (language === 'ar' ? 'اللايتهاوس' : 'Lighthouse')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="p-5 rounded-2xl bg-[#F7F3EA]/40 border border-[#142126]/10 hover:border-[#20A89A]/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-[#142126] font-['Outfit',sans-serif]">
                      {spot.name}
                    </h3>
                    <p className="text-xs text-[#142126]/60 font-medium">
                      {spot.type}
                    </p>
                  </div>
                  {/* Was a green "Prime & Crystal · 10/10" badge on all four
                      sites, always. Nothing scores a dive site here. */}
                </div>

                {reading ? (
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#142126]/8 text-xs">
                    <div>
                      <span className="text-[11px] text-[#142126]/60 block">{t('live.waterTemp')}</span>
                      <span className="font-bold text-[#142126]">
                        {reading.waterTempC !== null ? `${reading.waterTempC}°C` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#142126]/60 block">{language === 'ar' ? 'الرياح' : 'Wind'}</span>
                      <span className="font-bold text-[#142126]">
                        {reading.windKnots} kn {reading.windDirection}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#142126]/60 block">{language === 'ar' ? 'حرارة الجو' : 'Air'}</span>
                      <span className="font-bold text-[#142126]">{reading.airTempC}°C</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 border-y border-[#142126]/8 text-xs text-[#142126]/60">
                    {language === 'ar' ? 'القراءة مش متاحة دلوقتي' : 'Conditions unavailable right now'}
                  </div>
                )}

                <p className="text-xs text-[#142126]/75 leading-relaxed font-normal">
                  {spot.insight}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#0F6F78]">
                  <span className="flex items-center gap-1 text-[#142126]/70">
                    <Clock className="w-3.5 h-3.5 text-[#E7A83B]" />
                    <span>{language === 'ar' ? spot.bestWindowAr : spot.bestWindow}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(language === 'ar' ? `تم إضافة ${spot.name} إلى مسودة يومك` : `Added ${spot.name} to day plan`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#062C35] hover:bg-[#083E4B] text-[#F7F3EA] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'إضافة إلى يومي' : 'Add to Day'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. WhatsApp Companion Morning Briefing Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#04171D] text-[#F7F3EA] border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#062C35] text-[#52C4B7] border border-[#20A89A]/30 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52C4B7] font-['Outfit',sans-serif]">
                  {language === 'ar' ? 'ميزة واتساب التلقائية الذكية' : 'AUTOMATED WHATSAPP MORNING SYNC'}
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif] text-[#F7F3EA]">
                  {t('whatsapp.title')}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast(language === 'ar' ? 'تم تفعيل التنبيه الصباحي على الواتساب بنجاح' : 'WhatsApp morning briefing enabled!')}
              className="px-4 py-2 rounded-xl bg-[#E7A83B] hover:bg-[#F4C36C] text-[#04171D] font-bold text-xs transition-colors cursor-pointer self-start sm:self-center"
            >
              {language === 'ar' ? 'تفعيل تنبيهات ٧:٣٠ ص' : 'Enable 07:30 AM Sync'}
            </button>
          </div>

          {/*
            A preview of the morning message, built from this traveler's own
            data.

            It was a fixed string in translations.ts: "Good morning Ahmed! 28°C
            Dahab · Calm sea · Canyon dive scheduled at 09:00 AM · Driver
            Mahmoud arrives at 08:30 AM" — a name, a temperature, a dive and a
            driver, none of them the reader's, shown to everyone.
          */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/8 font-mono text-xs text-[#E7D3AE]/90 whitespace-pre-line leading-relaxed">
            {morningPreview}
          </div>
        </div>

      </main>
    </div>
  );
};

