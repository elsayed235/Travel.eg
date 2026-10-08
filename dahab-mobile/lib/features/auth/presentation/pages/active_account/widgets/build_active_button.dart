part of 'active_account_widgets_imports.dart';

class BuildActiveButton extends StatelessWidget {
  final ActiveAccountController controller;

  const BuildActiveButton({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return LoadingButton(
      title: Translate.s.auth_otp_cta,
      btnKey: controller.btnKey,
      onTap: () => controller.onSubmit(context),
      margin: EdgeInsets.zero,
      height: 56,
      borderRadius: AuthRadius.field,
    );
  }
}
