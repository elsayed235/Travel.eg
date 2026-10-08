part of 'order_detail_imports.dart';

@RoutePage(name: 'OrderDetailRoute')
class OrderDetail extends StatefulWidget {
  final String orderId;

  const OrderDetail({super.key, required this.orderId});

  @override
  State<OrderDetail> createState() => _OrderDetailState();
}

class _OrderDetailState extends State<OrderDetail> {
  late final OrderDetailController controller;

  @override
  void initState() {
    super.initState();
    controller = OrderDetailController(widget.orderId);
    controller.init();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.order_detail_title),
      body: RequesterConsumer<OrderDomainModel>(
        requester: controller.detailRequester,
        loadingBuilder: (_) => AppScreenShimmer.orderDetail(),
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
        successBuilder: (context, order, _) {
          return ListView(
            padding: const EdgeInsetsDirectional.symmetric(
              horizontal: AppSpacing.xl,
              vertical: AppSpacing.lg,
            ),
            children: [
              BuildRequestLifecycleStrip(status: order.status),
              Gaps.vGap18,
              BuildOrderSummaryCard(
                order: order,
                onPeerTap: order.peerUserId == null
                    ? null
                    : () => controller.openPeerProfile(context, order.peerUserId),
              ),
              if (order.showShareCode) ...[
                Gaps.vGap18,
                BuildConfirmationCode(
                  code: order.confirmationCode!,
                  verified: order.codeVerified,
                  onCopy: () => controller.copyCode(context, order.confirmationCode!),
                  onShowFullscreen: order.codeVerified
                      ? null
                      : () => BuildHandoverRitual.open(
                            context,
                            code: order.confirmationCode!,
                            title: order.title,
                            onCopy: () =>
                                controller.copyCode(context, order.confirmationCode!),
                          ),
                ),
              ],
              if (order.showEnterCode) ...[
                Gaps.vGap18,
                BuildEnterConfirmationCode(
                  controller: controller.codeController,
                  verifyingObs: controller.verifyingObs,
                  onVerify: () => controller.verifyCode(context),
                ),
              ],
              if (order.availableActions.isNotEmpty) ...[
                Gaps.vGap18,
                BuildOrderStatusActions(
                  actions: order.availableActions,
                  labelOf: controller.statusActionLabel,
                  onSelect: (status) => controller.advanceStatus(context, status),
                  busyObs: controller.advancingObs,
                ),
              ],
              Gaps.vGap24,
              Text(
                Translate.s.order_detail_timeline,
                style: AppTextStyle.sectionTitle(color: context.colors.text),
              ),
              Gaps.vGap13,
              BuildOrderTimeline(steps: order.timeline),
              Gaps.vGap24,
            ],
          );
        },
      ),
    );
  }
}
