part of 'order_detail_imports.dart';

class OrderDetailController {
  final String orderId;
  late final OrderDetailRequester detailRequester;
  final OrdersRepository _repo;
  final TextEditingController codeController = TextEditingController();
  final ObsValue<bool> verifyingObs = ObsValue.withInit(false);
  final ObsValue<bool> advancingObs = ObsValue.withInit(false);

  OrderDetailController(this.orderId, {OrdersRepository? repository})
      : _repo = repository ?? FakeOrdersRepository() {
    detailRequester = OrderDetailRequester(orderId: orderId, repository: _repo);
  }

  void init() {
    detailRequester.request();
  }

  Future<void> copyCode(BuildContext context, String code) async {
    await Clipboard.setData(ClipboardData(text: code));
    AppSnackBar.showSuccessSnackBar(Translate.s.order_detail_code_copied);
  }

  Future<void> verifyCode(BuildContext context) async {
    if (verifyingObs.getValue()) return;
    final code = codeController.text.trim();
    if (code.isEmpty) {
      AppSnackBar.showSimpleToast(msg: Translate.s.order_detail_code_required);
      return;
    }
    verifyingObs.setValue(true);
    final result = await _repo.verifyConfirmationCode(orderId: orderId, code: code);
    verifyingObs.setValue(false);
    result.when(
      isSuccess: (data) async {
        if (data == null) return;
        codeController.clear();
        detailRequester.applyLocal(data);
        if (!context.mounted) return;
        await AppQuietSuccess.show(
          context,
          title: Translate.s.order_detail_code_verified,
          subtitle: Translate.s.order_detail_cash_note,
        );
      },
      isError: (error) {
        AppSnackBar.showSimpleToast(msg: error.message);
      },
    );
  }

  Future<void> advanceStatus(BuildContext context, OrderStatus status) async {
    if (advancingObs.getValue()) return;
    advancingObs.setValue(true);
    final result = await _repo.advanceOrderStatus(orderId: orderId, status: status);
    advancingObs.setValue(false);
    result.when(
      isSuccess: (data) {
        if (data == null) return;
        detailRequester.applyLocal(data);
        AppSnackBar.showSimpleToast(
          msg: Translate.s.order_detail_status_updated,
          type: ToastType.success,
        );
      },
      isError: (error) {
        AppSnackBar.showSimpleToast(msg: error.message);
      },
    );
  }

  void openPeerProfile(BuildContext context, String? userId) {
    if (userId == null || userId.isEmpty) return;
    AutoRouter.of(context).push(UserPublicProfileRoute(userId: userId));
  }

  String statusActionLabel(OrderStatus status) {
    return switch (status) {
      OrderStatus.offerAccepted => Translate.s.chat_status_accepted,
      OrderStatus.confirmed => Translate.s.orders_status_confirmed,
      OrderStatus.delivery => Translate.s.chat_status_delivery,
      OrderStatus.inUse => Translate.s.chat_status_in_use,
      OrderStatus.completed => Translate.s.chat_status_completed,
      _ => status.name,
    };
  }

  void dispose() {
    codeController.dispose();
  }
}
