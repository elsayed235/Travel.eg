part of 'discover_widgets_imports.dart';

/// One line to DayGi. Tapping it opens DayGi; the mic opens it listening.
/// It feels alive without shouting: a slow light travels the rim, the
/// sparkle twinkles, the mic breathes out soft ripples, and the hint rolls
/// through things people actually ask. All of it holds still under reduced
/// motion.
class BuildDiscoverAskLine extends StatefulWidget {
  final void Function(bool voice) onAsk;

  const BuildDiscoverAskLine({super.key, required this.onAsk});

  @override
  State<BuildDiscoverAskLine> createState() => _BuildDiscoverAskLineState();
}

class _BuildDiscoverAskLineState extends State<BuildDiscoverAskLine> with TickerProviderStateMixin {
  static const _hold = Duration(milliseconds: 3600);

  late final AnimationController _pulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 2400));
  late final AnimationController _rim = AnimationController(vsync: this, duration: const Duration(seconds: 7));
  Timer? _roll;
  int _index = 0;
  bool _still = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _still = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    if (_still) {
      _pulse.stop();
      _rim.stop();
      _roll?.cancel();
      _roll = null;
      _index = 0;
    } else {
      if (!_pulse.isAnimating) _pulse.repeat();
      if (!_rim.isAnimating) _rim.repeat();
      _roll ??= Timer.periodic(_hold, (_) {
        if (mounted) setState(() => _index++);
      });
    }
  }

  @override
  void dispose() {
    _roll?.cancel();
    _pulse.dispose();
    _rim.dispose();
    super.dispose();
  }

  List<String> _lines(bool arabic) {
    String quote(String s) => arabic ? '«$s»' : '“$s”';
    return [
      Translate.s.home_ask_hint,
      quote(Translate.s.dg_try_2),
      quote(Translate.s.dg_try_3),
      quote(Translate.s.dg_try_1),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final lines = _lines(context.isArabic);
    final line = lines[_index % lines.length];

    return Semantics(
      button: true,
      label: Translate.s.home_ask_hint,
      excludeSemantics: true,
      onTap: () => widget.onAsk(false),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          HapticFeedback.selectionClick();
          widget.onAsk(false);
        },
        child: CustomPaint(
          foregroundPainter: _still
              ? null
              : _RimLightPainter(repaint: _rim, from: colors.button, to: colors.highlight),
          child: Container(
            height: 54,
            padding: const EdgeInsetsDirectional.only(start: AppSpacing.lg, end: AppSpacing.xs),
            decoration: BoxDecoration(
              color: colors.surface1,
              borderRadius: AppRadius.chipAll,
              border: Border.all(color: colors.line),
              boxShadow: [BoxShadow(color: colors.scrim.withValues(alpha: 0.08), blurRadius: 18, offset: const Offset(0, 6))],
            ),
            child: Row(
              children: [
                _Sparkle(pulse: _pulse, still: _still),
                Gaps.hGap10,
                Expanded(
                  child: ClipRect(
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 650),
                      switchInCurve: Curves.easeOutCubic,
                      switchOutCurve: Curves.easeInCubic,
                      layoutBuilder: (current, previous) =>
                          Stack(alignment: AlignmentDirectional.centerStart, children: [...previous, ?current]),
                      transitionBuilder: (child, animation) {
                        final incoming = child.key == ValueKey(line);
                        return _RollTransition(animation: animation, incoming: incoming, child: child);
                      },
                      child: Text(
                        line,
                        key: ValueKey(line),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyle.s14_w400(color: _index % lines.length == 0 ? colors.text3 : colors.text2),
                      ),
                    ),
                  ),
                ),
                Gaps.hGap6,
                _Mic(pulse: _pulse, still: _still, onTap: () => widget.onAsk(true)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// The hint rolls up: the new line rises in out of a soft blur while the old
/// one lifts away.
class _RollTransition extends AnimatedWidget {
  final bool incoming;
  final Widget child;

  const _RollTransition({required Animation<double> animation, required this.incoming, required this.child})
    : super(listenable: animation);

  @override
  Widget build(BuildContext context) {
    final t = (listenable as Animation<double>).value.clamp(0.0, 1.0);
    final blur = 3.0 * (1 - t);
    final dy = (incoming ? 14.0 : -14.0) * (1 - t);
    Widget out = Transform.translate(offset: Offset(0, dy), child: child);
    if (blur > 0.2) {
      out = ImageFiltered(imageFilter: ui.ImageFilter.blur(sigmaX: blur, sigmaY: blur), child: out);
    }
    return Opacity(opacity: t, child: out);
  }
}

/// DayGi's mark: the sparkle in the brand gradient, twinkling on the pulse.
class _Sparkle extends StatelessWidget {
  final Animation<double> pulse;
  final bool still;

  const _Sparkle({required this.pulse, required this.still});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final icon = ShaderMask(
      blendMode: BlendMode.srcIn,
      shaderCallback: (rect) => LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [colors.button, colors.button, colors.highlight],
        stops: const [0, 0.5, 1],
      ).createShader(rect),
      child: const AppIcon.ui(AppIcons.sparkle, size: 18, color: Colors.white),
    );
    if (still) return icon;
    return AnimatedBuilder(
      animation: pulse,
      child: icon,
      builder: (context, child) {
        final wave = math.sin(pulse.value * 2 * math.pi);
        return Transform.rotate(
          angle: 0.14 * wave,
          child: Transform.scale(scale: 1 + 0.12 * wave.abs(), child: child),
        );
      },
    );
  }
}

/// A compact mic that breathes: two soft rings ripple out of it in turn.
/// The visible button is small; the touch target stays 48.
class _Mic extends StatelessWidget {
  final Animation<double> pulse;
  final bool still;
  final VoidCallback onTap;

  const _Mic({required this.pulse, required this.still, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      button: true,
      label: Translate.s.dg_voice,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          HapticFeedback.lightImpact();
          onTap();
        },
        child: SizedBox(
          width: 46,
          height: 46,
          child: CustomPaint(
            painter: still ? null : _RipplePainter(repaint: pulse, color: colors.button),
            child: Center(
              child: Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color.lerp(colors.button, Colors.white, 0.12)!, colors.button],
                  ),
                  boxShadow: [BoxShadow(color: colors.button.withValues(alpha: 0.35), blurRadius: 10, offset: const Offset(0, 3))],
                ),
                child: AppIcon.ui(AppIcons.mic, size: 16, color: colors.onButton),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RipplePainter extends CustomPainter {
  final Animation<double> repaint;
  final Color color;

  _RipplePainter({required this.repaint, required this.color}) : super(repaint: repaint);

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    for (final lag in const [0.0, 0.5]) {
      final p = (repaint.value + lag) % 1;
      final eased = Curves.easeOutCubic.transform(p);
      final radius = 17 + 6 * eased;
      final alpha = 0.28 * (1 - p);
      canvas.drawCircle(center, radius, Paint()..color = color.withValues(alpha: alpha * 0.45));
      canvas.drawCircle(
        center,
        radius,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2
          ..color = color.withValues(alpha: alpha),
      );
    }
  }

  @override
  bool shouldRepaint(_RipplePainter old) => old.color != color;
}

/// A short arc of light that travels the pill's rim.
class _RimLightPainter extends CustomPainter {
  final Animation<double> repaint;
  final Color from;
  final Color to;

  _RimLightPainter({required this.repaint, required this.from, required this.to}) : super(repaint: repaint);

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final rrect = RRect.fromRectAndRadius(rect.deflate(0.6), Radius.circular(size.height / 2));
    final shader = SweepGradient(
      colors: [
        from.withValues(alpha: 0),
        from.withValues(alpha: 0.85),
        to.withValues(alpha: 0.85),
        to.withValues(alpha: 0),
        from.withValues(alpha: 0),
      ],
      stops: const [0.0, 0.08, 0.16, 0.24, 1.0],
      transform: GradientRotation(repaint.value * 2 * math.pi),
    ).createShader(rect);
    canvas.drawRRect(
      rrect,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.4
        ..shader = shader,
    );
  }

  @override
  bool shouldRepaint(_RimLightPainter old) => old.from != from || old.to != to;
}
