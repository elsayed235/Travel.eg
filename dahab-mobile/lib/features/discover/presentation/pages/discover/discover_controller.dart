part of 'discover_imports.dart';

/// Home: the place on screen, what it is like right now, and the ways into
/// it. The shell decides where a door, a question or "See all" goes.
class DiscoverController {
  DiscoverController({required this.onDoor, required this.onAsk, required this.onSeeToday, required this.onSearch});

  /// A door was tapped: the shell opens Discover filtered, or DayGi asking.
  final void Function(DiscoverDoor door) onDoor;

  /// Open DayGi, optionally with a question, optionally listening.
  final void Function(String? question, bool voice) onAsk;

  /// "See all" on today's rail.
  final VoidCallback onSeeToday;

  /// "See all" beside the doors: every outing, searchable.
  final VoidCallback onSearch;

  final ConditionsRequester conditionsRequester = ConditionsRequester();

  void init(RehlaDestination destination) => conditionsRequester.forDestination(destination);

  void onDestinationChanged(RehlaDestination destination) => conditionsRequester.forDestination(destination);

  Future<void> selectDestination(BuildContext context, RehlaDestination next) =>
      context.read<DestinationCubit>().select(context, next);

  void openDoor(BuildContext context, DiscoverDoor door) => onDoor(door);

  void dispose() => conditionsRequester.close();
}
