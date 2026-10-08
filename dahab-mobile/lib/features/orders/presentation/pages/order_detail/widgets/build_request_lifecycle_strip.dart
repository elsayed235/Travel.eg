part of 'order_detail_widgets_imports.dart';

class BuildRequestLifecycleStrip extends StatelessWidget {
  final OrderStatus status;

  const BuildRequestLifecycleStrip({super.key, required this.status});

  static const _steps = <OrderStatus>[
    OrderStatus.awaitingOffers,
    OrderStatus.offerAccepted,
    OrderStatus.confirmed,
    OrderStatus.delivery,
    OrderStatus.completed,
  ];

  int get _index {
    switch (status) {
      case OrderStatus.awaitingOffers:
        return 0;
      case OrderStatus.offerAccepted:
        return 1;
      case OrderStatus.confirmed:
        return 2;
      case OrderStatus.delivery:
      case OrderStatus.inUse:
        return 3;
      case OrderStatus.completed:
        return 4;
      case OrderStatus.cancelled:
        return -1;
    }
  }

  String _label(OrderStatus s) {
    switch (s) {
      case OrderStatus.awaitingOffers:
        return Translate.s.lifecycle_published;
      case OrderStatus.offerAccepted:
        return Translate.s.lifecycle_offers;
      case OrderStatus.confirmed:
        return Translate.s.lifecycle_chosen;
      case OrderStatus.delivery:
      case OrderStatus.inUse:
        return Translate.s.lifecycle_handover;
      case OrderStatus.completed:
        return Translate.s.lifecycle_done;
      case OrderStatus.cancelled:
        return Translate.s.orders_status_cancelled;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (status == OrderStatus.cancelled) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.lg),
        decoration: BoxDecoration(
          color: context.colors.surface1,
          borderRadius: AppRadius.cardAll,
          border: Border.all(color: context.colors.line),
        ),
        child: Text(
          Translate.s.orders_status_cancelled,
          style: AppTextStyle.body(color: context.colors.red),
        ),
      );
    }

    final current = _index;
    return Container(
      width: double.infinity,
      padding: const EdgeInsetsDirectional.symmetric(
        horizontal: AppSpacing.lg,
        vertical: AppSpacing.lg,
      ),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Row(
        children: [
          for (var i = 0; i < _steps.length; i++) ...[
            if (i > 0)
              Expanded(
                child: Container(
                  height: 1,
                  color: i <= current ? context.colors.button : context.colors.line,
                ),
              ),
            _Dot(
              label: _label(_steps[i]),
              done: i < current,
              active: i == current,
            ),
          ],
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  final String label;
  final bool done;
  final bool active;

  const _Dot({
    required this.label,
    required this.done,
    required this.active,
  });

  @override
  Widget build(BuildContext context) {
    final fill = done || active ? context.colors.button : context.colors.surface3;
    final fg = done || active ? context.colors.onButton : context.colors.text3;
    return Column(
      children: [
        Container(
          width: 18,
          height: 18,
          decoration: BoxDecoration(
            color: fill,
            shape: BoxShape.circle,
            border: Border.all(color: context.colors.line),
          ),
          alignment: Alignment.center,
          child: done
              ? Icon(Icons.check, size: 11, color: fg)
              : active
                  ? Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(color: fg, shape: BoxShape.circle),
                    )
                  : null,
        ),
        Gaps.vGap6,
        SizedBox(
          width: 52,
          child: Text(
            label,
            style: AppTextStyle.micro(
              color: active || done ? context.colors.text : context.colors.text3,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
