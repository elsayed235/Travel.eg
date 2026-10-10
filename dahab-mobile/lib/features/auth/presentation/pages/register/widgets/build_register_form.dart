part of 'register_widgets_imports.dart';

class BuildRegisterForm extends StatelessWidget {
  final RegisterController controller;

  const BuildRegisterForm({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: controller.formKey,
      child: Column(
        children: [
          BuildAuthTextField(
            label: Translate.s.label_full_name,
            icon: AppIcons.user,
            hint: Translate.s.auth_hint_name,
            controller: controller.nameController,
            fieldTypes: FieldTypes.normal,
            type: TextInputType.name,
            action: TextInputAction.next,
            validate: (value) => value?.validateEmpty(),
          ),
          Gaps.vGap16,
          BuildAuthTextField(
            label: Translate.s.label_email,
            icon: AppIcons.mail,
            hint: Translate.s.auth_hint_email,
            controller: controller.emailController,
            fieldTypes: FieldTypes.normal,
            type: TextInputType.emailAddress,
            action: TextInputAction.next,
            textDirection: TextDirection.ltr,
            validate: (value) => value?.validateEmail(),
          ),
          Gaps.vGap16,
          BuildAuthTextField(
            label: Translate.s.label_phone,
            icon: AppIcons.device,
            hint: Translate.s.auth_hint_phone_optional,
            controller: controller.phoneController,
            fieldTypes: FieldTypes.normal,
            type: TextInputType.phone,
            action: TextInputAction.next,
            textDirection: TextDirection.ltr,
            validate: (value) => value?.noValidate(),
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
