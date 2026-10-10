part of 'forget_password_widgets_imports.dart';

class BuildForgetForm extends StatelessWidget {
  final ForgetPasswordController controller;

  const BuildForgetForm({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: controller.formKey,
      child: BuildAuthTextField(
        label: Translate.s.label_email,
        icon: AppIcons.mail,
        hint: Translate.s.auth_hint_email,
        controller: controller.emailController,
        fieldTypes: FieldTypes.normal,
        type: TextInputType.emailAddress,
        action: TextInputAction.done,
        textDirection: TextDirection.ltr,
        validate: (value) => value?.validateEmail(),
        onSubmit: () => controller.onSubmit(context),
      ),
    );
  }
}
