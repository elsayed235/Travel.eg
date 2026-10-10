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
    eyebrowEn: 'Dahab · South Sinai',
    eyebrowAr: 'دهب · جنوب سينا',
    titleAEn: 'Where the desert',
    titleAAr: 'هنا الصحرا',
    titleBEn: 'meets the sea',
    titleBAr: 'بتقابل البحر',
    subtitleEn: 'Everything you need in Dahab — stays, tables, rides, reefs and desert — in one calm place.',
    subtitleAr: 'كل اللي محتاجه في دهب في مكان واحد: إقامة، وأكل، ومشاوير، وشعاب، وصحرا.',
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
    eyebrowEn: 'Nuweiba · Sinai',
    eyebrowAr: 'نويبع · سينا',
    titleAEn: 'A hut on the shore,',
    titleAAr: 'عشة على البحر،',
    titleBEn: 'and time is yours',
    titleBAr: 'والوقت ملكك',
    subtitleEn: 'Calm sea, soft mountains and days with nothing on the schedule: camps, shallow reefs and starry nights.',
    subtitleAr: 'بحر رايق، وجبال هادية، وأيام من غير برنامج: كامبات، وشعاب قريبة، ونجوم بالليل.',
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
    eyebrowEn: 'Siwa · Western Desert',
    eyebrowAr: 'سيوة · الصحرا الغربية',
    titleAEn: 'An oasis',
    titleAAr: 'واحة',
    titleBEn: 'that heals',
    titleBAr: 'بتداوي',
    subtitleEn: 'Salt lakes you float in, warm springs and palm groves at the edge of the Great Sand Sea.',
    subtitleAr: 'بحيرات ملح بتطفو فيها، وعيون دافية، ونخل على حافة بحر الرمال الأعظم.',
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
    required this.eyebrowEn,
    required this.eyebrowAr,
    required this.titleAEn,
    required this.titleAAr,
    required this.titleBEn,
    required this.titleBAr,
    required this.subtitleEn,
    required this.subtitleAr,
    required this.taglineEn,
    required this.taglineAr,
    required this.heroImagePath,
    required this.liveCatalogue,
    required this.tempo,
    required this.curve,
  });

  final String nameEn;
  final String nameAr;
  final String eyebrowEn;
  final String eyebrowAr;
  final String titleAEn;
  final String titleAAr;
  final String titleBEn;
  final String titleBAr;
  final String subtitleEn;
  final String subtitleAr;
  final String taglineEn;
  final String taglineAr;

  /// Bundled asset: the hero must paint offline and on the first frame.
  final String heroImagePath;

  final bool liveCatalogue;

  /// How motion feels here: Dahab lively, Nuweiba still, Siwa like a breath.
  final Duration tempo;
  final Curve curve;

  String label(bool arabic) => arabic ? nameAr : nameEn;
  String eyebrow(bool arabic) => arabic ? eyebrowAr : eyebrowEn;
  String titleA(bool arabic) => arabic ? titleAAr : titleAEn;
  String titleB(bool arabic) => arabic ? titleBAr : titleBEn;
  String subtitle(bool arabic) => arabic ? subtitleAr : subtitleEn;
  String tagline(bool arabic) => arabic ? taglineAr : taglineEn;

  static RehlaDestination fromName(String? value) =>
      RehlaDestination.values.asNameMap()[value] ?? RehlaDestination.dahab;
}
