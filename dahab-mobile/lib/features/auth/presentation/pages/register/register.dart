part of 'register_imports.dart';

@RoutePage(name: 'RegisterRoute')
class Register extends StatefulWidget {
  const Register({super.key});

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> with SingleTickerProviderStateMixin {
  final RegisterController controller = RegisterController();
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
                title: Translate.s.auth_register_title,
                subtitle: Translate.s.auth_register_subtitle,
              ),
              Gaps.vGap24,
              BuildRegisterForm(controller: controller),
              Gaps.vGap24,
              BuildRegisterButton(controller: controller),
              Gaps.vGap13,
              BuildAuthFooterLink(
                prompt: Translate.s.auth_have_account,
                action: Translate.s.auth_login_cta,
                onTap: () => AutoRouter.of(context).maybePop(),
              ),
              Gaps.vGap9,
              Text(
                Translate.s.auth_register_terms,
                style: AppTextStyle.micro(color: context.colors.text3),
                textAlign: TextAlign.center,
              ),
              Gaps.vGap24,
              const BuildAuthTrustRow(),
            ],
          ),
        ),
      ),
    );
  }
}
