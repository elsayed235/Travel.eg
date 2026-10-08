part of 'orders_widgets_imports.dart';

class BuildOrdersHeader extends StatelessWidget {
  final int filterIndex;
  final ValueChanged<int> onFilterChanged;
  final bool showTitle;

  /// Orders per filter, same order as the segments.
  final List<int> counts;

  /// Orders waiting on this user; tapping the banner opens the first one.
  final List<OrderDomainModel> needsAction;
  final ValueChanged<OrderDomainModel> onOpen;

  const BuildOrdersHeader({
    super.key,
    required this.filterIndex,
    required this.onFilterChanged,
    required this.counts,
    required this.needsAction,
    required this.onOpen,
    this.showTitle = true,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final labels = [
      Translate.s.orders_filter_all,
      Translate.s.orders_filter_active,
      Translate.s.orders_filter_done,
      Translate.s.orders_filter_cancelled,
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (showTitle) ...[
          Text(
            Translate.s.orders_title,
            style: AppTextStyle.h3(color: colors.text).copyWith(fontWeight: FontWeight.w700),
          ),
          Gaps.vGap4,
          Text(Translate.s.orders_subtitle, style: AppTextStyle.caption(color: colors.text2)),
          Gaps.vGap16,
        ],
        if (needsAction.isNotEmpty) ...[
          Material(
            color: colors.amberBg,
            borderRadius: const BorderRadius.all(Radius.circular(14)),
            child: InkWell(
              onTap: () => onOpen(needsAction.first),
              borderRadius: const BorderRadius.all(Radius.circular(14)),
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Row(
                  children: [
                    Icon(Icons.qr_code_2_rounded, size: 22, color: colors.amber),
                    Gaps.hGap12,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            Translate.s.orders_action_needed(needsAction.length.toArabicDigits),
                            style: AppTextStyle.s13_w500(color: colors.text),
                          ),
                          Text(
                            needsAction.first.title,
                            style: AppTextStyle.micro(color: colors.text2),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.chevron_right_rounded, color: colors.amber),
                  ],
                ),
              ),
            ),
          ),
          Gaps.vGap13,
        ],
        AppSegmented(
          items: [
            for (var i = 0; i < labels.length; i++)
              counts[i] > 0 ? '${labels[i]} ${counts[i].toArabicDigits}' : labels[i],
          ],
          index: filterIndex,
          onChanged: onFilterChanged,
        ),
      ],
    );
  }
}
