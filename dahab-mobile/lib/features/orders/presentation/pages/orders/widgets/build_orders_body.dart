part of 'orders_widgets_imports.dart';

class BuildOrdersBody extends StatelessWidget {
  final OrdersController controller;
  final bool showTitle;

  const BuildOrdersBody({
    super.key,
    required this.controller,
    this.showTitle = true,
  });

  @override
  Widget build(BuildContext context) {
    return RequesterConsumer<List<OrderDomainModel>>(
      requester: controller.ordersRequester,
      loadingBuilder: (_) => AppScreenShimmer.orders(),
      failureBuilder: (context, error, callback) => Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(error.message, style: AppTextStyle.body(color: context.colors.red)),
              Gaps.vGap13,
              TextButton(onPressed: callback, child: Text(Translate.s.retry)),
            ],
          ),
        ),
      ),
      successBuilder: (context, orders, _) {
        return ObsValueConsumer(
          observable: controller.filterIndexObs,
          builder: (context, filterIndex) {
            final filtered = controller.filtered(orders, filterIndex);
            final counts = [for (var i = 0; i < 4; i++) controller.filtered(orders, i).length];
            final needsAction = orders.where(orderNeedsAction).toList();
            return ListView(
              padding: const EdgeInsetsDirectional.symmetric(
                horizontal: AppSpacing.xl,
                vertical: AppSpacing.lg,
              ),
              children: [
                BuildOrdersHeader(
                  filterIndex: filterIndex,
                  onFilterChanged: controller.onFilterChanged,
                  showTitle: showTitle,
                  counts: counts,
                  needsAction: needsAction,
                  onOpen: (o) => controller.openOrder(context, o.id),
                ),
                Gaps.vGap16,
                if (filtered.isEmpty)
                  const BuildOrdersEmpty()
                else
                  for (final order in filtered) ...[
                    BuildOrderRow(
                      order: order,
                      onTap: () => controller.openOrder(context, order.id),
                    ),
                    Gaps.vGap10,
                  ],
                Gaps.vGap24,
              ],
            );
          },
        );
      },
    );
  }
}
