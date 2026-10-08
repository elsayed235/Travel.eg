part of 'plan_widgets_imports.dart';

/// A short beat between answers and plans: a route being drawn.
class BuildPlanBuilding extends StatelessWidget {
  const BuildPlanBuilding({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: 160,
            height: 64,
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: 1),
              duration: const Duration(milliseconds: 1000),
              curve: Curves.easeInOutCubic,
              builder: (context, t, _) => CustomPaint(
                painter: _RoutePainter(t: t, line: colors.line2, ink: colors.button),
              ),
            ),
          ),
          Gaps.vGap16,
          Text(
            Translate.s.plan_building,
            style: AppTextStyle.s18_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
          ),
        ],
      ),
    );
  }
}

class _RoutePainter extends CustomPainter {
  final double t;
  final Color line;
  final Color ink;

  _RoutePainter({required this.t, required this.line, required this.ink});

  @override
  void paint(Canvas canvas, Size size) {
    final path = Path()
      ..moveTo(8, size.height * 0.7)
      ..cubicTo(
        size.width * 0.3,
        -size.height * 0.1,
        size.width * 0.55,
        size.height * 1.2,
        size.width - 8,
        size.height * 0.3,
      );
    final base = Paint()
      ..color = line
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, base);
    final metric = path.computeMetrics().first;
    final drawn = metric.extractPath(0, metric.length * t);
    canvas.drawPath(drawn, base..color = ink);
    final tip = metric.getTangentForOffset(metric.length * t)?.position;
    if (tip != null) canvas.drawCircle(tip, 6, Paint()..color = ink);
    canvas.drawCircle(Offset(8, size.height * 0.7), 5, Paint()..color = ink);
  }

  @override
  bool shouldRepaint(_RoutePainter old) => old.t != t || old.ink != ink;
}
