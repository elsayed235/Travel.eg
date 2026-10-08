part of 'forget_password_imports.dart';

class ForgetPasswordController {
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  final TextEditingController phoneController = TextEditingController();

  Future<void> onSubmit(BuildContext context) async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    await AutoRouter.of(context).push(
      ActiveAccountRoute(phone: phoneController.text.trim(), isRegister: false),
    );
  }

  void dispose() {
    phoneController.dispose();
  }
}
