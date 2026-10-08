part of 'login_widgets_imports.dart';

class BuildForgetPasswordView extends StatelessWidget {
  const BuildForgetPasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional.centerEnd,
      child: TextButton(
        onPressed: () => AutoRouter.of(context).push(const ForgetPasswordRoute()),
        style: TextButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xs),
          minimumSize: const Size(0, 36),
        ),
        child: Text(
          Translate.s.auth_forget_title,
          style: AppTextStyle.caption(color: context.colors.text).copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
