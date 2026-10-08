part of 'orders_widgets_imports.dart';

/// Stage in the order lifecycle, 1..5; 0 for cancelled.
int _stageOf(OrderStatus status) => switch (status) {
      OrderStatus.awaitingOffers => 1,
      OrderStatus.offerAccepted => 2,
      OrderStatus.confirmed => 3,
      OrderStatus.delivery => 4,
      OrderStatus.inUse || OrderStatus.completed => 5,
      OrderStatus.cancelled => 0,
    };

/// True when the order is waiting on this user (show or enter the code).
bool orderNeedsAction(OrderDomainModel o) =>
    o.status == OrderStatus.delivery && (o.showShareCode || o.showEnterCode);

String orderStatusLabel(OrderStatus status) => switch (status) {
      OrderStatus.awaitingOffers => Translate.s.orders_status_awaiting,
      OrderStatus.offerAccepted => Translate.s.orders_status_accepted,
      OrderStatus.confirmed => Translate.s.orders_status_confirmed,
      OrderStatus.delivery => Translate.s.orders_status_delivery,
      OrderStatus.inUse => Translate.s.orders_status_in_use,
      OrderStatus.completed => Translate.s.orders_status_completed,
      OrderStatus.cancelled => Translate.s.orders_status_cancelled,
    };

/// Order card: what it is, where it stands in the lifecycle, and the next step.
class BuildOrderRow extends StatelessWidget {
  final OrderDomainModel order;
  final VoidCallback onTap;

  const BuildOrderRow({
    super.key,
    required this.order,
    required this.onTap,
  });

  static const _radius = BorderRadius.all(Radius.circular(16));

  String? _nextStep() {
    if (order.showShareCode && order.status == OrderStatus.delivery) {
      return Translate.s.orders_next_show_code;
    }
    if (order.showEnterCode) return Translate.s.orders_next_enter_code;
    return switch (order.status) {
      OrderStatus.awaitingOffers =>
        order.isMyRequest ? Translate.s.orders_next_offers : Translate.s.orders_next_details,
      OrderStatus.offerAccepted || OrderStatus.confirmed => Translate.s.orders_next_pickup,
      OrderStatus.delivery || OrderStatus.inUse => Translate.s.orders_next_track,
      OrderStatus.completed => Translate.s.orders_next_details,
      OrderStatus.cancelled => null,
    };
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final date = DateFormat('d MMM', 'ar_EG').format(order.eventDate).toArabicDigits;
    final qty = '${order.quantity.toArabicDigits} ${order.quantityUnit}';
    final peer = order.providerName.trim().isEmpty || order.providerName == '—'
        ? Translate.s.orders_awaiting_peer
        : order.providerName;
    final needsAction = orderNeedsAction(order);
    final statusColor = switch (order.status) {
      OrderStatus.cancelled => colors.red,
      OrderStatus.completed => colors.green,
      _ => needsAction ? colors.amber : colors.text,
    };
    final next = _nextStep();

    return Material(
      color: colors.surface1,
      shape: RoundedRectangleBorder(
        borderRadius: _radius,
        side: BorderSide(
          color: needsAction ? colors.amber.withValues(alpha: 0.55) : colors.line,
          width: needsAction ? 1.4 : 1,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        splashFactory: NoSplash.splashFactory,
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md + 3),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: AppRadius.cardAll,
                    child: SizedBox.square(
                      dimension: 64,
                      child: order.imageUrl != null
                          ? CachedImage(
                              url: order.imageUrl!,
                              fit: BoxFit.cover,
                              bgColor: colors.surface3,
                            )
                          : ColoredBox(color: colors.surface3),
                    ),
                  ),
                  Gaps.hGap12,
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            _RoleTag(isMyRequest: order.isMyRequest),
                            const Spacer(),
                            Icon(Icons.event_rounded, size: 13, color: colors.text3),
                            Gaps.hGap4,
                            Text(date, style: AppTextStyle.micro(color: colors.text2)),
                          ],
                        ),
                        Gaps.vGap6,
                        Text(
                          order.title,
                          style: AppTextStyle.s14_w500(color: colors.text),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Gaps.vGap4,
                        Text(
                          Translate.s.orders_meta(peer, qty),
                          style: AppTextStyle.micro(color: colors.text2),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Gaps.vGap13,
              _StageBar(stage: _stageOf(order.status), color: statusColor),
              Gaps.vGap10,
              Row(
                children: [
                  Icon(
                    switch (order.status) {
                      OrderStatus.cancelled => Icons.cancel_outlined,
                      OrderStatus.completed => Icons.check_circle_outline_rounded,
                      _ => needsAction ? Icons.error_outline_rounded : Icons.radio_button_checked_rounded,
                    },
                    size: 15,
                    color: statusColor,
                  ),
                  Gaps.hGap6,
                  Expanded(
                    child: Text(
                      orderStatusLabel(order.status),
                      style: AppTextStyle.s12_w600(color: statusColor),
                    ),
                  ),
                  if (next != null) _NextStepButton(label: next, prominent: needsAction, onTap: onTap),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoleTag extends StatelessWidget {
  final bool isMyRequest;

  const _RoleTag({required this.isMyRequest});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 2),
      decoration: BoxDecoration(
        color: isMyRequest ? colors.surface2 : colors.greenBg,
        borderRadius: AppRadius.chipAll,
      ),
      child: Text(
        isMyRequest ? Translate.s.market_side_request_short : Translate.s.orders_role_fulfill,
        style: AppTextStyle.micro(color: isMyRequest ? colors.text : colors.green),
      ),
    );
  }
}

/// Five segments for the lifecycle; filled up to the current stage.
class _StageBar extends StatelessWidget {
  final int stage;
  final Color color;

  const _StageBar({required this.stage, required this.color});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Row(
      children: [
        for (var i = 1; i <= 5; i++) ...[
          if (i > 1) Gaps.hGap4,
          Expanded(
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOutCubic,
              height: 4,
              decoration: BoxDecoration(
                color: i <= stage ? color : colors.line,
                borderRadius: const BorderRadius.all(Radius.circular(2)),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

class _NextStepButton extends StatelessWidget {
  final String label;
  final bool prominent;
  final VoidCallback onTap;

  const _NextStepButton({required this.label, required this.prominent, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: prominent ? colors.button : colors.surface1,
      shape: StadiumBorder(side: BorderSide(color: prominent ? colors.button : colors.line2)),
      child: InkWell(
        onTap: onTap,
        customBorder: const StadiumBorder(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
          child: Text(
            label,
            style: AppTextStyle.s12_w600(color: prominent ? colors.onButton : colors.text),
          ),
        ),
      ),
    );
  }
}
