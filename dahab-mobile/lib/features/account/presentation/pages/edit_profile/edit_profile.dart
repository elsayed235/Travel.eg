part of 'edit_profile_imports.dart';

@RoutePage(name: 'EditProfileRoute')
class EditProfile extends StatefulWidget {
  const EditProfile({super.key});

  @override
  State<EditProfile> createState() => _EditProfileState();
}

class _EditProfileState extends State<EditProfile> {
  final EditProfileController controller = EditProfileController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_edit_profile),
      body: Form(
        key: controller.formKey,
        child: ListView(
          padding: const EdgeInsetsDirectional.symmetric(
            horizontal: AppSpacing.xl,
            vertical: AppSpacing.lg,
          ),
          children: [
            BuildEditProfileAvatar(controller: controller),
            Gaps.vGap24,
            Text(
              Translate.s.account_edit_section_personal,
              style: AppTextStyle.caption(color: context.colors.text2),
            ),
            Gaps.vGap13,
            BuildEditProfileField(
              label: Translate.s.account_first_name,
              controller: controller.firstName,
              type: TextInputType.name,
              action: TextInputAction.next,
              validate: (v) => (v == null || v.trim().isEmpty) ? Translate.s.fillField : null,
            ),
            Gaps.vGap13,
            BuildEditProfileField(
              label: Translate.s.account_last_name,
              controller: controller.lastName,
              type: TextInputType.name,
              action: TextInputAction.next,
              validate: (v) => (v == null || v.trim().isEmpty) ? Translate.s.fillField : null,
            ),
            Gaps.vGap24,
            Text(
              Translate.s.account_edit_section_contact,
              style: AppTextStyle.caption(color: context.colors.text2),
            ),
            Gaps.vGap13,
            BuildEditProfileField(
              label: Translate.s.label_phone,
              controller: controller.phone,
              type: TextInputType.phone,
              action: TextInputAction.next,
              validate: (v) => (v == null || v.trim().isEmpty) ? Translate.s.fillField : null,
            ),
            Gaps.vGap13,
            BuildEditProfileField(
              label: Translate.s.label_email,
              controller: controller.email,
              type: TextInputType.emailAddress,
              action: TextInputAction.next,
              validate: (v) => (v == null || v.trim().isEmpty) ? Translate.s.fillField : null,
            ),
            Gaps.vGap13,
            BuildEditProfileField(
              label: Translate.s.account_city,
              controller: controller.city,
              type: TextInputType.text,
              action: TextInputAction.done,
              validate: (v) => (v == null || v.trim().isEmpty) ? Translate.s.fillField : null,
            ),
            Gaps.vGap24,
            AppTextButton.maxPrimary(
              text: Translate.s.save,
              onPressed: () => controller.save(context),
            ),
            Gaps.vGap18,
          ],
        ),
      ),
    );
  }
}
