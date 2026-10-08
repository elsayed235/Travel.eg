part of 'splash_widgets_imports.dart';

/// The website's splash gate: one photograph at a time, a swipe or a tap
/// moves the story on, Skip and Enter both open the app. Reduced motion
/// skips the cinema.
class BuildSplashCinema extends StatefulWidget {
  final VoidCallback onDone;

  static const frames = [
    'assets/images/places/hero-dahab.jpg',
    'assets/images/places/blue-hole-aerial.webp',
    'assets/images/places/house-reef.webp',
    'assets/images/places/ras-abu-galum.webp',
    'assets/images/places/colored-canyon.webp',
    'assets/images/places/st-catherine.webp',
  ];

  const BuildSplashCinema({super.key, required this.onDone});

  @override
  State<BuildSplashCinema> createState() => _BuildSplashCinemaState();
}

class _BuildSplashCinemaState extends State<BuildSplashCinema> {
  List<String> get _frames => BuildSplashCinema.frames;

  var _index = 0;
  var _exiting = false;
  var _motionChecked = false;
  var _dragY = 0.0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_motionChecked) return;
    _motionChecked = true;
    if (MediaQuery.disableAnimationsOf(context)) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _finish();
      });
    }
  }

  void _finish() {
    if (_exiting) return;
    final reduce = MediaQuery.disableAnimationsOf(context);
    setState(() => _exiting = true);
    if (reduce) {
      widget.onDone();
      return;
    }
    Future.delayed(const Duration(milliseconds: 420), () {
      if (mounted) widget.onDone();
    });
  }

  void _advance() {
    if (_exiting) return;
    if (_index >= _frames.length - 1) {
      _finish();
      return;
    }
    setState(() => _index += 1);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final reduce = MediaQuery.disableAnimationsOf(context);
    final tempo = reduce ? Duration.zero : const Duration(milliseconds: 700);
    return GestureDetector(
      onVerticalDragUpdate: (d) => _dragY += d.primaryDelta ?? 0,
      onVerticalDragEnd: (_) {
        if (_dragY < -24 || _dragY > 24) _advance();
        _dragY = 0;
      },
      onTap: _advance,
      child: AnimatedOpacity(
        opacity: _exiting ? 0 : 1,
        duration: tempo,
        curve: Curves.easeOutCubic,
        child: Stack(
          fit: StackFit.expand,
          children: [
            for (var i = 0; i < _frames.length; i++)
              AnimatedOpacity(
                opacity: i == _index ? 1 : 0,
                duration: tempo,
                curve: Curves.easeOutCubic,
                child: Image.asset(_frames[i], fit: BoxFit.cover),
              ),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    colors.scrim.withValues(alpha: 0.18),
                    colors.scrim.withValues(alpha: 0.08),
                    colors.scrim.withValues(alpha: 0.72),
                  ],
                  stops: const [0, 0.45, 1],
                ),
              ),
            ),
            PositionedDirectional(
              top: MediaQuery.paddingOf(context).top + AppSpacing.md,
              end: AppSpacing.lg,
              child: _Skip(onTap: _finish),
            ),
            PositionedDirectional(
              start: AppSpacing.xl,
              end: AppSpacing.xl,
              bottom: MediaQuery.paddingOf(context).bottom + AppSpacing.xxl,
              child: _Copy(
                index: _index,
                total: _frames.length,
                onEnter: _finish,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Skip extends StatelessWidget {
  final VoidCallback onTap;

  const _Skip({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: context.colors.scrim.withValues(alpha: 0.35),
        shape: StadiumBorder(side: BorderSide(color: context.colors.onImage.withValues(alpha: 0.35))),
      child: InkWell(
        onTap: onTap,
        customBorder: const StadiumBorder(),
        splashFactory: NoSplash.splashFactory,
        child: Padding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
          child: Text(Translate.s.splash_skip, style: AppTextStyle.s13_w500(color: context.colors.onImage)),
        ),
      ),
    );
  }
}

class _Copy extends StatelessWidget {
  final int index;
  final int total;
  final VoidCallback onEnter;

  const _Copy({required this.index, required this.total, required this.onEnter});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          Translate.s.splash_eyebrow,
          textAlign: TextAlign.center,
          style: AppTextStyle.caption(color: colors.onImage.withValues(alpha: 0.85)),
        ),
        Gaps.vGap13,
        Text(
          Translate.s.splash_title,
          textAlign: TextAlign.center,
          style: AppTextStyle.display(color: colors.onImage).copyWith(
            fontFamily: AppFonts.display(context),
            height: 1.15,
          ),
        ),
        Gaps.vGap8,
        Text(
          Translate.s.splash_subtitle,
          textAlign: TextAlign.center,
          style: AppTextStyle.body(color: colors.onImage.withValues(alpha: 0.88)),
        ),
        Gaps.vGap18,
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            for (var i = 0; i < total; i++)
              AnimatedContainer(
                duration: const Duration(milliseconds: 320),
                curve: Curves.easeOutCubic,
                margin: const EdgeInsetsDirectional.symmetric(horizontal: 3),
                width: i == index ? 22 : 6,
                height: 6,
                decoration: BoxDecoration(
                  color: colors.onImage.withValues(alpha: i == index ? 1 : 0.45),
                  borderRadius: AppRadius.chipAll,
                ),
              ),
          ],
        ),
        Gaps.vGap18,
        Material(
          color: colors.button,
          borderRadius: AppRadius.buttonAll,
          child: InkWell(
            onTap: onEnter,
            splashFactory: NoSplash.splashFactory,
            borderRadius: AppRadius.buttonAll,
            child: Padding(
              padding: const EdgeInsetsDirectional.symmetric(
                horizontal: AppSpacing.xxl,
                vertical: AppSpacing.lg,
              ),
              child: Text(
                Translate.s.splash_enter,
                style: AppTextStyle.s14_w600(color: colors.onButton),
              ),
            ),
          ),
        ),
        Gaps.vGap13,
        Icon(Icons.keyboard_arrow_down_rounded, color: colors.onImage.withValues(alpha: 0.7)),
        Text(
          Translate.s.splash_scroll,
          style: AppTextStyle.micro(color: colors.onImage.withValues(alpha: 0.7)),
        ),
      ],
    );
  }
}
