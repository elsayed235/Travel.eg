part of 'active_account_imports.dart';

class ActiveAccountController {
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  String? code;
  final bool isRegister;
  final String? phone;
  final String? fullName;

  ActiveAccountController({
    this.isRegister = false,
    this.phone,
    this.fullName,
  });

  /// Resend the code. No resend endpoint yet (ApiNames.resendCode is unused),
  /// so this only confirms to the user; wire the API call here.
  void onResend() {
    code = null;
    AppSnackBar.showSimpleToast(msg: Translate.s.auth_otp_resent, type: ToastType.success);
  }

  void onComplete(String value) {
    code = value;
  }

  Future<void> onSubmit(BuildContext context) async {
    if (code == null || code!.length < 6) {
      AppSnackBar.showSimpleToast(msg: Translate.s.auth_otp_required);
      return;
    }
    if (isRegister) {
      final parts = (fullName ?? Translate.s.auth_default_name).trim().split(' ');
      final first = parts.isNotEmpty ? parts.first : Translate.s.auth_default_name;
      final last = parts.length > 1 ? parts.sublist(1).join(' ') : '';
      await AuthSession.signIn(
        context,
        user: AuthSession.demoUser(
          phone: phone ?? '01000000000',
          firstName: first,
          lastName: last,
        ),
      );
      if (!context.mounted) return;
      await AppQuietSuccess.show(
        context,
        title: Translate.s.auth_register_success,
        subtitle: Translate.s.auth_login_success_hint,
      );
      if (!context.mounted) return;
      await AutoRouter.of(context).replaceAll([const HomeRoute()]);
      return;
    }
    await AutoRouter.of(context).push(const ResetPasswordRoute());
  }
}
