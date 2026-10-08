import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';

/// The plan the traveler kept. This is what the Trip tab shows until
/// operations confirm it with local hosts.
class KeptTrip {
  final String id;
  final RehlaDestination destination;
  final String titleEn;
  final String titleAr;
  final String taglineEn;
  final String taglineAr;
  final int durationDays;
  final num startingPriceEgp;
  final bool priceIsEstimate;
  final String heroImage;
  final List<ProgrammeDay> days;

  /// True after the plan was sent to the operations team.
  final bool sent;

  const KeptTrip({
    required this.id,
    required this.destination,
    required this.titleEn,
    required this.titleAr,
    required this.taglineEn,
    required this.taglineAr,
    required this.durationDays,
    required this.startingPriceEgp,
    required this.priceIsEstimate,
    required this.heroImage,
    required this.days,
    required this.sent,
  });

  String title(bool arabic) => arabic ? titleAr : titleEn;
  String tagline(bool arabic) => arabic ? taglineAr : taglineEn;

  KeptTrip copyWith({bool? sent}) => KeptTrip(
    id: id,
    destination: destination,
    titleEn: titleEn,
    titleAr: titleAr,
    taglineEn: taglineEn,
    taglineAr: taglineAr,
    durationDays: durationDays,
    startingPriceEgp: startingPriceEgp,
    priceIsEstimate: priceIsEstimate,
    heroImage: heroImage,
    days: days,
    sent: sent ?? this.sent,
  );

  factory KeptTrip.fromProgramme(ProgrammeDomainModel programme, {bool sent = false}) {
    return KeptTrip(
      id: programme.id,
      destination: programme.destination,
      titleEn: programme.titleEn,
      titleAr: programme.titleAr,
      taglineEn: programme.taglineEn,
      taglineAr: programme.taglineAr,
      durationDays: programme.durationDays,
      startingPriceEgp: programme.startingPriceEgp,
      priceIsEstimate: programme.priceIsEstimate,
      heroImage: programme.heroImage,
      days: programme.days,
      sent: sent,
    );
  }

  /// Enough of the programme for the same request the planner already sends.
  ProgrammeDomainModel toProgramme() {
    return ProgrammeDomainModel(
      id: id,
      destination: destination,
      priceIsEstimate: priceIsEstimate,
      titleEn: titleEn,
      titleAr: titleAr,
      taglineEn: taglineEn,
      taglineAr: taglineAr,
      durationDays: durationDays,
      idealForEn: '',
      pace: PlanPace.balanced,
      intensityScore: 1,
      freeTimeScore: 0,
      startingPriceEgp: startingPriceEgp,
      heroImage: heroImage,
      badgeEn: '',
      badgeAr: '',
      highlightsEn: const [],
      highlightsAr: const [],
      includedEn: const [],
      includedAr: const [],
      interests: const [],
      budget: PlanBudget.moderate,
      days: days,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'destination': destination.name,
    'titleEn': titleEn,
    'titleAr': titleAr,
    'taglineEn': taglineEn,
    'taglineAr': taglineAr,
    'durationDays': durationDays,
    'startingPriceEgp': startingPriceEgp,
    'priceIsEstimate': priceIsEstimate,
    'heroImage': heroImage,
    'sent': sent,
    'days': [
      for (final d in days)
        {
          'day': d.day,
          'titleEn': d.titleEn,
          'titleAr': d.titleArRaw,
          'subtitleEn': d.subtitleEn,
          'subtitleAr': d.subtitleArRaw,
          'highlightsEn': d.highlightsEn,
          'highlightsAr': d.highlightsArRaw,
        },
    ],
  };

  static KeptTrip? fromJson(Map<String, dynamic> json) {
    final destination = RehlaDestination.values.asNameMap()[json['destination']];
    if (destination == null) return null;
    final rawDays = json['days'];
    final days = <ProgrammeDay>[];
    if (rawDays is List) {
      for (final item in rawDays) {
        if (item is! Map) continue;
        final map = Map<String, dynamic>.from(item);
        days.add(
          ProgrammeDay(
            day: (map['day'] as num?)?.toInt() ?? days.length + 1,
            titleEn: map['titleEn'] as String? ?? '',
            titleArRaw: map['titleAr'] as String?,
            subtitleEn: map['subtitleEn'] as String? ?? '',
            subtitleArRaw: map['subtitleAr'] as String?,
            highlightsEn: _strings(map['highlightsEn']),
            highlightsArRaw: map['highlightsAr'] == null ? null : _strings(map['highlightsAr']),
            timeEstimate: '',
          ),
        );
      }
    }
    return KeptTrip(
      id: json['id'] as String? ?? '',
      destination: destination,
      titleEn: json['titleEn'] as String? ?? '',
      titleAr: json['titleAr'] as String? ?? '',
      taglineEn: json['taglineEn'] as String? ?? '',
      taglineAr: json['taglineAr'] as String? ?? '',
      durationDays: (json['durationDays'] as num?)?.toInt() ?? days.length,
      startingPriceEgp: json['startingPriceEgp'] as num? ?? 0,
      priceIsEstimate: json['priceIsEstimate'] as bool? ?? true,
      heroImage: json['heroImage'] as String? ?? '',
      days: days,
      sent: json['sent'] as bool? ?? false,
    );
  }

  static List<String> _strings(dynamic value) {
    if (value is! List) return const [];
    return [for (final e in value) if (e is String) e];
  }
}
