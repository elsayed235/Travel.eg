part of 'login_imports.dart';

@RoutePage(name: 'LoginRoute')
class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> with SingleTickerProviderStateMixin {
  final LoginController controller = LoginController();
  late final AnimationController _enter;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _enter = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 720),
    );
    _fade = CurvedAnimation(parent: _enter, curve: Curves.easeOutCubic);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.04),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _enter, curve: Curves.easeOutCubic));
    _enter.forward();
  }

  @override
  void dispose() {
    _enter.dispose();
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BuildAuthScaffold(
      backLabel: Translate.s.auth_back_home,
      onBack: () => controller.continueAsGuest(context),
      child: FadeTransition(
        opacity: _fade,
        child: SlideTransition(
          position: _slide,
          child: ListView(
            padding: const EdgeInsetsDirectional.fromSTEB(
              AppSpacing.xl,
              AppSpacing.md,
              AppSpacing.xl,
              AppSpacing.xxl,
            ),
            children: [
              BuildAuthHero(
                title: Translate.s.auth_login_title,
                subtitle: Translate.s.auth_login_subtitle,
              ),
              Gaps.vGap24,
              BuildLoginForm(controller: controller),
              const BuildForgetPasswordView(),
              Gaps.vGap13,
              BuildLoginButton(controller: controller),
              Gaps.vGap18,
              BuildLoginFooter(controller: controller),
              Gaps.vGap24,
              const BuildAuthTrustRow(),
            ],
          ),
        ),
      ),
    );
  }
}
