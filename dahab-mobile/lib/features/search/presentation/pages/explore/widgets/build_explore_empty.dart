part of 'explore_widgets_imports.dart';

/// No matches: say where we looked, then offer the two ways forward.
class BuildExploreEmpty extends StatelessWidget {
  final int radiusKm;
  final int? nextRadiusKm;
  final VoidCallback onCreateRequest;
  final VoidCallback onWidenRadius;

  const BuildExploreEmpty({
    super.key,
    required this.radiusKm,
    required this.nextRadiusKm,
    required this.onCreateRequest,
    required this.onWidenRadius,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      margin: const EdgeInsets.only(top: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.xl),
      decoration: BoxDecoration(
        color: colors.surface2,
        borderRadius: const BorderRadius.all(Radius.circular(18)),
      ),
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(color: colors.surface1, shape: BoxShape.circle),
            child: Icon(Icons.radar, color: colors.text2, size: 26),
          ),
          Gaps.vGap13,
          Text(
            Translate.s.explore_empty_title_radius(radiusKm.toArabicDigits),
            style: AppTextStyle.h4(color: colors.text),
            textAlign: TextAlign.center,
          ),
          Gaps.vGap6,
          Text(
            Translate.s.explore_empty_subtitle,
            style: AppTextStyle.body(color: colors.text2),
            textAlign: TextAlign.center,
          ),
          Gaps.vGap18,
          AppTextButton.maxPrimary(
            text: Translate.s.explore_empty_request,
            onPressed: onCreateRequest,
          ),
          if (nextRadiusKm != null) ...[
            Gaps.vGap9,
            AppTextButton.maxWhite(
              text: Translate.s.explore_empty_widen_to(nextRadiusKm!.toArabicDigits),
              onPressed: onWidenRadius,
            ),
          ],
        ],
      ),
    );
  }
}
