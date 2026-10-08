import 'package:rehla/core/models/domain_model/base_domain_model.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';

/// One day of a programme. Older Dahab programmes carry English only, so the
/// Arabic getters fall back to it.
class ProgrammeDay {
  final int day;
  final String titleEn;
  final String? titleArRaw;
  final String subtitleEn;
  final String? subtitleArRaw;
  final List<String> highlightsEn;
  final List<String>? highlightsArRaw;
  final String timeEstimate;

  const ProgrammeDay({
    required this.day,
    required this.titleEn,
    this.titleArRaw,
    required this.subtitleEn,
    this.subtitleArRaw,
    required this.highlightsEn,
    this.highlightsArRaw,
    required this.timeEstimate,
  });

  String title(bool arabic) => arabic ? (titleArRaw ?? titleEn) : titleEn;
  String subtitle(bool arabic) => arabic ? (subtitleArRaw ?? subtitleEn) : subtitleEn;
  List<String> highlights(bool arabic) => arabic ? (highlightsArRaw ?? highlightsEn) : highlightsEn;
}

/// A ready-made programme (GET /api/dahab/content/programmes).
class ProgrammeDomainModel extends BaseDomainModel<ProgrammeDomainModel> {
  final String id;
  final RehlaDestination destination;

  /// True while no supplier quotes it yet: the price is an editorial estimate.
  final bool priceIsEstimate;
  final String titleEn;
  final String titleAr;
  final String taglineEn;
  final String taglineAr;
  final int durationDays;
  final String idealForEn;
  final PlanPace pace;

  /// 1 (gentle) to 5 (demanding).
  final int intensityScore;

  /// Share of the trip left free, in percent.
  final int freeTimeScore;
  final num startingPriceEgp;

  /// Path on the API host (`/images/...`), or empty.
  final String heroImage;
  final String badgeEn;
  final String badgeAr;
  final List<String> highlightsEn;
  final List<String> highlightsAr;
  final List<String> includedEn;
  final List<String> includedAr;
  final List<String> interests;
  final PlanBudget budget;
  final List<ProgrammeDay> days;

  const ProgrammeDomainModel({
    required this.id,
    required this.destination,
    required this.priceIsEstimate,
    required this.titleEn,
    required this.titleAr,
    required this.taglineEn,
    required this.taglineAr,
    required this.durationDays,
    required this.idealForEn,
    required this.pace,
    required this.intensityScore,
    required this.freeTimeScore,
    required this.startingPriceEgp,
    required this.heroImage,
    required this.badgeEn,
    required this.badgeAr,
    required this.highlightsEn,
    required this.highlightsAr,
    required this.includedEn,
    required this.includedAr,
    required this.interests,
    required this.budget,
    required this.days,
  });

  String title(bool arabic) => arabic ? titleAr : titleEn;
  String tagline(bool arabic) => arabic ? taglineAr : taglineEn;
  String badge(bool arabic) => arabic ? badgeAr : badgeEn;
  List<String> highlights(bool arabic) => arabic && highlightsAr.isNotEmpty ? highlightsAr : highlightsEn;
  List<String> included(bool arabic) => arabic && includedAr.isNotEmpty ? includedAr : includedEn;
}
