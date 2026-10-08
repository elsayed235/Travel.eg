part of 'discover_widgets_imports.dart';

/// Ready-made trips for this place, the same programmes the planner ranks.
/// Hidden until they arrive, and hidden when this place has none.
class BuildDiscoverPlans extends StatelessWidget {
  final RehlaDestination destination;
  final ProgrammesRequester requester;
  final ValueChanged<ProgrammeDomainModel> onOpen;
  final VoidCallback onSeeAll;

  const BuildDiscoverPlans({
    super.key,
    required this.destination,
    required this.requester,
    required this.onOpen,
    required this.onSeeAll,
  });

  @override
  Widget build(BuildContext context) {
    return RequesterConsumer<List<ProgrammeDomainModel>>(
      requester: requester,
      loadingBuilder: (_) => const SizedBox.shrink(),
      failureBuilder: (_, _, _) => const SizedBox.shrink(),
      successBuilder: (context, programmes, _) {
        final items = programmes.where((p) => p.destination == destination).take(3).toList();
        if (items.isEmpty) return const SizedBox.shrink();
        final colors = context.colors;
        final arabic = context.isArabic;
        final place = destination.label(arabic);
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Gaps.vGap32,
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: Text(
                    Translate.s.discover_plans_title(place),
                    style: AppTextStyle.screenTitle(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
                  ),
                ),
                TextButton(
                  onPressed: onSeeAll,
                  style: TextButton.styleFrom(foregroundColor: colors.button),
                  child: Text(Translate.s.discover_plans_all, style: AppTextStyle.s13_w500(color: colors.button)),
                ),
              ],
            ),
            Gaps.vGap13,
            SizedBox(
              height: 280,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                clipBehavior: Clip.none,
                itemCount: items.length,
                separatorBuilder: (_, _) => Gaps.hGap12,
                itemBuilder: (context, i) {
                  final programme = items[i];
                  return AppEntrance(
                    delay: Duration(milliseconds: 70 * i),
                    duration: destination.tempo,
                    child: _PlanCard(programme: programme, onTap: () => onOpen(programme)),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

class _ProgrammePhoto extends StatelessWidget {
  final ProgrammeDomainModel programme;

  const _ProgrammePhoto({required this.programme});

  @override
  Widget build(BuildContext context) {
    final fallback = Image.asset(programme.destination.heroImagePath, fit: BoxFit.cover);
    if (programme.heroImage.isEmpty) return fallback;
    return Image.network(
      AppConfig.instance.assetUrl(programme.heroImage),
      fit: BoxFit.cover,
      errorBuilder: (_, _, _) => fallback,
    );
  }
}

class _PlanCard extends StatelessWidget {
  final ProgrammeDomainModel programme;
  final VoidCallback onTap;

  const _PlanCard({required this.programme, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final arabic = context.isArabic;
    return SizedBox(
      width: 210,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          splashFactory: NoSplash.splashFactory,
          borderRadius: AppRadius.cardAll,
          child: Ink(
            decoration: BoxDecoration(borderRadius: AppRadius.cardAll),
            child: ClipRRect(
              borderRadius: AppRadius.cardAll,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  _ProgrammePhoto(programme: programme),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          context.colors.scrim.withValues(alpha: 0),
                          context.colors.scrim.withValues(alpha: 0.82),
                        ],
                        stops: const [0.35, 1],
                      ),
                    ),
                  ),
                  PositionedDirectional(
                    top: AppSpacing.md,
                    start: AppSpacing.md,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: context.colors.scrim.withValues(alpha: 0.45),
                        borderRadius: AppRadius.chipAll,
                      ),
                      child: Padding(
                        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
                        child: Text(
                          Translate.s.plan_card_days(programme.durationDays),
                          style: AppTextStyle.micro(color: context.colors.onImage),
                        ),
                      ),
                    ),
                  ),
                  PositionedDirectional(
                    start: AppSpacing.md,
                    end: AppSpacing.md,
                    bottom: AppSpacing.md,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          programme.title(arabic),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyle.s16_w500(color: context.colors.onImage).copyWith(
                            fontFamily: AppFonts.display(context),
                            height: 1.2,
                          ),
                        ),
                        Gaps.vGap4,
                        Text(
                          programme.tagline(arabic),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyle.caption(color: context.colors.onImage.withValues(alpha: 0.85)),
                        ),
                        Gaps.vGap6,
                        Text(
                          AppMoney.egp(programme.startingPriceEgp),
                          style: AppTextStyle.s13_w500(color: context.colors.onImage),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
