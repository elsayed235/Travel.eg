// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:rehla/core/models/api_model/base_api_model.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';

part 'programme_model.freezed.dart';
part 'programme_model.g.dart';

@freezed
class ProgrammeDayModel with _$ProgrammeDayModel {
  const ProgrammeDayModel._();

  @JsonSerializable(explicitToJson: true)
  const factory ProgrammeDayModel({
    required int day,
    @Default('') String title,
    String? titleAr,
    @Default('') String subtitle,
    String? subtitleAr,
    @Default([]) List<String> highlights,
    List<String>? highlightsAr,
    @Default('') String timeEstimate,
  }) = _ProgrammeDayModel;

  factory ProgrammeDayModel.fromJson(Map<String, dynamic> json) => _$ProgrammeDayModelFromJson(json);

  ProgrammeDay toDomain() => ProgrammeDay(
    day: day,
    titleEn: title,
    titleArRaw: titleAr,
    subtitleEn: subtitle,
    subtitleArRaw: subtitleAr,
    highlightsEn: highlights,
    highlightsArRaw: highlightsAr,
    timeEstimate: timeEstimate,
  );
}

/// Wire shape of a ready-made programme (server/db/seeds/editorialContent.ts).
@freezed
class ProgrammeModel extends BaseApiModel<ProgrammeDomainModel> with _$ProgrammeModel {
  const ProgrammeModel._();

  @JsonSerializable(explicitToJson: true)
  const factory ProgrammeModel({
    required String id,
    String? destination,
    @Default(false) bool priceIsEstimate,
    @Default('') String title,
    @Default('') String titleAr,
    @Default('') String tagline,
    @Default('') String taglineAr,
    @Default(1) int durationDays,
    @Default('') String idealFor,
    String? pace,
    @Default(3) int intensityScore,
    @Default(0) int freeTimeScore,
    @Default(0) num startingPriceEGP,
    @Default('') String heroImage,
    @Default('') String badge,
    @Default('') String badgeAr,
    @Default([]) List<String> highlights,
    @Default([]) List<String> highlightsAr,
    @Default([]) List<String> includedItems,
    @Default([]) List<String> includedItemsAr,
    @Default([]) List<String> defaultInterests,
    String? defaultBudget,
    @Default([]) List<ProgrammeDayModel> dayByDay,
  }) = _ProgrammeModel;

  factory ProgrammeModel.fromJson(Map<String, dynamic> json) => _$ProgrammeModelFromJson(json);

  @override
  ProgrammeDomainModel toDomainModel() => ProgrammeDomainModel(
    id: id,
    // Absent means Dahab (the catalogue predates other destinations).
    destination: RehlaDestination.fromName(destination),
    priceIsEstimate: priceIsEstimate,
    titleEn: title,
    titleAr: titleAr.isEmpty ? title : titleAr,
    taglineEn: tagline,
    taglineAr: taglineAr.isEmpty ? tagline : taglineAr,
    durationDays: durationDays,
    idealForEn: idealFor,
    pace: PlanPace.fromWire(pace),
    intensityScore: intensityScore,
    freeTimeScore: freeTimeScore,
    startingPriceEgp: startingPriceEGP,
    heroImage: heroImage,
    badgeEn: badge,
    badgeAr: badgeAr.isEmpty ? badge : badgeAr,
    highlightsEn: highlights,
    highlightsAr: highlightsAr,
    includedEn: includedItems,
    includedAr: includedItemsAr,
    interests: defaultInterests,
    budget: PlanBudget.fromWire(defaultBudget),
    days: dayByDay.map((d) => d.toDomain()).toList(),
  );
}
