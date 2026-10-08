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
            return ListView(
                  padding: EdgeInsetsDirectional.fromSTEB(
        AppSpacing.xl,
        AppSpacing.lg,
        AppSpacing.xl,
        AppSpacing.lg + MediaQuery.paddingOf(context).bottom,
      ),
                  children: [
                RehlaMark(size: 36, color: context.colors.button, sunColor: context.colors.highlight),
                Gaps.vGap13,
                Text(
                  Translate.s.account_title,
                  style: AppTextStyle.screenTitle(color: context.colors.text).copyWith(fontFamily: AppFonts.display(context)),
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
                    Padding(
                      padding: const EdgeInsetsDirectional.fromSTEB(
                        AppSpacing.lg,
                        AppSpacing.md,
                        AppSpacing.lg,
                        AppSpacing.md,
                      ),
                      child: Align(
                        alignment: AlignmentDirectional.centerStart,
                        child: const BuildPreferenceSwitches(),
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
  }
}
