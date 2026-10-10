part of 'splash_imports.dart';

class SplashController {
  static const _onboardedKey = 'onboarded_v1';

  bool needsOnboarding = false;

  Future<void> prepare(BuildContext context) async {
    await AuthSession.hydrate(context);
    final prefs = await SharedPreferences.getInstance();
    needsOnboarding = !(prefs.getBool(_onboardedKey) ?? false);
  }

  Future<void> finishOnboarding(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardedKey, true);
    if (context.mounted) await enterHome(context);
  }

  /// Browsing never needs an account; sign-in is asked for at the moment it
  /// matters (holding a booking, opening a trip).
  Future<void> enterHome(BuildContext context) async {
    if (!context.mounted) return;
    await AutoRouter.of(context).replace(const HomeRoute());
  }
}
