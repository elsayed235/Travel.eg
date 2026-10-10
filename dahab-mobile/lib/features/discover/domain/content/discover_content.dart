import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/discover/domain/models/discover_door.dart';
import 'package:rehla/features/discover/domain/models/editorial_pick.dart';
import 'package:rehla/features/discover/domain/models/story_frame.dart';
import 'package:rehla/features/plan/domain/models/plan_vibe.dart';

/// Editorial home content per destination, mirroring the website
/// (src/data/destinationEditorial.ts). Arabic is light Egyptian colloquial.
/// Images are bundled so the first screen paints offline.
class DiscoverContent {
  const DiscoverContent._();

  static const _img = 'assets/images/places';

  static List<DiscoverDoor> doors(RehlaDestination d) => switch (d) {
    RehlaDestination.dahab => const [
      DiscoverDoor(
        id: 'dive',
        labelEn: 'Dive & snorkel',
        labelAr: 'غطس وسنوركل',
        planVibes: [PlanVibe.diving, PlanVibe.sea],
      ),
      DiscoverDoor(
        id: 'kite',
        labelEn: 'Kite & wind',
        labelAr: 'كايت',
        planVibes: [PlanVibe.adventure, PlanVibe.sea],
      ),
      DiscoverDoor(
        id: 'desert',
        labelEn: 'Desert & Sinai',
        labelAr: 'صحرا وسينا',
        planVibes: [PlanVibe.desert, PlanVibe.adventure],
      ),
      DiscoverDoor(
        id: 'stay',
        labelEn: 'Stay',
        labelAr: 'إقامة',
        askEn: 'Where should I stay in Dahab?',
        askAr: 'أنزل فين في دهب؟',
      ),
      DiscoverDoor(
        id: 'food',
        labelEn: 'Food',
        labelAr: 'أكل',
        askEn: 'Where should I eat in Dahab tonight?',
        askAr: 'آكل فين في دهب النهارده؟',
      ),
      DiscoverDoor(
        id: 'bike',
        labelEn: 'Bike rentals',
        labelAr: 'إيجار عجل',
        askEn: 'How do I rent a bike in Dahab?',
        askAr: 'أأجّر عجلة في دهب إزاي؟',
      ),
      DiscoverDoor(
        id: 'rides',
        labelEn: 'Rides & airport',
        labelAr: 'مشاوير ومطار',
        askEn: 'How do I get from Sharm airport to Dahab?',
        askAr: 'أروح من مطار شرم لدهب إزاي؟',
      ),
      DiscoverDoor(
        id: 'help',
        labelEn: 'Help & SOS',
        labelAr: 'مساعدة وطوارئ',
        askEn: 'I need help in Dahab',
        askAr: 'محتاج مساعدة في دهب',
      ),
    ],
    RehlaDestination.nuweiba => const [
      DiscoverDoor(
        id: 'camps',
        labelEn: 'Beach camps',
        labelAr: 'كامبات',
        planVibes: [PlanVibe.unplug, PlanVibe.sea],
      ),
      DiscoverDoor(
        id: 'snorkel',
        labelEn: 'Snorkel',
        labelAr: 'سنوركل',
        planVibes: [PlanVibe.sea],
      ),
      DiscoverDoor(
        id: 'canyons',
        labelEn: 'Canyons',
        labelAr: 'كانيونات',
        planVibes: [PlanVibe.nature, PlanVibe.adventure],
      ),
      DiscoverDoor(
        id: 'stars',
        labelEn: 'Stars',
        labelAr: 'نجوم',
        planVibes: [PlanVibe.stars],
      ),
      DiscoverDoor(
        id: 'unplug',
        labelEn: 'Unplug',
        labelAr: 'فصلان',
        planVibes: [PlanVibe.unplug],
      ),
      DiscoverDoor(
        id: 'desert',
        labelEn: 'Desert',
        labelAr: 'صحرا',
        planVibes: [PlanVibe.desert],
      ),
    ],
    RehlaDestination.siwa => const [
      DiscoverDoor(
        id: 'springs',
        labelEn: 'Springs',
        labelAr: 'عيون',
        planVibes: [PlanVibe.wellness],
      ),
      DiscoverDoor(
        id: 'salt',
        labelEn: 'Salt lakes',
        labelAr: 'بحيرات الملح',
        planVibes: [PlanVibe.wellness],
      ),
      DiscoverDoor(
        id: 'safari',
        labelEn: 'Sand sea',
        labelAr: 'بحر الرمال',
        planVibes: [PlanVibe.desert, PlanVibe.adventure],
      ),
      DiscoverDoor(
        id: 'heritage',
        labelEn: 'Heritage',
        labelAr: 'تاريخ',
        planVibes: [PlanVibe.culture],
      ),
      DiscoverDoor(
        id: 'wellness',
        labelEn: 'Wellness',
        labelAr: 'استشفاء',
        planVibes: [PlanVibe.wellness, PlanVibe.unplug],
      ),
      DiscoverDoor(
        id: 'stars',
        labelEn: 'Stars',
        labelAr: 'نجوم',
        planVibes: [PlanVibe.stars],
      ),
    ],
  };

