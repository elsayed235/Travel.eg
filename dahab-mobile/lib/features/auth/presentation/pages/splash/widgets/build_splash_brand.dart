part of 'splash_widgets_imports.dart';

/// The brand at the centre of a live reach radar: the first thing people
/// see is what the app does — a request going out and reaching neighbours.
class BuildSplashBrand extends StatelessWidget {
  final double radarFade;
  final double radarScale;
  final double breathe;
  final double taglineFade;
  final Offset taglineSlide;
  final double subtitleFade;
  final double trustFade;

  const BuildSplashBrand({
    super.key,
    required this.radarFade,
    required this.radarScale,
    required this.breathe,
    required this.taglineFade,
    required this.taglineSlide,
    required this.subtitleFade,
    required this.trustFade,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final screen = MediaQuery.sizeOf(context);
    // Fits width on phones, height on short screens, caps on tablets.
    final radarSize = math.min(math.min(screen.width - AppSpacing.xl * 2, screen.height * 0.42), 340.0);
    final disc = radarSize * 0.38;

    return Column(
      children: [
        Opacity(
          opacity: radarFade.clamp(0.0, 1.0),
          child: Transform.scale(
            scale: radarScale,
            child: AppReachRadar(
              size: radarSize,
              dotCount: 14,
              introDuration: const Duration(milliseconds: 1700),
              sweepDuration: const Duration(milliseconds: 3000),
              center: Transform.scale(
                scale: 1 + breathe * 0.015,
                child: Container(
                  width: disc,
                  height: disc,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: colors.surface1,
                    shape: BoxShape.circle,
                    border: Border.all(color: colors.line),
                    boxShadow: [
                      BoxShadow(
                        color: colors.green.withValues(alpha: 0.10 + breathe * 0.08),
                        blurRadius: 28,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: SizedBox.square(
                    dimension: disc * 0.68,
                    child: const FittedBox(child: AppBrandLogo(framed: false)),
                  ),
                ),
              ),
            ),
          ),
        ),
        Gaps.vGap24,
        Opacity(
          opacity: taglineFade.clamp(0.0, 1.0),
          child: FractionalTranslation(
            translation: taglineSlide,
            child: Text(
              Translate.s.splash_tagline,
              textAlign: TextAlign.center,
              style: AppTextStyle.h3(color: colors.text).copyWith(fontWeight: FontWeight.w700),
            ),
          ),
        ),
        Gaps.vGap9,
        Opacity(
          opacity: subtitleFade.clamp(0.0, 1.0),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 300),
            child: Text(
              Translate.s.splash_subtitle,
              textAlign: TextAlign.center,
              style: AppTextStyle.body(color: colors.text2),
            ),
          ),
        ),
        Gaps.vGap16,
        Opacity(
          opacity: trustFade.clamp(0.0, 1.0),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.verified_user_outlined, size: 14, color: colors.green),
              Gaps.hGap6,
              Flexible(
                child: Text(
                  Translate.s.splash_trust,
                  textAlign: TextAlign.center,
                  style: AppTextStyle.caption(color: colors.text2),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
