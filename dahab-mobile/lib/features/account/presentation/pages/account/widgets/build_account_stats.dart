part of 'account_widgets_imports.dart';

class BuildAccountStats extends StatelessWidget {
  final AccountStats stats;
  final VoidCallback? onOrdersTap;
  final VoidCallback? onRequestsTap;
  final VoidCallback? onReviewsTap;

  const BuildAccountStats({
    super.key,
    required this.stats,
    this.onOrdersTap,
    this.onRequestsTap,
    this.onReviewsTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Row(
        children: [
          _StatItem(
            value: stats.ordersCount.toLocaleDigits,
            label: Translate.s.account_stat_orders,
            onTap: onOrdersTap,
          ),
          Container(width: 1, height: 44, color: context.colors.line),
          _StatItem(
            value: stats.requestsCount.toLocaleDigits,
            label: Translate.s.account_stat_requests,
            onTap: onRequestsTap,
          ),
          Container(width: 1, height: 44, color: context.colors.line),
          _StatItem(
            value: stats.reviewsCount.toLocaleDigits,
            label: Translate.s.account_stat_reviews,
            onTap: onReviewsTap,
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  final VoidCallback? onTap;

  const _StatItem({
    required this.value,
    required this.label,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          splashFactory: NoSplash.splashFactory,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
            child: Column(
              children: [
                Text(value, style: AppTextStyle.sectionTitle(color: context.colors.text)),
                Gaps.vGap4,
                Text(label, style: AppTextStyle.caption(color: context.colors.text2)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
