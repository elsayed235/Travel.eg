part of 'discover_widgets_imports.dart';

/// The place under the status bar: its photograph, a greeting, the line
/// that names the place and what it is like there right now. The picture
/// melts into the page, and the line to DayGi sits on that edge. Switching
/// destination dissolves the old picture into the new one at the new
/// place's tempo.
class BuildDiscoverHero extends StatelessWidget {
  final RehlaDestination destination;
  final ConditionsRequester conditions;
  final ValueChanged<RehlaDestination> onSelect;
  final Widget search;

  const BuildDiscoverHero({
    super.key,
    required this.destination,
    required this.conditions,
    required this.onSelect,
    required this.search,
  });

  /// How far up from the bottom the picture fades into the page.
  static const _fade = 104.0;

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final top = MediaQuery.paddingOf(context).top;
    final reduce = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    final titleStyle = AppTextStyle.h1(
      color: colors.onImage,
    ).copyWith(fontFamily: AppFonts.display(context), fontSize: 27, height: 1.12, fontWeight: FontWeight.w600);

    return ColoredBox(
      color: colors.bg,
      child: Stack(
        children: [
          // The drifting picture grows past the hero; keep it inside.
          Positioned.fill(
            child: ClipRect(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  AnimatedSwitcher(
                    duration: reduce ? Duration.zero : destination.tempo * 1.6,
                    switchInCurve: Curves.easeOutCubic,
                    switchOutCurve: Curves.easeInCubic,
                    layoutBuilder: (current, previous) =>
                        Stack(fit: StackFit.expand, children: [...previous, ?current]),
                    transitionBuilder: (child, animation) => _HeroReveal(animation: animation, child: child),
                    child: _DriftingImage(key: ValueKey(destination), path: destination.heroImagePath),
                  ),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        stops: const [0, 0.3, 0.6, 1],
                        colors: [
                          colors.scrim.withValues(alpha: 0.5),
                          colors.scrim.withValues(alpha: 0.05),
                          colors.scrim.withValues(alpha: 0.3),
                          colors.scrim.withValues(alpha: 0.55),
                        ],
                      ),
                    ),
                  ),
                  // The picture melts into the page under the line to DayGi.
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: SizedBox(
                      height: _fade,
                      width: double.infinity,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            stops: const [0, 0.45, 0.8],
                            colors: [colors.bg.withValues(alpha: 0), colors.bg.withValues(alpha: 0.75), colors.bg],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, top + AppSpacing.md, AppSpacing.screenH, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
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
                const SizedBox(height: 56),
                const _Greeting(),
                Gaps.vGap6,
                AnimatedSwitcher(
                  duration: reduce ? Duration.zero : destination.tempo,
                  switchInCurve: Curves.easeOutCubic,
                  layoutBuilder: (current, previous) =>
                      Stack(alignment: AlignmentDirectional.bottomStart, children: [...previous, ?current]),
                  transitionBuilder: (child, animation) => FadeTransition(
                    opacity: animation,
                    child: SlideTransition(
                      position: Tween(begin: const Offset(0, 0.1), end: Offset.zero).animate(animation),
                      child: child,
                    ),
                  ),
                  child: Column(
                    key: ValueKey(destination),
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text.rich(
                        TextSpan(
                          children: [
                            TextSpan(text: '${destination.titleA(arabic)} '),
                            TextSpan(
                              text: destination.titleB(arabic),
                              style: TextStyle(
                                color: colors.highlight,
                                fontStyle: arabic ? FontStyle.normal : FontStyle.italic,
                              ),
                            ),
                          ],
                        ),
                        maxLines: 2,
                        style: titleStyle,
                      ),
                      if (!destination.liveCatalogue) ...[
                        Gaps.vGap6,
                        Text(
                          Translate.s.discover_early_note(destination.label(arabic)),
                          style: AppTextStyle.caption(color: colors.onImage.withValues(alpha: 0.8)),
                        ),
                      ],
                    ],
                  ),
                ),
                Gaps.vGap14,
                BuildHeroConditions(requester: conditions, place: destination.label(arabic)),
                const SizedBox(height: _fade - 54),
                search,
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// "Good morning, Karim · 3 days to your trip": the name from the session,
/// the countdown from the booked trip. Nothing is shown that is not known.
class _Greeting extends StatelessWidget {
  const _Greeting();

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final authorized = context.select<AuthCubit, bool>((c) => c.state.authorized);
    final name = context.select<UserCubit, String>((c) => c.state.model?.firstName.trim() ?? '');
    final hour = DateTime.now().hour;
    final hello = hour < 12
        ? Translate.s.home_hello_morning
        : hour < 17
        ? Translate.s.home_hello_afternoon
        : Translate.s.home_hello_evening;
    final greeting = authorized && name.isNotEmpty ? Translate.s.home_hello_name(hello, name) : hello;
    return ObsValueConsumer(
      observable: TripStore.instance.bundleObs,
      builder: (context, bundle) {
        final now = DateTime.now();
        final toGo = authorized ? TripStore.instance.daysToGo(now) : null;
        final day = authorized ? TripStore.instance.dayToday(now) : null;
        final tail = day != null
            ? Translate.s.home_trip_day(day)
            : toGo != null
            ? Translate.s.home_days_to_trip(toGo)
            : null;
        return Text.rich(
          TextSpan(
            children: [
              TextSpan(
                text: greeting,
                style: AppTextStyle.s14_w600(color: colors.onImage),
              ),
              if (tail != null)
                TextSpan(
                  text: '  ·  $tail',
                  style: AppTextStyle.s14_w500(color: colors.onImage.withValues(alpha: 0.85)),
                ),
            ],
          ),
        );
      },
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
