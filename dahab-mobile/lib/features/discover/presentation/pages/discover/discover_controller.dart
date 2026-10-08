part of 'discover_imports.dart';

/// The Discover tab: the place on screen, what it is like right now, and the
/// ways into it. Doors either start the planner or ask DayGi; the shell
/// decides where those go.
class DiscoverController {
  DiscoverController({required this.onPlan, required this.onAskDaygi});

  /// Open the planner with these vibes already picked (empty = from the start).
  final void Function(List<PlanVibe> vibes) onPlan;

  /// Open DayGi, optionally with a question already asked.
  final void Function(String? question) onAskDaygi;

  final ConditionsRequester conditionsRequester = ConditionsRequester();

  void init(RehlaDestination destination) => conditionsRequester.forDestination(destination);

  void onDestinationChanged(RehlaDestination destination) => conditionsRequester.forDestination(destination);

  Future<void> selectDestination(BuildContext context, RehlaDestination next) =>
      context.read<DestinationCubit>().select(context, next);

  void openDoor(BuildContext context, DiscoverDoor door) {
    if (door.asksDaygi) {
      onAskDaygi(door.ask(context.isArabic));
    } else {
      onPlan(door.planVibes);
    }
  }

  void dispose() => conditionsRequester.close();
}
