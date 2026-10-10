part of 'reset_password_imports.dart';

@RoutePage(name: 'ResetPasswordRoute')
class ResetPassword extends StatefulWidget {
  const ResetPassword({super.key});

  @override
  State<ResetPassword> createState() => _ResetPasswordState();
}

class _ResetPasswordState extends State<ResetPassword> {
  final ResetPasswordController controller = ResetPasswordController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BuildAuthScaffold(
      step: 3,
      totalSteps: 3,
      child: ListView(
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.xl,
          AppSpacing.lg,
          AppSpacing.xl,
          AppSpacing.xxl,
        ),
        children: [
          BuildAuthHeader(
            title: Translate.s.auth_reset_title,
            subtitle: Translate.s.auth_reset_subtitle,
            icon: AppIcons.lock,
          ),
          ResetPasswordForm(controller: controller),
          Gaps.vGap24,
          ResetPasswordButton(controller: controller),
        ],
      ),
    );
  }
}
