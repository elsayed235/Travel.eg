part of 'account_my_orders_imports.dart';

/// Same orders list as the home "طلباتي" tab, opened from the account page.
@RoutePage(name: 'AccountMyOrdersRoute')
class AccountMyOrders extends StatefulWidget {
  const AccountMyOrders({super.key});

  @override
  State<AccountMyOrders> createState() => _AccountMyOrdersState();
}

class _AccountMyOrdersState extends State<AccountMyOrders> {
  final OrdersController controller = OrdersController();

  @override
  void initState() {
    super.initState();
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
      appBar: DefaultAppBar(title: Translate.s.account_my_orders_title),
      body: BuildOrdersBody(controller: controller, showTitle: false),
    );
  }
}
