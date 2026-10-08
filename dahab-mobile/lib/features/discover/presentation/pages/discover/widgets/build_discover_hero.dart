part of 'discover_widgets_imports.dart';

/// The place, full-bleed. Switching destination dissolves the old photograph
/// into the new one (fade + de-blur + settle from a slight zoom) at the new
/// place's tempo, while a slow drift keeps the image alive.
class BuildDiscoverHero extends StatelessWidget {
  final RehlaDestination destination;
  final ValueChanged<RehlaDestination> onSelect;
  final VoidCallback onPlan;

  const BuildDiscoverHero({super.key, required this.destination, required this.onSelect, required this.onPlan});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final height = (MediaQuery.sizeOf(context).height * 0.64).clamp(460.0, 680.0);
    final reduce = MediaQuery.maybeDisableAnimationsOf(context) ?? false;

    return SizedBox(
      height: height,
      // The drifting photo paints past its box (a transform, not layout
      // overflow, so Stack would not clip it).
      child: ClipRect(
        child: Stack(
          fit: StackFit.expand,
          children: [
            AnimatedSwitcher(
              duration: reduce ? Duration.zero : destination.tempo * 1.6,
              switchInCurve: Curves.easeOutCubic,
              switchOutCurve: Curves.easeInCubic,
              layoutBuilder: (current, previous) => Stack(fit: StackFit.expand, children: [...previous, ?current]),
              transitionBuilder: (child, animation) => _HeroReveal(animation: animation, child: child),
              child: _DriftingImage(key: ValueKey(destination), path: destination.heroImagePath),
            ),
            // Legibility: a scrim under the copy, a lighter one under the switcher.
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: const [0, 0.22, 0.45, 1],
                  colors: [
                    colors.scrim.withValues(alpha: 0.42),
                    colors.scrim.withValues(alpha: 0),
                    colors.scrim.withValues(alpha: 0.08),
                    colors.scrim.withValues(alpha: 0.78),
                  ],
                ),
              ),
            ),
            PositionedDirectional(
              top: MediaQuery.paddingOf(context).top + AppSpacing.lg,
              start: AppSpacing.screenH,
              end: AppSpacing.screenH,
              child: Row(
                children: [
                  Text(
                    arabic ? 'رحلة' : 'REHLA',
                    style: AppTextStyle.s20_w600(
                      color: colors.onImage,
                    ).copyWith(fontFamily: AppFonts.display(context), letterSpacing: arabic ? 0 : 3),
                  ),
                  const Spacer(),
                  BuildDestinationSwitcher(current: destination, onSelect: onSelect),
                ],
              ),
            ),
            PositionedDirectional(
              start: AppSpacing.screenH,
              end: AppSpacing.screenH,
              bottom: AppSpacing.xxl + AppSpacing.lg,
              child: AnimatedSwitcher(
                duration: reduce ? Duration.zero : destination.tempo,
                switchInCurve: Curves.easeOutCubic,
                layoutBuilder: (current, previous) =>
                    Stack(alignment: AlignmentDirectional.bottomStart, children: [...previous, ?current]),
                transitionBuilder: (child, animation) => FadeTransition(
                  opacity: animation,
                  child: SlideTransition(
                    position: Tween(begin: const Offset(0, 0.08), end: Offset.zero).animate(animation),
                    child: child,
                  ),
                ),
                child: Column(
                  key: ValueKey(destination),
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      destination.label(arabic),
                      style: AppTextStyle.h1(
                        color: colors.onImage,
                      ).copyWith(fontFamily: AppFonts.display(context), fontSize: 46, height: 1.05),
                    ),
                    Gaps.vGap8,
                    Text(
                      destination.tagline(arabic),
                      style: AppTextStyle.s16_w400(color: colors.onImage.withValues(alpha: 0.92)),
                    ),
                    if (!destination.liveCatalogue) ...[
                      Gaps.vGap8,
                      Text(
                        Translate.s.discover_early_note(destination.label(arabic)),
                        style: AppTextStyle.caption(color: colors.onImage.withValues(alpha: 0.8)),
                      ),
                    ],
                    Gaps.vGap18,
                    FilledButton.icon(
                      onPressed: onPlan,
                      icon: const Icon(Icons.route_outlined, size: 20),
                      label: Text(Translate.s.discover_hero_cta),
                      style: FilledButton.styleFrom(
                        backgroundColor: colors.button,
                        foregroundColor: colors.onButton,
                        minimumSize: const Size(0, 50),
                        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.xxl),
                        shape: const RoundedRectangleBorder(borderRadius: AppRadius.chipAll),
                        textStyle: AppTextStyle.s16_w500(color: colors.onButton),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Melt into the page so the hero has no hard bottom edge.
            PositionedDirectional(
              start: 0,
              end: 0,
              bottom: 0,
              height: AppSpacing.xxl,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [colors.bg.withValues(alpha: 0), colors.bg],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroReveal extends AnimatedWidget {
  const _HeroReveal({required Animation<double> animation, required this.child}) : super(listenable: animation);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final t = (listenable as Animation<double>).value.clamp(0.0, 1.0);
    final blur = 14 * (1 - t);
    return Opacity(
      opacity: t,
      child: Transform.scale(
        scale: 1.06 - 0.06 * t,
        child: blur < 0.2
            ? child
            : ImageFiltered(
                imageFilter: ui.ImageFilter.blur(sigmaX: blur, sigmaY: blur),
                child: child,
              ),
      ),
    );
  }
}

/// A photograph that breathes: a very slow zoom and drift, paused when the
/// tab is hidden (TickerMode) and off under reduced motion.
class _DriftingImage extends StatefulWidget {
  final String path;

  const _DriftingImage({super.key, required this.path});

  @override
  State<_DriftingImage> createState() => _DriftingImageState();
}

class _DriftingImageState extends State<_DriftingImage> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(seconds: 26));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final reduce = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    if (reduce) {
      _c.stop();
    } else if (!_c.isAnimating) {
      _c.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _c,
      builder: (context, child) {
        final t = Curves.easeInOut.transform(_c.value);
        return Transform.translate(
          offset: Offset(-8 * t, -6 * t),
          child: Transform.scale(scale: 1.04 + 0.06 * t, child: child),
        );
      },
      child: Image.asset(widget.path, fit: BoxFit.cover, gaplessPlayback: true),
    );
  }
}
