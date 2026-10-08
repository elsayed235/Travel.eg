import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/utils/arabic_numerals.dart';

/// Live reach radar — the app's core idea drawn: a request goes out from
/// you and reaches the owners around you.
///
/// km rings (dashed inside, bezel ticks outside), a sweep that lights owner
/// dots as it passes, a sonar ping + link back to the centre per owner, and
/// a ripple from the centre. Rings draw in and dots arrive during [introDuration],
/// then the sweep loops. Static when the user has reduced motion on.
/// Pauses automatically under a disabled [TickerMode].
class AppReachRadar extends StatefulWidget {
  final double size;
  final int dotCount;

  /// Shows km labels on the rings when set.
  final int? radiusKm;

  /// Replaces the centre dot (e.g. the brand mark on splash).
  final Widget? center;
  final Duration introDuration;
  final Duration sweepDuration;

  const AppReachRadar({
    super.key,
    required this.size,
    required this.dotCount,
    this.radiusKm,
    this.center,
    this.introDuration = const Duration(milliseconds: 1400),
    this.sweepDuration = const Duration(seconds: 6),
  });

  @override
  State<AppReachRadar> createState() => _AppReachRadarState();
}

class _AppReachRadarState extends State<AppReachRadar> with TickerProviderStateMixin {
  late final AnimationController _intro = AnimationController(
    vsync: this,
    duration: widget.introDuration,
  );

  late final AnimationController _loop = AnimationController(
    vsync: this,
    duration: widget.sweepDuration,
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _intro.value = 1;
      _loop.stop();
      return;
    }
    if (_intro.value == 0 && !_intro.isAnimating) _intro.forward();
    if (!_loop.isAnimating) _loop.repeat();
  }

  @override
  void dispose() {
    _intro.dispose();
    _loop.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final animate = !MediaQuery.disableAnimationsOf(context);
    final radar = ExcludeSemantics(
      child: RepaintBoundary(
        child: AnimatedBuilder(
          animation: Listenable.merge([_intro, _loop]),
          builder: (context, _) => CustomPaint(
            size: Size.square(widget.size),
            painter: _ReachRadarPainter(
              intro: _intro.value,
              sweep: animate ? _loop.value : null,
              dotCount: widget.dotCount.clamp(0, 18),
              radiusKm: widget.radiusKm,
              drawCenter: widget.center == null,
              ringColor: colors.line2,
              dotColor: colors.green,
              centerColor: colors.surface1,
              labelStyle: AppTextStyle.micro(color: colors.text3),
              textDirection: Directionality.of(context),
            ),
          ),
        ),
      ),
    );
    if (widget.center == null) return radar;
    return SizedBox.square(
      dimension: widget.size,
      child: Stack(alignment: Alignment.center, children: [radar, widget.center!]),
    );
  }
}

class _ReachRadarPainter extends CustomPainter {
  /// 0..1 dot entrance.
  final double intro;

  /// 0..1 position of the sweep around the circle; null = static.
  final double? sweep;
  final int dotCount;
  final int? radiusKm;
  final bool drawCenter;
  final Color ringColor;
  final Color dotColor;
  final Color centerColor;
  final TextStyle labelStyle;
  final TextDirection textDirection;

  _ReachRadarPainter({
    required this.intro,
    required this.sweep,
    required this.dotCount,
    required this.radiusKm,
    required this.drawCenter,
    required this.ringColor,
    required this.dotColor,
    required this.centerColor,
    required this.labelStyle,
    required this.textDirection,
  });

  static const _twoPi = math.pi * 2;

  /// Width of the fading trail behind the sweep line, in radians.
  static const _trail = math.pi / 2.2;

  /// A dot "pings" (sonar ring + link to you) for this long after the sweep.
  static const _pingSpan = math.pi / 5;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final maxR = size.width / 2 - 8;
    final s = sweep;
    // Intro: rings draw in first, then the sweep fades up, then dots arrive.
    final rings = Curves.easeOutCubic.transform((intro / 0.5).clamp(0.0, 1.0));
    final sweepIn = ((intro - 0.35) / 0.4).clamp(0.0, 1.0);
    final sweepAngle = s == null ? null : s * _twoPi - math.pi / 2;

