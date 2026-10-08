part of 'orders_imports.dart';

class OrdersController {
  final OrdersListRequester ordersRequester = OrdersListRequester();
  final ObsValue<int> filterIndexObs = ObsValue.withInit(0);

  void init() {
    ordersRequester.request();
  }

  void onFilterChanged(int index) => filterIndexObs.setValue(index);

  List<OrderDomainModel> filtered(List<OrderDomainModel> all, int filterIndex) {
    switch (filterIndex) {
      case 1:
        return all
            .where((o) =>
                o.status == OrderStatus.awaitingOffers ||
                o.status == OrderStatus.offerAccepted ||
                o.status == OrderStatus.confirmed ||
                o.status == OrderStatus.delivery ||
                o.status == OrderStatus.inUse)
            .toList();
      case 2:
        return all.where((o) => o.status == OrderStatus.completed).toList();
      case 3:
        return all.where((o) => o.status == OrderStatus.cancelled).toList();
      default:
        return all;
    }
  }

  void openOrder(BuildContext context, String orderId) {
    AutoRouter.of(context).push(OrderDetailRoute(orderId: orderId));
  }

  void dispose() {}
}
