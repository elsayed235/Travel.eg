part of '../experiences_imports.dart';

/// A Discover result: photo, title, facts, the "why it fits you" line, then
/// the price beside the real cancellation policy.
class BuildExperienceRow extends StatelessWidget {
  final Experience experience;
  final LiveConditions? live;
  final bool selected;

  const BuildExperienceRow({super.key, required this.experience, required this.live, this.selected = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final e = experience;
    final reason = ExperienceFit.reason(e, live);
    final cancel = ExperienceFit.cancellation(e);
    final meta = [
      ExperienceFit.duration(e.durationMinutes),
      if (e.place != null) e.place!.name(arabic),
      e.bookable.supplier(arabic),
    ].where((s) => s.isNotEmpty).join(' · ');
    return XpPressable(
      onTap: () => openExperience(context, e),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 260),
        curve: Curves.easeOutCubic,
        decoration: BoxDecoration(
          color: colors.surface1,
          borderRadius: AppRadius.cardAll,
          border: Border.all(color: selected ? colors.button : colors.line, width: selected ? 1.5 : 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: 156,
              width: double.infinity,
              child: RehlaPhoto(webPath: e.webPhoto, asset: e.assetPhoto),
            ),
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    e.title(arabic),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyle.s16_w500(color: colors.text).copyWith(height: 1.3),
                  ),
                  Gaps.vGap4,
                  Text(meta, maxLines: 2, overflow: TextOverflow.ellipsis, style: AppTextStyle.caption(color: colors.text3)),
                  if (reason != null) ...[Gaps.vGap8, XpFitLine(reason: reason)],
                  Gaps.vGap12,
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      XpPrice(experience: e, size: 18),
                      Gaps.hGap12,
                      if (cancel != null)
                        Expanded(
                          child: Text(
                            cancel,
                            textAlign: TextAlign.end,
                            maxLines: 2,
                            style: AppTextStyle.s12_w500(color: colors.green),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
