part of 'explore_widgets_imports.dart';

/// Result count with both sort options visible, so switching is one tap.
class BuildExploreToolbar extends StatelessWidget {
  final int count;
  final ExploreSort sort;
  final ValueChanged<ExploreSort> onSortChanged;

  const BuildExploreToolbar({
    super.key,
    required this.count,
    required this.sort,
    required this.onSortChanged,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Row(
      children: [
        Expanded(
          child: Text(
            Translate.s.explore_results_count(count.toArabicDigits),
            style: AppTextStyle.h4(color: colors.text),
          ),
        ),
        for (final option in ExploreSort.values) ...[
          Gaps.hGap6,
          _SortOption(
            label: switch (option) {
              ExploreSort.nearest => Translate.s.explore_sort_nearest,
              ExploreSort.soonest => Translate.s.explore_sort_soonest,
            },
            icon: switch (option) {
              ExploreSort.nearest => Icons.near_me_outlined,
              ExploreSort.soonest => Icons.schedule_rounded,
            },
            selected: option == sort,
            onTap: () => onSortChanged(option),
          ),
        ],
      ],
    );
  }
}

class _SortOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  const _SortOption({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final fg = selected ? colors.text : colors.text3;
    return Semantics(
      selected: selected,
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.buttonAll,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 14, color: fg),
              Gaps.hGap4,
              Text(
                label,
                style: AppTextStyle.caption(color: fg).copyWith(
                  fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                  decoration: selected ? TextDecoration.underline : null,
                  decorationColor: colors.text,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
