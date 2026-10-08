part of 'reset_password_widgets_imports.dart';

class ResetPasswordButton extends StatelessWidget {
  final ResetPasswordController controller;

  const ResetPasswordButton({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return LoadingButton(
      title: Translate.s.auth_reset_cta,
      btnKey: controller.btnKey,
      onTap: () => controller.onSubmit(context),
      margin: EdgeInsets.zero,
      height: 56,
      borderRadius: AuthRadius.field,
    );
  }
}