    // Depth: a faint glow that falls off towards the edge.
    canvas.drawCircle(
      center,
      maxR,
      Paint()
        ..shader = RadialGradient(
          colors: [dotColor.withValues(alpha: 0.10), dotColor.withValues(alpha: 0)],
        ).createShader(Rect.fromCircle(center: center, radius: maxR)),
    );

    // Inner rings dashed, outer ring solid.
    final ring = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = ringColor;
    for (final f in const [1 / 3, 2 / 3]) {
      _dashedCircle(
        canvas,
        center,
        maxR * f,
        ring,
        dashes: f < 0.5 ? 18 : 30,
        gapAtTop: radiusKm == null ? 0 : 9,
        reveal: rings,
      );
    }
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: maxR),
      -math.pi / 2,
      _twoPi * rings,
      false,
      ring,
    );

    // Bezel ticks; the ones inside the sweep trail pick up the accent.
    const ticks = 72;
    for (var i = 0; i < ticks * rings; i++) {
      final a = i / ticks * _twoPi - math.pi / 2;
      final major = i % 6 == 0;
      var lit = 0.0;
      if (sweepAngle != null) {
        final behind = _behind(sweepAngle, a);
        if (behind < _trail) lit = (1 - behind / _trail) * sweepIn;
      }
      final dir = Offset(math.cos(a), math.sin(a));
      canvas.drawLine(
        center + dir * (maxR + 2),
        center + dir * (maxR + (major ? 7 : 4)),
        Paint()
          ..strokeWidth = major ? 1.2 : 0.8
          ..color = Color.lerp(ringColor, dotColor, lit)!,
      );
    }

    if (sweepAngle != null && sweepIn > 0) {
      // Ripple from the centre: twice per sweep.
      final ripple = (s! * 2) % 1;
      canvas.drawCircle(
        center,
        maxR * Curves.easeOut.transform(ripple),
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2
          ..color = dotColor.withValues(alpha: 0.30 * (1 - ripple) * sweepIn),
      );

      // Trail wedge ending at the leading edge.
      canvas.drawCircle(
        center,
        maxR,
        Paint()
          ..shader = SweepGradient(
            endAngle: _trail,
            colors: [dotColor.withValues(alpha: 0), dotColor.withValues(alpha: 0.20 * sweepIn)],
            transform: GradientRotation(sweepAngle - _trail),
          ).createShader(Rect.fromCircle(center: center, radius: maxR)),
      );

      // Leading line: soft glow under a crisp stroke.
      final tip = center + Offset(math.cos(sweepAngle), math.sin(sweepAngle)) * maxR;
      canvas.drawLine(
        center,
        tip,
        Paint()
          ..strokeWidth = 4
          ..strokeCap = StrokeCap.round
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3)
          ..color = dotColor.withValues(alpha: 0.35 * sweepIn),
      );
      canvas.drawLine(
        center,
        tip,
        Paint()
          ..strokeWidth = 1.2
          ..strokeCap = StrokeCap.round
          ..color = dotColor.withValues(alpha: 0.8 * sweepIn),
      );
    }

    // Owners: seeded so positions stay put between frames.
    final rnd = math.Random(15);
    final dot = Paint();
    for (var i = 0; i < dotCount; i++) {
      final angle = rnd.nextDouble() * _twoPi;
      final dist = maxR * (0.2 + rnd.nextDouble() * 0.74);
      final baseAlpha = 0.35 + rnd.nextDouble() * 0.3;
      final start = 0.4 + 0.45 * i / (dotCount + 1);
      final appear = ((intro - start) / 0.15).clamp(0.0, 1.0);
      if (appear == 0) continue;
      final pos = center + Offset(math.cos(angle), math.sin(angle)) * dist;

      var glow = 0.0;
      var ping = -1.0;
      if (sweepAngle != null) {
        final behind = _behind(sweepAngle, angle);
        if (behind < _trail * 1.6) glow = (1 - behind / (_trail * 1.6)) * sweepIn;
        if (sweepIn == 1 && behind < _pingSpan) ping = behind / _pingSpan;
      }

      if (ping >= 0) {
        final fade = 1 - ping;
        // Link back to you: the request reaching this owner.
        canvas.drawLine(
          center,
          pos,
          Paint()
            ..strokeWidth = 0.8
            ..color = dotColor.withValues(alpha: 0.28 * fade * appear),
        );
        // Sonar ring around the owner.
        canvas.drawCircle(
          pos,
          3 + 9 * Curves.easeOut.transform(ping),
          Paint()
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1
            ..color = dotColor.withValues(alpha: 0.6 * fade * appear),
        );
      }
      if (glow > 0) {
        dot
          ..color = dotColor.withValues(alpha: 0.25 * glow * appear)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2.5);
        canvas.drawCircle(pos, 4 + 3 * glow, dot);
        dot.maskFilter = null;
      }
      final alpha = sweepAngle == null ? 0.75 : baseAlpha + (1 - baseAlpha) * glow;
      dot.color = dotColor.withValues(alpha: alpha * appear);
      canvas.drawCircle(pos, (2 + 1.2 * appear) + 0.8 * glow, dot);
    }

    if (drawCenter) {
      // You, at the centre, breathing with the ripple.
      final breathe = s == null ? 0.0 : (math.sin(s * _twoPi * 2) + 1) / 2;
      canvas.drawCircle(center, 8 + 2.5 * breathe, Paint()..color = dotColor.withValues(alpha: 0.16));
      canvas.drawCircle(center, 4.5, Paint()..color = dotColor.withValues(alpha: 0.9));
      canvas.drawCircle(center, 2, Paint()..color = centerColor);
    }

    final km = radiusKm;
    if (km == null) return;

    // Km on each ring, at the top, like an instrument scale.
    for (final (f, value) in [
      (1 / 3, km / 3),
      (2 / 3, km * 2 / 3),
      (1.0, km.toDouble()),
    ]) {
      final text = value.round().toArabicDigits;
      final tp = TextPainter(
        text: TextSpan(
          text: f == 1.0 ? Translate.s.home_radius_label(text) : text,
          style: labelStyle.copyWith(color: labelStyle.color?.withValues(alpha: rings)),
        ),
        textDirection: textDirection,
      )..layout();
      final y = f == 1.0 ? center.dy - maxR - tp.height - 8 : center.dy - maxR * f - tp.height / 2;
      tp.paint(canvas, Offset(center.dx - tp.width / 2, y));
    }
  }

  /// Angle (0..2π) by which the sweep has already passed [angle].
  double _behind(double sweepAngle, double angle) =>
      ((sweepAngle - angle) % _twoPi + _twoPi) % _twoPi;

  /// Dashed ring with a gap at 12 o'clock, [gapAtTop] px wide each side, for its km label.
  void _dashedCircle(
    Canvas canvas,
    Offset c,
    double r,
    Paint paint, {
    required int dashes,
    required double gapAtTop,
    required double reveal,
  }) {
    final step = _twoPi / dashes;
    final gap = gapAtTop / r;
    final rect = Rect.fromCircle(center: c, radius: r);
    for (var i = 0; i < dashes * reveal; i++) {
      final mid = i * step + step * 0.275;
      final fromTop = (mid + math.pi / 2) % _twoPi;
      if (fromTop < gap || fromTop > _twoPi - gap) continue;
      canvas.drawArc(rect, i * step, step * 0.55, false, paint);
    }
  }

  @override
  bool shouldRepaint(_ReachRadarPainter old) =>
      old.intro != intro ||
      old.sweep != sweep ||
      old.dotCount != dotCount ||
      old.radiusKm != radiusKm ||
      old.drawCenter != drawCenter ||
      old.ringColor != ringColor;
}
