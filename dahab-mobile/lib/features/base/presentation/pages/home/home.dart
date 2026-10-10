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
    controller.init(context);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  static String _nav(String name) => 'assets/icons/nav/$name.svg';

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) controller.onBack();
      },
      child: _shell(context),
    );
  }

  Widget _shell(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      // Home's hero and the Discover map run under the status bar; the other
      // tabs keep the safe area themselves.
      body: ObsValueConsumer(
        observable: controller.navIndexObs,
        builder: (context, index) {
          final now = DateTime.now();
          final onTrip = TripStore.instance.bundleObs.getValue()?.trip.dayOf(now) != null;
          final media = MediaQuery.of(context);
          // The bar floats over the tabs; like iOS it steps aside for the keyboard.
          final keyboard = media.viewInsets.bottom > 0;
          final overlap = keyboard ? media.padding.bottom : AppBottomNav.overlap(context);
          return Stack(
            children: [
              Positioned.fill(
                child: MediaQuery(
                  data: media.copyWith(padding: media.padding.copyWith(bottom: overlap)),
                  child: IndexedStack(
                    index: index,
                    // TickerMode pauses animations on tabs that are not showing.
                    children: [
                      TickerMode(
                        enabled: index == ShellActions.home,
                        child: DiscoverTab(
                          controller: controller.discoverController,
                          programmesRequester: controller.planController.programmesRequester,
                          scrollController: controller.discoverScroll,
                          onProgramme: (programme) => controller.openProgramme(context, programme),
                          onSeeAllPlans: controller.showAllPlans,
                        ),
                      ),
                      TickerMode(
                        enabled: index == ShellActions.discover,
                        child: ExploreTab(controller: controller.exploreController),
                      ),
                      TickerMode(
                        enabled: index == ShellActions.daygi,
                        child: SafeArea(bottom: false, child: DaygiTab(controller: controller.daygiController)),
                      ),
                      TickerMode(
                        enabled: index == ShellActions.trip,
                        child: SafeArea(
                          bottom: false,
                          child: TripTab(
                            controller: controller.todayController,
                            fallback: ObsValueConsumer(
                              observable: controller.planController.savedObs,
                              builder: (context, plans) {
                                if (plans.isEmpty) {
                                  return BuildTripEmpty(
                                    destination: context.destination,
                                    onPlan: () => controller.openPlan(const []),
                                  );
                                }
                                return BuildSavedPlans(
                                  plans: plans,
                                  onOpen: (plan) => controller.openSavedPlan(context, plan),
                                  onRemove: (plan) => controller.planController.removePlan(plan.id),
                                  onNew: () => controller.openPlan(const []),
                                );
                              },
                            ),
                          ),
                        ),
                      ),
                      TickerMode(
                        enabled: index == ShellActions.account,
                        child: SafeArea(
                          bottom: false,
                          child: BuildAccountBody(controller: controller.accountController),
                        ),
                      ),
                      TickerMode(
                        enabled: index == HomeController.planIndex,
                        child: SafeArea(
                          bottom: false,
                          child: Column(
                            children: [
                              Align(
                                alignment: AlignmentDirectional.centerStart,
                                child: Padding(
                                  padding: const EdgeInsetsDirectional.only(start: AppSpacing.xs, top: AppSpacing.xs),
                                  child: IconButton(
                                    onPressed: controller.closePlan,
                                    tooltip: Translate.s.home_back,
                                    style: IconButton.styleFrom(splashFactory: NoSplash.splashFactory),
                                    icon: AppIcon.ui(AppIcons.close, color: context.colors.text2),
                                  ),
                                ),
                              ),
                              Expanded(
                                child: PlanTab(
                                  controller: controller.planController,
                                  presetObs: controller.planPresetObs,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (!keyboard)
                PositionedDirectional(
                  start: 0,
                  end: 0,
                  bottom: AppBottomNav.overlap(context),
                  child: IgnorePointer(
                    child: ObsValueConsumer(
                      observable: controller.exitHintObs,
                      builder: (context, show) => BuildExitHint(visible: show),
                    ),
                  ),
                ),
              if (!keyboard)
                PositionedDirectional(
                  start: 0,
                  end: 0,
                  bottom: AppBottomNav.overlap(context) + AppSpacing.sm,
                  child: ObsValueConsumer(
                    observable: controller.planController.justSavedObs,
                    builder: (context, trip) => BuildSavedToast(trip: trip, onSee: controller.planController.seePlans),
                  ),
                ),
              if (!keyboard)
                PositionedDirectional(
                  start: 0,
                  end: 0,
                  bottom: 0,
                  child: AppBottomNav(
                    index: controller.barIndex(index),
                    tempo: MediaQuery.disableAnimationsOf(context) ? Duration.zero : context.destination.tempo,
                    onChanged: (i) => controller.onNavChanged(context, i),
                    items: [
                      AppBottomNavItem(
                        icon: _nav('home'),
                        activeIcon: _nav('home_fill'),
                        label: Translate.s.home_nav_home,
                      ),
                      AppBottomNavItem(
                        icon: _nav('discover'),
                        activeIcon: _nav('discover_fill'),
                        label: Translate.s.home_nav_discover,
                      ),
                      AppBottomNavItem(
                        icon: _nav('daygi'),
                        activeIcon: _nav('daygi_fill'),
                        label: Translate.s.home_nav_daygi,
                      ),
                      AppBottomNavItem(
                        icon: _nav(onTrip ? 'today' : 'trip'),
                        activeIcon: _nav(onTrip ? 'today_fill' : 'trip_fill'),
                        label: onTrip ? Translate.s.home_nav_today : Translate.s.home_nav_trip,
                      ),
                      AppBottomNavItem(
                        icon: _nav('account'),
                        activeIcon: _nav('account_fill'),
                        label: Translate.s.home_nav_account,
                      ),
                    ],
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
