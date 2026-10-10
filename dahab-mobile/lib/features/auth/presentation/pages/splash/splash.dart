part of 'splash_imports.dart';

@RoutePage(name: 'SplashRoute')
class Splash extends StatefulWidget {
  const Splash({super.key});

  @override
  State<Splash> createState() => _SplashState();
}

class _SplashState extends State<Splash> {
  final SplashController controller = SplashController();
  late final Future<void> _ready;
  var _onboarding = false;

  @override
  void initState() {
    super.initState();
    _ready = controller.prepare(context);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    for (final asset in BuildOnboarding.frames) {
      precacheImage(AssetImage(asset), context);
    }
  }

  void _afterBrand() {
    if (!mounted) return;
    if (controller.needsOnboarding) {
      setState(() => _onboarding = true);
    } else {
      controller.enterHome(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: SplashInk.bottom,
        body: AnimatedSwitcher(
          duration: const Duration(milliseconds: 600),
          switchInCurve: Curves.easeOutCubic,
          child: _onboarding
              ? BuildOnboarding(key: const ValueKey('onboarding'), onDone: () => controller.finishOnboarding(context))
              : BuildSplashBrand(key: const ValueKey('brand'), ready: _ready, onDone: _afterBrand),
        ),
      ),
    );
  }
}
