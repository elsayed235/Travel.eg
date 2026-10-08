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

  Future<void> openLanguageSheet(BuildContext context) async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) => BuildAccountLanguageSheet(
        currentCode: ctx.read<DeviceCubit>().state.model.locale.languageCode,
        onSelect: (locale) async {
          Navigator.of(ctx).pop();
          await DeviceSettings.setLanguage(context, locale);
          if (context.mounted) {
            AppSnackBar.showSimpleToast(msg: Translate.s.account_language_updated);
          }
        },
      ),
    );
  }

  Future<void> openThemeSheet(BuildContext context) async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) => BuildAccountThemeSheet(
        currentMode: ctx.read<DeviceCubit>().state.model.themeMode,
        onSelect: (mode) async {
          Navigator.of(ctx).pop();
          await DeviceSettings.setTheme(context, mode);
          if (context.mounted) {
            AppSnackBar.showSimpleToast(msg: Translate.s.account_theme_updated);
          }
        },
      ),
    );
  }

  void openEditProfile(BuildContext context) {
    AutoRouter.of(context).push(const EditProfileRoute());
  }

  void openNotifications(BuildContext context) {
    AutoRouter.of(context).push(const AccountNotificationsRoute());
  }

  void openHelp(BuildContext context) {
    AutoRouter.of(context).push(const AccountHelpRoute());
  }

  void openPrivacy(BuildContext context) {
    AutoRouter.of(context).push(const AccountPrivacyRoute());
  }

  void openTerms(BuildContext context) {
    AutoRouter.of(context).push(const TermsRoute());
  }

  Future<void> confirmLogout(BuildContext context) async {
    final confirmed = await showModalBottomSheet<bool>(
      context: context,
      backgroundColor: context.colors.surface1,
      elevation: 0,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
      builder: (ctx) => BuildAccountLogoutSheet(
        onConfirm: () => Navigator.of(ctx).pop(true),
        onCancel: () => Navigator.of(ctx).pop(false),
      ),
    );
    if (confirmed == true && context.mounted) {
      await AuthSession.signOut(context);
      if (!context.mounted) return;
      AppSnackBar.showSimpleToast(msg: Translate.s.account_logout_done);
      AutoRouter.of(context).replace(const LoginRoute());
    }
  }

  String languageLabel(Locale locale) {
    return locale.languageCode == 'en'
        ? Translate.s.account_lang_en
        : Translate.s.account_lang_ar;
  }

  String themeLabel(AdaptiveThemeMode mode) {
    return switch (mode) {
      AdaptiveThemeMode.light => Translate.s.account_theme_light,
      AdaptiveThemeMode.dark => Translate.s.account_theme_dark,
      AdaptiveThemeMode.system => Translate.s.account_theme_system,
    };
  }

  String radiusLabel(int km) => Translate.s.account_radius_value(km.toLocaleDigits);

  void dispose() {}
}
