import { NEAR_ME_DATA } from '../components/explore/ExploreView';
import type { DahabActivity, DahabPlace, DahabDiningVenue, ResolvedBookability } from '../shared';

export interface ExperienceDetailData {
  id: string;
  slug: string;
  /**
   * The corpus activity this editorial entry describes, when one exists.
   *
   * Curated entries are written by hand and keyed by slug ('blue-hole') while
   * the catalogue keys by activity id ('act_blue_hole_safari_dive'), so the
   * link has to be stated rather than derived from the strings.
   */
  activityId?: string;
  /**
   * What it takes to sell this experience, resolved by the server from the
   * commerce catalogue — null when it cannot be booked online.
   *
   * Until this existed there was no route at all from an experience to a
   * booking: Explore sold slugs, checkout accepted only SKUs, and nothing
   * mapped between them. Prefer `bookable.basePriceEGP` over the editorial
   * `basePriceEGP` below wherever a price leads to a checkout, because the
   * bookable one is what gets charged.
   */
  bookable?: ResolvedBookability | null;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: 'diving' | 'safari' | 'beach' | 'food' | 'coffee' | 'nightlife' | 'wellness' | 'culture' | 'water_sport';
  categoryLabelEn: string;
  categoryLabelAr: string;
  heroImage: string;
  galleryImages: string[];
  locationEn: string;
  locationAr: string;
  coordinates?: { lat: number; lng: number };
  durationEn: string;
  durationAr: string;
  durationMinutes: number;
  difficultyEn: string;
  difficultyAr: string;
  intensityScore: number; // 1-5
  accessMethodEn: string;
  accessMethodAr: string;
  openHoursEn: string;
  openHoursAr: string;
  basePriceEGP: number;
  priceLevel: '$' | '$$' | '$$$';
  verifiedBadgeEn: string;
  verifiedBadgeAr: string;
  localGuideInsightEn: string;
  localGuideInsightAr: string;
  highlightsEn: string[];
  highlightsAr: string[];
  includedEn: string[];
  includedAr: string[];
  notIncludedEn: string[];
  notIncludedAr: string[];
  preparationTipsEn: string[];
  preparationTipsAr: string[];
  environmentalSignals: {
    waterTemp: string;
    visibility: string;
    windCondition: string;
    bestTide: string;
  };
}

