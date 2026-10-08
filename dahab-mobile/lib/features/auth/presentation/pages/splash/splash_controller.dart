part of 'splash_imports.dart';

class SplashController {
  /// Once per process, same idea as the website's sessionStorage flag.
  static var seen = false;

  bool _hasSession = false;

  Future<void> prepareSession(BuildContext context) async {
    await AuthSession.hydrate(context);
    _hasSession = await AuthSession.hasPersistedSession();
  }

  Future<void> goNext(BuildContext context) async {
    seen = true;
    if (!context.mounted) return;
    if (_hasSession || AuthSession.isAuthorized(context)) {
      await AutoRouter.of(context).replace(const HomeRoute());
    } else {
      await AutoRouter.of(context).replace(const LoginRoute());
    }
  }
}
