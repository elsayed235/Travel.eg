part of 'reset_password_imports.dart';

class ResetPasswordController {
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  final TextEditingController password = TextEditingController();
  final TextEditingController confirmPassword = TextEditingController();

  Future<void> onSubmit(BuildContext context) async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    await AppQuietSuccess.show(
      context,
      title: Translate.s.auth_reset_success,
      subtitle: Translate.s.auth_reset_success_hint,
    );
    if (!context.mounted) return;
    await AutoRouter.of(context).replaceAll([const LoginRoute()]);
  }

  void dispose() {
    password.dispose();
    confirmPassword.dispose();
  }
}
