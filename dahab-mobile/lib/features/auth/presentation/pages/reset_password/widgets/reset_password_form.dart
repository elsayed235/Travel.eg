part of 'reset_password_widgets_imports.dart';

class ResetPasswordForm extends StatelessWidget {
  final ResetPasswordController controller;

  const ResetPasswordForm({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: controller.formKey,
      child: Column(
        children: [
          BuildAuthTextField(
            label: Translate.s.label_password,
            icon: AppIcons.lock,
            hint: Translate.s.auth_hint_password,
            controller: controller.password,
            fieldTypes: FieldTypes.password,
            type: TextInputType.visiblePassword,
            action: TextInputAction.next,
            validate: (value) => value?.validatePassword(),
          ),
          BuildAuthPasswordRules(controller: controller.password),
          Gaps.vGap16,
          BuildAuthTextField(
            label: Translate.s.label_confirm_password,
            icon: AppIcons.lock,
            hint: Translate.s.auth_hint_password,
            controller: controller.confirmPassword,
            fieldTypes: FieldTypes.password,
            type: TextInputType.visiblePassword,
            action: TextInputAction.done,
            validate: (value) => value?.validatePasswordConfirm(pass: controller.password.text),
            onSubmit: () => controller.onSubmit(context),
          ),
        ],
      ),
    );
  }
}
