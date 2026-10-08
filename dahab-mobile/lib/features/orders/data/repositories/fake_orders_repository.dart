import 'package:flutter_tdd/core/constants/fake_images.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/core/errors/base_error.dart';
import 'package:flutter_tdd/features/orders/domain/models/order_domain_model.dart';
import 'package:flutter_tdd/features/orders/domain/repositories/orders_repository.dart';

class FakeOrdersRepository implements OrdersRepository {
  static final List<OrderDomainModel> _orders = [
    OrderDomainModel(
      id: 'ord-1',
      title: 'محتاج جهاز لابتوب خفيف للشغل زي الصورة',
      providerName: 'محل الأمل للإلكترونيات',
      peerUserId: 'u-owner-1',
      myRole: OrderPartyRole.requester,
      status: OrderStatus.delivery,
      eventDate: DateTime(2026, 10, 25),
      categoryId: 'electronics',
      categoryName: 'إلكترونيات',
      quantity: 1,
      quantityUnit: 'قطعة',
      imageUrl: FakeImages.lighting,
      confirmationCode: '482917',
      codeVerified: false,
      availableActions: const [],
      timeline: [
        OrderTimelineStep(
          title: 'تم نشر الطلب',
          subtitle: 'وصل للناس في نطاقك',
          at: DateTime(2026, 9, 10, 11, 20),
          done: true,
        ),
        OrderTimelineStep(
          title: 'تم قبول عرض',
          subtitle: 'محل الأمل للإلكترونيات',
          at: DateTime(2026, 9, 11, 9, 40),
          done: true,
        ),
        OrderTimelineStep(
          title: 'جاهز للاستلام',
          subtitle: 'الدفع كاش عند الاستلام',
          at: DateTime(2026, 9, 11, 10, 0),
          done: true,
        ),
        OrderTimelineStep(
          title: 'الاستلام',
          subtitle: 'ورّي كود الاستلام للطرف التاني',
          at: DateTime(2026, 9, 16, 10, 0),
          done: true,
          current: true,
        ),
        const OrderTimelineStep(
          title: 'تم التسليم',
          subtitle: 'بعد تأكيد الكود',
        ),
        const OrderTimelineStep(title: 'مكتمل'),
      ],
    ),
    OrderDomainModel(
      id: 'ord-list-1',
      title: 'هدوم شتوي مقاس L بحالة كويسة',
      providerName: 'أحمد حسن',
      peerUserId: 'u-renter-1',
      myRole: OrderPartyRole.owner,
      status: OrderStatus.delivery,
      eventDate: DateTime(2026, 10, 28),
      categoryId: 'clothes',
      categoryName: 'ملابس',
      quantity: 3,
      quantityUnit: 'قطعة',
      imageUrl: FakeImages.chairs,
      confirmationCode: '551028',
      codeVerified: false,
      availableActions: const [],
      timeline: [
        OrderTimelineStep(
          title: 'طلب وارد على عرضك',
          at: DateTime(2026, 9, 14, 10),
          done: true,
        ),
        OrderTimelineStep(
          title: 'تم قبول العرض',
          at: DateTime(2026, 9, 14, 10, 5),
          done: true,
        ),
        OrderTimelineStep(
          title: 'جاهز للاستلام',
          subtitle: 'الدفع كاش عند الاستلام',
          at: DateTime(2026, 9, 14, 12),
          done: true,
        ),
        OrderTimelineStep(
          title: 'في انتظار كود الاستلام',
          subtitle: 'اطلب الكود من الطالب واكتبه هنا',
          at: DateTime(2026, 9, 15, 9),
          done: true,
          current: true,
        ),
        const OrderTimelineStep(title: 'تم التسليم'),
        const OrderTimelineStep(title: 'مكتمل'),
      ],
    ),
    OrderDomainModel(
      id: 'ord-2',
      title: 'مواد غذائية جافة للمخزن — أرز وسكر وزيت',
      providerName: '—',
      peerUserId: null,
      myRole: OrderPartyRole.requester,
      status: OrderStatus.awaitingOffers,
      eventDate: DateTime(2026, 11, 2),
      categoryId: 'food',
      categoryName: 'مواد غذائية',
      quantity: 10,
      quantityUnit: 'قطعة',
      imageUrl: FakeImages.tables,
      timeline: [
        OrderTimelineStep(
          title: 'تم نشر الطلب',
          subtitle: 'في انتظار العروض',
          at: DateTime(2026, 9, 15, 16, 10),
          done: true,
          current: true,
        ),
        const OrderTimelineStep(title: 'استلام العروض'),
        const OrderTimelineStep(title: 'قبول عرض'),
        const OrderTimelineStep(title: 'جاهز للاستلام'),
        const OrderTimelineStep(
          title: 'الاستلام',
          subtitle: 'كود استلام للطالب',
        ),
        const OrderTimelineStep(title: 'مكتمل'),
      ],
    ),
    OrderDomainModel(
      id: 'ord-3',
      title: 'خلاط كهربائي منزلي شغال',
      providerName: 'مصطفى ع.',
      peerUserId: 'u-owner-2',
      myRole: OrderPartyRole.requester,
      status: OrderStatus.inUse,
      eventDate: DateTime(2026, 9, 12),
      categoryId: 'home',
      categoryName: 'أدوات منزلية',
      quantity: 1,
      quantityUnit: 'قطعة',
      imageUrl: FakeImages.lighting,
      confirmationCode: '913204',
      codeVerified: true,
      availableActions: const [OrderStatus.completed],
      timeline: [
        OrderTimelineStep(
          title: 'تم نشر الطلب',
          at: DateTime(2026, 9, 1, 10),
          done: true,
        ),
        OrderTimelineStep(
          title: 'تم قبول عرض',
          at: DateTime(2026, 9, 2, 12),
          done: true,
        ),
        OrderTimelineStep(
          title: 'جاهز للاستلام',
          at: DateTime(2026, 9, 3, 9),
          done: true,
        ),
        OrderTimelineStep(
          title: 'تم الاستلام',
          subtitle: 'تم تأكيد كود الاستلام',
          at: DateTime(2026, 9, 12, 8, 30),
          done: true,
        ),
        OrderTimelineStep(
          title: 'تم التسليم',
          subtitle: 'الدفع تم كاش',
          at: DateTime(2026, 9, 12, 9),
          done: true,
          current: true,
        ),
        const OrderTimelineStep(title: 'مكتمل'),
      ],
    ),
    OrderDomainModel(
      id: 'ord-4',
      title: 'مكتب خشب صغير للمذاكرة',
      providerName: 'تجهيزات الهدى',
      peerUserId: 'u-owner-3',
      myRole: OrderPartyRole.requester,
      status: OrderStatus.completed,
      eventDate: DateTime(2026, 8, 20),
      categoryId: 'furniture',
      categoryName: 'أثاث',
      quantity: 1,
      quantityUnit: 'قطعة',
      imageUrl: FakeImages.backdrop,
      confirmationCode: '220881',
      codeVerified: true,
      timeline: [
        OrderTimelineStep(
          title: 'تم نشر الطلب',
          at: DateTime(2026, 8, 1),
          done: true,
        ),
        OrderTimelineStep(
          title: 'تم قبول عرض',
          at: DateTime(2026, 8, 3),
          done: true,
        ),
        OrderTimelineStep(
          title: 'تم الاستلام',
          subtitle: 'تم تأكيد كود الاستلام',
          at: DateTime(2026, 8, 20),
          done: true,
        ),
        OrderTimelineStep(
          title: 'مكتمل',
          subtitle: 'الصفقة خلصت',
          at: DateTime(2026, 8, 21, 12),
          done: true,
          current: true,
        ),
      ],
    ),
  ];

