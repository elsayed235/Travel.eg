part of 'login_imports.dart';

class LoginController {
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> onSubmit(BuildContext context) async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    btnKey.currentState?.animateForward();
    final outcome = await AuthRemote.signIn(
      email: emailController.text.trim(),
      password: passwordController.text,
    );
    if (!context.mounted) return;
    btnKey.currentState?.animateReverse();
    final user = outcome.user;
    if (!outcome.ok || user == null) {
      AppSnackBar.showSimpleToast(msg: outcome.error ?? Translate.s.auth_server_missing);
      return;
    }
    await AuthSession.signIn(context, user: user, token: outcome.token);
    if (!context.mounted) return;
    await AppQuietSuccess.show(
      context,
      title: Translate.s.auth_login_success,
      subtitle: Translate.s.auth_login_success_hint,
    );
    if (!context.mounted) return;
    await AuthSession.leaveAuth(context);
  }

  Future<void> continueAsGuest(BuildContext context) async {
    final router = AutoRouter.of(context);
    if (router.stack.any((page) => page.name == HomeRoute.name)) {
      await router.maybePop();
      return;
    }
    await AuthSession.continueAsGuest(context);
    if (!context.mounted) return;
    await router.replace(const HomeRoute());
  }

  void openForgetPassword(BuildContext context) {
    AutoRouter.of(context).push(const ForgetPasswordRoute());
  }

  void openRegister(BuildContext context) {
    AutoRouter.of(context).push(const RegisterRoute());
  }

  void dispose() {
    emailController.dispose();
    passwordController.dispose();
  }
}
