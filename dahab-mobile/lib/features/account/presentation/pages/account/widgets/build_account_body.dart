part of 'account_widgets_imports.dart';

class BuildAccountBody extends StatelessWidget {
  final AccountController controller;

  const BuildAccountBody({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthCubit, AuthState>(
      builder: (context, authState) {
        if (!authState.authorized) {
          return BuildAccountGuestBody(controller: controller);
        }
        return RequesterConsumer<AccountProfileDomainModel>(
          requester: controller.accountRequester,
          loadingBuilder: (_) => const SizedBox.shrink(),
          failureBuilder: (context, error, callback) => Center(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(error.message, style: AppTextStyle.body(color: context.colors.red)),
                  Gaps.vGap13,
                  TextButton(onPressed: callback, child: Text(Translate.s.retry)),
                ],
              ),
            ),
          ),
          successBuilder: (context, profile, _) {
            controller.applyProfile(profile);
            return BlocBuilder<DeviceCubit, DeviceState>(
              builder: (context, deviceState) {
                return ListView(
                  padding: const EdgeInsetsDirectional.symmetric(
                    horizontal: AppSpacing.xl,
                    vertical: AppSpacing.lg,
                  ),
                  children: [
                Text(
                  Translate.s.account_title,
                  style: AppTextStyle.screenTitle(color: context.colors.text),
                ),
                Gaps.vGap18,
                BuildAccountHeader(
                  profile: profile,
                  onEdit: () => controller.openEditProfile(context),
                ),
                Gaps.vGap18,
                BuildAccountSection(
                  title: Translate.s.account_section_profile,
                  children: [
                    BuildAccountTile(
                      icon: Icons.person_outline,
                      title: Translate.s.account_edit_profile,
                      subtitle: Translate.s.account_edit_profile_hint,
                      onTap: () => controller.openEditProfile(context),
                    ),
                    BuildAccountTile(
                      icon: Icons.notifications_none_rounded,
                      title: Translate.s.account_notifications,
                      subtitle: Translate.s.account_notifications_hint,
                      onTap: () => controller.openNotifications(context),
                      showDivider: false,
                    ),
                  ],
                ),
                Gaps.vGap18,
                BuildAccountSection(
                  title: Translate.s.account_section_preferences,
                  children: [
                    BuildAccountTile(
                      icon: Icons.language,
                      title: Translate.s.label_app_language,
                      subtitle: controller.languageLabel(deviceState.model.locale),
                      onTap: () => controller.openLanguageSheet(context),
                    ),
                    BuildAccountDarkModeRow(
                      isDark: DeviceSettings.isDark(
                        context,
                        deviceState.model.themeMode,
                      ),
                    ),
                  ],
                ),
                Gaps.vGap18,
                BuildAccountSection(
                  title: Translate.s.account_section_support,
                  children: [
                    BuildAccountTile(
                      icon: Icons.help_outline,
                      title: Translate.s.account_help,
                      subtitle: Translate.s.account_help_hint,
                      onTap: () => controller.openHelp(context),
                    ),
                    BuildAccountTile(
                      icon: Icons.description_outlined,
                      title: Translate.s.account_terms,
                      onTap: () => controller.openTerms(context),
                    ),
                    BuildAccountTile(
                      icon: Icons.privacy_tip_outlined,
                      title: Translate.s.account_privacy,
                      onTap: () => controller.openPrivacy(context),
                      showDivider: false,
                    ),
                  ],
                ),
                Gaps.vGap18,
                BuildAccountSection(
                  title: Translate.s.account_section_about,
                  children: [
                    BuildAccountTile(
                      icon: Icons.info_outline,
                      title: Translate.s.account_version,
                      subtitle: '1.0.0',
                      showChevron: false,
                      showDivider: false,
                    ),
                  ],
                ),
                Gaps.vGap24,
                AppTextButton.maxWhite(
                  text: Translate.s.label_logout,
                  onPressed: () => controller.confirmLogout(context),
                ),
                Gaps.vGap24,
              ],
            );
          },
        );
          },
        );
      },
    );
  }
}
