part of 'splash_widgets_imports.dart';

/// The splash's night palette. It does not follow the theme on purpose: it is
/// the continuation of the native launch screen, painted with the same stops.
abstract final class SplashInk {
  static const top = Color(0xFF13222C);
  static const bottom = Color(0xFF0B151C);
  static const lagoon = Color(0xFF3CC2BC);
  static const coral = Color(0xFFF08A6C);
  static const text = Color(0xFFEAF2F1);
  static const text2 = Color(0xFF93A8AB);
}

/// One orchestrated moment: the journey line of the mark draws itself while
/// a small light walks it like a guide leading the way, the sun rises over
/// it, then the name settles in. The sea breathes underneath the whole time.
/// [ready] is the session restore running in parallel; the splash leaves
/// when both are done.
class BuildSplashBrand extends StatefulWidget {
  final Future<void> ready;
  final VoidCallback onDone;

  const BuildSplashBrand({super.key, required this.ready, required this.onDone});

  @override
  State<BuildSplashBrand> createState() => _BuildSplashBrandState();
}

class _BuildSplashBrandState extends State<BuildSplashBrand> with TickerProviderStateMixin {
  late final AnimationController _intro = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 2600),
  );
  late final AnimationController _ambient = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 9),
  );
  late final AnimationController _exit = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 520),
  );
  var _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    _run(MediaQuery.disableAnimationsOf(context));
  }

  Future<void> _run(bool still) async {
    if (still) {
      _intro.value = 1;
      await Future.wait([widget.ready, Future<void>.delayed(const Duration(milliseconds: 700))]);
    } else {
      _ambient.repeat();
      await Future.wait([_intro.forward().orCancel, widget.ready]).catchError((_) => const <void>[]);
      if (!mounted) return;
      await _exit.forward().orCancel.catchError((_) {});
    }
    if (mounted) widget.onDone();
  }

  @override
  void dispose() {
    _intro.dispose();
    _ambient.dispose();
    _exit.dispose();
    super.dispose();
  }

  static double _span(double t, double from, double to, [Curve curve = Curves.easeOutCubic]) =>
      curve.transform(((t - from) / (to - from)).clamp(0.0, 1.0));

  @override
  Widget build(BuildContext context) {
    final arabic = Directionality.of(context) == TextDirection.rtl;
    final display = AppFonts.display(context);
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [SplashInk.top, SplashInk.bottom],
        ),
      ),
      child: AnimatedBuilder(
        animation: Listenable.merge([_intro, _ambient, _exit]),
        builder: (context, _) {
          final t = _intro.value;
          final out = Curves.easeInCubic.transform(_exit.value);
          final word = _span(t, 0.50, 0.80);
          final line = _span(t, 0.64, 0.92);
          return Opacity(
            opacity: 1 - out,
            child: Stack(
              fit: StackFit.expand,
              children: [
                RepaintBoundary(
                  child: CustomPaint(
                    painter: _SplashSkyPainter(
                      reveal: _span(t, 0.0, 0.55),
                      phase: _ambient.value,
                    ),
                  ),
                ),
                Align(
                  alignment: const Alignment(0, -0.12),
                  child: Transform.scale(
                    scale: 1 + out * 0.06,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox.square(
                          dimension: 124,
                          child: CustomPaint(
                            painter: _SplashMarkPainter(
                              draw: _span(t, 0.08, 0.55, Curves.easeInOutCubic),
                              sun: _span(t, 0.40, 0.70),
                              breath: _ambient.value,
                            ),
                          ),
                        ),
                        Gaps.vGap18,
                        Opacity(
                          opacity: word,
                          child: Transform.translate(
                            offset: Offset(0, (1 - word) * 10),
                            child: Text(
                              Translate.s.splash_wordmark,
                              style: TextStyle(
                                fontFamily: display,
                                fontSize: arabic ? 36 : 32,
                                fontWeight: FontWeight.w600,
                                height: 1.1,
                                letterSpacing: arabic ? 0 : 6 + (1 - word) * 8,
                                color: SplashInk.text,
                              ),
                            ),
                          ),
                        ),
                        Gaps.vGap12,
                        Opacity(
                          opacity: line,
                          child: Container(
                            width: 28 * line,
                            height: 1.5,
                            decoration: const BoxDecoration(
                              color: SplashInk.coral,
                              borderRadius: BorderRadius.all(Radius.circular(1)),
                            ),
                          ),
                        ),
                        Gaps.vGap12,
                        Opacity(
                          opacity: line,
                          child: Transform.translate(
                            offset: Offset(0, (1 - line) * 6),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl),
                              child: Text(
                                Translate.s.splash_line,
                                textAlign: TextAlign.center,
                                style: AppTextStyle.s14_w400(color: SplashInk.text2).copyWith(height: 1.5),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

/// The mark, drawn: the journey line extends along its own length with a
/// soft lagoon glow and a guiding light at its tip; the sun rises into place.
class _SplashMarkPainter extends CustomPainter {
  final double draw;
  final double sun;
  final double breath;

  _SplashMarkPainter({required this.draw, required this.sun, required this.breath});

  static final _journey = RehlaMark.journey();
  static final _metric = _journey.computeMetrics().first;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(size.width / 64);
    if (draw > 0) {
      final drawn = _metric.extractPath(0, _metric.length * draw);
      canvas.drawPath(
        drawn,
        Paint()
          ..color = SplashInk.lagoon.withValues(alpha: 0.35)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 5
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3),
      );
      canvas.drawPath(
        drawn,
        Paint()
          ..color = SplashInk.lagoon
          ..style = PaintingStyle.stroke
          ..strokeWidth = 5
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round,
      );
      final guide = (1 - ((draw - 0.85) / 0.15).clamp(0.0, 1.0));
      final tip = _metric.getTangentForOffset(_metric.length * draw)?.position;
      if (tip != null && guide > 0) {
        canvas.drawCircle(tip, 4.5, Paint()
          ..color = Colors.white.withValues(alpha: 0.35 * guide)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3));
        canvas.drawCircle(tip, 1.6, Paint()..color = Colors.white.withValues(alpha: 0.95 * guide));
      }
    }
    if (sun > 0) {
      final center = RehlaMark.sunCenter + Offset(0, (1 - sun) * 9);
      final pulse = 0.5 + 0.5 * math.sin(breath * math.pi * 2);
      canvas.drawCircle(
        center,
        RehlaMark.sunRadius * (1.9 + pulse * 0.25),
        Paint()
          ..color = SplashInk.coral.withValues(alpha: 0.16 * sun)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4),
      );
      canvas.drawCircle(
        center,
        RehlaMark.sunRadius * (0.7 + 0.3 * sun),
        Paint()..color = SplashInk.coral.withValues(alpha: sun),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _SplashMarkPainter old) =>
      old.draw != draw || old.sun != sun || old.breath != breath;
}

/// Night over the Gulf: a lagoon glow behind the mark, a few faint stars over
/// the mountains, and slow swells along the bottom edge.
class _SplashSkyPainter extends CustomPainter {
  final double reveal;
  final double phase;

  _SplashSkyPainter({required this.reveal, required this.phase});

  static final _stars = List.generate(22, (i) {
    final r = math.Random(7 + i * 31);
    return (Offset(r.nextDouble(), r.nextDouble() * 0.42), 0.6 + r.nextDouble() * 0.9, r.nextDouble());
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (reveal <= 0) return;
    final w = size.width;
    final h = size.height;
    final glowCenter = Offset(w / 2, h * 0.40);
    final radius = math.max(w, h) * 0.55;
    canvas.drawCircle(
      glowCenter,
      radius,
      Paint()
        ..shader = RadialGradient(
          colors: [
            SplashInk.lagoon.withValues(alpha: 0.13 * reveal),
            SplashInk.lagoon.withValues(alpha: 0),
          ],
        ).createShader(Rect.fromCircle(center: glowCenter, radius: radius)),
    );

    final twinkle = phase * math.pi * 2;
    for (final (pos, r, seed) in _stars) {
      final a = (0.10 + 0.22 * (0.5 + 0.5 * math.sin(twinkle * 2 + seed * 10))) * reveal;
      canvas.drawCircle(Offset(pos.dx * w, pos.dy * h), r, Paint()..color = SplashInk.text.withValues(alpha: a));
    }

    const swells = [
      (0.80, 7.0, 0.95, 1.0, 0.15),
      (0.86, 6.0, 0.70, -0.8, 0.10),
      (0.92, 5.0, 1.15, 0.6, 0.07),
    ];
    for (final (y, amp, wave, speed, alpha) in swells) {
      final path = Path();
      final shift = twinkle * speed;
      for (var x = 0.0; x <= w; x += 4) {
        final dy = h * y + math.sin(x / (w * wave) * math.pi * 2 + shift) * amp;
        x == 0 ? path.moveTo(x, dy) : path.lineTo(x, dy);
      }
      canvas.drawPath(
        path,
        Paint()
          ..color = SplashInk.lagoon.withValues(alpha: alpha * reveal)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.4,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _SplashSkyPainter old) => old.reveal != reveal || old.phase != phase;
}
