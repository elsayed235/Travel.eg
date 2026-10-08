part of 'conversation_widgets_imports.dart';

class BuildChatOrderCard extends StatelessWidget {
  final ChatOrderCard order;

  const BuildChatOrderCard({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context).toString();
    final needBy = order.needBy == null
        ? null
        : DateFormat('d MMM y', locale).format(order.needBy!).toLocaleDigits;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: context.colors.surface1,
          borderRadius: AppRadius.cardAll,
          border: Border.all(color: context.colors.line),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (order.imageUrl != null)
              Stack(
                children: [
                  CachedImage(
                    url: order.imageUrl!,
                    width: double.infinity,
                    height: 148,
                    fit: BoxFit.cover,
                    borderRadius: BorderRadius.zero,
                    bgColor: context.colors.surface3,
                  ),
                  PositionedDirectional(
                    start: AppSpacing.md,
                    top: AppSpacing.md,
                    child: Container(
                      padding: const EdgeInsetsDirectional.symmetric(
                        horizontal: AppSpacing.md,
                        vertical: AppSpacing.xs,
                      ),
                      decoration: BoxDecoration(
                        color: context.colors.bg.withValues(alpha: 0.92),
                        borderRadius: AppRadius.chipAll,
                        border: Border.all(color: context.colors.line),
                      ),
                      child: Text(
                        Translate.s.chat_order_card_badge,
                        style: AppTextStyle.micro(color: context.colors.text2),
                      ),
                    ),
                  ),
                ],
              ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    Translate.s.chat_order_card_title,
                    style: AppTextStyle.caption(color: context.colors.text3),
                  ),
                  Gaps.vGap6,
                  Text(
                    order.title,
                    style: AppTextStyle.sectionTitle(color: context.colors.text),
                  ),
                  Gaps.vGap13,
                  Divider(height: 1, color: context.colors.line),
                  Gaps.vGap13,
                  _OrderMetaRow(
                    label: Translate.s.chat_order_qty,
                    value: order.quantityLabel,
                  ),
                  if (needBy != null) ...[
                    Gaps.vGap9,
                    _OrderMetaRow(
                      label: Translate.s.chat_order_need_by,
                      value: needBy,
                    ),
                  ],
                  if (order.providerName != null) ...[
                    Gaps.vGap9,
                    _OrderMetaRow(
                      label: Translate.s.chat_order_provider,
                      value: order.providerName!,
                    ),
                  ],
                  Gaps.vGap9,
                  _OrderMetaRow(
                    label: Translate.s.chat_order_status,
                    value: order.statusLabel,
                    valueColor: context.colors.green,
                  ),
                  if (order.price != null) ...[
                    Gaps.vGap13,
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            Translate.s.chat_order_price,
                            style: AppTextStyle.body(color: context.colors.text2),
                          ),
                        ),
                        AppPrice(amount: order.price!),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderMetaRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _OrderMetaRow({
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(label, style: AppTextStyle.body(color: context.colors.text2)),
        ),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: AppTextStyle.itemTitle(
              color: valueColor ?? context.colors.text,
            ),
          ),
        ),
      ],
    );
  }
}
