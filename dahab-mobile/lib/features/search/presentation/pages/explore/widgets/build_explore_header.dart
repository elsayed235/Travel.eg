part of 'explore_widgets_imports.dart';

/// Title, where the results come from, and how far to look.
class BuildExploreHeader extends StatelessWidget {
  final String locationLabel;
  final int radiusKm;
  final List<int> radiusOptions;
  final ValueChanged<int> onRadiusChanged;

  const BuildExploreHeader({
    super.key,
    required this.locationLabel,
    required this.radiusKm,
    required this.radiusOptions,
    required this.onRadiusChanged,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(Translate.s.explore_title, style: AppTextStyle.h3(color: colors.text)),
        Gaps.vGap4,
        Row(
          children: [
            Icon(Icons.location_on_rounded, size: 14, color: colors.green),
            Gaps.hGap4,
            Expanded(
              child: Text(
                Translate.s.explore_subtitle(locationLabel),
                style: AppTextStyle.caption(color: colors.text2),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        Gaps.vGap13,
        Container(
          padding: const EdgeInsets.all(3),
          decoration: BoxDecoration(
            color: colors.surface2,
            borderRadius: const BorderRadius.all(Radius.circular(22)),
          ),
          child: Row(
            children: [
              Padding(
                padding: const EdgeInsetsDirectional.only(start: AppSpacing.md, end: AppSpacing.xs),
                child: Icon(Icons.radar, size: 16, color: colors.text2),
              ),
              for (final km in radiusOptions)
                Expanded(
                  child: _RadiusSegment(
                    label: Translate.s.home_radius_label(km.toArabicDigits),
                    selected: km == radiusKm,
                    onTap: () => onRadiusChanged(km),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _RadiusSegment extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _RadiusSegment({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      selected: selected,
      button: true,
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          height: 34,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: selected ? colors.surface1 : Colors.transparent,
            borderRadius: const BorderRadius.all(Radius.circular(18)),
            border: Border.all(color: selected ? colors.line2 : Colors.transparent),
          ),
          child: Text(
            label,
            maxLines: 1,
            style: AppTextStyle.s12_w500(color: selected ? colors.text : colors.text2),
          ),
        ),
      ),
    );
  }
}