// Curated high-res curated experiences database
export const CURATED_EXPERIENCES: ExperienceDetailData[] = [
  {
    id: 'near-blue-hole',
    slug: 'blue-hole',
    activityId: 'act_blue_hole_safari_dive',
    titleEn: 'Blue Hole & Bells Marine Sanctuary',
    titleAr: 'محمية البلو هول والبلز للغطس الحر',
    taglineEn: 'World-renowned 120m submarine sinkhole with vertical coral drop-offs.',
    taglineAr: 'الثقب الأزرق الأسطوري بعمق ١٢٠ متراً وجدران مرجانية عمودية تبهر الغطاسين من كل أنحاء العالم.',
    descriptionEn: 'The Blue Hole is Dahab’s most famous marine landmark — a submarine sinkhole dropping 120 meters directly into the deep azure Gulf of Aqaba. The dive starts at "The Bells", a chimney-like opening in the reef wall where you drop down to 26 meters, followed by a gentle drift along a breathtaking vertical coral wall teeming with clownfish, sea turtles, and anthias.',
    descriptionAr: 'البلو هول هو أشهر معلم بحري في دهب والعالم — حفرة غائرة في الشعاب المرجانية بعمق يصل إلى ١٢٠ متراً وسط زرقة خليج العقبة الخلابة. تبدأ المغامرة من منطقة "البلز" (The Bells)، وهي فتحة عمودية في جدار الشعب تنزل فيها حتى عمق ٢٦ متراً، ثم تنجرف بلطف مع التيار بمحاذاة جدار مرجاني ساحر غني بالسلاحف وسمك نيمو والشعب النادرة.',
    category: 'diving',
    categoryLabelEn: 'World Heritage Marine Sanctuary',
    categoryLabelAr: 'محمية بحرية عالمية',
    heroImage: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
    ],
    locationEn: 'North Dahab Coastal Protected Zone (15 min 4x4 from Lighthouse)',
    locationAr: 'شمال دهب (منطقة المحميات الساحلية · ١٥ دقيقة بالسيارة من اللايتهاوس)',
    coordinates: { lat: 28.5724, lng: 34.5369 },
    durationEn: '3 hours',
    durationAr: '٣ ساعات',
    durationMinutes: 180,
    difficultyEn: 'Intermediate to Advanced (Snorkeling: All Levels)',
    difficultyAr: 'متوسط إلى متقدم (السنوركلينج متاح للجميع)',
    intensityScore: 4,
    accessMethodEn: 'Shore Entry via The Bells / Bedouin 4x4 Transfer',
    accessMethodAr: 'نزول شاطئي من منطقة البلز · سيارة دفع رباعي بدوية',
    openHoursEn: '08:00 AM – 05:00 PM (Best in morning sunlight)',
    openHoursAr: '٠٨:٠٠ ص – ٠٥:٠٠ م (أفضل وقت صباحاً مع سطوع الشمس)',
    basePriceEGP: 850,
    priceLevel: '$$$',
    verifiedBadgeEn: 'Vetted Master Divemaster & Bedouin Host',
    verifiedBadgeAr: 'دليل غطس معتمد ومضيف بدوي محلي',
    localGuideInsightEn: 'Arrive before 10:00 AM to beat the day-trip crowds from Sharm. The light beams slicing through The Bells chimney in the morning create unbeatable underwater photography conditions.',
    localGuideInsightAr: 'تعال قبل الساعة ١٠ الصبح عشان تتفادى زحمة الرحلات اليومية من شرم الشيخ. أشعة الشمس اللي بتخترق ممر البلز الصبح بتعمل إضاءة خرافية للتصوير تحت المية.',
    highlightsEn: [
      'The dramatic 26m vertical drop down The Bells chimney',
      'Pristine coral wall drift along the outer barrier reef',
      'Snorkeling the protected inner Blue Hole saddle',
      'Bedouin seafront tea and shade lounges at the water’s edge'
    ],
    highlightsAr: [
      'النزول العمودي المثير في ممر البلز حتى عمق ٢٦ متراً',
      'الانجراف السلس بمحاذاة جدار المرجان الخارجي الشاهق',
      'سنوركلينج ممتع في سرج البلو هول المحمي وهادئ الأمواج',
      'شاي بدوي على البحر وقعدات خشبية مريحة بعد النزلة'
    ],
    includedEn: [
      'Certified PADI/SSI Divemaster or Snorkel Guide',
      'Full Snorkeling gear (mask, snorkel, fins, safety float)',
      '4x4 Jeep transfer round-trip from your Dahab hotel',
      'Bedouin tea & shaded seafront seat reservation'
    ],
    includedAr: [
      'مرشد غطس وسنوركلينج محترف ومعتمد',
      'طقم سنوركلينج كامل (نظارة، قصبة، زعانف وسترة أمان)',
      'انتقالات ذهاب وعودة بسيارة جيب 4x4 من مكان إقامتك في دهب',
      'شاي أعشاب بدوي وقعدة مريحة على البحر'
    ],
    notIncludedEn: [
      'Protected Area National Park Entry Ticket (approx. 100-200 EGP)',
      'Scuba tanks & BCD weights (available as dive add-on)',
      'Seafood lunch (optional at partner seaside tables)'
    ],
    notIncludedAr: [
      'تذكرة دخول المحمية الطبيعية (حوالي ١٠٠ - ٢٠٠ ج.م)',
      'معدات الغوص الاسكوبا (متاحة كإضافة للغواصين المرخصين)',
      'وجبة الغداء (اختيارية في مطاعم الشاطئ الشريكة)'
    ],
    preparationTipsEn: [
      'Bring reef-safe mineral sunscreen, dry bag, and swimwear',
      'Water shoes/booties are recommended for walking on pebble entries',
      'Ensure at least 18-24 hours surface interval before flying if diving'
    ],
    preparationTipsAr: [
      'احرص على إحضار واقي شمس صديق للبيئة، شنطة ضد المية، ومايوه',
      'يُفضل ارتداء حذاء بحر مريح للنزول من الشاطئ الصخري',
      'اترك فاصل زمني ١٨ إلى ٢٤ ساعة على الأقل بين الغوص وموعد طيرانك'
    ],
    environmentalSignals: {
      waterTemp: '24°C – 27°C',
      visibility: '30+ meters',
      windCondition: 'Calm & Sheltered in Bay',
      bestTide: 'High to Mid Tide'
    }
  },
  {
    id: 'near-lighthouse-reef',
    slug: 'lighthouse-reef',
    activityId: 'act_lighthouse_guided_dive',
    titleEn: 'Lighthouse Reef Shore Entry',
    titleAr: 'شاطئ ورصيف اللايتهاوس للغطس والسنوركلينج',
    taglineEn: 'The beating heart of Dahab shore diving, right on the lively promenade.',
    taglineAr: 'أسهل نزلة بحر شاطئية في دهب؛ مياه هادية، شعب مرجانية ملونة وخطوات من الممشى.',
    descriptionEn: 'Lighthouse Bay is Dahab’s most accessible and beloved reef. Sloping gently from shallow sandy entries into vibrant coral gardens, it offers effortless snorkeling, world-class freediving lines, and nocturnal night dives where Spanish dancers, octopus, and moray eels emerge under dive torch beams.',
    descriptionAr: 'خليج اللايتهاوس هو الرئة الحيوية لدهب وأسهل شاطئ لنزول البحر. ينحدر القاع الرملي برفق نحو حدائق مرجانية مبهجة، مما يجعله مثالياً للسباحة، السنوركلينج، تدريبات الغوص الحر، وأروع الغطسات الليلية لرؤية الأخطبوط والرقاصة الإسبانية تحت كشافات الغطس.',
    category: 'beach',
    categoryLabelEn: 'Promenade Shore Reef',
    categoryLabelAr: 'شاطئ وشعاب الممشى السياحي',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop'
    ],
    locationEn: 'Lighthouse Bay Promenade, Central Dahab',
    locationAr: 'ممشى خليج اللايتهاوس، وسط دهب',
    coordinates: { lat: 28.5028, lng: 34.5204 },
    durationEn: '1.5 - 2 hours',
    durationAr: 'ساعة ونصف إلى ساعتين',
    durationMinutes: 100,
    difficultyEn: 'All Levels (Beginner Friendly)',
    difficultyAr: 'جميع المستويات (مناسب جداً للمبتدئين)',
    intensityScore: 2,
    accessMethodEn: 'Direct Shore Walk-In from Sandy Steps',
    accessMethodAr: 'نزول مباشر من الشاطئ الرملي بخطوات بسيطة',
    openHoursEn: 'Open 24/7 (Daylight for coral, Night for nocturnal life)',
    openHoursAr: 'مفتوح دائماً (النهار لرؤية الشعب والليل للكائنات الليلية)',
    basePriceEGP: 250,
    priceLevel: '$',
    verifiedBadgeEn: 'Verified Public Shore Entry & Dive Center Hub',
    verifiedBadgeAr: 'شاطئ عام موثق ومحيط بمراكز الغطس المعتمدة',
    localGuideInsightEn: 'The south corner near the sandy slope is where sea turtles often feed on seagrass around 3:00 PM. Slip in quietly without splashing to swim beside them.',
    localGuideInsightAr: 'الركن الجنوبي جنب المنحدر الرملي بتيجي فيه سلاحف البحر تتغذى ع الأعشاب حوالي الساعة ٣ العصر. انزل بهدوء من غير طرطشة وهتعوم جنبها على بعد متر.',
    highlightsEn: [
      'Effortless sandy walk-in entry with zero current friction',
      'Vibrant table corals, lionfish, and curious sea turtles',
      'Direct adjacency to Lighthouse cafes for post-swim coffee',
      'Ideal training ground for first-time snorkelers and freedivers'
    ],
    highlightsAr: [
      'نزول سهل وسلس من الرمل بدون أي تيارات متعبة',
      'شعب مرجانية متفرقة، سمك الفراشة وسلاحف بحرية لطيفة',
      'على بعد خطوات من كافيهات الممشى عشان تشرب قهوتك بعد العومة',
      'المكان المثالي لتجربة السنوركلينج الأولى والغوص الحر'
    ],
    includedEn: [
      'Orientation map & marine safety briefing',
      'Full snorkel gear & buoyancy vest',
      'Reserved beachfront sun lounger at partner cafe'
    ],
    includedAr: [
      'خريطة إرشادية وتعليمات السلامة وحماية الشعب',
      'طقم سنوركلينج كامل مع سترة طفو',
      'حجز شلتة ومظلة مريحة على البحر في الكافيه الشريك'
    ],
    notIncludedEn: [
      'Underwater GoPro photo package (optional)',
      'Food & beverage orders from cafe menu'
    ],
    notIncludedAr: [
      'جلسة تصوير احترافية بكاميرا جوبرو تحت المية (اختيارية)',
      'الطلبات الإضافية من منيو الكافيه'
    ],
    preparationTipsEn: [
      'Never stand on the living coral reefs',
      'Keep your belongings safe at partner locker stations'
    ],
    preparationTipsAr: [
      'ممنوع منعاً باتاً الوقوف على الشعاب المرجانية الحية',
      'استخدم خزائن الأمانات المتوفرة لحفظ متعلقاتك وموبايلك'
    ],
    environmentalSignals: {
      waterTemp: '25°C',
      visibility: '25 meters',
      windCondition: 'Mild Coastal Breeze',
      bestTide: 'Any Tide (High Tide Optimal)'
    }
  },
  {
    id: 'near-ralphs',
    slug: 'ralphs-german-bakery',
    titleEn: "Ralph's German Bakery & Courtyard",
    titleAr: 'مخبز رالف الألماني والحديقة الهادئة',
    taglineEn: 'Artisan sourdough, apple strudels, pretzels, and fresh Sinai organic infusions.',
    taglineAr: 'أشهر مخبز في دهب للعيش الساوردو الفريش، فطيرة التفاح (أبل شترودل)، وشاي الأعشاب السيناوية.',
    descriptionEn: 'A Dahab institution since the early days of coastal travel, Ralph’s German Bakery is the undisputed breakfast destination of the town. Nestled in a shaded, plant-filled courtyard, master bakers craft authentic German rye breads, butter pretzels, flaky croissants, and homemade seasonal jams every morning.',
    descriptionAr: 'أحد معالم دهب الأصيلة ومحطة الفطار الأولى لكل زوار المدينة. وسط حديقة مظللة بالأشجار والنباتات، يُخبز العيش الألماني الطبيعي، البريتزل الطازج، الكرواسون الهش، وتُقدم مربى الفواكه الطبيعية مع القهوة الفريش وعصائر الصباح.',
    category: 'coffee',
    categoryLabelEn: 'Artisan Bakery & Cafe',
    categoryLabelAr: 'مخبز يدوي وكافيه روقان',
    heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
    ],
    locationEn: 'Lighthouse Area, 2 min walk from shore',
    locationAr: 'منطقة اللايتهاوس، دقيقتان مشي من الشاطئ',
    coordinates: { lat: 28.5034, lng: 34.5192 },
    durationEn: '45 - 60 min',
    durationAr: '٤٥ - ٦٠ دقيقة',
    durationMinutes: 60,
    difficultyEn: 'All Levels (Relaxed Dining)',
    difficultyAr: 'للجميع (فطار وقهوة بروقان)',
    intensityScore: 1,
    accessMethodEn: 'Easy Promenade Walk',
    accessMethodAr: 'تمشية خفيفة على الممشى',
    openHoursEn: '07:00 AM – 10:00 PM',
    openHoursAr: '٠٧:٠٠ ص – ١٠:٠٠ م',
    basePriceEGP: 220,
    priceLevel: '$$',
    verifiedBadgeEn: 'Verified Dahab Culinary Landmark',
    verifiedBadgeAr: 'معلم طعام معتمد وأصيل في دهب',
    localGuideInsightEn: 'The warm apple strudel straight out of the morning oven with a scoop of vanilla ice cream is legendary. Go early around 8:30 AM for the freshest bread selection.',
    localGuideInsightAr: 'فطيرة التفاح السخنة من الفرن مع بولة آيس كريم فانيليا متتفوتش. تعال بدري حوالي ٨:٣٠ الصبح عشان تلحق تشكيلة العيش الساوردو السخنة.',
    highlightsEn: [
      'Fresh daily baked German sourdough loaves and baguettes',
      'Warm apple strudel and Bavarian salted pretzels',
      'Quiet shaded inner garden away from coastal wind',
      'Specialty coffee and organic herbal tea blends'
    ],
    highlightsAr: [
      'عيش ساوردو ألماني وباجيت فريش يومياً من الفرن',
      'فطيرة تفاح ساخنة وبريتزل بافاري بالزبدة والملح الخشن',
      'قعدة جنينة داخلية هادية ومظللة بعيد عن هواء البحر',
      'قهوة اسبريسو وشاي أعشاب سيناوية طبيعية'
    ],
    includedEn: [
      'Table seating in garden terrace',
      'High-speed WiFi for digital nomads'
    ],
    includedAr: [
      'قعدة في الحديقة الخارجية المظللة',
      'إنترنت واي فاي سريع للمسافرين وأصحاب العمل عن بعد'
    ],
    notIncludedEn: [
      'Food and drink items ordered from menu',
      'Takeaway bakery loaves'
    ],
    notIncludedAr: [
      'الطلبات والمشروبات حسب اختيارك من المنيو',
      'شراء العيش والمخبوزات تيك أواي'
    ],
    preparationTipsEn: [
      'Cash and local debit/credit cards accepted',
      'Arrive early on weekend mornings to secure outdoor garden tables'
    ],
    preparationTipsAr: [
      'يقبل الدفع كاش أو بالفيزا والماستركارد',
      'في الويك إند يفضل الحضور قبل ٩ الصبح لتلاقي طاولة في الحديقة'
    ],
    environmentalSignals: {
      waterTemp: 'N/A',
      visibility: 'N/A',
      windCondition: 'Sheltered Garden Court',
      bestTide: 'Anytime (Morning Peak)'
    }
  },
  {
    id: 'near-ali-baba',
    slug: 'ali-baba-seafood',
    titleEn: 'Ali Baba Waterfront Restaurant & Bedouin Grill',
    titleAr: 'مطعم علي بابا ع الممشى والمشاوي البدوية',
    taglineEn: 'Pick your fresh Red Sea catch from the ice counter, grilled over open charcoal by the waves.',
    taglineAr: 'اختار سمكتك الطازة من التلج مباشرة، وتتشوي ع الفحم وتجيلك على طاولة ممتدة ع البحر.',
    descriptionEn: 'Overlooking the gentle night waves of Dahab bay, Ali Baba offers the quintessential Sinai seafood ritual. Guests choose their fish, squid, and shrimp directly from a crushed-ice display freshly caught by local Bedouin fishermen, paired with rich seafood soup, sesame tahini, hot flatbreads, and fragrant spiced rice.',
    descriptionAr: 'مباشرة أمام أمواج خليج دهب الهادئة، يقدم علي بابا طقوس عشاء السمك السيناوي الأصيل. يختار الضيوف سمكهم والجمبري والكاليماري الطازج من فرش الثلج صيد اليوم بواسطة الصيادين المحليين، ليُشوى على الفحم ويُقدم مع شوربة السي فود الغنية، الطحينة، والخبز الساخن.',
    category: 'food',
    categoryLabelEn: 'Seafood & Bedouin Waterfront Grill',
    categoryLabelAr: 'سي فود ومشاوي ع البحر',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop'
    ],
    locationEn: 'Lighthouse Promenade, Beachfront',
    locationAr: 'ممشى اللايتهاوس السياحي، على البحر مباشرة',
    coordinates: { lat: 28.5041, lng: 34.5211 },
    durationEn: '1.5 - 2 hours',
    durationAr: 'ساعة ونصف إلى ساعتين',
    durationMinutes: 100,
    difficultyEn: 'All Levels (Dining Experience)',
    difficultyAr: 'للجميع (عشاء بحري مميز)',
    intensityScore: 1,
    accessMethodEn: 'Beachfront Promenade Stroll',
    accessMethodAr: 'تمشية على ممشى الشاطئ',
    openHoursEn: '12:00 PM – 12:00 AM (Dinner by torchlight)',
    openHoursAr: '١٢:٠٠ ظ – ١٢:٠٠ منتصف الليل (عشاء على ضوء المشاعل)',
    basePriceEGP: 480,
    priceLevel: '$$',
    verifiedBadgeEn: 'Verified Daily Fresh Catch & Fair Pricing',
    verifiedBadgeAr: 'صيد يومي طازج وأسعار وزن عادلة وموثقة',
    localGuideInsightEn: 'Ask for the grilled Sea Bass (Qarous) "Singary" style with lemon, garlic, and fresh Sinai herbs. Sit at the low carpeted cushions right above the waterline for sunset.',
    localGuideInsightAr: 'اطلب سمك القاروص المشوي "سنجاري" بالليمون والثوم وأعشاب سيناء. اختار القعدة العربي المنخفضة ع البحر مباشرة وقت الغروب لمنظر ساحر.',
    highlightsEn: [
      'Choice of fresh Red Sea fish weighed and priced transparently in front of you',
      'Charcoal grill cooking infused with olive wood and Bedouin spices',
      'Waterfront low-cushion seating lit by lanterns and candlelight',
      'Includes complimentary hot seafood bisque and salad mezzes'
    ],
    highlightsAr: [
      'اختيار السمك الطازة والوزن بشفافية قدامك بالجرام',
      'شواء على الفحم الطبيعي وخشب الزيتون ببهارات بدوية',
      'طاولات وشلتات ممتدة ع البحر مضاءة بالفوانيس والشموع',
      'شوربة سي فود ومقبلات طحينة وسلطة بلدي مع الوجبة'
    ],
    includedEn: [
      'Reserved beachfront table by the waves',
      'Seafood soup and fresh bread appetizer',
      'Dedicated local table service'
    ],
    includedAr: [
      'حجز طاولة بحرية مميزة على الممشى مباشرة',
      'شوربة سي فود ومقبلات وعيش ساخن',
      'خدمة وضيافة محلية ممتازة'
    ],
    notIncludedEn: [
      'Fish weighed by kilo (priced transparently by weight)',
      'Specialty mocktails and desserts'
    ],
    notIncludedAr: [
      'سعر السمك حسب الوزن المختار بالجرام',
      'العصائر والمشروبات الخاصة والحلويات'
    ],
    preparationTipsEn: [
      'Reservations recommended for prime waterfront front-row tables at sunset',
      'Vegetarian and chicken grill options available for non-seafood eaters'
    ],
    preparationTipsAr: [
      'يُفضل الحجز المسبق لطاولات الصف الأول ع البحر وقت الغروب',
      'تتوفر خيارات مشاوي دجاج وخضار للأشخاص النباتيين'
    ],
    environmentalSignals: {
      waterTemp: 'N/A',
      visibility: 'N/A',
      windCondition: 'Pleasant Waterfront Breeze',
      bestTide: 'Sunset & Evening'
    }
  },
  {
    id: 'near-everyday-cafe',
    slug: 'everyday-cafe',
    titleEn: 'Everyday Cafe & Acoustic Starlight Lounge',
    titleAr: 'إيفري داي كافيه وسهرات العود على البحر',
    taglineEn: 'Iconic seafront terrace with over-water swings, live acoustic melodies, and Bedouin habaq tea.',
    taglineAr: 'قعدة مريحة على البحر ومراجيح خشبية فوق المية، وعزف عود وجيتار هادئ مع شاي المرمية والشيشة.',
    descriptionEn: 'Perched directly above the tidal waters of Mashraba, Everyday Cafe is where Dahab slows to its most tranquil cadence. With hanging wooden swings over the tide, colorful Sinai carpets, live acoustic oud performances, and herbal Bedouin infusions, it is the ultimate evening retreat.',
    descriptionAr: 'مباشرة فوق مياه المشربة، يقدم إيفري داي كافيه روقان دهب الحقيقي في أبهى صوره. مراجيح خشبية فوق مياه المد، شلتات وسجاد سيناوي مريح، عزف حي لآلة العود والجيتار تحت النجوم، وألذ شاي بالحبق والمرمية والليمون بالنعناع.',
    category: 'nightlife',
    categoryLabelEn: 'Acoustic Music & Sea Terrace',
    categoryLabelAr: 'تراس بحري وموسيقى لايف',
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop'
    ],
    locationEn: 'Mashraba Promenade, South Dahab Shore',
    locationAr: 'ممشى المشربة، جنوب شاطئ دهب',
    coordinates: { lat: 28.4982, lng: 34.5165 },
    durationEn: '1 - 3 hours',
    durationAr: 'ساعة إلى ٣ ساعات',
    durationMinutes: 120,
    difficultyEn: 'All Levels (Evening Chill)',
    difficultyAr: 'للجميع (سهرة وروقان)',
    intensityScore: 1,
    accessMethodEn: 'Promenade Walkway',
    accessMethodAr: 'تمشية على الممشى',
    openHoursEn: '08:00 AM – 01:30 AM (Live music starts 08:30 PM)',
    openHoursAr: '٠٨:٠٠ ص – ٠١:٣٠ ص (المزيكا اللايف تبدأ ٠٨:٣٠ م)',
    basePriceEGP: 150,
    priceLevel: '$$',
    verifiedBadgeEn: 'Verified Local Cultural Venue',
    verifiedBadgeAr: 'مكان فني وثقافي محلي معتمد',
    localGuideInsightEn: 'Grab the over-water swing seats at around 05:30 PM to watch the sunset paint the Saudi Arabian mountain ridges pink across the Gulf.',
    localGuideInsightAr: 'اقعد في المراجيح الخشبية فوق المية حوالي ٥:٣٠ المغرب عشان تشوف جبال السعودية بتتلون باللون الوردي والذهبي عبر الخليج.',
    highlightsEn: [
      'Over-water wooden swings suspended over gentle sea waves',
      'Daily acoustic oud and guitar performances under the stars',
      'Authentic Bedouin tea brewed with fresh habaq and marmareya herbs',
      'Fresh fruit smoothies and organic cinnamon Turkish coffees'
    ],
    highlightsAr: [
      'مراجيح خشبية معلقة فوق أمواج البحر مباشرة',
      'عزف عود وجيتار هادئ يومياً تحت النجوم بدون صخب',
      'شاي بدوي أصيل بأعشاب الحبق والمرمية الطبيعية',
      'عصائر فواكه طبيعية فريش وقهوة تركي بالقرفة'
    ],
    includedEn: [
      'Sea terrace admission & live acoustic musical session',
      'Reserved beachfront swing or cushioned floor lounge'
    ],
    includedAr: [
      'دخول التراس والاستمتاع بفقرة المزيكا اللايف',
      'حجز مرجيحة أو شلتة مريحة ع البحر'
    ],
    notIncludedEn: [
      'Beverages, desserts, and snacks ordered from counter'
    ],
    notIncludedAr: [
      'المشروبات والحلويات حسب اختيارك من الكاونتر'
    ],
    preparationTipsEn: [
      'Bring a light sweater or shawl during winter evenings as coastal breezes can be cool',
      'Card and cash payments both accepted'
    ],
    preparationTipsAr: [
      'هات جاكيت خفيف في سهرات الشتاء لأن نسيم البحر بيكون بارد بالليل',
      'يقبل الدفع كاش أو بالبطاقات البنكية'
    ],
    environmentalSignals: {
      waterTemp: 'N/A',
      visibility: 'N/A',
      windCondition: 'Gentle Evening Sea Breeze',
      bestTide: 'Evening High Tide'
    }
  },
  {
    id: 'near-eel-garden',
    slug: 'eel-garden',
    titleEn: 'Eel Garden Marine Reserve & Sandy Slope',
    titleAr: 'شاطئ وحديقة ثعابين البحر (إيل جاردن)',
    taglineEn: 'Natural marine phenomenon with hundreds of garden eels swaying gracefully with sea currents.',
    taglineAr: 'قاع رملي ساحر يضم مئات من ثعابين البحر الرملية المسالمة اللي بتتراقص مع تيار المية اللطيف.',
    descriptionEn: 'Located just north of the lighthouse, Eel Garden is named for the vast colony of slender garden eels that live in burrows in the sandy slope. As divers and snorkelers hover quietly overhead, hundreds of eels rise up to feed on passing plankton, resembling a meadow of tall grass swaying in the gentle Red Sea currents.',
    descriptionAr: 'يقع شمال اللايتهاوس مباشرة، وسُمي بهذا الاسم نسبة إلى مستعمرة ضخمة من ثعابين البحر الرملية المسالمة التي تعيش في جحور القاع الرملي. عندما تسبح بهدوء فوقها، تخرج مئات الثعابين من جحورها لتتغذى ع العوالق، لتبدو كحقل من العشب الأخضر المتمايل مع التيار.',
    category: 'beach',
    categoryLabelEn: 'Natural Marine Reserve',
    categoryLabelAr: 'محمية بحرية طبيعية',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=800&auto=format&fit=crop'
    ],
    locationEn: 'Eel Garden Bay, North Central Dahab',
    locationAr: 'خليج إيل جاردن، شمال وسط دهب',
    coordinates: { lat: 28.5089, lng: 34.5245 },
    durationEn: '1.5 - 2 hours',
    durationAr: 'ساعة ونصف إلى ساعتين',
    durationMinutes: 90,
    difficultyEn: 'Beginner to Intermediate',
    difficultyAr: 'مبتدئ إلى متوسط',
    intensityScore: 2,
    accessMethodEn: 'Shore Entry through Coral Lagoon Canyon',
    accessMethodAr: 'نزول شاطئي عبر ممر مرجاني هادئ',
    openHoursEn: 'Open 24/7 (Morning sunlight & High Tide optimal)',
    openHoursAr: 'مفتوح دائماً (أفضل وقت صباحاً مع المد وضوء الشمس)',
    basePriceEGP: 350,
    priceLevel: '$',
    verifiedBadgeEn: 'Protected Marine Sanctuary',
    verifiedBadgeAr: 'محمية بيئية وبحرية خاضعة للحماية',
    localGuideInsightEn: 'Hover motionless a few feet off the sandy bottom. If you remain still, the shy garden eels will emerge one by one to their full height.',
    localGuideInsightAr: 'اثبت في مكانك فوق القاع الرملي من غير حركة زعانف سريعة.. الثعابين خجولة وهتطلع بالكامل من جحورها أول ما تحس بالهدوء.',
    highlightsEn: [
      'Unique garden eel colony undulating in sandy channels',
      'Pristine coral walls with anemonefish and blue-spotted stingrays',
      'Crystal-clear morning visibility reaching 30+ meters',
      'Quiet seaside palapas for relaxation away from main promenade crowds'
    ],
    highlightsAr: [
      'مستعمرة فريدة لثعابين البحر الرملية في قنوات رملية بيضاء',
      'شعب مرجانية بكر تضم سمك نيمو وشعاع الراي المنقط بالأزرق',
      'رؤية مائية فائقة النقاء في ساعات الصباح الباكر (+٣٠ متر)',
      'شاطئ هادئ وقعدات مريحة بعيد عن زحمة الممشى الرئيسية'
    ],
    includedEn: [
      'Guided marine life orientation',
      'Snorkel mask, fins, and safety float rental',
      'Bedouin tea & shaded beach hut access'
    ],
    includedAr: [
      'شرح لمعالم المكان وكائنات الشعب مع دليل محلي',
      'تأجير طقم سنوركلينج كامل وزعانف وسترة طفو',
      'شاي بدوي وقعدة مظللة على الشاطئ'
    ],
    notIncludedEn: [
      'Private underwater photography equipment'
    ],
    notIncludedAr: [
      'كاميرا تصوير تحت المية (يمكن طلبها بشكل منفصل)'
    ],
    preparationTipsEn: [
      'Best visited during high tide when crossing the reef table is effortless',
      'Do not touch or kick the sandy bottom to avoid stirring sediment'
    ],
    preparationTipsAr: [
      'أفضل وقت للزيارة وقت المد العالي لتعدي حاجز الشعب بسهولة',
      'تجنب لمس أو تعكير القاع الرملي بالزعانف لتستمتع بأفضل رؤية'
    ],
    environmentalSignals: {
      waterTemp: '24°C – 26°C',
      visibility: '30 meters',
      windCondition: 'Moderate Morning Breeze',
      bestTide: 'High Tide Essential'
    }
  }
];

