// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'programme_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProgrammeDayModelImpl _$$ProgrammeDayModelImplFromJson(Map<String, dynamic> json) => _$ProgrammeDayModelImpl(
  day: (json['day'] as num).toInt(),
  title: json['title'] as String? ?? '',
  titleAr: json['titleAr'] as String?,
  subtitle: json['subtitle'] as String? ?? '',
  subtitleAr: json['subtitleAr'] as String?,
  highlights: (json['highlights'] as List<dynamic>?)?.map((e) => e as String).toList() ?? const [],
  highlightsAr: (json['highlightsAr'] as List<dynamic>?)?.map((e) => e as String).toList(),
  timeEstimate: json['timeEstimate'] as String? ?? '',
);

Map<String, dynamic> _$$ProgrammeDayModelImplToJson(_$ProgrammeDayModelImpl instance) => <String, dynamic>{
  'day': instance.day,
  'title': instance.title,
  'titleAr': instance.titleAr,
  'subtitle': instance.subtitle,
  'subtitleAr': instance.subtitleAr,
  'highlights': instance.highlights,
  'highlightsAr': instance.highlightsAr,
  'timeEstimate': instance.timeEstimate,
};

_$ProgrammeModelImpl _$$ProgrammeModelImplFromJson(Map<String, dynamic> json) => _$ProgrammeModelImpl(
  id: json['id'] as String,
  destination: json['destination'] as String?,
  priceIsEstimate: json['priceIsEstimate'] as bool? ?? false,
  title: json['title'] as String? ?? '',
  titleAr: json['titleAr'] as String? ?? '',
  tagline: json['tagline'] as String? ?? '',
  taglineAr: json['taglineAr'] as String? ?? '',
  durationDays: (json['durationDays'] as num?)?.toInt() ?? 1,
  idealFor: json['idealFor'] as String? ?? '',
  pace: json['pace'] as String?,
  intensityScore: (json['intensityScore'] as num?)?.toInt() ?? 3,
  freeTimeScore: (json['freeTimeScore'] as num?)?.toInt() ?? 0,
  startingPriceEGP: json['startingPriceEGP'] as num? ?? 0,
  heroImage: json['heroImage'] as String? ?? '',
  badge: json['badge'] as String? ?? '',
  badgeAr: json['badgeAr'] as String? ?? '',
  highlights: (json['highlights'] as List<dynamic>?)?.map((e) => e as String).toList() ?? const [],
  highlightsAr: (json['highlightsAr'] as List<dynamic>?)?.map((e) => e as String).toList() ?? const [],
  includedItems: (json['includedItems'] as List<dynamic>?)?.map((e) => e as String).toList() ?? const [],
  includedItemsAr: (json['includedItemsAr'] as List<dynamic>?)?.map((e) => e as String).toList() ?? const [],
  defaultInterests: (json['defaultInterests'] as List<dynamic>?)?.map((e) => e as String).toList() ?? const [],
  defaultBudget: json['defaultBudget'] as String?,
  dayByDay:
      (json['dayByDay'] as List<dynamic>?)
          ?.map((e) => ProgrammeDayModel.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
);

Map<String, dynamic> _$$ProgrammeModelImplToJson(_$ProgrammeModelImpl instance) => <String, dynamic>{
  'id': instance.id,
  'destination': instance.destination,
  'priceIsEstimate': instance.priceIsEstimate,
  'title': instance.title,
  'titleAr': instance.titleAr,
  'tagline': instance.tagline,
  'taglineAr': instance.taglineAr,
  'durationDays': instance.durationDays,
  'idealFor': instance.idealFor,
  'pace': instance.pace,
  'intensityScore': instance.intensityScore,
  'freeTimeScore': instance.freeTimeScore,
  'startingPriceEGP': instance.startingPriceEGP,
  'heroImage': instance.heroImage,
  'badge': instance.badge,
  'badgeAr': instance.badgeAr,
  'highlights': instance.highlights,
  'highlightsAr': instance.highlightsAr,
  'includedItems': instance.includedItems,
  'includedItemsAr': instance.includedItemsAr,
  'defaultInterests': instance.defaultInterests,
  'defaultBudget': instance.defaultBudget,
  'dayByDay': instance.dayByDay.map((e) => e.toJson()).toList(),
};
