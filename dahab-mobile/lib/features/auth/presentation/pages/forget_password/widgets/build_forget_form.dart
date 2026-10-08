part of 'forget_password_widgets_imports.dart';

class BuildForgetForm extends StatelessWidget {
  final ForgetPasswordController controller;

  const BuildForgetForm({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: controller.formKey,
      child: BuildAuthTextField(
        label: Translate.s.label_phone,
        icon: Icons.phone_iphone_rounded,
        hint: Translate.s.auth_hint_phone,
        controller: controller.phoneController,
        fieldTypes: FieldTypes.normal,
        type: TextInputType.phone,
        action: TextInputAction.done,
        textDirection: TextDirection.ltr,
        validate: (value) => value?.validatePhone(),
        onSubmit: () => controller.onSubmit(context),
      ),
    );
  }
}
