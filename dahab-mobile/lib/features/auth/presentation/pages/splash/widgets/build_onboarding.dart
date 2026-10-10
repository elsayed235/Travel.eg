part of 'splash_widgets_imports.dart';

/// First run only: three calm pages about what the app actually does, then
/// straight into Home. Signing in waits until it is needed (booking, trip).
class BuildOnboarding extends StatefulWidget {
  final VoidCallback onDone;

  const BuildOnboarding({super.key, required this.onDone});

  static const frames = [
    'assets/images/places/house-reef.webp',
    'assets/images/places/colored-canyon.webp',
    'assets/images/places/st-catherine.webp',
  ];

  @override
  State<BuildOnboarding> createState() => _BuildOnboardingState();
}

class _BuildOnboardingState extends State<BuildOnboarding> with SingleTickerProviderStateMixin {
  final _pages = PageController();
  late final AnimationController _drift = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 12),
  );
  var _index = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!MediaQuery.disableAnimationsOf(context) && !_drift.isAnimating) _drift.forward();
  }

  @override
  void dispose() {
    _pages.dispose();
    _drift.dispose();
    super.dispose();
  }

  void _onPage(int i) {
    HapticFeedback.selectionClick();
    setState(() => _index = i);
    if (!MediaQuery.disableAnimationsOf(context)) _drift.forward(from: 0);
  }

  void _next() {
    if (_index == BuildOnboarding.frames.length - 1) {
      widget.onDone();
      return;
    }
    _pages.nextPage(duration: const Duration(milliseconds: 520), curve: Curves.easeInOutCubic);
  }

  List<(String, String, String, String)> get _copy => [
        (AppIcons.compass, Translate.s.onboard_1_eyebrow, Translate.s.onboard_1_title, Translate.s.onboard_1_body),
        (AppIcons.sparkle, Translate.s.onboard_2_eyebrow, Translate.s.onboard_2_title, Translate.s.onboard_2_body),
        (AppIcons.calendar, Translate.s.onboard_3_eyebrow, Translate.s.onboard_3_title, Translate.s.onboard_3_body),
      ];

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final copy = _copy;
    final last = _index == copy.length - 1;
    final (icon, eyebrow, title, body) = copy[_index];
    final total = copy.length;
    return ColoredBox(
      color: SplashInk.bottom,
      child: Stack(
        fit: StackFit.expand,
        children: [
          PageView.builder(
            controller: _pages,
            itemCount: total,
            onPageChanged: _onPage,
            itemBuilder: (context, i) => AnimatedBuilder(
              animation: _drift,
              builder: (context, child) => Transform.scale(
                scale: 1.02 + (i == _index ? Curves.easeOut.transform(_drift.value) * 0.07 : 0),
                child: child,
              ),
              child: Image.asset(
                BuildOnboarding.frames[i],
                fit: BoxFit.cover,
                excludeFromSemantics: true,
              ),
            ),
          ),
          const IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: [0, 0.2, 0.42, 0.66, 1],
                  colors: [Color(0x8C0B151C), Color(0x000B151C), Color(0x400B151C), Color(0xCC0B151C), Color(0xF70B151C)],
                ),
              ),
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Gaps.vGap10,
                  SizedBox(
                    height: 44,
                    child: Row(
                      children: [
                        Expanded(
                          child: Semantics(
                            label: Translate.s.onboard_progress('${_index + 1}', '$total'),
                            child: Row(
                              children: [
                                for (var i = 0; i < total; i++) ...[
                                  if (i > 0) Gaps.hGap6,
                                  Expanded(child: _Segment(filled: i <= _index)),
                                ],
                              ],
                            ),
                          ),
                        ),
                        Gaps.hGap16,
                        AnimatedOpacity(
                          opacity: last ? 0 : 1,
                          duration: const Duration(milliseconds: 200),
                          child: IgnorePointer(
                            ignoring: last,
                            child: TextButton(
                              onPressed: widget.onDone,
                              style: TextButton.styleFrom(
                                foregroundColor: colors.onImage,
                                minimumSize: const Size(44, 44),
                                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                              ),
                              child: Text(Translate.s.splash_skip, style: AppTextStyle.s14_w500(color: colors.onImage)),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 420),
                    switchInCurve: Curves.easeOutCubic,
                    switchOutCurve: Curves.easeInCubic,
                    layoutBuilder: (current, previous) => Stack(
                      alignment: AlignmentDirectional.bottomStart,
                      children: [...previous, ?current],
                    ),
                    transitionBuilder: (child, animation) => FadeTransition(
                      opacity: animation,
                      child: SlideTransition(
                        position: Tween(begin: const Offset(0, 0.06), end: Offset.zero).animate(animation),
                        child: child,
                      ),
                    ),
                    child: _PageCopy(
                      key: ValueKey(_index),
                      icon: icon,
                      eyebrow: eyebrow,
                      title: title,
                      body: body,
                    ),
                  ),
                  Gaps.vGap32,
                  SizedBox(
                    height: 54,
                    child: FilledButton(
                      onPressed: _next,
                      style: FilledButton.styleFrom(
                        backgroundColor: last ? SplashInk.lagoon : colors.onImage,
                        foregroundColor: SplashInk.bottom,
                        shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                      ),
                      child: AnimatedSwitcher(
                        duration: const Duration(milliseconds: 200),
                        child: Row(
                          key: ValueKey(last),
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              last ? Translate.s.onboard_start : Translate.s.onboard_next,
                              style: AppTextStyle.s16_w500(color: SplashInk.bottom),
                            ),
                            Gaps.hGap8,
                            AppIcon.ui(AppIcons.chevron, size: 18, color: SplashInk.bottom, mirrorInRtl: true),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Gaps.vGap16,
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Segment extends StatelessWidget {
  final bool filled;

  const _Segment({required this.filled});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.all(Radius.circular(2)),
      child: SizedBox(
        height: 3,
        child: Stack(
          fit: StackFit.expand,
          children: [
            ColoredBox(color: Colors.white.withValues(alpha: 0.28)),
            AnimatedFractionallySizedBox(
              duration: const Duration(milliseconds: 420),
              curve: Curves.easeOutCubic,
              alignment: AlignmentDirectional.centerStart,
              widthFactor: filled ? 1 : 0,
              child: const ColoredBox(color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}

class _PageCopy extends StatelessWidget {
  final String icon;
  final String eyebrow;
  final String title;
  final String body;

  const _PageCopy({
    super.key,
    required this.icon,
    required this.eyebrow,
    required this.title,
    required this.body,
  });

  @override
  Widget build(BuildContext context) {
    final white = context.colors.onImage;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: SplashInk.lagoon.withValues(alpha: 0.22),
                shape: BoxShape.circle,
                border: Border.all(color: SplashInk.lagoon.withValues(alpha: 0.55)),
              ),
              alignment: Alignment.center,
              child: AppIcon.ui(icon, size: 16, color: white),
            ),
            Gaps.hGap10,
            Flexible(
              child: Text(
                eyebrow,
                style: AppTextStyle.s13_w500(color: white.withValues(alpha: 0.85)),
              ),
            ),
          ],
        ),
        Gaps.vGap16,
        Text(
          title,
          style: TextStyle(
            fontFamily: AppFonts.display(context),
            fontSize: 32,
            height: 1.15,
            fontWeight: FontWeight.w600,
            color: white,
          ),
        ),
        Gaps.vGap12,
        Text(
          body,
          style: AppTextStyle.s16_w400(color: white.withValues(alpha: 0.82)).copyWith(height: 1.55),
        ),
      ],
    );
  }
}
