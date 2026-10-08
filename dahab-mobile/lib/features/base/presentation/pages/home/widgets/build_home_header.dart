part of 'home_widgets_imports.dart';

/// Greeting + actions, then the question the screen asks, set over a reach
/// map: rings in km with a dot per owner nearby (the app's core idea —
/// your request reaches the people around you).
class BuildHomeHeader extends StatelessWidget {
  final HomeFeedDomainModel feed;
  final VoidCallback onSearch;
  final VoidCallback onNotifications;

  const BuildHomeHeader({
    super.key,
    required this.feed,
    required this.onSearch,
    required this.onNotifications,
  });

  String _greeting(String? name) {
    final base = DateTime.now().hour < 12
        ? Translate.s.home_greeting_morning
        : Translate.s.home_greeting_evening;
    if (name == null || name.trim().isEmpty) return base;
    return Translate.s.home_greeting_named(base, name.trim());
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        PositionedDirectional(
          end: -AppSpacing.xl - 34,
          top: 62,
          child: AppReachRadar(
            size: 184,
            dotCount: feed.ownersInRange,
            radiusKm: feed.locationDistanceKm,
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      BlocBuilder<UserCubit, UserState>(
                        builder: (context, state) => Text(
                          _greeting(state.model?.firstName),
                          style: AppTextStyle.s14_w500(color: context.colors.text),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Gaps.vGap4,
                      Row(
                        children: [
                          Icon(Icons.location_on_rounded, size: 14, color: context.colors.green),
                          Gaps.hGap4,
                          Flexible(
                            child: Text(
                              feed.locationLabel,
                              style: AppTextStyle.caption(color: context.colors.text2),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                _HeaderAction(
                  icon: Icons.notifications_none_rounded,
                  label: Translate.s.home_notifications,
                  onTap: onNotifications,
                ),
                Gaps.hGap8,
                _HeaderAction(
                  icon: Icons.search_rounded,
                  label: Translate.s.home_nav_explore,
                  onTap: onSearch,
                ),
              ],
            ),
            Gaps.vGap32,
            Text(
              Translate.s.home_headline,
              style: AppTextStyle.display(color: context.colors.text),
            ),
            Gaps.vGap8,
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 230),
              child: Text(
                Translate.s.home_reach_line(
                  feed.ownersInRange.toArabicDigits,
                  feed.locationDistanceKm.toArabicDigits,
                ),
                style: AppTextStyle.body(color: context.colors.text2),
              ),
            ),
            Gaps.vGap24,
          ],
        ),
      ],
    );
  }
}

class _HeaderAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _HeaderAction({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: label,
      child: Material(
        color: context.colors.surface1,
        shape: CircleBorder(side: BorderSide(color: context.colors.line)),
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: SizedBox(
            width: 42,
            height: 42,
            child: Icon(icon, size: 20, color: context.colors.text),
          ),
        ),
      ),
    );
  }
}

