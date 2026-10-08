part of 'login_widgets_imports.dart';

class BuildLoginButton extends StatelessWidget {
  final LoginController controller;

  const BuildLoginButton({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return LoadingButton(
      title: Translate.s.auth_login_cta,
      btnKey: controller.btnKey,
      onTap: () => controller.onSubmit(context),
      margin: EdgeInsets.zero,
      height: 56,
      borderRadius: AuthRadius.field,
    );
  }
}
