part of 'order_detail_widgets_imports.dart';

class BuildOrderStatusActions extends StatelessWidget {
  final List<OrderStatus> actions;
  final String Function(OrderStatus) labelOf;
  final ValueChanged<OrderStatus> onSelect;
  final ObsValue<bool> busyObs;

  const BuildOrderStatusActions({
    super.key,
    required this.actions,
    required this.labelOf,
    required this.onSelect,
    required this.busyObs,
  });

  @override
  Widget build(BuildContext context) {
    if (actions.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          Translate.s.order_detail_actions_title,
          style: AppTextStyle.sectionTitle(color: context.colors.text),
        ),
        Gaps.vGap6,
        Text(
          Translate.s.order_detail_actions_hint,
          style: AppTextStyle.caption(color: context.colors.text2),
        ),
        Gaps.vGap13,
        ObsValueConsumer(
          observable: busyObs,
          builder: (context, busy) {
            return Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                for (final action in actions)
                  Material(
                    color: context.colors.surface2,
                    borderRadius: AppRadius.chipAll,
                    child: InkWell(
                      onTap: busy ? null : () => onSelect(action),
                      borderRadius: AppRadius.chipAll,
                      splashFactory: NoSplash.splashFactory,
                      child: Padding(
                        padding: const EdgeInsetsDirectional.symmetric(
                          horizontal: AppSpacing.lg,
                          vertical: AppSpacing.sm,
                        ),
                        child: Text(
                          labelOf(action),
                          style: AppTextStyle.caption(color: context.colors.text),
                        ),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ],
    );
  }
}
