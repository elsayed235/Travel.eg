part of 'discover_widgets_imports.dart';

/// Hand-picked moments, swipeable. No prices here: a pick opens the planner
/// around it, and prices come from the server there.
class BuildDiscoverPicks extends StatelessWidget {
  final RehlaDestination destination;
  final String title;
  final ValueChanged<EditorialPick> onPick;

  const BuildDiscoverPicks({super.key, required this.destination, required this.title, required this.onPick});

  @override
  Widget build(BuildContext context) {
    final picks = DiscoverContent.picks(destination);
    final colors = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTextStyle.screenTitle(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
        ),
        Gaps.vGap13,
        SizedBox(
          height: 300,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            clipBehavior: Clip.none,
            itemCount: picks.length,
            separatorBuilder: (_, _) => Gaps.hGap12,
            itemBuilder: (context, i) => AppEntrance(
              delay: Duration(milliseconds: 80 * i),
              duration: destination.tempo,
              child: _PickCard(pick: picks[i], onTap: () => onPick(picks[i])),
            ),
          ),
        ),
      ],
    );
  }
}

class _PickCard extends StatelessWidget {
  final EditorialPick pick;
  final VoidCallback onTap;

  const _PickCard({required this.pick, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    return SizedBox(
      width: 236,
      child: Material(
        borderRadius: AppRadius.cardAll,
        clipBehavior: Clip.antiAlias,
        color: colors.surface2,
        child: InkWell(
          onTap: onTap,
          child: Stack(
            fit: StackFit.expand,
            children: [
              Image.asset(pick.image, fit: BoxFit.cover),
              DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    stops: const [0.35, 1],
                    colors: [colors.scrim.withValues(alpha: 0), colors.scrim.withValues(alpha: 0.82)],
                  ),
                ),
              ),
              PositionedDirectional(
                start: AppSpacing.lg,
                end: AppSpacing.lg,
                bottom: AppSpacing.lg,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pick.meta(arabic),
                      style: AppTextStyle.s12_w500(color: colors.onImage.withValues(alpha: 0.85)),
                    ),
                    Gaps.vGap4,
                    Text(
                      pick.title(arabic),
                      maxLines: 2,
                      style: AppTextStyle.s18_w600(
                        color: colors.onImage,
                      ).copyWith(fontFamily: AppFonts.display(context), height: 1.25),
                    ),
                    Gaps.vGap9,
                    Row(
                      children: [
                        Text(Translate.s.discover_pick_cta, style: AppTextStyle.s13_w500(color: colors.onImage)),
                        Gaps.hGap4,
                        Icon(
                          Directionality.of(context) == TextDirection.rtl
                              ? Icons.arrow_back_rounded
                              : Icons.arrow_forward_rounded,
                          size: 16,
                          color: colors.onImage,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
