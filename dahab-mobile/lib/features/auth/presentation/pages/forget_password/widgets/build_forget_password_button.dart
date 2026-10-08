part of 'forget_password_widgets_imports.dart';

class BuildForgetPasswordButton extends StatelessWidget {
  final ForgetPasswordController controller;

  const BuildForgetPasswordButton({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return LoadingButton(
      title: Translate.s.auth_forget_cta,
      btnKey: controller.btnKey,
      onTap: () => controller.onSubmit(context),
      margin: EdgeInsets.zero,
      height: 56,
      borderRadius: AuthRadius.field,
    );
  }
}
