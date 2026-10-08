part of 'splash_imports.dart';

@RoutePage(name: 'SplashRoute')
class Splash extends StatefulWidget {
  const Splash({super.key});

  @override
  State<Splash> createState() => _SplashState();
}

class _SplashState extends State<Splash> with TickerProviderStateMixin {
  final SplashController controller = SplashController();

  late final AnimationController _master;
  late final AnimationController _breathe;

  // Act 1 — What the app does: atmosphere + reach radar around the mark
  late final Animation<double> _atmosphere;
  late final Animation<double> _markFade;
  late final Animation<double> _markScale;

  // Act 2 — Meaning: promise copy
  late final Animation<double> _taglineFade;
  late final Animation<Offset> _taglineSlide;
  late final Animation<double> _subtitleFade;
  late final Animation<double> _trustFade;

  // Act 3 — Commit: progress + exit
  late final Animation<double> _progress;
  late final Animation<double> _screenFade;
  late final Animation<double> _screenScale;

  @override
  void initState() {
    super.initState();
    _master = AnimationController(vsync: this, duration: SplashController.sequenceDuration);
    _breathe = AnimationController(vsync: this, duration: const Duration(milliseconds: 3200));

    _atmosphere = CurvedAnimation(
      parent: _master,
      curve: const Interval(0.0, 0.28, curve: Curves.easeOutCubic),
    );

    _markFade = CurvedAnimation(
      parent: _master,
      curve: const Interval(0.04, 0.26, curve: Curves.easeOutCubic),
    );
    _markScale = Tween<double>(begin: 0.86, end: 1).animate(
      CurvedAnimation(
        parent: _master,
        curve: const Interval(0.04, 0.30, curve: Curves.easeOutCubic),
      ),
    );

    _taglineFade = CurvedAnimation(
      parent: _master,
      curve: const Interval(0.32, 0.52, curve: Curves.easeOutCubic),
    );
    _taglineSlide = Tween<Offset>(begin: const Offset(0, 0.14), end: Offset.zero).animate(
      CurvedAnimation(
        parent: _master,
        curve: const Interval(0.32, 0.54, curve: Curves.easeOutCubic),
      ),
    );
    _subtitleFade = CurvedAnimation(
      parent: _master,
      curve: const Interval(0.42, 0.60, curve: Curves.easeOutCubic),
    );
    _trustFade = CurvedAnimation(
      parent: _master,
      curve: const Interval(0.52, 0.70, curve: Curves.easeOutCubic),
    );

    _progress = CurvedAnimation(
      parent: _master,
      curve: const Interval(0.58, 0.90, curve: Curves.easeInOutCubic),
    );
    _screenFade = Tween<double>(begin: 1, end: 0).animate(
      CurvedAnimation(
        parent: _master,
        curve: const Interval(0.90, 1.0, curve: Curves.easeInCubic),
      ),
    );
    _screenScale = Tween<double>(begin: 1, end: 1.03).animate(
      CurvedAnimation(
        parent: _master,
        curve: const Interval(0.90, 1.0, curve: Curves.easeInCubic),
      ),
    );

    _runSequence();
  }

  Future<void> _runSequence() async {
    controller.prepareSession(context);
    _breathe.repeat(reverse: true);
    await _master.forward();
    if (!mounted) return;
    await controller.goNext(context);
  }

  @override
  void didChangeDependencies() {
    for (final asset in AppBrandAssets.all) {
      precacheImage(AssetImage(asset), context);
    }
    precacheImage(const AssetImage(Res.icon), context);
    super.didChangeDependencies();
  }

  @override
  void dispose() {
    _master.dispose();
    _breathe.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarBrightness: brightness == Brightness.dark ? Brightness.dark : Brightness.light,
        statusBarIconBrightness:
            brightness == Brightness.dark ? Brightness.light : Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: context.colors.bg,
        body: AnimatedBuilder(
          animation: Listenable.merge([_master, _breathe]),
          builder: (context, _) {
            final breathe = _breathe.value;
            return Opacity(
              opacity: _screenFade.value.clamp(0.0, 1.0),
              child: Transform.scale(
                scale: _screenScale.value,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    BuildSplashAtmosphere(
                      breathe: breathe,
                      reveal: _atmosphere.value,
                    ),
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsetsDirectional.symmetric(
                          horizontal: AppSpacing.xl,
                          vertical: AppSpacing.xxl,
                        ),
                        child: Column(
                          children: [
                            const Spacer(flex: 2),
                            BuildSplashBrand(
                              radarFade: _markFade.value,
                              radarScale: _markScale.value,
                              breathe: breathe,
                              taglineFade: _taglineFade.value,
                              taglineSlide: _taglineSlide.value,
                              subtitleFade: _subtitleFade.value,
                              trustFade: _trustFade.value,
                            ),
                            const Spacer(flex: 4),
                            BuildSplashProgress(
                              progress: _progress.value,
                              trustFade: _trustFade.value,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
