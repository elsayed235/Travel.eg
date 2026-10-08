part of 'home_imports.dart';

@RoutePage(name: 'HomeRoute')
class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final HomeController controller = HomeController();

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
      body: SafeArea(
        bottom: false,
        child: ObsValueConsumer(
          observable: controller.navIndexObs,
          builder: (context, index) {
            return Column(
              children: [
                Expanded(
                  child: IndexedStack(
                    index: index,
                    // TickerMode pauses animations on tabs that are not showing.
                    children: [
                      TickerMode(
                        enabled: index == 0,
                        child: BuildHomeFeedBody(controller: controller),
                      ),
                      TickerMode(
                        enabled: index == 1,
                        child: BuildExploreBody(controller: controller.exploreController),
                      ),
                      TickerMode(
                        enabled: index == 2,
                        child: BuildOrdersBody(controller: controller.ordersController),
                      ),
                      TickerMode(
                        enabled: index == 3,
                        child: BuildAccountBody(controller: controller.accountController),
                      ),
                    ],
                  ),
                ),
                AppBottomNav(
                  index: index,
                  onChanged: (i) => controller.onNavChanged(context, i),
                  centerLabel: Translate.s.home_nav_request,
                  onCenterTap: () => controller.openCreateRequest(context),
                  items: [
                    AppBottomNavItem(
                      icon: Icons.home_outlined,
                      label: Translate.s.home_nav_home,
                    ),
                    AppBottomNavItem(
                      icon: Icons.explore_outlined,
                      label: Translate.s.home_nav_explore,
                    ),
                    AppBottomNavItem(
                      icon: Icons.receipt_long_outlined,
                      label: Translate.s.home_nav_orders,
                    ),
                    AppBottomNavItem(
                      icon: Icons.person_outline,
                      label: Translate.s.home_nav_account,
                    ),
                  ],
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
