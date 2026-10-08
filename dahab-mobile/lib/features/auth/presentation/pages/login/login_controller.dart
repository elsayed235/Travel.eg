part of 'login_imports.dart';

class LoginController {
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> onSubmit(BuildContext context) async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    await AuthSession.signIn(
      context,
      user: AuthSession.demoUser(phone: phoneController.text.trim()),
    );
    if (!context.mounted) return;
    await AppQuietSuccess.show(
      context,
      title: Translate.s.auth_login_success,
      subtitle: Translate.s.auth_login_success_hint,
    );
    if (!context.mounted) return;
    await AutoRouter.of(context).replace(const HomeRoute());
  }

  Future<void> continueAsGuest(BuildContext context) async {
    await AuthSession.continueAsGuest(context);
    if (!context.mounted) return;
    await AutoRouter.of(context).replace(const HomeRoute());
  }

  void openForgetPassword(BuildContext context) {
    AutoRouter.of(context).push(const ForgetPasswordRoute());
  }

  void openRegister(BuildContext context) {
    AutoRouter.of(context).push(const RegisterRoute());
  }

  void dispose() {
    phoneController.dispose();
    passwordController.dispose();
  }
}
