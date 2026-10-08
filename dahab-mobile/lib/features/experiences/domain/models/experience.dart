/// A sellable outing from GET /api/dahab/activities, joined to its place.
///
/// Everything shown about price, operator, slots and cancellation comes from
/// [bookable] — the commerce SKU checkout actually charges — never from the
/// activity's own editorial price.
class Experience {
  final String id;
  final String titleEn;
  final String titleAr;
  final String category;
  final String placeId;
  final String areaId;
  final String difficulty;
  final List<int> seasonalityMonths;
  final num? maxWindKnots;
  final bool requiresDaylight;
  final List<String> personas;
  final List<String> prepEn;
  final List<String> prepAr;
  final List<String> dependencies;
  final ExperienceBookable bookable;
  final ExperiencePlace? place;

  const Experience({
    required this.id,
    required this.titleEn,
    required this.titleAr,
    required this.category,
    required this.placeId,
    required this.areaId,
    required this.difficulty,
    required this.seasonalityMonths,
    required this.maxWindKnots,
    required this.requiresDaylight,
    required this.personas,
    required this.prepEn,
    required this.prepAr,
    required this.dependencies,
    required this.bookable,
    required this.place,
  });

  String title(bool arabic) => arabic && titleAr.isNotEmpty ? titleAr : titleEn;

  String prep(bool arabic, int i) => arabic && i < prepAr.length ? prepAr[i] : prepEn[i];

  int get durationMinutes => bookable.durationMinutes;

  bool openOn(DateTime day) => seasonalityMonths.isEmpty || seasonalityMonths.contains(day.month);

  /// Under the operator's wind limit at [knots]; true when no limit is set.
  bool windOk(num? knots) => maxWindKnots == null || knots == null || knots <= maxWindKnots!;

  bool get firstTimerFriendly =>
      difficulty == 'Beginner' ||
      difficulty == 'All Levels' ||
      RegExp(r'first.time|beginner|discover scuba', caseSensitive: false).hasMatch(titleEn);

  bool get isSunset => RegExp(r'sunset|stargaz|twilat', caseSensitive: false).hasMatch(titleEn);

  bool get isWater =>
      category == 'diving' ||
      category == 'water_sport' ||
      RegExp(r'snorkel|dive|boat|kite|surf|reef', caseSensitive: false).hasMatch(titleEn);

  /// Same matching the website uses (src/data/activityPhotos.ts): the photo
  /// follows the English title, specific places before generic kinds.
  String get webPhoto {
    for (final rule in _photos) {
      if (rule.$1.hasMatch(titleEn)) return rule.$2;
    }
    return '/images/attractions/blue-hole.jpg';
  }

  /// The closest bundled photo, for previews without a host or offline.
  String get assetPhoto {
    for (final rule in _assets) {
      if (rule.$1.hasMatch(titleEn)) return rule.$2;
    }
    return 'assets/images/places/hero-dahab.jpg';
  }

