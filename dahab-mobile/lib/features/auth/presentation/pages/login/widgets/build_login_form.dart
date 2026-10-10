part of 'login_widgets_imports.dart';

class BuildLoginForm extends StatelessWidget {
  final LoginController controller;

  const BuildLoginForm({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: controller.formKey,
      child: Column(
        children: [
          BuildAuthTextField(
            label: Translate.s.auth_identifier,
            icon: AppIcons.mail,
            hint: Translate.s.auth_hint_identifier,
            controller: controller.emailController,
            fieldTypes: FieldTypes.normal,
            type: TextInputType.text,
            action: TextInputAction.next,
            textDirection: TextDirection.ltr,
            validate: (value) => value?.validateEmailOrPhone(),
          ),
          Gaps.vGap16,
          BuildAuthTextField(
            label: Translate.s.label_password,
            icon: AppIcons.lock,
            hint: Translate.s.auth_hint_password,
            controller: controller.passwordController,
            fieldTypes: FieldTypes.password,
            type: TextInputType.visiblePassword,
            action: TextInputAction.done,
            validate: (value) => value?.validateEmpty(),
            onSubmit: () => controller.onSubmit(context),
          ),
        ],
      ),
    );
  }
}
