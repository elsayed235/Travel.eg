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
      step: 1,
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
            title: Translate.s.auth_forget_title,
            subtitle: Translate.s.auth_forget_subtitle,
            icon: Icons.phone_iphone_rounded,
          ),
          BuildForgetForm(controller: controller),
          Gaps.vGap24,
          BuildForgetPasswordButton(controller: controller),
        ],
      ),
    );
  }
}