  static final _photos = <(RegExp, String)>[
    (RegExp('eel garden', caseSensitive: false), '/images/attractions/attr-eel-garden.webp'),
    (RegExp('three pools', caseSensitive: false), '/images/attractions/three-pools.jpg'),
    (RegExp('white canyon|colou?red canyon|wishwashi', caseSensitive: false), '/images/attractions/attr-colored-canyon.webp'),
    (RegExp('camel', caseSensitive: false), '/images/hero/camels-beach.jpg'),
    (RegExp('abu galum', caseSensitive: false), '/images/attractions/attr-ras-abu-galum.webp'),
    (RegExp('bells|blue hole.*dive|dive.*blue hole', caseSensitive: false), '/images/attractions/blue-hole-divers.jpg'),
    (RegExp('blue hole', caseSensitive: false), '/images/attractions/attr-blue-hole-aerial.webp'),
    (RegExp('canyon', caseSensitive: false), '/images/attractions/attr-reef-wall.webp'),
    (RegExp('glass bottom|napoleon', caseSensitive: false), '/images/attractions/coral-gardens.jpg'),
    (RegExp('discover scuba|try scuba|first.time', caseSensitive: false), '/images/hero/splash-underwater.webp'),
    (RegExp('lighthouse', caseSensitive: false), '/images/attractions/lighthouse-reef.jpg'),
    (RegExp('kite|wind|surf', caseSensitive: false), '/images/hero/blue-lagoon-kitesurf.jpg'),
    (RegExp('climb|boulder', caseSensitive: false), '/images/attractions/bouldering-wadi-gnai.jpg'),
    (RegExp('moses|catherine', caseSensitive: false), '/images/attractions/attr-st-catherine.webp'),
    (RegExp('quad', caseSensitive: false), '/images/attractions/sinai-desert-safari.jpg'),
    (RegExp('twilat|stargaz|sunset', caseSensitive: false), '/images/hero/conc-hero-sunset.webp'),
    (RegExp('airport|transfer', caseSensitive: false), '/images/attractions/attr-sinai-highway.webp'),
    (RegExp('bike|bicycle|cycling', caseSensitive: false), '/images/rentals/rent-bike.webp'),
    (RegExp('scuba|dive|diving', caseSensitive: false), '/images/attractions/experience-diving.jpg'),
    (RegExp('snorkel|reef', caseSensitive: false), '/images/attractions/attr-house-reef.webp'),
    (RegExp('desert|safari|jeep|4x4', caseSensitive: false), '/images/attractions/experience-desert.jpg'),
  ];

  static final _assets = <(RegExp, String)>[
    (RegExp('abu galum', caseSensitive: false), 'assets/images/places/ras-abu-galum.webp'),
    (RegExp('blue hole|bells', caseSensitive: false), 'assets/images/places/blue-hole-aerial.webp'),
    (RegExp('canyon|wishwashi', caseSensitive: false), 'assets/images/places/colored-canyon.webp'),
    (RegExp('moses|catherine', caseSensitive: false), 'assets/images/places/st-catherine.webp'),
    (RegExp('twilat|stargaz|quad|camp', caseSensitive: false), 'assets/images/places/story-campfire.webp'),
    (RegExp('desert|safari|climb|boulder|4x4', caseSensitive: false), 'assets/images/places/book-desert-camp-2.webp'),
    (RegExp('snorkel|reef|dive|scuba|pools|eel|boat', caseSensitive: false), 'assets/images/places/house-reef.webp'),
  ];

  factory Experience.fromJson(Map<String, dynamic> json, Map<String, ExperiencePlace> places) {
    final sens = _map(json['environmentalSensitivities']);
    final bookable = ExperienceBookable.fromJson(_map(json['bookable']) ?? const {}, json);
    final placeId = json['placeId'] as String? ?? '';
    return Experience(
      id: json['id'] as String? ?? '',
      titleEn: json['titleEn'] as String? ?? '',
      titleAr: json['titleAr'] as String? ?? '',
      category: json['category'] as String? ?? '',
      placeId: placeId,
      areaId: json['areaId'] as String? ?? '',
      difficulty: json['difficulty'] as String? ?? '',
      seasonalityMonths: _ints(json['seasonalityMonths']),
      maxWindKnots: sens?['maxWindKnots'] as num?,
      requiresDaylight: sens?['requiresDaylight'] == true,
      personas: _strings(json['travelerFitPersonas']),
      prepEn: _strings(json['preparationTips']),
      prepAr: _strings(json['preparationTipsAr']),
      dependencies: _strings(json['dependencies']),
      bookable: bookable,
      place: places[placeId],
    );
  }
}

class ExperienceBookable {
  final String skuId;
  final String serviceType;
  final num priceEgp;
  final String pricingBasis;
  final String supplierId;
  final String supplierEn;
  final String supplierAr;
  final int maxPerSlot;
  final int? cancellationHours;
  final int durationMinutes;
  final String descriptionEn;
  final String descriptionAr;
  final List<String> includedEn;
  final List<String> includedAr;
  final List<String> timeSlots;
  final String meetingEn;
  final String meetingAr;

  const ExperienceBookable({
    required this.skuId,
    required this.serviceType,
    required this.priceEgp,
    required this.pricingBasis,
    required this.supplierId,
    required this.supplierEn,
    required this.supplierAr,
    required this.maxPerSlot,
    required this.cancellationHours,
    required this.durationMinutes,
    required this.descriptionEn,
    required this.descriptionAr,
    required this.includedEn,
    required this.includedAr,
    required this.timeSlots,
    required this.meetingEn,
    required this.meetingAr,
  });

