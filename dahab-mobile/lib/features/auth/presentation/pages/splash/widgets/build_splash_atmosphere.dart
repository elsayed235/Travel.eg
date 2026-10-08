part of 'splash_widgets_imports.dart';

class BuildSplashAtmosphere extends StatelessWidget {
  final double breathe;
  final double reveal;

  const BuildSplashAtmosphere({
    super.key,
    required this.breathe,
    required this.reveal,
  });

  @override
  Widget build(BuildContext context) {
    final soft = context.colors.surface2;
    final softer = context.colors.surface3;
    final brand = context.colors.button;
    final t = 0.58 + (breathe * 0.42);
    final r = reveal.clamp(0.0, 1.0);
    final direction = Directionality.of(context);

    return Opacity(
      opacity: r,
      child: Stack(
        children: [
          // Soft vertical wash — calm authority, not flashy color
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    soft.withValues(alpha: 0.55 * r),
                    context.colors.bg,
                    softer.withValues(alpha: 0.40 * r),
                  ],
                  stops: const [0.0, 0.48, 1.0],
                ),
              ),
            ),
          ),
          Positioned.directional(
            textDirection: direction,
            top: -130,
            end: -90,
            child: _GlowOrb(
              size: 300 * t,
              color: soft.withValues(alpha: 0.95),
            ),
          ),
          Positioned.directional(
            textDirection: direction,
            bottom: -150,
            start: -110,
            child: _GlowOrb(
              size: 340 * (1.06 - breathe * 0.1),
              color: softer.withValues(alpha: 0.9),
            ),
          ),
          // Subtle brand presence — trust cue without stealing the logo
          Positioned.directional(
            textDirection: direction,
            top: MediaQuery.sizeOf(context).height * 0.34,
            start: -70,
            child: _GlowOrb(
              size: 180,
              color: brand.withValues(alpha: 0.04 + (breathe * 0.02)),
            ),
          ),
          Positioned.directional(
            textDirection: direction,
            top: MediaQuery.sizeOf(context).height * 0.22,
            end: -40,
            child: _GlowOrb(
              size: 120,
              color: brand.withValues(alpha: 0.03),
            ),
          ),
        ],
      ),
    );
  }
}

class _GlowOrb extends StatelessWidget {
  final double size;
  final Color color;

  const _GlowOrb({required this.size, required this.color});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [
              color,
              color.withValues(alpha: 0),
            ],
          ),
        ),
      ),
    );
  }
}
