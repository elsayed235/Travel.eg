part of 'forget_password_imports.dart';

@RoutePage(name: 'ForgetPasswordRoute')
class ForgetPassword extends StatefulWidget {
  const ForgetPassword({super.key});

  @override
  State<ForgetPassword> createState() => _ForgetPasswordState();
}

class _ForgetPasswordState extends State<ForgetPassword> {
  final ForgetPasswordController controller = ForgetPasswordController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BuildAuthScaffold(
      child: ListView(
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.xl,
          AppSpacing.lg,
          AppSpacing.xl,
          AppSpacing.xxl,
        ),
        children: [
          BuildAuthHeader(
            title: Translate.s.auth_forget_title,
            subtitle: Translate.s.auth_forget_subtitle,
            icon: AppIcons.mail,
          ),
          BuildForgetForm(controller: controller),
          Gaps.vGap24,
          BuildForgetPasswordButton(controller: controller),
          Gaps.vGap13,
          Text(
            Translate.s.auth_reset_unavailable,
            textAlign: TextAlign.center,
            style: AppTextStyle.caption(color: context.colors.text3),
          ),
        ],
      ),
    );
  }
}
