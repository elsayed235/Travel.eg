part of 'register_imports.dart';

class RegisterController {
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> onSubmit(BuildContext context) async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    btnKey.currentState?.animateForward();
    final outcome = await AuthRemote.register(
      name: nameController.text.trim(),
      email: emailController.text.trim(),
      phone: phoneController.text.trim(),
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
      title: Translate.s.auth_register_success,
      subtitle: Translate.s.auth_login_success_hint,
    );
    if (!context.mounted) return;
    await AuthSession.leaveAuth(context);
  }

  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
  }
}
