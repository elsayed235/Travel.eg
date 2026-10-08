part of 'order_detail_widgets_imports.dart';

class BuildOrderSummaryCard extends StatelessWidget {
  final OrderDomainModel order;
  final VoidCallback? onPeerTap;

  const BuildOrderSummaryCard({
    super.key,
    required this.order,
    this.onPeerTap,
  });

  String _statusLabel(OrderStatus status) {
    switch (status) {
      case OrderStatus.awaitingOffers:
        return Translate.s.orders_status_awaiting;
      case OrderStatus.offerAccepted:
        return Translate.s.orders_status_accepted;
      case OrderStatus.confirmed:
        return Translate.s.orders_status_confirmed;
      case OrderStatus.delivery:
        return Translate.s.orders_status_delivery;
      case OrderStatus.inUse:
        return Translate.s.orders_status_in_use;
      case OrderStatus.completed:
        return Translate.s.orders_status_completed;
      case OrderStatus.cancelled:
        return Translate.s.orders_status_cancelled;
    }
  }

  AppChipKind _chipKind(OrderStatus status) {
    switch (status) {
      case OrderStatus.completed:
        return AppChipKind.available;
      case OrderStatus.confirmed:
      case OrderStatus.offerAccepted:
      case OrderStatus.delivery:
      case OrderStatus.inUse:
        return AppChipKind.verified;
      case OrderStatus.cancelled:
        return AppChipKind.ad;
      case OrderStatus.awaitingOffers:
        return AppChipKind.neutral;
    }
  }

  @override
  Widget build(BuildContext context) {
    final date = DateFormat('d MMMM yyyy', 'ar_EG').format(order.eventDate).toArabicDigits;
    final qty = '${order.quantity.toArabicDigits} ${order.quantityUnit}';
    final peer = order.providerName.trim().isEmpty || order.providerName == '—'
        ? Translate.s.orders_awaiting_peer
        : order.providerName;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: AppRadius.imageAll,
                child: order.imageUrl != null
                    ? CachedImage(
                        url: order.imageUrl!,
                        width: 72,
                        height: 72,
                        fit: BoxFit.cover,
                        borderRadius: AppRadius.imageAll,
                        bgColor: context.colors.surface3,
                      )
                    : Container(
                        width: 72,
                        height: 72,
                        color: context.colors.surface3,
                      ),
              ),
              Gaps.hGap13,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AppChip(
                      label: order.isMyRequest
                          ? Translate.s.market_side_request_short
                          : Translate.s.orders_role_fulfill,
                      kind: order.isMyRequest
                          ? AppChipKind.verified
                          : AppChipKind.available,
                    ),
                    Gaps.vGap6,
                    Text(
                      order.title,
                      style: AppTextStyle.itemTitle(color: context.colors.text),
                    ),
                    Gaps.vGap4,
                    GestureDetector(
                      onTap: onPeerTap,
                      child: Text(
                        peer,
                        style: AppTextStyle.caption(color: context.colors.text2).copyWith(
                          decoration: onPeerTap == null ? null : TextDecoration.underline,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          Gaps.vGap13,
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              AppChip(label: order.categoryName, kind: AppChipKind.neutral),
              AppChip(label: qty, kind: AppChipKind.available),
              AppChip(
                label: Translate.s.home_need_by_chip(date),
                kind: AppChipKind.verified,
              ),
              AppChip(
                label: _statusLabel(order.status),
                kind: _chipKind(order.status),
              ),
            ],
          ),
          Gaps.vGap9,
          Text(
            Translate.s.order_detail_cash_note,
            style: AppTextStyle.micro(color: context.colors.text3),
          ),
        ],
      ),
    );
  }
}
