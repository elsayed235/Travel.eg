part of 'splash_imports.dart';

@RoutePage(name: 'SplashRoute')
class Splash extends StatefulWidget {
  const Splash({super.key});

  @override
  State<Splash> createState() => _SplashState();
}

class _SplashState extends State<Splash> {
  final SplashController controller = SplashController();
  var _ready = false;

  @override
  void initState() {
    super.initState();
    _boot();
  }

  Future<void> _boot() async {
    await controller.prepareSession(context);
    if (!mounted) return;
    if (SplashController.seen) {
      await controller.goNext(context);
      return;
    }
    setState(() => _ready = true);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    for (final asset in BuildSplashCinema.frames) {
      precacheImage(AssetImage(asset), context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: context.colors.scrim,
        body: _ready
            ? BuildSplashCinema(onDone: () => controller.goNext(context))
            : const SizedBox.expand(),
      ),
    );
  }
}
