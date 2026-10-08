part of 'login_widgets_imports.dart';

class BuildLoginFooter extends StatelessWidget {
  final LoginController controller;

  const BuildLoginFooter({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        BuildAuthSecondaryButton(
          label: Translate.s.auth_browse_guest,
          icon: Icons.explore_outlined,
          onTap: () => controller.continueAsGuest(context),
        ),
        Gaps.vGap8,
        Text(
          Translate.s.auth_guest_hint,
          style: AppTextStyle.micro(color: context.colors.text3),
          textAlign: TextAlign.center,
        ),
        Gaps.vGap13,
        BuildAuthFooterLink(
          prompt: Translate.s.auth_no_account,
          action: Translate.s.auth_create_account,
          onTap: () => controller.openRegister(context),
        ),
      ],
    );
  }
}
