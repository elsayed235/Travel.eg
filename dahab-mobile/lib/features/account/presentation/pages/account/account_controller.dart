part of 'account_imports.dart';

class AccountController {
  final AccountRequester accountRequester = AccountRequester();
  final ObsValue<AccountProfileDomainModel?> profileObs = ObsValue.withInit(null);

  bool _loaded = false;
  bool _profileApplied = false;

  void ensureLoaded() {
    if (_loaded) return;
    _loaded = true;
    accountRequester.request();
  }

  void applyProfile(AccountProfileDomainModel profile) {
    if (_profileApplied) return;
    _profileApplied = true;
    profileObs.setValue(profile);
  }

  void updateLocalProfile(AccountProfileDomainModel profile) {
    profileObs.setValue(profile);
  }

  void open(BuildContext context, Widget page) {
    Navigator.of(context).push(RehlaPageRoute(builder: (_) => page));
  }

  void askDaygiFrom(BuildContext context) {
    Navigator.of(context).popUntil((route) => route.settings.name == HomeRoute.name || route.isFirst);
    ShellActions.askDaygi(null);
  }

  void openLogin(BuildContext context) {
    AutoRouter.of(context).push(const LoginRoute());
  }

  void openRegister(BuildContext context) {
    AutoRouter.of(context).push(const RegisterRoute());
  }

  void openEditProfile(BuildContext context) {
    AutoRouter.of(context).push(const EditProfileRoute());
  }

  void openNotifications(BuildContext context) {
    AutoRouter.of(context).push(const AccountNotificationsRoute());
  }

  /// Signing out keeps the traveler where they are; the tab turns into the
  /// guest view and everything public stays reachable.
  Future<void> confirmLogout(BuildContext context) async {
    final confirmed = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      showDragHandle: true,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) => BuildAccountLogoutSheet(
        onConfirm: () => Navigator.of(ctx).pop(true),
        onCancel: () => Navigator.of(ctx).pop(false),
      ),
    );
    if (confirmed == true && context.mounted) {
      await AuthSession.signOut(context);
      _loaded = false;
      _profileApplied = false;
      profileObs.setValue(null);
      if (!context.mounted) return;
      AppSnackBar.showSimpleToast(msg: Translate.s.account_logout_done);
    }
  }

  String languageLabel(Locale locale) {
    return locale.languageCode == 'en' ? Translate.s.account_lang_en : Translate.s.account_lang_ar;
  }

  void dispose() {}
}
