part of 'home_imports.dart';

/// The app shell: four places in the same order as the website's tab bar
/// (Discover · Plan · Trip/Today · Account) with DayGi as the centre action.
class HomeController {
  final AccountController accountController = AccountController();
  late final DiscoverController discoverController = DiscoverController(
    onPlan: openPlan,
    onAskDaygi: openDaygi,
  );

  /// What the planner should start with when a door or pick opened it.
  final ObsValue<List<PlanVibe>?> planPresetObs = ObsValue.withInit(null);
  final ObsValue<int> navIndexObs = ObsValue.withInit(0);

  void init() {
    accountController.ensureLoaded();
  }

  void onNavChanged(BuildContext context, int index) {
    navIndexObs.setValue(index);
    if (index == 3) accountController.ensureLoaded();
  }

  /// Switch to the Plan tab, already set to [vibes].
  void openPlan(List<PlanVibe> vibes) {
    planPresetObs.setValue(vibes);
    navIndexObs.setValue(1);
  }

  /// DayGi opens from the centre of the tab bar, or from a door with a
  /// question already asked.
  void openDaygi([String? question]) {
    // Wired to the DayGi feature in its own commit.
  }

  void dispose() {
    accountController.dispose();
    discoverController.dispose();
  }
}
