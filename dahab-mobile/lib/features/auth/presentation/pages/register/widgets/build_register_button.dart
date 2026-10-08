part of 'register_widgets_imports.dart';

class BuildRegisterButton extends StatelessWidget {
  final RegisterController controller;

  const BuildRegisterButton({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return LoadingButton(
      title: Translate.s.auth_register_cta,
      btnKey: controller.btnKey,
      onTap: () => controller.onSubmit(context),
      margin: EdgeInsets.zero,
      height: 56,
      borderRadius: AuthRadius.field,
    );
  }
}
