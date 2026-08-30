export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const TRANSLATIONS: Translations = {
  // =========================================================================
  // 1. BRAND & GLOBAL NAVIGATION
  // =========================================================================
  'brand.name': { en: 'DAHAB', ar: 'دهب' },
  'brand.tagline': { en: 'Travel OS · Sinai', ar: 'عيش دهب على مزاجك · سيناء' },
  'nav.discover': { en: 'Discover', ar: 'اكتشف دهب' },
  'nav.myTrip': { en: 'My Trip', ar: 'رحلتي' },
  'nav.dahabLive': { en: 'Dahab Live', ar: 'دهب دلوقتي' },
  'nav.aiDirector': { en: 'AI Director', ar: 'مرشد الرحلة الذكي' },
  // Was missing entirely, so the footer rendered the literal string
  // "nav.memories" to users in both languages.
  'nav.memories': { en: 'Trip Memories', ar: 'ذكريات الرحلة' },
  'nav.search': { en: 'Search (⌘K)', ar: 'دور على أي مكان (⌘K)' },
  'nav.quickBook': { en: 'Book Now', ar: 'احجز دلوقتي' },
  'nav.emergency': { en: 'SOS Emergency', ar: 'طوارئ سيناء' },
  'nav.offline': { en: 'Offline Pack', ar: 'بيانات بدون نت' },
  'nav.language': { en: 'العربية', ar: 'English' },
  'nav.today': { en: 'Today in Dahab', ar: 'دهب النهارده' },
  'nav.bookings': { en: 'Bookings', ar: 'حجوزاتي' },
  'nav.food': { en: 'Food & Beach', ar: 'أكل ومطاعم' },
  'nav.help': { en: 'Help & SOS', ar: 'محتاج مساعدة؟' },
  'nav.profile': { en: 'Traveler Profile', ar: 'حسابي' },

  // =========================================================================
  // 2. HERO COCKPIT & NORTH STAR
  // =========================================================================
  'hero.badge': { en: 'DAHAB OS · ACTIVE TRAVEL COMPANION', ar: 'منصة دهب · رفيقك الميداني الذكي' },
  'hero.title': { en: 'You made it to Dahab. We’ll handle the rest.', ar: 'وصلت دهب؟ سيب الباقي علينا.' },
  'hero.subtitle': {
    en: 'Real-time Red Sea marine radar, adaptive day planning, and curated Sinai wonder.',
    ar: 'رادار بحري لحالة الجو والموج، تظبيط يومك أول بأول، وتجارب حقيقية وسط جبال وبحر سيناء.',
  },
  'hero.cta.itinerary': { en: 'Command Center', ar: 'جدول رحلتي' },
  'hero.cta.whatNow': { en: 'What Should I Do Now?', ar: 'أعمل إيه دلوقتي؟' },
  'hero.cta.explore': { en: 'Living Map & Spots', ar: 'خريطة الأماكن الحية' },
  'hero.scene.reef': { en: 'Coral Reef & Blue Hole', ar: 'الشعاب المرجانية والبلو هول' },
  'hero.scene.desert': { en: 'Sinai Canyons & Valleys', ar: 'وديان وكانيونات سيناء' },
  'hero.scene.lagoon': { en: 'Laguna & Coastline', ar: 'اللاجونا وممشى دهب' },
  'hero.agencyPromise': { en: 'Every detail handled by trusted locals.', ar: 'كل تفصيلة متظبطة مع ناس ثقة من أهل دهب.' },

  // =========================================================================
  // 3. WHAT SHOULD I DO NOW? (SPONTANEOUS & REAL-TIME)
  // =========================================================================
  'whatNow.title': { en: 'What Should I Do Now?', ar: 'أعمل إيه دلوقتي؟' },
  'whatNow.subtitle': {
    en: 'Dynamic recommendation based on golden hour, sea state, and your location in Dahab.',
    ar: 'اقتراحات متفصلة على مزاجك حسب وقت الغروب، حالة البحر، ومكانك الحالي في دهب.',
  },
  'whatNow.timeInsight': { en: '🌅 Golden hour begins in 22 minutes at Lighthouse Reef', ar: '🌅 وقت الغروب الذهبي هيبدأ كمان ٢٢ دقيقة عند اللايتهاوس' },
  'whatNow.buildNext3Hours': { en: 'Build My Next 3 Hours', ar: 'ظبّطلي الـ ٣ ساعات الجايين' },
  'whatNow.perfectForYou': { en: 'PERFECT FOR THIS MOMENT', ar: 'أنسب حاجة ليك دلوقتي' },
  'whatNow.freeTimePrompt': { en: 'Have some open hours? Let us pick the best flow for you.', ar: 'عندك وقت فاضي؟ تعالى نختارلك أحسن حاجة تعملها.' },
  'whatNow.chooseOption': { en: 'Choose This Option', ar: 'اختار ده' },
  'whatNow.customFlow': { en: 'Custom Flow', ar: 'مسار على مزاجك' },

  // =========================================================================
  // 4. DAHAB LIVE & MARINE RADAR
  // =========================================================================
  'live.title': { en: 'Dahab Live Intelligence', ar: 'رادار دهب اللحظي · حالة البحر والجو' },
  'live.subtitle': {
    en: 'Environmental data translated into actionable travel decisions.',
    ar: 'بيانات حية ومباشرة عشان تعرف أنسب وقت للغطس، الكايت، أو قعدة الغروب.',
  },
  'live.airTemp': { en: 'Air Temp', ar: 'حرارة الجو' },
  'live.waterTemp': { en: 'Sea Temp', ar: 'حرارة المية' },
  'live.visibility': { en: 'Reef Visibility', ar: 'وضوح الرؤية تحت المية' },
  'live.wind': { en: 'Thermal Wind', ar: 'سرعة الهوا' },
  'live.seaCondition': { en: 'Sea State', ar: 'حالة البحر' },
  'live.divingRating': { en: 'Diving Index', ar: 'مؤشر الغطس' },
  'live.kitesurfRating': { en: 'Kitesurf Index', ar: 'مؤشر الكايت' },
  'live.sunsetRating': { en: 'Sunset Magic', ar: 'أجواء الغروب' },
  'live.bestTimeCanyon': { en: 'BEST WINDOW TO DIVE CANYON', ar: 'أحسن ميعاد لغطسة الكانيون' },
  'live.canyonTime': { en: '09:00 AM — 12:30 PM', ar: '٠٩:٠٠ ص — ١٢:٣٠ م' },
  'live.canyonReason': { en: 'Crystal 25m+ visibility with gentle current and high morning light.', ar: 'رؤية ممتازة فوق ٢٥ متر مع تيار هادي وشمس صباحية رايقة.' },
  'live.bestTimeKite': { en: 'BEST KITE WINDOW AT LAGOON', ar: 'أحسن وقت للكايت في اللاجونا' },
  'live.kiteTime': { en: '01:30 PM — 05:00 PM', ar: '٠١:٣٠ م — ٠٥:٠٠ م' },
  'live.kiteReason': { en: 'Steady 18 knots north-westerly wind over flat turquoise water.', ar: 'هوا شمالي غربي مظبوط ١٨ عقدة والمية فلات تماماً.' },
  'live.seaCalm': { en: 'Glassy & Calm · Ideal for Snorkeling & Diving', ar: 'البحر مراية وهادي جداً · مثالي للغطس والسنوركلنج' },
  'live.goodConditions': { en: 'Great Conditions Today', ar: 'أجواء ممتازة النهارده' },

  // =========================================================================
  // 5. AI TRAVEL DIRECTOR & ASSISTANT
  // =========================================================================
  'director.title': { en: 'AI Travel Director', ar: 'مرشد الرحلة الذكي' },
  'director.subtitle': {
    en: 'Your visual, context-aware travel director. Not a generic chatbot.',
    ar: 'مساعدك الذكي اللي فاهم دهب وسيناء حتة حتة.. يرتبلك يومك ويقترحلك أنسب الأماكن.',
  },
  'director.prompt1': { en: 'Plan a relaxing afternoon around Lighthouse', ar: 'ظبّطلي قعدة رايقة بعد الضهر عند اللايتهاوس' },
  'director.prompt2': { en: 'Find a 3-hour dive & seafood flow', ar: 'رتبلي غطسة حلوة يتبعها أكلة سمك طازة' },
  'director.prompt3': { en: 'Where should I watch sunset today?', ar: 'أروح فين أتفرج ع الغروب النهارده؟' },
  'director.prompt4': { en: 'Bedouin stargazing dinner tonight', ar: 'عايز سهرة عشاء بدوي وشاي ع الفحم تحت النجوم' },
  'director.addToTrip': { en: 'Add Flow to Itinerary', ar: 'أضف لجدول رحلتي' },
  'director.optimizeDay': { en: 'Optimize My Day', ar: 'عدّل ترتيب يومي' },
  'director.generating': { en: 'Curating the best flow for you...', ar: 'بنظبّطلك أحسن خطة على مزاجك...' },

  // =========================================================================
  // 6. SMART ITINERARY & MY TRIP
  // =========================================================================
  'itinerary.title': { en: 'Smart Travel Command Center', ar: 'جدول أيامك في دهب' },
  'itinerary.subtitle': {
    en: 'Your 5-day Dahab timeline with real-time marine sync, group voting, and budget tracker.',
    ar: 'خطة أيامك الخمسة في دهب مربوطة بحالة البحر لحظة بلحظة، مع حساب المصاريف وتصويت الصحاب.',
  },
  'itinerary.day': { en: 'Day', ar: 'اليوم' },
  'itinerary.optimizeCTA': { en: 'Optimize Schedule with AI', ar: 'ظبّط الجدول ذكياً' },
  'itinerary.addActivity': { en: '+ Add Experience', ar: '+ أضف تجربة' },
  'itinerary.activeActivity': { en: 'NEXT UP IN DAHAB', ar: 'النشاط اللي عليه الدور' },
  'itinerary.booked': { en: 'Booked ✓', ar: 'متأكد ومحجوز ✓' },
  'itinerary.suggested': { en: 'Recommended', ar: 'مرشح ليك' },
  'itinerary.freeTime': { en: 'Unhurried Time', ar: 'وقت رايق وفاضي' },
  'itinerary.emptyState': { en: 'No activities scheduled yet.', ar: 'مفيش أنشطة متسجلة لسه في اليوم ده.' },
  'itinerary.timeline': { en: 'Day Timeline', ar: 'تسلسل اليوم' },

  // =========================================================================
  // 7. GROUP TRAVEL & VOTING
  // =========================================================================
  'group.title': { en: 'Group Travel & Voting', ar: 'سفر الصحاب والتصويت' },
  'group.members': { en: 'Trip Crew', ar: 'شلة السفر' },
  'group.splitExpenses': { en: 'Split Expenses', ar: 'قسّم المصاريف' },
  'group.consensus': { en: '3/3 Approved', ar: 'الكل موافق (٣ من ٣)' },
  'group.voting': { en: 'Vote on Activity', ar: 'صوت على النشاط' },
  'group.shareCode': { en: 'Invite Crew to Trip', ar: 'ابعت كود الرحلة لصحابك' },

  // =========================================================================
  // 8. SMART BUDGET & EXPENSES
  // =========================================================================
  'budget.title': { en: 'Smart Trip Budget', ar: 'حساب ميزانية الرحلة' },
  'budget.total': { en: 'Total Budget', ar: 'إجمالي الميزانية' },
  'budget.spent': { en: 'Spent', ar: 'اللي اتصرف' },
  'budget.remaining': { en: 'Remaining', ar: 'المتبقي' },
  'budget.insight': {
    en: 'You are spending 18% less than planned. $160 remaining for desert safari.',
    ar: 'أنت صارف أقل بـ ١٨٪ من المخطط. متبقي معاك حوالي ١٦٠ دولار يكفوا رحلة سفاري في الكانيون.',
  },
  'budget.currency': { en: 'EGP', ar: 'جنيه' },

  // =========================================================================
  // 9. LIVING MAP & SINAI SPOTS
  // =========================================================================
  'map.title': { en: 'Living Sinai Interactive Map', ar: 'خريطة سيناء الحية' },
  'map.filterAll': { en: 'All Spots', ar: 'كل الأماكن' },
  'map.filterDiving': { en: '🤿 Diving & Reefs', ar: '🤿 أماكن الغطس والشعاب' },
  'map.filterSunset': { en: '🌅 Sunset Viewpoints', ar: '🌅 أحسن قعدات للغروب' },
  'map.filterFood': { en: '🍽 Bedouin & Seafood', ar: '🍽 أكل بدوي وسمك طازة' },
  'map.filterExperiences': { en: '🏜 Desert Canyons', ar: '🏜 سفاري ووديان الصحراء' },
  'map.filterHotels': { en: '🏨 Stays & Camps', ar: '🏨 فنادق وكامبات' },
  'map.walkTime': { en: 'min walk', ar: 'دقايق مشي' },
  'map.getDirections': { en: 'Get Route', ar: 'ورّيني الطريق' },

  // =========================================================================
  // 10. MEMORIES & DAHAB PASSPORT
  // =========================================================================
  'memories.title': { en: 'Your Dahab Story & Passport', ar: 'حكايتك في دهب وجواز السفر التذكاري' },
  'memories.subtitle': {
    en: 'Your visual travel memory log, unlocked Dahab badges, and logged adventures.',
    ar: 'سجل ذكرياتك المصور، الشارات اللي جمعتها، وإحصائيات مغامراتك في سيناء.',
  },
  'passport.title': { en: 'Dahab Explorer Passport', ar: 'جواز مستكشف دهب' },
  'passport.badgeDiving': { en: 'Deep Abyss Diver', ar: 'غواص الأعماق' },
  'passport.badgeSunset': { en: 'Golden Sunset Chaser', ar: 'عاشق الغروب الذهبي' },
  'passport.badgeDesert': { en: 'Canyon Wanderer', ar: 'مستكشف الكانيون' },
  'passport.badgeReef': { en: 'Reef Guardian', ar: 'حامي الشعاب المرجانية' },
  'passport.badgeFood': { en: 'Bedouin Feaster', ar: 'خبير الأكل البدوي والسي فود' },
  'passport.badgeNight': { en: 'Sinai Stargazer', ar: 'راصد نجوم سيناء' },

  // =========================================================================
  // 11. OFFLINE PACK & LOCAL BACKUP
  // =========================================================================
  'offline.title': { en: 'Offline Dahab Companion', ar: 'بيانات دهب بدون نت' },
  'offline.ready': { en: 'Offline Pack Synchronized ✓', ar: 'كل تفاصيل الرحلة محفوظة على جهازك ✓' },
  'offline.desc': {
    en: 'Vouchers, taxi numbers, dive maps, and emergency coordinates saved locally.',
    ar: 'قسائم الحجز، أرقام السائقين، خرائط الغطس، وأرقام الطوارئ شغالة معاك حتى لو الشبكة وقعت.',
  },
  'offline.downloadAll': { en: 'Update Offline Pack', ar: 'حدّث بيانات عدم الاتصال' },

  // =========================================================================
  // 12. EMERGENCY & MEDICAL SOS
  // =========================================================================
  'emergency.title': { en: '24/7 Sinai Emergency & Medical', ar: 'طوارئ دهب وغرفة الضغط ٢٤ ساعة' },
  'emergency.hyperbaric': { en: 'Dahab Hyperbaric Chamber', ar: 'غرفة علاج الضغط وطوارئ الغطس' },
  'emergency.hyperbaricDesc': { en: 'Dr. Adel Taher On-Duty · +20 69 364 0536', ar: 'دكتور عادل طاهر (طبيب مناوب) · ٠٦٩٣٦٤٠٥٣٦' },
  'emergency.hospital': { en: 'Dahab Central Specialist Clinic', ar: 'مستشفى دهب المركزي التخصصي' },
  'emergency.police': { en: 'Sinai Tourist Police Hotline', ar: 'شرطة السياحة بسيناء (١٢٦)' },
  'emergency.lostLocation': { en: "I'm Lost / Need Taxi Dispatch", ar: 'أنا تايه ومحتاج تاكسي يجيلي فوراً' },
  'emergency.callDirect': { en: 'Call Emergency', ar: 'اتصال فوري' },

  // =========================================================================
  // 13. WHATSAPP & MORNING NOTIFICATIONS
  // =========================================================================
  'whatsapp.title': { en: 'WhatsApp Morning Companion', ar: 'رسالة صباح دهب على الواتساب' },
  'whatsapp.previewText': {
    en: '☀️ Good morning Ahmed!\n🌡 28°C Dahab · 🌊 Calm sea\n🤿 Canyon dive scheduled at 09:00 AM\n🚗 Driver Mahmoud arrives at 08:30 AM',
    ar: '☀️ صباح الفل يا أحمد!\n🌡 حرارة دهب النهارده ٢٨°م · 🌊 البحر هادي وصافي\n🤿 غطسة الكانيون في ميعادها ٠٩:٠٠ الصبح\n🚗 الكابتن محمود هيقابلك قدام الفندق ٠٨:٣٠ بالظبط',
  },

  // =========================================================================
  // 14. AROUND ME & LOCAL MOBILITY
  // =========================================================================
  'aroundMe.title': { en: 'Around Me in Dahab', ar: 'حواليا إيه في دهب؟' },
  'aroundMe.nearLighthouse': { en: "YOU'RE NEAR LIGHTHOUSE REEF", ar: 'أنت دلوقتي قريب من شاطئ اللايتهاوس' },
  'aroundMe.walkTime': { en: 'min walk', ar: 'دقايق مشي' },
  'aroundMe.scooterNotice': {
    en: 'Spots are 3.5km apart tomorrow. Grab a coastal scooter to save 1h 40m walking time.',
    ar: 'الأماكن بعيدة عن بعض بكرة بحوالي ٣.٥ كم. سكوتر خفيف هيوفرلك ساعة و٤٠ دقيقة مشي في الشمس.',
  },
  'aroundMe.bookScooter': { en: 'Rent Coastal Scooter', ar: 'احجز سكوتر' },

  // =========================================================================
  // 15. FOOD NOW & BEACH DELIVERY
  // =========================================================================
  'food.title': { en: 'Palapa & Beach Delivery', ar: 'أكل ومشروبات واصلة لحد شلتك ع البحر' },
  'food.subtitle': {
    en: 'Fresh breakfast, Bedouin tea, and local seafood delivered to your seafront lounger.',
    ar: 'فطور مصري طازة، شاي بدوي بالحبق، ووجبات سمك مشوي توصلك لحد مكانك على الشاطئ أو أوضتك.',
  },
  'food.orderNow': { en: 'Order to My Spot', ar: 'اطلب لمكاني دلوقتي' },
  'food.hungry': { en: 'Hungry? What are you craving?', ar: 'جعان؟ نفسك في إيه النهارده؟' },
  'food.quickSnack': { en: 'Quick bite or full seaside meal?', ar: 'عايز حاجة خفيفة سريعة ولا وجبة سمك محترمة؟' },
  'food.riderStatus': { en: 'Order picked up by rider · Arriving at Lighthouse in 8 mins', ar: 'المندوب استلم الطلب · هيوصلك عند اللايتهاوس كمان ٨ دقايق' },

  // =========================================================================
  // 16. ARRIVAL MODE (EARLY ARRIVAL & FIRST 2 HOURS)
  // =========================================================================
  // The demo user's name used to be baked into this string in both languages,
  // so every traveler was greeted as Ahmed. The name is now interpolated from
  // the real profile, and this is the greeting for a visitor with no name yet.
  'arrival.title': { en: 'Welcome to Dahab 👋', ar: 'حمد الله ع السلامة في دهب 👋' },
  // Times on the arrival page are computed from the viewer's own clock, so these
  // carry only the wording around the value. See src/utils/arrivalTime.ts.
  'arrival.currentTimeLabel': { en: 'Current time:', ar: 'الوقت الحالي:' },
  'arrival.timeAvailableLabel': { en: 'Time available:', ar: 'الوقت المتاح:' },
  'arrival.subtitleWaiting': { en: "You're here! Your room will be ready at", ar: 'وصلت بالسلامة! غرفتك هتكون جاهزة الساعة' },
  'arrival.subtitleReady': { en: "You're here! Your room should be ready now.", ar: 'وصلت بالسلامة! غرفتك المفروض جاهزة دلوقتي.' },
  'arrival.checkInOpen': { en: 'Check-in is open', ar: 'الاستلام متاح دلوقتي' },
  'arrival.checkInOpenLong': { en: 'Check-in is open — your room should be ready.', ar: 'الاستلام متاح — غرفتك المفروض جاهزة.' },
  'arrival.reassuranceDescPre': { en: 'You have approximately', ar: 'معاك حوالي' },
  'arrival.reassuranceDescPost': { en: 'of relaxed time right here on the Lighthouse promenade.', ar: 'وقت رايق هنا على ممشى اللايتهاوس.' },
  'arrival.reassuranceDescReady': { en: 'Check-in has opened — head to reception whenever you are ready.', ar: 'الاستلام فتح — روح الاستقبال في أي وقت يناسبك.' },
  'arrival.timeRemainingPre': { en: 'You have', ar: 'معاك' },
  'arrival.timeRemainingPost': { en: 'before check-in.', ar: 'قبل استلام الغرفة.' },
  'arrival.waitProgressLabel': { en: 'Time elapsed until check-in', ar: 'الوقت المنقضي حتى الاستلام' },
  'arrival.timelineArrivedLabel': { en: 'Arrived', ar: 'الوصول' },
  'arrival.timelineTransLabel': { en: 'Transition', ar: 'التنقل' },
  'arrival.timelineCheckInLabel': { en: 'Check-in', ar: 'الاستلام' },
  'arrival.checkInOpenedAt': { en: 'Check-in opened at', ar: 'الاستلام فتح الساعة' },
  'arrival.today': { en: 'Today', ar: 'اليوم' },
  'arrival.titleNamed': { en: 'Welcome to Dahab,', ar: 'حمد الله ع السلامة في دهب يا' },
  'arrival.companion': { en: 'Companion', ar: 'مرافق' },
  'arrival.companions': { en: 'Companions', ar: 'مرافقين' },
  'arrival.travelers': { en: 'Travelers', ar: 'مسافرين' },
  'arrival.regionRoomStatus': { en: 'Room status', ar: 'حالة الغرفة' },
  'arrival.regionSuggestion': { en: 'Our suggestion', ar: 'اقتراحنا' },
  'arrival.regionContext': { en: 'Arrival context and trip details', ar: 'سياق الوصول وتفاصيل الرحلة' },
  'profile.pace.Relaxed': { en: 'Relaxed', ar: 'هادئ' },
  'profile.pace.Balanced': { en: 'Balanced', ar: 'متوازن' },
  'profile.pace.Active': { en: 'Active', ar: 'نشط' },
  'arrival.returnItinerary': { en: 'Return to Full Itinerary', ar: 'الرجوع لجدول الرحلة الكامل' },
  'arrival.liveBadge': { en: 'Live: Just Arrived in Dahab', ar: 'مباشر: وصول دهب الآن' },
  'arrival.assistancePill': { en: 'Real-Time Arrival Assistance · Lighthouse Area', ar: 'مساعد الوصول الفوري · منطقة اللايتهاوس' },
  'arrival.hotelName': { en: 'Dahab Bay Hotel', ar: 'فندق خليج دهب (Dahab Bay Hotel)' },
  'arrival.roomNotReady': { en: "Your room isn't ready yet", ar: 'غرفتك لسه بتجهز' },
  'arrival.waitingCheckIn': { en: 'Waiting for check-in', ar: 'في انتظار موعد الاستلام' },
  'arrival.scheduledCheckIn': { en: 'Scheduled Check-in', ar: 'موعد تسجيل الوصول' },
  'arrival.reservedRoom': { en: 'Reserved Room', ar: 'الغرفة المحجوزة' },
  'arrival.roomTypeVal': { en: 'Sea View Deluxe (2 Guests)', ar: 'ديلوكس إطلالة بحر (فردين)' },
  'arrival.reassuranceHeader': { en: "No worries — we've found a few easy ways to use the time before your room is ready.", ar: 'ولا تشيل هم — جهزنالك كذا خيار رايق تستمتع بيهم في دهب لحد ما غرفتك تجهز.' },
  'arrival.choicesTag': { en: 'Curated Early Arrival Choices', ar: 'خيارات الوصول المبكر المختارة' },
  'arrival.choicesTitle': { en: 'What would you like to do?', ar: 'تحب تعمل إيه دلوقتي؟' },
  'arrival.choicesDesc': { en: "We've kept the options close, easy, and within the time you have.", ar: 'اخترنالك خيارات قريبة، سهلة، وتناسب بالظبط الوقت اللي معاك.' },
  'arrival.optLeaveBags': { en: 'Leave your bags', ar: 'سيب الشنط في أمان' },
  'arrival.optRecFirst': { en: 'Recommended First', ar: 'الخطوة الأولى المقترحة' },
  'arrival.optLeaveBagsDesc': { en: 'Drop your luggage somewhere convenient and explore without carrying it around.', ar: 'سيب شنطك في مكان مريح وآمن واستكشف دهب خفيف وخالي البال.' },
  'arrival.optLeaveBagsLoc': { en: 'Hotel Concierge · 120m away (Free with stay)', ar: 'استقبال الفندق · على بعد ١٢٠م (مجاناً مع الحجز)' },
  'arrival.optLeaveBagsBtn': { en: 'Find a nearby option', ar: 'شوف أقرب مكان للشنط' },
  'arrival.optBreakfast': { en: 'Breakfast', ar: 'فطار صباحي رايق' },
  'arrival.optBreakfastTime': { en: '15–20 min away', ar: '١٥–٢٠ دقيقة' },
  'arrival.optBreakfastDesc': { en: 'Grab something to eat before you start exploring.', ar: 'افطر وجبة حلوة وفريش قبل ما تبدأ يومك.' },
  'arrival.optBreakfastVibe': { en: 'Seaside cafes & fresh bakery spots', ar: 'كافيهات ومخابز طازة ع البحر مباشرة' },
  'arrival.optBreakfastBtn': { en: 'Find breakfast', ar: 'اكتشف أماكن الفطار' },
  'arrival.optBeach': { en: 'Beach', ar: 'قعدة بحر واسترخاء' },
  'arrival.optBeachTag': { en: 'Nearby', ar: 'قريب جداً' },
  'arrival.optBeachDesc': { en: 'Take it easy by the sea while you wait.', ar: 'استمتع بنسيم البحر والشلتات المريحة على الممشى.' },
  'arrival.optBeachVibe': { en: 'Shaded cushions & calm shallow reef', ar: 'شلت مظللة وشعاب مرجانية هادية' },
  'arrival.optBeachBtn': { en: 'Explore', ar: 'استكشف' },
  'arrival.optWalk': { en: 'Walk around', ar: 'تمشية واستكشاف' },
  'arrival.optWalkTag': { en: 'Easy pace', ar: 'ريتم هادي' },
  'arrival.optWalkDesc': { en: 'Take a relaxed walk and get your first feel of Dahab.', ar: 'تمشى في الممشى وخد أول انطباع عن روح وبساطة دهب.' },
  'arrival.optWalkVibe': { en: 'Car-free coastal walkway', ar: 'ممشى ساحلي مخصص للمشاة بدون سيارات' },
  'arrival.optWalkBtn': { en: 'Explore', ar: 'استكشف' },
  'arrival.optCheckIn': { en: 'Early check-in', ar: 'تسجيل وصول مبكر' },
  'arrival.optCheckInTag': { en: 'Hotel Sync', ar: 'تنسيق مع الفندق' },
  'arrival.optCheckInDesc': { en: 'See if your hotel can prepare the room earlier.', ar: 'نشوفلك إمكانية تجهيز الغرفة في وقت أقرب مع خدمة الغرف.' },
  'arrival.optCheckInNote': { en: '*Subject to housekeeping readiness', ar: '*حسب جاهزية خدمة الغرف والنزلاء السابقين' },
  'arrival.optCheckInBtn': { en: 'Check availability', ar: 'فحص الإمكانية' },
  'arrival.suggestionTag': { en: 'Our suggestion', ar: 'اقتراحنا لك' },
  'arrival.suggestionTitle': { en: 'Leave your bags, grab breakfast, and take a short walk by the sea.', ar: 'سيب شنطك في الفندق، افطر فطار رايق، وخد لفة سريعة ع البحر.' },
  'arrival.suggestionDesc': { en: "You'll have enough time to enjoy Dahab without rushing before check-in.", ar: 'هيكون معاك وقت كافي ومريح تعيش دهب بروقان قبل استلام الأوضة.' },
  'arrival.build2Hours': { en: 'Build my first 2 hours', ar: 'رتبلي أول ساعتين في دهب' },
  'arrival.contextTag': { en: 'Real-Time Context', ar: 'السياق اللحظي' },
  'arrival.timeWindow': { en: 'Available Time Window', ar: 'نافذة الوقت المتاح' },
  'arrival.onSchedule': { en: 'On Schedule', ar: 'في الميعاد المحدد' },
  'arrival.currentArea': { en: 'Current Area', ar: 'المنطقة الحالية' },
  'arrival.currentAreaVal': { en: 'Lighthouse Promenade', ar: 'ممشى اللايتهاوس' },
  'arrival.tripPace': { en: 'Trip Pace', ar: 'ريتم الرحلة' },
  'arrival.tripPaceVal': { en: 'Balanced (Unrushed)', ar: 'متوازن وهادئ' },
  'arrival.groupLabel': { en: 'Group', ar: 'المجموعة' },
  'arrival.groupVal': { en: 'Ahmed + 1 Companion', ar: 'أحمد + مرافق' },
  'arrival.itinTag': { en: 'Itinerary Integration', ar: 'ربط جدول الرحلة' },
  'arrival.comingUp': { en: 'Coming up', ar: 'المحطات القادمة' },
  'arrival.milestone1Title': { en: 'Hotel Check-in', ar: 'استلام الغرفة بالفندق' },
  'arrival.milestone1Desc': { en: 'Dahab Bay Hotel · Sea View Deluxe Room', ar: 'فندق خليج دهب · غرفة ديلوكس إطلالة بحر' },
  'arrival.milestone2Tag': { en: 'Tomorrow · 09:00 AM', ar: 'غداً · ٠٩:٠٠ صباحاً' },
  'arrival.milestone2Title': { en: 'Guided Diving Experience', ar: 'تجربة غطس مع مرشد محلي' },
  'arrival.milestone2Desc': { en: 'Canyon & Blue Hole Reefs · Full gear reserved', ar: 'شعاب الكانيون والبلو هول · حجز المعدات كاملة' },
  'arrival.itinFootnote': { en: '*Your temporary early morning choices do not alter your main itinerary.', ar: '*اختيارات الصباح المبكر لا تؤثر على مواعيد جدول رحلتك الأساسي.' },
  'arrival.accomTag': { en: 'Accommodation', ar: 'بيانات الإقامة' },
  'arrival.hotelDetailsTitle': { en: 'Dahab Bay Hotel Details', ar: 'تفاصيل فندق خليج دهب' },
  'arrival.locLabel': { en: 'Location:', ar: 'الموقع:' },
  'arrival.refLabel': { en: 'Booking Ref:', ar: 'رقم الحجز:' },
  'arrival.frontDeskLabel': { en: 'Front Desk:', ar: 'مكتب الاستقبال:' },
  'arrival.frontDeskVal': { en: '24/7 Monitored', ar: 'متاح ومتابع ٢٤/٧' },
  'arrival.dropBagsDeskBtn': { en: 'Drop Bags at Hotel Desk (Free)', ar: 'سيب الشنط في الاستقبال (مجاناً)' },
  'arrival.needAssistance': { en: 'Need immediate assistance?', ar: 'محتاج مساعدة فورية؟' },
  'arrival.conciergeDesc': { en: 'Our local Dahab concierge team is available right now.', ar: 'فريق مرشدي دهب المحليين جاهز لمساعدتك في أي لحظة.' },
  'arrival.helpMeNowBtn': { en: 'Help Me Now', ar: 'طلب مساعدة عاجلة' },
  'arrival.earlyWelcome': {
    en: 'Arrived early before 3:00 PM check-in? Let’s make the most of these 2 hours.',
    ar: 'وصلت بدري قبل ميعاد الـCheck-in؟ تمام، نرتبلك الساعتين دول براحة.',
  },
  'arrival.luggageDrop': { en: 'Secure luggage drop at Lighthouse Storage Hub', ar: 'سيب شنطك في أمان عند نقطة اللايتهاوس' },
  'arrival.step1': { en: '1. Drop bags safely', ar: '١. سيب شنطك في أمان' },
  'arrival.step2': { en: '2. Grab an iced Bedouin tea or fresh juice', ar: '٢. اشرب عصير فريش أو شاي بدوي رايق' },
  'arrival.step3': { en: '3. Stroll the seafront promenade until room is ready', ar: '٣. خد لفة على الممشى لحد ميعاد استلام الغرفة' },
  'arrival.readyConfirm': { en: 'I’ve Checked In', ar: 'استلمت الأوضة خلاص ✓' },

  // =========================================================================
  // 17. DEPARTURE MODE & FINAL HOURS
  // =========================================================================
  'departure.title': { en: 'Dahab Departure & Return Journey', ar: 'ترتيب يوم الرجوع والمطار' },
  'departure.subtitle': {
    en: 'Smooth countdown to your Sharm airport transfer with luggage storage and last-minute dip.',
    ar: 'بنرتبلك آخر كام ساعة في دهب براحة وبدون توتر، من مواصلات المطار لآخر غطسة وتجهيز الشنط.',
  },
  'departure.carTime': { en: 'Transfer pickup ready at 01:30 PM', ar: 'العربية هتكون جاهزة تاخدك الساعة ٠١:٣٠ الظهر' },
  'departure.flightCountdown': { en: 'Flight departure in 5 hours', ar: 'ميعاد طيارتك بعد ٥ ساعات' },
  'departure.lastAction': { en: 'Have breakfast & pack at your own pace', ar: 'افطر بروقان واقفل شنطتك براحتك' },

  // =========================================================================
  // 18. CHANGE ENGINE & RECOVERY (INSTEAD OF "CANCELLED")
  // =========================================================================
  'recovery.title': { en: 'Something changed? We’ve got alternatives.', ar: 'حصل تغيير في الخطة؟ ظبطنالك البدائل.' },
  'recovery.seaWarning': {
    en: 'Waves picked up at Ras Abu Galum. Boat trip rescheduled with 3 curated alternatives.',
    ar: 'الموج علي عند رأس أبو جالوم. وبدل ما نلغي، لقينالك ٣ بدائل جاهزة ومضمونة فوراً.',
  },
  'recovery.option1': { en: 'Sheltered Canyon shore dive + Bedouin tea fire', ar: 'غطسة هادية في الكانيون + قعدة شاي بدوي ع الفحم' },
  'recovery.option2': { en: 'Wadi Gnai bouldering & quad safari', ar: 'مغامرة وتسلق في وادي قناي وسفاري بالبيتش باجي' },
  'recovery.option3': { en: 'Laguna relaxation & seafood lunch', ar: 'قعدة روقان في اللاجونا وغداء سمك طازة ع البحر' },
  'recovery.pickChoice': { en: 'Confirm New Plan', ar: 'اعتمد الاختيار ده' },
  'recovery.weFixedDay': { en: 'All transfers, hotels, and rentals automatically synchronized.', ar: 'كل المواعيد والعربيات اتظبطت تلقائياً بدون أي دوشة.' },

  // =========================================================================
  // 19. TRIP BUILDER & PLANNING INTERACTION
  // =========================================================================
  'planner.title': { en: 'Tell us how you want to experience Dahab', ar: 'قولنا نفسك تعيش دهب إزاي' },
  'planner.subtitle': {
    en: 'Pick your vibe, pace, and interests. We craft a complete 5-day flow with real bookings.',
    ar: 'حدد ميزانيتك، اهتماماتك، والجو اللي بتحبه.. وإحنا نظبّطلك رحلة متكاملة ومحبوكة صح.',
  },
  'planner.stepDuration': { en: 'Duration & Travelers', ar: 'المدة وعدد الأفراد' },
  'planner.stepInterests': { en: 'Interests & Vibe', ar: 'اهتماماتك في الرحلة' },
  'planner.stepPace': { en: 'Travel Pace', ar: 'طبيعة جدولك (هادي ولا مليان؟)' },
  'planner.stepBudget': { en: 'Budget Range', ar: 'الميزانية التقريبية' },
  'planner.planForMe': { en: 'Plan My Dahab Trip', ar: 'ظبّطلي رحلتي' },
  'planner.buildingTrip': { en: 'Matching trusted guides, boutique stays & marine tides...', ar: 'بنوفق أحسن غطسات، أماكن إقامة، ومرشدين ثقة من أهل دهب...' },

  // =========================================================================
  // 20. CHECKOUT, UNIFIED VOUCHER & BOOKINGS
  // =========================================================================
  'booking.unifiedTitle': { en: 'Unified Dahab Pass & Voucher', ar: 'كارت حجزك الموحد لدهب' },
  'booking.unifiedDesc': {
    en: 'Hotel + Airport Transfer + Diving + Desert Safari combined into 1 single voucher code.',
    ar: 'الفندق + توصيلة المطار + الغطس + السفاري متجمعين في كود حجز واحد بدون تعقيد.',
  },
  'booking.statusConfirmed': { en: 'Confirmed ✓', ar: 'متأكد ومحجوز ✓' },
  'booking.statusPending': { en: 'Processing with local operator...', ar: 'بيتأكد حالاً مع المنظم...' },
  'booking.statusChanged': { en: 'Rescheduled seamlessly', ar: 'اتعدل بنجاح' },
  'booking.paySecure': { en: 'Pay & Confirm', ar: 'أكّد وادفع بأمان' },
  'booking.paymentSuccess': { en: 'Payment Complete! Have an unforgettable time in Dahab.', ar: 'الدفع تم بنجاح! جهز نفسك لأيام متتنسيش في دهب.' },
  'booking.paymentError': { en: 'Payment issue encountered. Please try again or reach our team.', ar: 'حصلت مشكلة وإحنا بنكمّل الدفع. جرّب تاني أو كلمنا نساعدك.' },

  // =========================================================================
  // 21. LOCAL OPERATIONS & SUPPLIER NETWORK
  // =========================================================================
  'supplier.title': { en: 'Dahab Local Operators & Captains', ar: 'شركاء دهب وأهل البلد' },
  'supplier.subtitle': {
    en: 'Direct coordination with Bedouin guides, dive masters, and boutique camp owners.',
    ar: 'تنسيق مباشر مع أمهر الغواصين، المرشدين البدو، وسائقي سيناء المعتمدين.',
  },
  'supplier.verifiedBadge': { en: 'Sinai Verified Local Master', ar: 'منظم محلي موثوق ومعتمد' },

  // =========================================================================
  // 22. COMMON ACTIONS, LABELS & TIME UNITS
  // =========================================================================
  'common.viewAll': { en: 'View All', ar: 'شوف كله' },
  'common.close': { en: 'Close', ar: 'قفل' },
  'common.save': { en: 'Save', ar: 'حفظ' },
  'common.saved': { en: 'Saved ✓', ar: 'اتحفظت ✓' },
  'common.bookNow': { en: 'Book Now', ar: 'احجز دلوقتي' },
  'common.details': { en: 'Full Details', ar: 'كل التفاصيل' },
  'common.directions': { en: 'Get Directions', ar: 'طريق الوصول' },
  'common.minutes': { en: 'min', ar: 'دقيقة' },
  'common.hours': { en: 'hrs', ar: 'ساعات' },
  'common.egp': { en: 'EGP', ar: 'جنيه' },
  'common.usd': { en: '$', ar: '$' },
  'common.today': { en: 'Today', ar: 'النهارده' },
  'common.tomorrow': { en: 'Tomorrow', ar: 'بكرة' },
  'common.afterTomorrow': { en: 'Day After Tomorrow', ar: 'بعد بكرة' },
  'common.morning': { en: 'Morning', ar: 'الصبح' },
  'common.afternoon': { en: 'Afternoon', ar: 'الظهر والفرصة' },
  'common.evening': { en: 'Evening & Night', ar: 'المساء والليل' },
  'common.needHelp': { en: 'Need Help?', ar: 'محتاج مساعدة؟' },
  'common.contactUs': { en: 'Talk to Local Team', ar: 'كلمنا حالاً' },
  'common.back': { en: 'Back', ar: 'رجوع' },
  'common.continue': { en: 'Continue', ar: 'كمّل' },
  'common.confirm': { en: 'Confirm', ar: 'تأكيد' },
  'common.loading': { en: 'Getting things ready...', ar: 'ثواني وبنظبطلك كل حاجة...' },
  'common.noResults': { en: 'No matching places found. Try another spot.', ar: 'ملقناش مكان بالاسم ده في دهب.. جرّب تبحث باسم تاني أو امسح البحث.' },
  'common.retry': { en: 'Try Again', ar: 'جرّب تاني' },

  // =========================================================================
  // 23. LEVEL C TRANSACTIONAL: EMPTY STATES (WARM, HUMAN & ACTIONABLE)
  // =========================================================================
  'empty.bookingsTitle': { en: 'No Bookings in This Category Yet', ar: 'لسه مفيش حجوزات في القسم ده' },
  'empty.bookingsDesc': {
    en: 'You can book verified boutique stays, private transfers, and coral dives directly.',
    ar: 'تقدر تحجز إقامتك، عربية المطار، أو غطسة البلو هول بكارت موحد بدون أي وجع دماغ.',
  },
  'empty.bookingsAction': { en: 'Explore Dahab Experiences', ar: 'اكتشف تجارب دهب واحجز' },
  'empty.savedTitle': { en: 'Your Bucket List is Waiting', ar: 'قائمة مفضلتك لسه فاضية' },
  'empty.savedDesc': {
    en: 'Heart your favorite cafes, reefs, and desert spots to keep them close while in Dahab.',
    ar: 'دوس على القلب عند أي كافيه، شاطئ، أو مكان عجبك عشان ترجعله بضغطة واحدة وأنت في دهب.',
  },
  'empty.savedAction': { en: 'Discover Spots', ar: 'شوف أحلى أماكن دهب' },
  'empty.searchTitle': { en: 'No Exact Matches Found', ar: 'ملقناش أماكن بالاسم ده' },
  'empty.searchDesc': {
    en: 'Try searching for keywords like "Diving", "Canyon", "Breakfast", "Ralphs", or "Taxi".',
    ar: 'جرّب تدور على كلمات زي: غطس، كانيون، فطار، سمك، رالفز، أو تاكسي.',
  },
  'empty.searchAction': { en: 'Clear Search Filter', ar: 'مسح البحث وعرض الكل' },
  'empty.foodTitle': { en: 'Kitchens Take More Time Than Your Free Window', ar: 'الوقت ضيق على قعدة مطعم قبل ميعادك الجاي' },
  'empty.foodDesc': {
    en: 'Dine-in meals might cut too close to your 03:00 PM activity. Here are 3 quick solutions instead:',
    ar: 'قعدة المطعم هتاخد وقت وممكن تعطل ميعادك الساعة ٣:٠٠. جهزنالك ٣ حلول سريعة ومريحة:',
  },
  'empty.foodActionDelivery': { en: 'Order Beach Delivery (30 min)', ar: 'اطلب دليفري للشلتة (٣٠ دقيقة)' },
  'empty.foodActionCoffee': { en: 'Grab Quick Iced Coffee', ar: 'اشرب قهوة أو شاي سريع ع البحر' },
  'empty.foodActionLater': { en: 'Wait for Seaside Dinner', ar: 'أجّل الأكلة لسهرة سمك بعد النشاط' },
  'empty.offlineTitle': { en: 'No Offline Pack Downloaded', ar: 'مفيش بيانات محفوظة بدون نت' },
  'empty.offlineDesc': {
    en: 'Download your offline pack to access taxi numbers, maps, and vouchers when signal drops.',
    ar: 'نزّل حزمة دهب بدون نت عشان تضمن أرقام السائقين، الفاوتشر، والخرائط حتى لو الشبكة فصلت.',
  },
  'empty.offlineAction': { en: 'Download Offline Pack (2.4 MB)', ar: 'تحميل بيانات عدم الاتصال (٢.٤ ميجا)' },

  // =========================================================================
  // 24. LEVEL C TRANSACTIONAL: LOADING STATES (CONTEXTUAL & CALM)
  // =========================================================================
  'loading.tripBuilding': { en: 'Finding your Dahab rhythm...', ar: 'بنظبطلك ريتم رحلتك في دهب...' },
  'loading.tripSub': { en: 'Syncing tides, trusted Bedouin guides & golden-hour timing', ar: 'بنوفق مواعيد البحر، الكباتن البدو، ووقت الغروب ع الرايق' },
  'loading.marineRadar': { en: 'Checking live Red Sea marine conditions...', ar: 'بنتأكد من حالة الموج ووضوح الرؤية في البحر...' },
  'loading.marineSub': { en: 'Reading thermal wind & underwater visibility sensors', ar: 'بنقيس سرعة الهوا وصفاء المية عند البلو هول والكانيون' },
  'loading.paymentProcessing': { en: 'Confirming your Dahab reservations...', ar: 'بنتأكد من حجزك الموحد مع المنظمين...' },
  'loading.paymentSub': { en: 'Securing room, private transfer, and dive gear slots', ar: 'بنقفل حجز الأوضة، العربية، ومعدات الغطس' },
  'loading.orderFood': { en: 'Placing order directly with the kitchen...', ar: 'بنبعت طلبك للمطبخ حالا...' },
  'loading.orderFoodSub': { en: 'Rider dispatch assigned for seaside palapa delivery', ar: 'المندوب بيتحرك يستلم عشان يوصله لحد شلتك' },
  'loading.directions': { en: 'Locating best scenic route along the coast...', ar: 'بنحددلك أحسن طريق مشي ع البحر...' },

  // =========================================================================
  // 25. LEVEL C TRANSACTIONAL: ERROR & RECOVERY (WARM, CALM & ACTION-ORIENTED)
  // =========================================================================
  'error.generalTitle': { en: 'Something hit a snag on our end', ar: 'حصلت مشكلة بسيطة وإحنا بنحمّل' },
  'error.generalDesc': {
    en: 'Don’t worry, your trip details and bookings are safe. Let’s try that again.',
    ar: 'ولا تشيل هم، كل بيانات رحلتك وحجوزاتك في أمان. دوس إعادة محاولة وهنظبطها.',
  },
  'error.networkTitle': { en: 'Sinai Connection Dropped', ar: 'النت فصل أو الإشارة ضعيفة' },
  'error.networkDesc': {
    en: 'Cell signal along the mountains can fluctuate. Your offline vouchers and emergency contacts are ready.',
    ar: 'شبكة الموبايل في الجبال بتفصل ساعات. كل فاوتشراتك وأرقام الطوارئ شغالة بدون نت.',
  },
  'error.networkAction': { en: 'Open Offline Hub', ar: 'افتح بيانات بدون نت' },
  'error.paymentTitle': { en: 'Payment Didn’t Go Through', ar: 'عملية الدفع متكملتش' },
  'error.paymentDesc': {
    en: 'Your card was not charged. Please check your card balance or choose to pay cash upon arrival in Dahab.',
    ar: 'ماتخصمش أي فلوس من كارتك. تقدر تعيد المحاولة أو تختار الدفع كاش عند الوصول لدهب براحتك.',
  },
  'error.paymentActionCard': { en: 'Try Card Again', ar: 'جرّب الكارت تاني' },
  'error.paymentActionArrival': { en: 'Pay Cash on Arrival Instead', ar: 'ادفع كاش عند الوصول بدلاً من ذلك' },
  'error.driverLateTitle': { en: 'Driver Delayed by Checkpoint', ar: 'الكابتن اتأخر شوية عند الكمين' },
  'error.driverLateDesc': {
    en: 'Sinai tourist checkpoint traffic delayed your driver by 10 minutes. He’s already in touch.',
    ar: 'زحمة خفيفة في كمين مدخل دهب أخرت الكابتن حوالي ١٠ دقايق، وهو بيتواصل معاك دلوقتي.',
  },
  'error.driverLateAction': { en: 'Call Driver Directly', ar: 'اتصال بالكابتن' },
  'error.seaShiftTitle': { en: 'Sea Conditions Shifted', ar: 'حالة البحر اتغيرت والموج علي' },
  'error.seaShiftDesc': {
    en: 'Wind picked up at the outer reef. We safely shifted your dive to sheltered Canyon with 3 instant alternatives.',
    ar: 'الهوا زاد عند الريف المفتوح. عشان سلامتك، حولنا النشاط لغطسة الكانيون الهادية مع ٣ بدائل جاهزة.',
  },
  'error.seaShiftAction': { en: 'View & Pick Alternatives', ar: 'شوف البدائل واختار اللي يناسبك' },
  'error.locationDisabledTitle': { en: 'Location Access Needed', ar: 'محتاجين إذن تحديد مكانك' },
  'error.locationDisabledDesc': {
    en: 'To show walking times to cafes and reefs, enable location permissions in your browser.',
    ar: 'عشان نحسبلك دقايق المشي للكافيهات والشواطئ بالظبط، اسمح للموقع يحدد مكانك في دهب.',
  },
  'error.locationAction': { en: 'Enable Location', ar: 'تفعيل الموقع' },

  // =========================================================================
  // 26. TRIP ENTRY EXPERIENCE ("HOW DO YOU WANT TO EXPERIENCE DAHAB?")
  // =========================================================================
  'tripEntry.eyebrow': { en: 'Trip Entry Experience', ar: 'مدخل رحلتك إلى دهب' },
  'tripEntry.title': { en: 'How do you want to experience Dahab?', ar: 'كيف تحب تعيش دهب؟' },
  'tripEntry.subtitle': {
    en: 'Three clear paths to start. Every choice leads to a personalized trip shaped around you.',
    ar: '٣ مسارات واضحة تبدأ بيهم.. وكل مسار بيوصلك لنفس الرحلة المتفصلة على مزاجك.',
  },

  // First-timer guidance & comparison
  'tripEntry.newToDahab': { en: 'New to Dahab?', ar: 'أول مرة في دهب؟' },
  'tripEntry.firstTimePrompt': {
    en: 'Never been before? We’ll guide you in 2 quick taps.',
    ar: 'مش عارف تبدأ منين؟ هنوصلك للرحلة المناسبة في خطوتين.'
  },
  'tripEntry.firstTimeYes': { en: 'Yes, first time', ar: 'نعم، أول مرة' },
  'tripEntry.firstTimeNo': { en: 'I’ve been before', ar: 'زرتها قبل كده' },
  'tripEntry.quickStartVibe': { en: 'What sounds like you?', ar: 'إيه أكتر جو يعجبك؟' },
  'tripEntry.yourDahabStarts': { en: 'Your Dahab starts here', ar: 'رحلتك إلى دهب تبدأ من هنا' },
  'tripEntry.recommendedBadge': { en: 'Recommended for first-time visitors', ar: 'الترشيح الأنسب للزيارة الأولى' },
  'tripEntry.seeMyTrip': { en: 'See My Trip', ar: 'شوف رحلتي' },
  'tripEntry.startThisTrip': { en: 'Start This Trip', ar: 'ابدأ الرحلة دي' },
  'tripEntry.pickAnother': { en: 'Pick Another', ar: 'اختار رحلة تانية' },
  'tripEntry.noCommitment': { en: 'No commitment yet · 100% customizable later', ar: 'بدون أي التزام مالي · تقدر تعدل كل حاجة براحتك' },
  'tripEntry.verifiedLocal': { en: 'Verified by local Dahab guides', ar: 'مجربة وموثقة من أهل دهب' },

  // Mode A: Build My Dahab
  'tripEntry.modeA.tag': { en: 'Full Control', ar: 'تحكم كامل' },
  'tripEntry.modeA.title': { en: 'Build Myself', ar: 'ابنِ رحلتك بنفسك' },
  'tripEntry.modeA.intent': { en: 'Full control over every step', ar: 'تحكم كامل في كل خطوة' },
  'tripEntry.modeA.desc': {
    en: 'Choose every detail yourself.',
    ar: 'اختار ورتّب كل تفصيلة في رحلتك بنفسك.',
  },
  'tripEntry.modeA.cta': { en: 'Build Trip Myself', ar: 'ابنِ الرحلة بنفسك' },

  // Mode B: Ready-Made Trip
  'tripEntry.modeB.tag': { en: 'Easiest Start', ar: 'أسهل بداية' },
  'tripEntry.modeB.title': { en: 'Ready Trips', ar: 'ابدأ برحلة جاهزة' },
  'tripEntry.modeB.intent': { en: 'Fastest start with a proven plan', ar: 'أسرع بداية ببرنامج مجرب ومظبوط' },
  'tripEntry.modeB.desc': {
    en: 'Start with a trip already designed for Dahab.',
    ar: 'ابدأ ببرنامج متناسق ومجرب صممه خبراء دهب.',
  },
  'tripEntry.modeB.cta': { en: 'Explore Ready Trips', ar: 'تصفح الرحلات الجاهزة' },
  'tripEntry.modeB.compareBtn': { en: 'Compare Programs', ar: 'مقارنة الرحلات' },
  'tripEntry.modeB.whichIsRight': { en: 'Which is right for me?', ar: 'أنهي رحلة تناسبني؟' },

  // Mode C: Plan It For Me
  'tripEntry.modeC.tag': { en: 'Done With You', ar: 'مرشد ذكي' },
  'tripEntry.modeC.title': { en: 'Plan It For Me', ar: 'خططها لي' },
  'tripEntry.modeC.intent': { en: 'Done with you in 60 seconds', ar: 'جاهزة معاك في ٦٠ ثانية' },
  'tripEntry.modeC.desc': {
    en: 'Tell us what you like and we’ll shape the trip.',
    ar: 'قول لنا بتحب إيه وإحنا نبني لك الرحلة.',
  },
  'tripEntry.modeC.cta': { en: 'Get My Plan in 60s', ar: 'ظبّطلي رحلتي في دقيقة' },

  // Resume Banner
  'tripEntry.resume.badge': { en: 'Active Dahab Journey', ar: 'رحلتك الحالية في دهب' },
  'tripEntry.resume.title': { en: 'Continue your Dahab', ar: 'كمّل رحلتك الحالية' },
  'tripEntry.resume.cta': { en: 'Open Itinerary', ar: 'افتح جدول الرحلة' },
  'tripEntry.resume.startNew': { en: 'Or start a new trip', ar: 'أو ابدأ رحلة جديدة' },

  // Program details & modal
  'readyTrip.planTitle': { en: 'Your Dahab Plan', ar: 'خطة رحلتك إلى دهب' },
  'readyTrip.bookNow': { en: 'Start This Trip', ar: 'ابدأ الرحلة دي' },
  'readyTrip.customize': { en: 'Customize', ar: 'تعديل وتخصيص' },
  'readyTrip.pickAnother': { en: 'Pick Another Trip', ar: 'اختيار رحلة تانية' },
  'readyTrip.included': { en: 'What’s Inside Your Dahab', ar: 'إيه اللي جوة رحلتك في دهب' },
  'readyTrip.customizable': { en: 'What You Can Change Later', ar: 'حاجات تقدر تعدلها في أي وقت' },
  'readyTrip.dayByDay': { en: 'Day-by-Day Journey', ar: 'تفاصيل الأيام خطوة بخطوة' },
  'readyTrip.startingFrom': { en: 'Starting from', ar: 'تبدأ من' },
  'readyTrip.perPerson': { en: 'per person for full trip', ar: 'للفرد للرحلة بالكامل' },
  'readyTrip.intensity': { en: 'Activity Intensity', ar: 'مستوى الحركة' },
  'readyTrip.freeTime': { en: 'Free Relaxation Time', ar: 'وقت راحة واسترخاء' },
  // =========================================================================
  // 27. TRIP PLANNER WIZARD (STEPS 1-5 & FLOW)
  // =========================================================================
  'planner.header.title': { en: 'Plan your Dahab trip', ar: 'خطط لرحلتك في دهب' },
  'planner.header.stepOf': { en: 'Step', ar: 'الخطوة' },
  'planner.header.of': { en: 'of', ar: 'من' },
  'planner.header.exit': { en: 'Exit', ar: 'خروج' },
  'planner.step1.short': { en: 'Duration', ar: 'المدة' },
  'planner.step2.short': { en: 'Travelers', ar: 'المسافرون' },
  'planner.step3.short': { en: 'Budget', ar: 'الميزانية' },
  'planner.step4.short': { en: 'Interests', ar: 'الاهتمامات' },
  'planner.step5.short': { en: 'Pace', ar: 'طبيعة الجدول' },
  'planner.common.back': { en: 'Back', ar: 'رجوع' },
  'planner.common.continue': { en: 'Continue', ar: 'متابعة' },
  'planner.common.authenticSinai': { en: 'Authentic Sinai Travel', ar: 'رحلات سيناء الأصيلة' },
  'planner.common.flexiblePromise': {
    en: 'No rigid tour packages · Tailored to your pace & preferences',
    ar: 'بدون قوالب جاهزة · جدول مفصل على رغباتك وتفضيلاتك',
  },
  'planner.common.curatedExpertise': {
    en: 'Curated with local Sinai expertise',
    ar: 'مصمم بخبرة وتجارب أهل سيناء الحقيقية',
  },

  // Step 1: Duration
  'planner.step1.badge': { en: 'Step 1 · Trip Duration', ar: 'الخطوة ١ · مدة الرحلة' },
  'planner.step1.title': { en: 'How long are you staying in Dahab?', ar: 'كم مدة إقامتك في دهب؟' },
  'planner.step1.subtitle': {
    en: 'Tell us how much time you have, and we’ll shape the experience around it.',
    ar: 'أخبرنا بالوقت المتاح لديك، وسنقوم بتصميم التجربة بناءً عليه.',
  },
  'planner.step1.2-3.label': { en: '2–3 days', ar: '٢-٣ أيام' },
  'planner.step1.2-3.subtitle': { en: 'Weekend & Quick Escape', ar: 'عطلة نهاية أسبوع وسريعة' },
  'planner.step1.2-3.desc': {
    en: 'A focused recharge with top reef dives and slow sunset dinners.',
    ar: 'استعادة نشاط مركزة مع أفضل غطسات الشعاب وعشاء هادئ عند الغروب.',
  },
  'planner.step1.2-3.tag': { en: 'Quick Escape', ar: 'رحلة سريعة' },
  'planner.step1.4-5.label': { en: '4–5 days', ar: '٤-٥ أيام' },
  'planner.step1.4-5.subtitle': { en: 'Classic Dahab Rhythm', ar: 'إيقاع دهب الكلاسيكي' },
  'planner.step1.4-5.desc': {
    en: 'The sweet spot for diving the Blue Hole, canyon trips, and Bedouin dinners.',
    ar: 'المدة المثالية لغطس البلو هول ورحلات الكانيون والعشاء البدوي.',
  },
  'planner.step1.4-5.tag': { en: 'Recommended for Dahab', ar: 'أنسب مدة لدهب' },
  'planner.step1.6-7.label': { en: '6–7 days', ar: '٦-٧ أيام' },
  'planner.step1.6-7.subtitle': { en: 'Full Sinai Immersion', ar: 'معايشة سيناوية كاملة' },
  'planner.step1.6-7.desc': {
    en: 'Unrushed adventures, remote coastal sanctuaries (Ras Abu Galum), and deep relaxation.',
    ar: 'مغامرات براحة بال، ومحميات ساحلية معزولة (رأس أبو جالوم) واسترخاء عميق.',
  },
  'planner.step1.6-7.tag': { en: 'Full Immersion', ar: 'معايشة كاملة' },
  'planner.step1.8plus.label': { en: '8+ days', ar: '+٨ أيام' },
  'planner.step1.8plus.subtitle': { en: 'Extended Slow Stay', ar: 'إقامة طويلة وهادئة' },
  'planner.step1.8plus.desc': {
    en: 'Freediving courses, remote desert expeditions, and authentic local Sinai living.',
    ar: 'دورات الغطس الحر واستكشاف الصحراء والعيش كأهل دهب.',
  },
  'planner.step1.8plus.tag': { en: 'Slow Travel', ar: 'سياحة هادئة' },
  'planner.step1.custom.label': { en: 'Choose dates', ar: 'تحديد تواريخ' },
  'planner.step1.custom.subtitle': { en: 'Specific Calendar Dates', ar: 'تواريخ تقويم محددة' },
  'planner.step1.custom.desc': {
    en: 'Select exact arrival and departure dates for your upcoming travel.',
    ar: 'اختر مواعيد الوصول والمغادرة الدقيقة لرحلتك القادمة.',
  },
  'planner.step1.custom.start': { en: 'Arrival Date', ar: 'تاريخ الوصول' },
  'planner.step1.custom.end': { en: 'Departure Date', ar: 'تاريخ المغادرة' },
  'planner.step1.custom.daysSelected': { en: 'days selected', ar: 'أيام محددة' },
  'planner.step1.continueBtn': { en: 'Continue to Travelers', ar: 'متابعة لتحديد المسافرين' },

  // Step 2: Travelers
  'planner.step2.badge': { en: 'Step 2 · Number of Travelers', ar: 'الخطوة ٢ · عدد المسافرين' },
  'planner.step2.title': { en: 'Who is coming with you?', ar: 'مين مسافر معاك؟' },
  'planner.step2.subtitle': {
    en: 'Tell us about your group so we can curate the right stays, transport, and experiences.',
    ar: 'عرفنا بمجموعتك عشان نختارلك أنسب إقامة وتنقلات وتجارب.',
  },
  'planner.step2.adults': { en: 'Adults', ar: 'البالغين' },
  'planner.step2.adultsDesc': { en: 'Age 13+', ar: 'عمر ١٣ سنة فما فوق' },
  'planner.step2.children': { en: 'Children', ar: 'الأطفال' },
  'planner.step2.childrenDesc': { en: 'Ages 0–12', ar: 'من عمر ٠ إلى ١٢ سنة' },
  'planner.step2.dynamicTitle': { en: 'Trip Dynamic (Optional)', ar: 'طبيعة الرحلة (اختياري)' },
  'planner.step2.dynamicSubtitle': {
    en: 'Helps us match room configurations, activity intensity, and dining vibes.',
    ar: 'بيساعدنا نختارلك الغرف والأنشطة والأجواء الأنسب لمجموعتك.',
  },
  'planner.step2.friends.label': { en: 'Friends', ar: 'أصحاب' },
  'planner.step2.friends.sub': { en: 'Shared adventures & dinners', ar: 'مغامرات مشتركة وسهرات أصحاب' },
  'planner.step2.couple.label': { en: 'Couple', ar: 'زوجين / كابلز' },
  'planner.step2.couple.sub': { en: 'Romantic & calm seaside pace', ar: 'أجواء رومانسية وهادية ع البحر' },
  'planner.step2.family.label': { en: 'Family', ar: 'عائلة' },
  'planner.step2.family.sub': { en: 'Comfort & multi-age activities', ar: 'راحة وأنشطة مناسبة لكل الأعمار' },
  'planner.step2.solo.label': { en: 'Solo', ar: 'لوحدي (سولو)' },
  'planner.step2.solo.sub': { en: 'Freedive focus & flexibility', ar: 'حرية حركة وتركيز ع الغطس' },
  'planner.step2.group.label': { en: 'Group', ar: 'مجموعة كبيرة' },
  'planner.step2.group.sub': { en: 'Private tours & gatherings', ar: 'جولات خاصة وتجمعات' },
  'planner.step2.continueBtn': { en: 'Continue to Budget', ar: 'متابعة لتحديد الميزانية' },

  // Step 3: Budget
  'planner.step3.badge': { en: 'Step 3 · Budget Preference', ar: 'الخطوة ٣ · الميزانية المفضلة' },
  'planner.step3.title': { en: 'What’s your budget like?', ar: 'إيه طبيعة ميزانيتك للرحلة؟' },
  'planner.step3.subtitle': {
    en: 'We’ll use your budget to find the right balance between where you stay, what you do, and how you spend your time.',
    ar: 'هنستخدم ميزانيتك عشان نوازن بين مكان الإقامة والأنشطة وطريقة قضاء وقتك في دهب.',
  },
  'planner.step3.budget.title': { en: 'Easy on the budget', ar: 'اقتصادية وعلى قد الإيد' },
  'planner.step3.budget.desc': {
    en: 'Simple stays, local experiences, and smart choices.',
    ar: 'إقامات بسيطة، تجارب محلية أصيلة، واختيارات ذكية وموفرة.',
  },
  'planner.step3.budget.badge': { en: 'Budget', ar: 'اقتصادية' },
  'planner.step3.moderate.title': { en: 'A balanced trip', ar: 'متوازنة ومريحة' },
  'planner.step3.moderate.desc': {
    en: 'Comfortable stays, great experiences, and room to explore.',
    ar: 'إقامات مريحة، تجارب ممتازة، ومساحة حرة للاستكشاف.',
  },
  'planner.step3.moderate.badge': { en: 'Moderate', ar: 'متوازنة' },
  'planner.step3.premium.title': { en: 'Treat yourself', ar: 'مميزة وفاخرة' },
  'planner.step3.premium.desc': {
    en: 'More comfort, premium stays, and flexible experiences.',
    ar: 'أقصى درجات الراحة، إقامات فاخرة، وتجارب خاصة مميزة.',
  },
  'planner.step3.premium.badge': { en: 'Premium', ar: 'فاخرة' },
  'planner.step3.continueBtn': { en: 'Continue to Interests', ar: 'متابعة للاستكشاف والاهتمامات' },

  // Step 4: Interests
  'planner.step4.badge': { en: 'Step 4 · Experiences & Vibe', ar: 'الخطوة ٤ · الأنشطة والاهتمامات' },
  'planner.step4.title': { en: 'What sounds good for this trip?', ar: 'نفسك تعمل إيه وتجرب إيه في دهب؟' },
  'planner.step4.subtitle': {
    en: 'Pick as many as you like. We’ll blend them into a natural, flowing itinerary.',
    ar: 'اختار كل اللي نفسك فيه.. وهنظبّطهم في جدول يومي سلس ورايق.',
  },
  'planner.step4.selectedCount': { en: 'selected', ar: 'تم اختيار' },
  'planner.step4.continueBtn': { en: 'Continue to Daily Pace', ar: 'متابعة لطبيعة الجدول' },

  // Step 5: Pace
  'planner.step5.badge': { en: 'Step 5 · Daily Rhythm', ar: 'الخطوة ٥ · إيقاع اليوم' },
  'planner.step5.title': { en: 'How do you want your days to feel?', ar: 'حابب يومك في دهب يكون عامل إزاي؟' },
  'planner.step5.subtitle': {
    en: 'Tell us your pace, and we’ll balance activities and free time around it.',
    ar: 'قولنا على رتمك المفضل، وهنوازن بين الأنشطة ووقت الراحة والاسترخاء.',
  },
  'planner.step5.slow.title': { en: 'Slow & Easy', ar: 'هادي ورايق' },
  'planner.step5.slow.desc': {
    en: 'Plenty of free time, relaxed mornings, and room to go with the flow.',
    ar: 'وقت حر كتير، صباحيات رايقة ع البحر، ومفيش أي استعجال.',
  },
  'planner.step5.slow.sub': { en: 'Less planned · More breathing room', ar: 'برامج أقل · وقت راحة أكتر' },
  'planner.step5.balanced.title': { en: 'Balanced', ar: 'متوازن' },
  'planner.step5.balanced.desc': {
    en: 'A mix of experiences and free time, without making every hour a plan.',
    ar: 'مزيج مظبوط بين التجارب والأنشطة والوقت الحر بدون ضغط.',
  },
  'planner.step5.balanced.sub': { en: 'Best of both', ar: 'أفضل ما في الحالتين' },
  'planner.step5.packed.title': { en: 'See It All', ar: 'نشيط ومليان مغامرات' },
  'planner.step5.packed.desc': {
    en: 'More activities, more places, and a full day of experiences.',
    ar: 'أنشطة أكتر، زيارة لكل الأماكن، ويوم مليان تجارب من الصبح لليل.',
  },
  'planner.step5.packed.sub': { en: 'Maximum exploration', ar: 'استكشاف أقصى' },
  'planner.step5.buildBtn': { en: 'Build My Dahab Trip', ar: 'ابدأ تصميم رحلتي في دهب' },

  // Visuals
  'planner.visual.step1.badge': { en: 'Dahab, South Sinai', ar: 'دهب، جنوب سيناء' },
  'planner.visual.step1.title': { en: 'Where the red mountains meet the pristine coral reefs.', ar: 'حيث تلتقي الجبال الحمراء بالشعاب المرجانية البكر.' },
  'planner.visual.step1.cardTitle': { en: 'Personalized Trip Shaping', ar: 'تصميم رحلة مخصصة' },
  'planner.visual.step1.cardText': { en: 'We’ll use your answers to build a trip that fits you.', ar: 'سنستخدم إجاباتك لبناء جدول يناسب رغباتك وتطلعاتك تماماً.' },

  'planner.visual.step2.badge': { en: 'Dahab With Friends', ar: 'دهب مع الأصدقاء' },
  'planner.visual.step2.title': { en: 'Good trips start with knowing who’s coming.', ar: 'حلاوة الرحلة بتبدأ من معرفة مين مسافر معاك.' },
  'planner.visual.step2.cardTitle': { en: 'Party-Specific Curation', ar: 'ترتيبات متفصلة لمجموعتك' },
  'planner.visual.step2.cardText': { en: 'Accommodation layouts, boat charters, and dining spots are matched to your group dynamics.', ar: 'توزيع الغرف، حجز المراكب، وأماكن العشاء كلها متوافقة مع طبيعة مجموعتك.' },

  'planner.visual.step3.badge': { en: 'Dahab Atmosphere', ar: 'أجواء دهب' },
  'planner.visual.step3.title': { en: 'Comfort, adventure, and local soul.', ar: 'راحة، مغامرة، وروح المكان الحقيقية.' },
  'planner.visual.step3.cardTitle': { en: 'Balanced Sinai Value', ar: 'قيمة حقيقية في سيناء' },
  'planner.visual.step3.cardText': { en: 'A great trip doesn’t have to mean spending more. We prioritize memorable local experiences, soulful cafes, and welcoming stays.', ar: 'الرحلة الحلوة مش شرط تكلف كتير.. بنهتم بالتجارب المحلية الأصيلة والأماكن الدافية.' },

  'planner.visual.step4.badge': { en: 'Sinai Experiences', ar: 'تجارب سيناء' },
  'planner.visual.step4.title': { en: 'Diving, desert safaris, and seaside pace.', ar: 'غطس، سفاري في الصحراء، وروقان ع الشاطئ.' },
  'planner.visual.step4.cardTitle': { en: 'Tailored to Your Passions', ar: 'متفصلة على اهتماماتك' },
  'planner.visual.step4.cardText': { en: 'Your interests shape the trip we build for you. We curate reef diving, canyon trekking, and seaside cafes around what you love.', ar: 'اهتماماتك هي اللي بتشكل رحلتك.. بننسق الغطس وجولات الكانيونز والمطاعم حسب اللي بتحبه.' },

  'planner.visual.step5.badge': { en: 'Daily Rhythm', ar: 'إيقاع اليوم' },
  'planner.visual.step5.title': { en: 'A little adventure. A little time to breathe.', ar: 'شوية مغامرة.. وشوية وقت تتنفس وتروق فيه.' },
  'planner.visual.step5.cardTitle': { en: 'Daily Rhythm & Free Time', ar: 'إيقاع متوازن ووقت حر' },
  'planner.visual.step5.cardText': { en: 'A little adventure. A little time to breathe. We balance exciting diving and desert activities with plenty of room to unwind by the sea.', ar: 'بنوازن بين الغطس والسفاري ومساحات كافية للاسترخاء ع البحر.' },

  // Verification Badges & Provenance
  'badge.regulatoryVerified': { en: 'REGULATORY VERIFIED', ar: 'موثق تنظيميًا (CDWS)' },
  'badge.supplierConfirmed': { en: 'SUPPLIER CONFIRMED', ar: 'مؤكد من المورد' },
  'badge.webConfirmed': { en: 'WEB CONFIRMED', ar: 'مؤكد من الموقع الرسمي' },
  'badge.instagramReported': { en: 'INSTAGRAM REPORTED', ar: 'منشور عبر Instagram' },
  'badge.sourceReported': { en: 'SOURCE REPORTED', ar: 'مرصود من المطبوعات المحلية' },
  'badge.needsConfirmation': { en: 'NEEDS CONFIRMATION', ar: 'يحتاج تأكيد قبل الحجز' },
  'badge.unverifiedRegulatoryClaim': { en: 'UNVERIFIED REGULATORY CLAIM', ar: 'ادعاء ترخيص غير مؤكد' },

  // Pricing Semantics
  'pricing.advertisedPrice': { en: 'Advertised Price', ar: 'السعر المعلن' },
  'pricing.observedMarketPrice': { en: 'Observed Market Price', ar: 'السعر المرصود بالسوق' },
  'pricing.supplierReportedPrice': { en: 'Supplier-Reported Price', ar: 'السعر المنشور من المورد' },
  'pricing.priceRequiresConfirmation': { en: 'Availability & price require confirmation', ar: 'التوافر والأسعار تخضع للتأكيد' },
  'pricing.basis.perPerson': { en: 'Per Person', ar: 'للفرد' },
  'pricing.basis.single': { en: 'Single Occupancy', ar: 'فردي (Single)' },
  'pricing.basis.double': { en: 'Double Occupancy', ar: 'زوجي (Double)' },
  'pricing.basis.perRoomNight': { en: 'Per Room / Night', ar: 'للغرفة / ليلة' },
  'pricing.basis.perGroup': { en: 'Per Group / Vehicle', ar: 'للمجموعة / للسيارة' },

  // Commerce Comparison & Smart Recommendations
  'commerce.compare.title': { en: 'Offer & Supplier Comparison Engine', ar: 'محرك مقارنة العروض والموردين' },
  'commerce.compare.subtitle': { en: 'Multi-dimensional weighted ranking grounded in verified pricing, freshness, and regulatory clearance.', ar: 'مقارنة وترتيب متعدد الأبعاد مبني على الأسعار المرصودة، الحداثة، والتوثيق التنظيمي.' },
  'commerce.compare.bestMatch': { en: 'Best Match', ar: 'أنسب اختيار' },
  'commerce.compare.bestValue': { en: 'Best Value', ar: 'أفضل قيمة' },
  'commerce.compare.lowestObservedPrice': { en: 'Lowest Observed Price', ar: 'أقل سعر مرصود' },
  'commerce.compare.mostVerified': { en: 'Most Verified', ar: 'الأعلى توثيقًا' },
  'commerce.compare.mostRecent': { en: 'Most Recent', ar: 'أحدث عرض' },
  'commerce.compare.bestScheduleMatch': { en: 'Best Schedule Match', ar: 'أفضل توافق زمني' },
  'commerce.instagramNotice': { en: 'This offer was discovered from the supplier\'s Instagram account. Price is published by the supplier and requires confirmation before booking.', ar: 'تم رصد هذا العرض من حساب المورد الموثق على Instagram. السعر منشور من المورد ويحتاج تأكيد التوافر قبل الحجز النهائي.' },
  'commerce.marketStats.title': { en: 'Dahab Market Price Intelligence', ar: 'إحصائيات أسعار سوق دهب' },
  'commerce.marketStats.observedMarketData': { en: 'Observed Market Data', ar: 'بيانات السوق المرصودة' },

  // The generated-itinerary screen. Every one of these keys was missing, so
  // `t(key, fallback)` returned the English fallback and the whole trip preview
  // rendered in English inside an otherwise Arabic flow.
  'itinerary.badge.personalized': { en: 'Personalized Trip', ar: 'رحلة مصمّمة ليك' },
  'itinerary.btn.editPreferences': { en: 'Edit preferences', ar: 'عدّل تفضيلاتك' },
  'itinerary.btn.approveTrip': { en: 'Approve Trip', ar: 'اعتمد الرحلة' },
  'itinerary.btn.tripApproved': { en: 'Trip Approved', ar: 'الرحلة معتمدة' },
  'itinerary.badge.curatedForYou': { en: 'Curated For You', ar: 'مختارة مخصوص ليك' },
  'itinerary.mainTitle': { en: 'We built this Dahab trip for you.', ar: 'بنينالك رحلة دهب دي على مقاسك.' },
  'itinerary.subTitle': { en: 'A balanced experience with diving, adventure, local food, and enough time to slow down.', ar: 'تجربة متوازنة فيها غطس ومغامرة وأكل بلدي، ووقت كفاية تروق فيه.' },
  'itinerary.status.label': { en: 'Status', ar: 'الحالة' },
  'itinerary.status.suggested': { en: 'Suggested itinerary', ar: 'جدول مقترح' },
  'itinerary.status.suggestedDesc': { en: 'Review and approve your trip before booking. Everything is fully flexible.', ar: 'راجع الرحلة واعتمدها قبل الحجز. كل حاجة قابلة للتعديل.' },
  'itinerary.btn.customize': { en: 'Customize Trip', ar: 'عدّل الرحلة' },
  'itinerary.status.approved': { en: 'Trip approved', ar: 'الرحلة معتمدة' },
  'itinerary.status.readyForBooking': { en: 'Ready for booking', ar: 'جاهزة للحجز' },
  'itinerary.btn.continueBooking': { en: 'Continue to Booking', ar: 'كمّل للحجز' },
  'itinerary.bottom.readyTitle': { en: 'Ready to lock in your Dahab journey?', ar: 'جاهز تثبّت رحلتك في دهب؟' },
  'itinerary.bottom.readyDesc': { en: 'Review and approve this personalized blueprint. You will review accommodation and transfer booking details in the next step.', ar: 'راجع الخطة دي واعتمدها. هتراجع تفاصيل الإقامة والانتقالات في الخطوة اللي بعدها.' },
  'itinerary.btn.keepEditing': { en: 'Keep Editing', ar: 'كمّل تعديل' },
  'itinerary.sidebar.blueprintTitle': { en: 'Trip Blueprint', ar: 'مخطط الرحلة' },
  'itinerary.sidebar.destination': { en: 'Destination', ar: 'الوجهة' },
  'itinerary.sidebar.destinationVal': { en: 'Dahab, South Sinai', ar: 'دهب، جنوب سيناء' },
  'itinerary.sidebar.duration': { en: 'Duration', ar: 'المدة' },
  'itinerary.sidebar.travelers': { en: 'Travelers', ar: 'المسافرون' },
  'itinerary.sidebar.budget': { en: 'Budget', ar: 'الميزانية' },
  'itinerary.sidebar.moderateBudget': { en: 'Moderate Budget', ar: 'ميزانية متوسطة' },
  'itinerary.sidebar.pace': { en: 'Pace', ar: 'الإيقاع' },
  'itinerary.sidebar.balancedPace': { en: 'Balanced', ar: 'متوازن' },
  'itinerary.sidebar.interests': { en: 'Selected Interests', ar: 'اهتماماتك' },
  'itinerary.sidebar.guaranteeTitle': { en: 'Sinai Local Host Guarantee', ar: 'ضمان المضيف المحلي في سيناء' },
  'itinerary.sidebar.guaranteeDesc': { en: 'All diving centers, desert drivers, and boat captains are vetted local Dahab professionals who prioritize safety and authentic hospitality.', ar: 'كل مراكز الغطس وسواقين الصحرا وقباطنة المراكب محليين من دهب ومتحقَّق منهم، وبيحطوا الأمان والضيافة الأصلية في الأول.' }
};

