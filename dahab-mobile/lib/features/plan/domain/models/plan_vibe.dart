/// What the traveler wants from the trip (website: PlanVibe in
/// src/services/planMatcher.ts). Each vibe maps onto the interest tags the
/// programmes already carry, so matching needs no new data.
enum PlanVibe {
  sea(['Beach', 'Snorkeling']),
  diving(['Diving']),
  adventure(['Adventure']),
  desert(['Desert']),
  wellness(['Wellness']),
  culture(['Culture', 'Local Life']),
  food(['Food']),
  unplug(['Unplug']),
  stars(['Stargazing']),
  nature(['Nature']);

  const PlanVibe(this.tags);

  /// Programme interest tags (`defaultInterests`) this vibe matches.
  final List<String> tags;
}
