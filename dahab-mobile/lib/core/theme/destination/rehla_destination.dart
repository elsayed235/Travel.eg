import 'package:flutter/animation.dart';

/// The places REHLA covers (website: src/design/destinations.ts). Dahab is the
/// default and the only one with a live catalogue today; Nuweiba and Siwa open
/// with editorial content (`liveCatalogue == false`), which screens use to set
/// expectations honestly.
///
/// Colour lives in [RehlaPalettes]; this holds what code needs: names, copy,
/// imagery and the motion personality of each place.
enum RehlaDestination {
  dahab(
    nameEn: 'Dahab',
    nameAr: 'دهب',
    taglineEn: 'Where the desert meets the sea',
    taglineAr: 'هنا الصحرا بتقابل البحر',
    heroImagePath: 'assets/images/places/hero-dahab.jpg',
    liveCatalogue: true,
    tempo: Duration(milliseconds: 520),
    curve: Cubic(0.34, 1.3, 0.64, 1),
  ),
  nuweiba(
    nameEn: 'Nuweiba',
    nameAr: 'نويبع',
    taglineEn: 'A hut on the shore, and time is yours',
    taglineAr: 'عشة على البحر، والوقت ملكك',
    heroImagePath: 'assets/images/places/hero-nuweiba.webp',
    liveCatalogue: false,
    tempo: Duration(milliseconds: 800),
    curve: Cubic(0.45, 0, 0.2, 1),
  ),
  siwa(
    nameEn: 'Siwa',
    nameAr: 'سيوة',
    taglineEn: 'An oasis that heals',
    taglineAr: 'واحة بتداوي',
    heroImagePath: 'assets/images/places/hero-siwa.webp',
    liveCatalogue: false,
    tempo: Duration(milliseconds: 1100),
    curve: Cubic(0.37, 0, 0.2, 1),
  );

  const RehlaDestination({
    required this.nameEn,
    required this.nameAr,
    required this.taglineEn,
    required this.taglineAr,
    required this.heroImagePath,
    required this.liveCatalogue,
    required this.tempo,
    required this.curve,
  });

  final String nameEn;
  final String nameAr;
  final String taglineEn;
  final String taglineAr;

  /// Bundled asset: the hero must paint offline and on the first frame.
  final String heroImagePath;
  final bool liveCatalogue;

  /// How motion feels here: Dahab lively, Nuweiba still, Siwa like a breath.
  final Duration tempo;
  final Curve curve;

  String label(bool arabic) => arabic ? nameAr : nameEn;
  String tagline(bool arabic) => arabic ? taglineAr : taglineEn;

  static RehlaDestination fromName(String? value) =>
      RehlaDestination.values.asNameMap()[value] ?? RehlaDestination.dahab;
}
