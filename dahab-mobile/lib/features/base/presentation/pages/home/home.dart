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
                        child: BuildHomeTabPlaceholder(icon: Icons.explore_outlined, title: Translate.s.home_nav_discover),
                      ),
                      TickerMode(
                        enabled: index == 1,
                        child: BuildHomeTabPlaceholder(icon: Icons.route_outlined, title: Translate.s.home_nav_plan),
                      ),
                      TickerMode(
                        enabled: index == 2,
                        child: BuildHomeTabPlaceholder(icon: Icons.luggage_outlined, title: Translate.s.home_nav_trip),
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
                  centerLabel: Translate.s.home_nav_daygi,
                  onCenterTap: () => controller.openDaygi(context),
                  items: [
                    AppBottomNavItem(icon: Icons.explore_outlined, label: Translate.s.home_nav_discover),
                    AppBottomNavItem(icon: Icons.route_outlined, label: Translate.s.home_nav_plan),
                    AppBottomNavItem(icon: Icons.luggage_outlined, label: Translate.s.home_nav_trip),
                    AppBottomNavItem(icon: Icons.person_outline, label: Translate.s.home_nav_account),
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
