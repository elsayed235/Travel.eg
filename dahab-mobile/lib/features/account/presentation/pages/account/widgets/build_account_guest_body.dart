part of 'account_widgets_imports.dart';

class BuildAccountGuestBody extends StatelessWidget {
  final AccountController controller;

  const BuildAccountGuestBody({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
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
          Translate.s.auth_guest_account_title,
          style: AppTextStyle.screenTitle(color: context.colors.text).copyWith(fontFamily: AppFonts.display(context)),
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
          children: const [
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.md),
              child: Align(
                alignment: AlignmentDirectional.centerStart,
                child: BuildPreferenceSwitches(),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