  static List<EditorialPick> picks(RehlaDestination d) => switch (d) {
    RehlaDestination.dahab => const [
      EditorialPick(
        id: 'dh-blue-hole',
        titleEn: 'Snorkel the Blue Hole rim',
        titleAr: 'سنوركل على حافة البلو هول',
        metaEn: 'Morning · calm water',
        metaAr: 'الصبح · الميّة هادية',
        image: '$_img/blue-hole-aerial.webp',
        vibes: [PlanVibe.sea, PlanVibe.diving],
      ),
      EditorialPick(
        id: 'dh-abu-galum',
        titleEn: 'Walk to Ras Abu Galum',
        titleAr: 'مشي لرأس أبو جالوم',
        metaEn: 'Full day · by the coast',
        metaAr: 'يوم كامل · على الساحل',
        image: '$_img/ras-abu-galum.webp',
        vibes: [PlanVibe.nature, PlanVibe.adventure],
      ),
      EditorialPick(
        id: 'dh-sinai-sunrise',
        titleEn: 'Sunrise on Mount Sinai',
        titleAr: 'الشروق من فوق جبل موسى',
        metaEn: 'Overnight · warm layers',
        metaAr: 'طول الليل · هات تقيل',
        image: '$_img/st-catherine.webp',
        vibes: [PlanVibe.desert, PlanVibe.culture],
      ),
    ],
    RehlaDestination.nuweiba => const [
      EditorialPick(
        id: 'nw-shore-snorkel',
        titleEn: 'Snorkel straight from your camp',
        titleAr: 'سنوركل من قدام الكامب على طول',
        metaEn: 'House reef · any time of day',
        metaAr: 'شعاب قريبة · في أي وقت',
        image: '$_img/house-reef.webp',
        vibes: [PlanVibe.sea],
      ),
      EditorialPick(
        id: 'nw-colored-canyon',
        titleEn: 'Walk the Colored Canyon',
        titleAr: 'مشي في الكانيون الملوّن',
        metaEn: 'Half day · early start',
        metaAr: 'نص يوم · بدري',
        image: '$_img/colored-canyon.webp',
        vibes: [PlanVibe.nature, PlanVibe.adventure],
      ),
      EditorialPick(
        id: 'nw-fire-stars',
        titleEn: 'Bedouin dinner and stars',
        titleAr: 'عشا بدوي ونجوم',
        metaEn: 'Evening · at the camp',
        metaAr: 'بالليل · في الكامب',
        image: '$_img/story-campfire.webp',
        vibes: [PlanVibe.stars],
      ),
    ],
    RehlaDestination.siwa => const [
      EditorialPick(
        id: 'sw-sand-sea',
        titleEn: 'Into the Great Sand Sea',
        titleAr: 'جوه بحر الرمال الأعظم',
        metaEn: 'Afternoon to night · 4x4',
        metaAr: 'من العصر للّيل · دفع رباعي',
        image: '$_img/book-desert-camp-2.webp',
        vibes: [PlanVibe.desert, PlanVibe.adventure],
      ),
      EditorialPick(
        id: 'sw-salt-float',
        titleEn: 'Float in the salt lakes',
        titleAr: 'تطفو في بحيرات الملح',
        metaEn: 'Half day · bring a towel',
        metaAr: 'نص يوم · هات فوطة',
        image: '$_img/hero-siwa.webp',
        vibes: [PlanVibe.wellness],
      ),
      EditorialPick(
        id: 'sw-campfire',
        titleEn: 'Tea on the coals, stars above',
        titleAr: 'شاي على الفحم ونجوم فوقك',
        metaEn: 'Evening · in the dunes',
        metaAr: 'بالليل · وسط الكثبان',
        image: '$_img/story-campfire.webp',
        vibes: [PlanVibe.stars, PlanVibe.unplug],
      ),
    ],
  };

  /// Frames we actually ship in the app bundle. Captions follow the website
  /// where the photograph is the same subject.
  static List<StoryFrame> stories(RehlaDestination d) => switch (d) {
    RehlaDestination.dahab => const [
      StoryFrame(image: '$_img/blue-hole-aerial.webp', captionEn: 'The Blue Hole', captionAr: 'البلو هول'),
      StoryFrame(image: '$_img/house-reef.webp', captionEn: 'Morning reef light', captionAr: 'نور الشعاب الصبح'),
      StoryFrame(image: '$_img/ras-abu-galum.webp', captionEn: 'The coast path', captionAr: 'الطريق على الساحل'),
      StoryFrame(image: '$_img/st-catherine.webp', captionEn: 'Dawn on the mountain', captionAr: 'الشروق من الجبل'),
      StoryFrame(image: '$_img/story-campfire.webp', captionEn: 'Fire after dark', captionAr: 'نار بعد المغرب'),
    ],
    RehlaDestination.nuweiba => const [
      StoryFrame(image: '$_img/hero-nuweiba.webp', captionEn: 'Shade, sand and the gulf', captionAr: 'ضل ورملة والخليج'),
      StoryFrame(image: '$_img/house-reef.webp', captionEn: 'First swim of the day', captionAr: 'أول عومة في اليوم'),
      StoryFrame(image: '$_img/colored-canyon.webp', captionEn: 'Canyon colours', captionAr: 'ألوان الكانيون'),
      StoryFrame(image: '$_img/story-campfire.webp', captionEn: 'Fire after dark', captionAr: 'نار بعد المغرب'),
    ],
    RehlaDestination.siwa => const [
      StoryFrame(image: '$_img/hero-siwa.webp', captionEn: 'The sand sea begins', captionAr: 'هنا بيبدأ بحر الرمال'),
      StoryFrame(image: '$_img/book-desert-camp-2.webp', captionEn: 'Camp in the dunes', captionAr: 'كامب وسط الكثبان'),
      StoryFrame(image: '$_img/story-campfire.webp', captionEn: 'Tea on the coals', captionAr: 'شاي على الفحم'),
    ],
  };
}