  bool get perPerson => pricingBasis == 'per_person';

  String supplier(bool arabic) => arabic && supplierAr.isNotEmpty ? supplierAr : supplierEn;
  String description(bool arabic) => arabic && descriptionAr.isNotEmpty ? descriptionAr : descriptionEn;
  String meeting(bool arabic) => arabic && meetingAr.isNotEmpty ? meetingAr : meetingEn;
  List<String> included(bool arabic) => arabic && includedAr.isNotEmpty ? includedAr : includedEn;

  num totalFor(int guests) => perPerson ? priceEgp * guests : priceEgp;

  /// Earliest slot as minutes after midnight, for ordering a day.
  int? get firstSlotMinutes => timeSlots.isEmpty ? null : slotMinutes(timeSlots.first);

  /// "03:30 PM" → 930; "15:30" → 930. Null for labels that are not a clock time.
  static int? slotMinutes(String slot) {
    final m = RegExp(r'^(\d{1,2}):(\d{2})\s*(AM|PM)?', caseSensitive: false).firstMatch(slot.trim());
    if (m == null) return null;
    var hours = int.parse(m.group(1)!);
    final suffix = m.group(3)?.toUpperCase();
    if (suffix != null) {
      hours = hours % 12;
      if (suffix == 'PM') hours += 12;
    }
    return hours * 60 + int.parse(m.group(2)!);
  }

  factory ExperienceBookable.fromJson(Map<String, dynamic> json, Map<String, dynamic> activity) {
    return ExperienceBookable(
      skuId: json['skuId'] as String? ?? '',
      serviceType: json['serviceType'] as String? ?? '',
      priceEgp: json['basePriceEGP'] as num? ?? 0,
      pricingBasis: json['pricingBasis'] as String? ?? 'per_person',
      supplierId: json['supplierId'] as String? ?? '',
      supplierEn: json['supplierName'] as String? ?? '',
      supplierAr: json['supplierNameAr'] as String? ?? '',
      maxPerSlot: (json['maxCapacityPerSlot'] as num?)?.toInt() ?? 1,
      cancellationHours: (json['cancellationPolicyHours'] as num?)?.toInt(),
      durationMinutes: (json['durationMinutes'] as num? ?? activity['durationMinutes'] as num? ?? 0).toInt(),
      descriptionEn: json['description'] as String? ?? '',
      descriptionAr: json['descriptionAr'] as String? ?? '',
      includedEn: _strings(json['includedItems']),
      includedAr: _strings(json['includedItemsAr']),
      timeSlots: _strings(json['timeSlots']),
      meetingEn: json['meetingPoint'] as String? ?? '',
      meetingAr: json['meetingPointAr'] as String? ?? '',
    );
  }
}

class ExperiencePlace {
  final String id;
  final String nameEn;
  final String nameAr;
  final double? lat;
  final double? lng;

  const ExperiencePlace({required this.id, required this.nameEn, required this.nameAr, this.lat, this.lng});

  String name(bool arabic) => arabic && nameAr.isNotEmpty ? nameAr : nameEn;

  factory ExperiencePlace.fromJson(Map<String, dynamic> json) {
    final c = _map(json['coordinates']);
    return ExperiencePlace(
      id: json['id'] as String? ?? '',
      nameEn: json['nameEn'] as String? ?? '',
      nameAr: json['nameAr'] as String? ?? '',
      lat: (c?['lat'] as num?)?.toDouble(),
      lng: (c?['lng'] as num?)?.toDouble(),
    );
  }
}

Map<String, dynamic>? _map(dynamic v) {
  if (v is Map<String, dynamic>) return v;
  if (v is Map) return Map<String, dynamic>.from(v);
  return null;
}

List<String> _strings(dynamic v) => v is List ? v.whereType<String>().toList() : const [];

List<int> _ints(dynamic v) => v is List ? v.whereType<num>().map((n) => n.toInt()).toList() : const [];
