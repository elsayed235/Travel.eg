part of 'discover_widgets_imports.dart';

/// "Today in Dahab": outings with a departure still ahead today, the ones
/// the wind allows first. Hidden until the catalogue has something to show.
class BuildTodayRail extends StatelessWidget {
  final String place;
  final VoidCallback onSeeAll;

  const BuildTodayRail({super.key, required this.place, required this.onSeeAll});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: ExperienceCatalogue.instance.stateObs,
      builder: (context, state) {
        final items = _today(state.items, state.live);
        if (items.isEmpty) return const SizedBox.shrink();
        return Padding(
          padding: const EdgeInsetsDirectional.only(top: AppSpacing.xxl + AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
                child: XpSectionHead(title: Translate.s.home_today_in(place), action: Translate.s.home_see_all, onAction: onSeeAll),
              ),
              Gaps.vGap13,
              SizedBox(
                height: 262,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
                  itemCount: items.length,
                  separatorBuilder: (_, _) => Gaps.hGap12,
                  itemBuilder: (context, i) => AppEntrance(
                    delay: Duration(milliseconds: 60 * i.clamp(0, 4)),
                    child: BuildExperienceCard(experience: items[i]),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  static List<Experience> _today(List<Experience> all, LiveConditions? live) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final out = all.where((e) {
      if (!e.openOn(today)) return false;
      if (e.bookable.timeSlots.isEmpty) return true;
      return e.bookable.timeSlots.any((s) {
        final at = RehlaDates.at(today, s);
        return at == null || at.subtract(const Duration(minutes: 45)).isAfter(now);
      });
    }).toList()
      ..sort((a, b) {
        final wa = a.windOk(live?.windKnots) ? 0 : 1;
        final wb = b.windOk(live?.windKnots) ? 0 : 1;
        if (wa != wb) return wa - wb;
        return a.bookable.priceEgp.compareTo(b.bookable.priceEgp);
      });
    return out.take(8).toList();
  }
}
