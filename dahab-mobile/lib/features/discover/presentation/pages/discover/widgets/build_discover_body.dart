part of 'discover_widgets_imports.dart';

/// Home before the trip: greeting and the place, one line to DayGi, what
/// it is like right now, six ways in, what is on today, ready-made trips.
class BuildDiscoverBody extends StatelessWidget {
  final DiscoverController controller;
  final RehlaDestination destination;
  final ProgrammesRequester programmesRequester;
  final ScrollController scrollController;
  final ValueChanged<ProgrammeDomainModel> onProgramme;
  final VoidCallback onSeeAllPlans;

  const BuildDiscoverBody({
    super.key,
    required this.controller,
    required this.destination,
    required this.programmesRequester,
    required this.scrollController,
    required this.onProgramme,
    required this.onSeeAllPlans,
  });

  @override
  Widget build(BuildContext context) {
    final place = destination.label(context.isArabic);
    return CustomScrollView(
      controller: scrollController,
      slivers: [
        SliverToBoxAdapter(
          child: BuildDiscoverHero(
            destination: destination,
            onSelect: (d) => controller.selectDestination(context, d),
            onAsk: (voice) => controller.onAsk(null, voice),
          ),
        ),
        SliverList.list(
          // Keyed on the place so every section re-enters with its new content.
          key: ValueKey(destination),
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Gaps.vGap8,
                  BuildConditionsStrip(requester: controller.conditionsRequester, place: place),
                  Gaps.vGap24,
                  BuildDiscoverDoors(
                    destination: destination,
                    title: Translate.s.discover_doors_title(place),
                    onOpen: (door) => controller.openDoor(context, door),
                  ),
                ],
              ),
            ),
            if (destination == RehlaDestination.dahab) BuildTodayRail(place: place, onSeeAll: controller.onSeeToday),
            Padding(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
              child: BuildDiscoverPlans(
                destination: destination,
                requester: programmesRequester,
                onOpen: onProgramme,
                onSeeAll: onSeeAllPlans,
              ),
            ),
            Gaps.vGap24,
            SizedBox(height: MediaQuery.paddingOf(context).bottom),
          ],
        ),
      ],
    );
  }
}
