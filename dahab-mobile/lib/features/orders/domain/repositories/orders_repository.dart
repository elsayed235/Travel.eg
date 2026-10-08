import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/orders/domain/models/order_domain_model.dart';

abstract class OrdersRepository {
  Future<MyResult<List<OrderDomainModel>>> getOrders();

  Future<MyResult<OrderDomainModel>> getOrder(String id);

  Future<MyResult<OrderDomainModel>> verifyConfirmationCode({
    required String orderId,
    required String code,
  });

  Future<MyResult<OrderDomainModel>> advanceOrderStatus({
    required String orderId,
    required OrderStatus status,
  });
}
