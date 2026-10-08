import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/plan/domain/models/plan_vibe.dart';

enum PlanParty { solo, couple, friends, family }

/// Same names as the programmes' `pace` field on the server.
enum PlanPace {
  relaxed('Relaxed'),
  balanced('Balanced'),
  active('Active');

  const PlanPace(this.wire);
  final String wire;

  static PlanPace fromWire(String? v) =>
      PlanPace.values.firstWhere((p) => p.wire == v, orElse: () => PlanPace.balanced);
}

/// Same names as the programmes' `defaultBudget` field on the server.
enum PlanBudget {
  budget('Budget', 1200, 2500),
  moderate('Moderate', 2500, 5000),
  premium('Premium', 5000, 12000);

  const PlanBudget(this.wire, this.dailyFromEgp, this.dailyToEgp);
  final String wire;

  /// Indicative per-person-per-day band shown under the option; real totals
  /// come from the programme.
  final int dailyFromEgp;
  final int dailyToEgp;

  static PlanBudget fromWire(String? v) =>
      PlanBudget.values.firstWhere((b) => b.wire == v, orElse: () => PlanBudget.moderate);
}

/// The planner's questions, in order.
enum PlanStep { destination, when, party, vibes, pace, budget }

/// Which vibes make sense to offer per place: no diving question in Siwa.
const Map<RehlaDestination, List<PlanVibe>> vibesByDestination = {
  RehlaDestination.dahab: [
    PlanVibe.diving,
    PlanVibe.sea,
    PlanVibe.adventure,
    PlanVibe.desert,
    PlanVibe.food,
    PlanVibe.wellness,
    PlanVibe.culture,
    PlanVibe.stars,
  ],
  RehlaDestination.nuweiba: [
    PlanVibe.sea,
    PlanVibe.unplug,
    PlanVibe.nature,
    PlanVibe.stars,
    PlanVibe.desert,
    PlanVibe.adventure,
  ],
  RehlaDestination.siwa: [
    PlanVibe.wellness,
    PlanVibe.culture,
    PlanVibe.desert,
    PlanVibe.stars,
    PlanVibe.nature,
    PlanVibe.unplug,
    PlanVibe.adventure,
  ],
};

/// What the traveler told the planner. `null` means "not decided", which is a
/// valid answer ("Not sure yet") and scores neutrally.
class PlanAnswers {
  final RehlaDestination destination;
  final int? nights;
  final PlanParty? party;
  final List<PlanVibe> vibes;
  final PlanPace? pace;
  final PlanBudget? budget;

  const PlanAnswers({
    required this.destination,
    this.nights,
    this.party,
    this.vibes = const [],
    this.pace,
    this.budget,
  });

  /// Nullable fields are replaced through the `set*` flags so "clear it" and
  /// "leave it" stay distinguishable.
  PlanAnswers copyWith({
    RehlaDestination? destination,
    int? nights,
    bool setNights = false,
    PlanParty? party,
    List<PlanVibe>? vibes,
    PlanPace? pace,
    PlanBudget? budget,
  }) {
    final dest = destination ?? this.destination;
    final allowed = vibesByDestination[dest]!;
    return PlanAnswers(
      destination: dest,
      nights: setNights ? nights : (nights ?? this.nights),
      party: party ?? this.party,
      // Vibes the new place does not offer are dropped (no diving in Siwa).
      vibes: (vibes ?? this.vibes).where(allowed.contains).toList(),
      pace: pace ?? this.pace,
      budget: budget ?? this.budget,
    );
  }

  Map<String, dynamic> toJson() => {
    'destination': destination.name,
    'nights': nights,
    'party': party?.name,
    'vibes': vibes.map((v) => v.name).toList(),
    'pace': pace?.name,
    'budget': budget?.name,
  };

  factory PlanAnswers.fromJson(Map<String, dynamic> json) {
    T? byName<T extends Enum>(List<T> values, Object? name) => values.asNameMap()[name];
    return PlanAnswers(
      destination: RehlaDestination.fromName(json['destination'] as String?),
      nights: json['nights'] as int?,
      party: byName(PlanParty.values, json['party']),
      vibes: [for (final v in (json['vibes'] as List? ?? const [])) ?byName(PlanVibe.values, v)],
      pace: byName(PlanPace.values, json['pace']),
      budget: byName(PlanBudget.values, json['budget']),
    );
  }
}
