part of 'login_widgets_imports.dart';

class BuildLoginFooter extends StatelessWidget {
  final LoginController controller;

  const BuildLoginFooter({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return BuildAuthFooterLink(
      prompt: Translate.s.auth_no_account,
      action: Translate.s.auth_create_account,
      onTap: () => controller.openRegister(context),
    );
  }
}
