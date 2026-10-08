import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/features/orders/data/repositories/fake_orders_repository.dart';
import 'package:flutter_tdd/features/orders/domain/models/order_domain_model.dart';
import 'package:flutter_tdd/features/orders/domain/repositories/orders_repository.dart';

class OrdersListRequester extends Requester<List<OrderDomainModel>> {
  OrdersListRequester({OrdersRepository? repository})
      : _repository = repository ?? FakeOrdersRepository();

  final OrdersRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) loadingState();
    final result = await _repository.getOrders();
    result.when(
      isSuccess: (data) {
        if (data != null) successState(data);
      },
      isError: (error) => failedState(error, () => request(fromRemote: fromRemote)),
    );
  }
}

class OrderDetailRequester extends Requester<OrderDomainModel> {
  OrderDetailRequester({
    required this.orderId,
    OrdersRepository? repository,
  }) : _repository = repository ?? FakeOrdersRepository();

  final String orderId;
  final OrdersRepository _repository;

  @override
  Future<void> request({bool fromRemote = true}) async {
    if (hasNoData) loadingState();
    final result = await _repository.getOrder(orderId);
    result.when(
      isSuccess: (data) {
        if (data != null) successState(data);
      },
      isError: (error) => failedState(error, () => request(fromRemote: fromRemote)),
    );
  }

  void applyLocal(OrderDomainModel order) => successState(order);
}
