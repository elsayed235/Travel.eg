part of 'account_widgets_imports.dart';

class BuildAccountGuestBody extends StatelessWidget {
  final AccountController controller;

  const BuildAccountGuestBody({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsetsDirectional.symmetric(
        horizontal: AppSpacing.xl,
        vertical: AppSpacing.lg,
      ),
      children: [
        Text(
          Translate.s.auth_guest_account_title,
          style: AppTextStyle.screenTitle(color: context.colors.text),
        ),
        Gaps.vGap9,
        Text(
          Translate.s.auth_guest_account_subtitle,
          style: AppTextStyle.body(color: context.colors.text2),
        ),
        Gaps.vGap24,
        AppTextButton.maxPrimary(
          text: Translate.s.auth_guest_login_cta,
          onPressed: () => AutoRouter.of(context).push(const LoginRoute()),
        ),
        Gaps.vGap13,
        AppTextButton.maxCustom(
          text: Translate.s.auth_create_account,
          onPressed: () => AutoRouter.of(context).push(const RegisterRoute()),
          bgColor: context.colors.surface2,
          txtColor: context.colors.text,
          maxHeight: 52,
        ),
        Gaps.vGap24,
        BuildAccountSection(
          title: Translate.s.account_section_preferences,
          children: [
            BuildAccountTile(
              icon: Icons.language,
              title: Translate.s.label_app_language,
              subtitle: controller.languageLabel(
                context.read<DeviceCubit>().state.model.locale,
              ),
              onTap: () => controller.openLanguageSheet(context),
            ),
            BuildAccountDarkModeRow(
              isDark: DeviceSettings.isDark(
                context,
                context.read<DeviceCubit>().state.model.themeMode,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
