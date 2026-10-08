part of 'home_imports.dart';

/// The app shell: four places in the same order as the website's tab bar
/// (Discover · Plan · Trip/Today · Account) with DayGi as the centre action.
class HomeController {
  final AccountController accountController = AccountController();
  final ObsValue<int> navIndexObs = ObsValue.withInit(0);

  void init() {
    accountController.ensureLoaded();
  }

  void onNavChanged(BuildContext context, int index) {
    navIndexObs.setValue(index);
    if (index == 3) accountController.ensureLoaded();
  }

  /// DayGi opens from the centre of the tab bar.
  void openDaygi(BuildContext context) {
    // Wired to the DayGi feature in its own commit.
  }

  void dispose() {
    accountController.dispose();
  }
}