  @override
  Future<MyResult<List<OrderDomainModel>>> getOrders() async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    return MyResult.isSuccess(List.unmodifiable(_orders));
  }

  @override
  Future<MyResult<OrderDomainModel>> getOrder(String id) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    final match = _orders.where((o) => o.id == id);
    if (match.isEmpty) return MyResult.notFoundError();
    return MyResult.isSuccess(match.first);
  }

  @override
  Future<MyResult<OrderDomainModel>> verifyConfirmationCode({
    required String orderId,
    required String code,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index < 0) return MyResult.notFoundError();
    final order = _orders[index];
    final expected = order.confirmationCode?.trim() ?? '';
    if (expected.isEmpty || code.trim() != expected) {
      return MyResult.isError(BaseError.unknown(msg: 'كود الاستلام غير صحيح'));
    }
    final now = DateTime.now();
    final updatedTimeline = [
      for (final step in order.timeline)
        OrderTimelineStep(
          title: step.title,
          subtitle: step.subtitle,
          at: step.at,
          done: true,
          current: false,
        ),
    ];
    final withHandover = <OrderTimelineStep>[
      ...updatedTimeline.where((s) => s.title != 'تم التسليم' && s.title != 'مكتمل'),
      OrderTimelineStep(
        title: 'تم الاستلام',
        subtitle: 'تم تأكيد كود الاستلام',
        at: now,
        done: true,
      ),
      OrderTimelineStep(
        title: 'تم التسليم',
        subtitle: 'الدفع تم كاش',
        at: now,
        done: true,
        current: true,
      ),
      const OrderTimelineStep(title: 'مكتمل'),
    ];
    final updated = order.copyWith(
      status: OrderStatus.inUse,
      codeVerified: true,
      timeline: withHandover,
      availableActions: const [OrderStatus.completed],
    );
    _orders[index] = updated;
    return MyResult.isSuccess(updated);
  }

  @override
  Future<MyResult<OrderDomainModel>> advanceOrderStatus({
    required String orderId,
    required OrderStatus status,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index < 0) return MyResult.notFoundError();
    final order = _orders[index];
    final now = DateTime.now();
    final code = order.confirmationCode ??
        (status == OrderStatus.delivery ? _generateCode() : null);

    List<OrderStatus> nextActions;
    String stepTitle;
    String? stepSubtitle;
    switch (status) {
      case OrderStatus.offerAccepted:
        nextActions = const [OrderStatus.confirmed];
        stepTitle = 'تم قبول العرض';
        break;
      case OrderStatus.confirmed:
        nextActions = const [OrderStatus.delivery];
        stepTitle = 'جاهز للاستلام';
        stepSubtitle = 'الدفع كاش عند الاستلام';
        break;
      case OrderStatus.delivery:
        nextActions = const [];
        stepTitle = 'الاستلام';
        stepSubtitle = order.isMyRequest
            ? 'ورّي كود الاستلام للطرف التاني'
            : 'اطلب الكود من الطالب واكتبه هنا';
        break;
      case OrderStatus.inUse:
        nextActions = const [OrderStatus.completed];
        stepTitle = 'تم التسليم';
        break;
      case OrderStatus.completed:
        nextActions = const [];
        stepTitle = 'مكتمل';
        break;
      default:
        nextActions = const [];
        stepTitle = status.name;
    }

    final cleared = [
      for (final step in order.timeline)
        OrderTimelineStep(
          title: step.title,
          subtitle: step.subtitle,
          at: step.at,
          done: true,
          current: false,
        ),
    ];
    final updated = order.copyWith(
      status: status,
      confirmationCode: code,
      timeline: [
        ...cleared,
        OrderTimelineStep(
          title: stepTitle,
          subtitle: stepSubtitle,
          at: now,
          done: true,
          current: true,
        ),
      ],
      availableActions: nextActions,
    );
    _orders[index] = updated;
    return MyResult.isSuccess(updated);
  }

  static String _generateCode() {
    final n = DateTime.now().millisecondsSinceEpoch % 900000 + 100000;
    return '$n';
  }
}
