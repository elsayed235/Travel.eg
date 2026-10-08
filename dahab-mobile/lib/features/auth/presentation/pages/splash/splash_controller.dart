part of 'splash_imports.dart';

class SplashController {
  /// Premium pacing: long enough to land trust, short enough to feel sharp.
  static const Duration sequenceDuration = Duration(milliseconds: 3800);

  bool _hasSession = false;

  Future<void> prepareSession(BuildContext context) async {
    await AuthSession.hydrate(context);
    _hasSession = await AuthSession.hasPersistedSession();
  }

  Future<void> goNext(BuildContext context) async {
    if (!context.mounted) return;
    if (_hasSession || AuthSession.isAuthorized(context)) {
      await AutoRouter.of(context).replace(const HomeRoute());
    } else {
      await AutoRouter.of(context).replace(const LoginRoute());
    }
  }
}