/**
 * Attaches the commerce facts for an editorial experience.
 *
 * Curated entries and NearMe items are hand-written content with no commerce
 * identity of their own; the catalogue is where bookability lives. This is the
 * one place the two are joined, so a surface can ask `exp.bookable` instead of
 * guessing from a price or a category.
 */
function withBookability(
  experience: ExperienceDetailData,
  corpusActivities: DahabActivity[]
): ExperienceDetailData {
  const activity = experience.activityId
    ? corpusActivities.find(a => a.id === experience.activityId)
    : undefined;
  return { ...experience, bookable: activity?.bookable ?? null };
}

/**
 * Resolves an experience by slug or ID across both curated experiences,
 * NearMe items, and backend activities/places corpus.
 */
export function resolveExperience(
  slugOrId: string | null | undefined,
  corpusActivities: DahabActivity[] = [],
  corpusPlaces: DahabPlace[] = []
): ExperienceDetailData | null {
  if (!slugOrId) return null;

  const clean = slugOrId.toLowerCase().trim();

  // 1. Check curated database first
  const curated = CURATED_EXPERIENCES.find(
    (exp) =>
      exp.id.toLowerCase() === clean ||
      exp.slug.toLowerCase() === clean ||
      exp.id.toLowerCase().replace(/^near-/, '') === clean ||
      exp.slug.toLowerCase().replace(/-/g, '_') === clean
  );
  if (curated) return withBookability(curated, corpusActivities);

  // 2. Check NEAR_ME_DATA fallback
  const nearMe = NEAR_ME_DATA.find(
    (item) =>
      item.id.toLowerCase() === clean ||
      item.id.toLowerCase().replace(/^near-/, '') === clean ||
      item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === clean
  );
  if (nearMe) {
    return {
      id: nearMe.id,
      slug: nearMe.id.replace(/^near-/, ''),
      titleEn: nearMe.name || '',
      titleAr: nearMe.nameAr || '',
      taglineEn: nearMe.tag || '',
      taglineAr: nearMe.tagAr || '',
      descriptionEn: nearMe.description || '',
      descriptionAr: nearMe.descriptionAr || '',
      category: (nearMe.category as any) || 'beach',
      categoryLabelEn: nearMe.tag || '',
      categoryLabelAr: nearMe.tagAr || '',
      heroImage: nearMe.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
      galleryImages: [nearMe.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop'],
      locationEn: nearMe.location || '',
      locationAr: nearMe.locationAr || '',
      durationEn: nearMe.openHours || '1 - 2 hours',
      durationAr: nearMe.openHoursAr || 'ساعة إلى ساعتين',
      durationMinutes: 90,
      difficultyEn: nearMe.bestFor || 'All Levels',
      difficultyAr: nearMe.bestForAr || 'جميع المستويات',
      intensityScore: 2,
      accessMethodEn: 'Direct Shore Walk-In',
      accessMethodAr: 'نزول مباشر من الشاطئ',
      openHoursEn: nearMe.openHours || '',
      openHoursAr: nearMe.openHoursAr || '',
      basePriceEGP: nearMe.priceLevel === '$$$' ? 650 : nearMe.priceLevel === '$$' ? 350 : 150,
      priceLevel: nearMe.priceLevel,
      verifiedBadgeEn: 'Verified Sinai Destination Spot',
      verifiedBadgeAr: 'مكان سياحي معتمد وموثق في دهب',
      localGuideInsightEn: 'Visit early in the day or during sunset for the most atmospheric experience.',
      localGuideInsightAr: 'زر المكان في الصباح الباكر أو وقت الغروب للاستمتاع بأجمل أجواء وروقان.',
      highlightsEn: [nearMe.bestFor || 'All Levels', 'Vibrant atmosphere and authentic local hosting', 'Scenic views of the Red Sea and Sinai mountains'],
      highlightsAr: [nearMe.bestForAr || 'جميع المستويات', 'أجواء حيوية وضيافة محلية أصيلة', 'إطلالات ساحرة على مياه البحر الأحمر وجبال سيناء'],
      includedEn: ['Location admission & access', 'Standard service & hospitality'],
      includedAr: ['دخول المكان والاستمتاع بالموقع', 'الخدمة والضيافة الأساسية'],
      notIncludedEn: ['Personal food, beverages, and extra gear purchases'],
      notIncludedAr: ['الطلبات والمشتريات الشخصية الإضافية'],
      preparationTipsEn: ['Bring comfortable walking shoes and camera'],
      preparationTipsAr: ['احرص على ارتداء حذاء مريح وإحضار كاميرا أو موبايل مشحون'],
      environmentalSignals: {
        waterTemp: '25°C',
        visibility: '25+ meters',
        windCondition: 'Gentle Sea Breeze',
        bestTide: 'Optimal at Daylight'
      }
    };
  }

  // 3. Check API Corpus Activities
  const activity = corpusActivities.find(
    (a) =>
      a.id.toLowerCase() === clean ||
      a.id.toLowerCase().replace(/_/g, '-') === clean ||
      a.titleEn.toLowerCase().replace(/[^a-z0-9]/g, '-') === clean
  );
  if (activity) {
    const place = corpusPlaces.find((p) => p.id === activity.placeId);
    return {
      id: activity.id,
      slug: activity.id.replace(/_/g, '-'),
      activityId: activity.id,
      bookable: activity.bookable ?? null,
      titleEn: activity.titleEn,
      titleAr: activity.titleAr,
      taglineEn: `${activity.durationMinutes} min · ${activity.difficulty} · ${activity.category}`,
      taglineAr: `${activity.durationMinutes} دقيقة · ${activity.difficulty} · ${activity.category}`,
      descriptionEn: place?.descriptionEn || activity.experienceLevelRequired,
      descriptionAr: place?.descriptionAr || activity.experienceLevelRequired,
      category: (activity.category as any) || 'diving',
      categoryLabelEn: activity.category.toUpperCase().replace('_', ' '),
      categoryLabelAr: activity.category,
      heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
      galleryImages: ['https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=800&auto=format&fit=crop'],
      locationEn: place?.nameEn || activity.areaId.replace(/_/g, ' '),
      locationAr: place?.nameAr || activity.areaId.replace(/_/g, ' '),
      durationEn: `${activity.durationMinutes} minutes`,
      durationAr: `${activity.durationMinutes} دقيقة`,
      durationMinutes: activity.durationMinutes,
      difficultyEn: activity.difficulty,
      difficultyAr: activity.difficulty,
      intensityScore: activity.difficulty === 'Advanced' ? 5 : activity.difficulty === 'Intermediate' ? 3 : 2,
      accessMethodEn: activity.accessMethod,
      accessMethodAr: activity.accessMethod,
      openHoursEn: '08:00 AM – 05:00 PM',
      openHoursAr: '٠٨:٠٠ ص – ٠٥:٠٠ م',
      basePriceEGP: activity.basePriceEGP,
      priceLevel: activity.basePriceEGP > 1500 ? '$$$' : activity.basePriceEGP > 500 ? '$$' : '$',
      verifiedBadgeEn: 'Verified Sinai Licensed Activity',
      verifiedBadgeAr: 'نشاط سياحي مرخص وموثق في سيناء',
      localGuideInsightEn: 'Always follow your certified guide instructions and stay hydrated under the Sinai sun.',
      localGuideInsightAr: 'اتبع دائماً تعليمات دليلك المعتمد واشرب مياه كافية تحت شمس سيناء.',
      highlightsEn: activity.preparationTips.slice(0, 3),
      highlightsAr: activity.preparationTipsAr.slice(0, 3),
      includedEn: ['Certified professional guide', 'Standard safety equipment', 'Local destination briefing'],
      includedAr: ['مرشد محترف ومعتمد', 'معدات الأمان والسلامة الأساسية', 'شرح وإرشادات للموقع'],
      notIncludedEn: ['Personal snacks & national park permits if applicable'],
      notIncludedAr: ['المأكولات الشخصية ورسوم المحميات إن وُجدت'],
      preparationTipsEn: activity.preparationTips,
      preparationTipsAr: activity.preparationTipsAr,
      environmentalSignals: {
        waterTemp: '24°C – 27°C',
        visibility: '30 meters',
        windCondition: 'Live Sinai Conditions',
        bestTide: 'High Tide Recommended'
      }
    };
  }

  // 4. Check API Corpus Places
  const placeMatch = corpusPlaces.find(
    (p) =>
      p.id.toLowerCase() === clean ||
      p.id.toLowerCase().replace(/_/g, '-') === clean ||
      p.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-') === clean
  );
  if (placeMatch) {
    return {
      id: placeMatch.id,
      slug: placeMatch.id.replace(/_/g, '-'),
      titleEn: placeMatch.nameEn,
      titleAr: placeMatch.nameAr,
      taglineEn: placeMatch.category,
      taglineAr: placeMatch.category,
      descriptionEn: placeMatch.descriptionEn,
      descriptionAr: placeMatch.descriptionAr,
      category: 'beach',
      categoryLabelEn: placeMatch.category,
      categoryLabelAr: placeMatch.category,
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      galleryImages: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop'],
      locationEn: placeMatch.areaId.replace(/_/g, ' '),
      locationAr: placeMatch.areaId.replace(/_/g, ' '),
      durationEn: '1 - 2 hours',
      durationAr: 'ساعة إلى ساعتين',
      durationMinutes: 90,
      difficultyEn: 'All Levels',
      difficultyAr: 'للجميع',
      intensityScore: 1,
      accessMethodEn: 'Shore Entry / Walk',
      accessMethodAr: 'نزول شاطئي / مشي',
      openHoursEn: 'Open 24/7',
      openHoursAr: 'مفتوح دائماً',
      basePriceEGP: 200,
      priceLevel: '$',
      verifiedBadgeEn: 'Verified Dahab Place',
      verifiedBadgeAr: 'موقع سياحي موثق في دهب',
      localGuideInsightEn: 'A wonderful spot to relax, take photos, and experience the authentic Dahab spirit.',
      localGuideInsightAr: 'مكان رائع للاسترخاء والتصوير والتمتع بروح دهب الحقيقية.',
      highlightsEn: ['Natural scenery', 'Calm seaside atmosphere', 'Easy walkability'],
      highlightsAr: ['مناظر طبيعية خلابة', 'أجواء بحرية هادئة', 'سهولة الوصول والمشي'],
      includedEn: ['Public access & scenic views'],
      includedAr: ['دخول وإطلالة طبيعية'],
      notIncludedEn: ['Commercial rentals & purchases'],
      notIncludedAr: ['المشتريات والخدمات التجارية'],
      preparationTipsEn: ['Bring sunscreen and water'],
      preparationTipsAr: ['احرص على إحضار مياه وواقي شمس'],
      environmentalSignals: {
        waterTemp: '25°C',
        visibility: '25 meters',
        windCondition: 'Calm',
        bestTide: 'Anytime'
      }
    };
  }

  // Not found
  return null;
}
