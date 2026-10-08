part of 'register_imports.dart';

class RegisterController {
  final GlobalKey<FormState> formKey = GlobalKey();
  final GlobalKey<CustomButtonState> btnKey = GlobalKey();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> onSubmit(BuildContext context) async {
    if (!(formKey.currentState?.validate() ?? false)) return;
    await AutoRouter.of(context).push(
      ActiveAccountRoute(
        phone: phoneController.text.trim(),
        isRegister: true,
        fullName: nameController.text.trim(),
      ),
    );
  }

  void dispose() {
    nameController.dispose();
    phoneController.dispose();
    passwordController.dispose();
  }
}
