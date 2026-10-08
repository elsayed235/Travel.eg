part of 'discover_widgets_imports.dart';

class BuildDiscoverBody extends StatelessWidget {
  final DiscoverController controller;
  final RehlaDestination destination;

  const BuildDiscoverBody({super.key, required this.controller, required this.destination});

  @override
  Widget build(BuildContext context) {
    final place = destination.label(context.isArabic);
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: BuildDiscoverHero(
            destination: destination,
            onSelect: (d) => controller.selectDestination(context, d),
            onPlan: () => controller.onPlan(const []),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
          sliver: SliverList.list(
            // Keyed on the place so every section re-enters with its new content.
            key: ValueKey(destination),
            children: [
              Gaps.vGap8,
              BuildConditionsStrip(requester: controller.conditionsRequester, place: place),
              Gaps.vGap24,
              BuildDiscoverDoors(
                destination: destination,
                title: Translate.s.discover_doors_title(place),
                onOpen: (door) => controller.openDoor(context, door),
              ),
              Gaps.vGap32,
              BuildDiscoverPicks(
                destination: destination,
                title: Translate.s.discover_picks_title(place),
                onPick: (pick) => controller.onPlan(pick.vibes),
              ),
              Gaps.vGap32,
              BuildPlanPrompt(onStart: () => controller.onPlan(const [])),
              Gaps.vGap32,
            ],
          ),
        ),
      ],
    );
  }
}
