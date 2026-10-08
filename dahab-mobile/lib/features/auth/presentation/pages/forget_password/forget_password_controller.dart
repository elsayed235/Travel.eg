part of 'forget_password_imports.dart';

class ForgetPasswordController {
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  final TextEditingController emailController = TextEditingController();

  /// The website sends this through Firebase. This build has no mail client,
  /// so we say so instead of pretending a link went out.
  Future<void> onSubmit(BuildContext context) async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    AppSnackBar.showSimpleToast(msg: Translate.s.auth_reset_unavailable);
  }

  void dispose() {
    emailController.dispose();
  }
}
