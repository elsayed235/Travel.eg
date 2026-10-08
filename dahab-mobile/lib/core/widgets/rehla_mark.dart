import 'package:flutter/material.dart';

/// The REHLA mark from the website: one journey line — floor, rise, wave —
/// and the sun. It takes the action colour; the sun takes the highlight.
class RehlaMark extends StatelessWidget {
  final double size;
  final Color color;
  final Color sunColor;

  const RehlaMark({
    super.key,
    required this.size,
    required this.color,
    required this.sunColor,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional.centerStart,
      widthFactor: 1,
      heightFactor: 1,
      child: SizedBox.square(
        dimension: size,
        child: CustomPaint(painter: _RehlaMarkPainter(ink: color, sun: sunColor)),
      ),
    );
  }
}

class _RehlaMarkPainter extends CustomPainter {
  final Color ink;
  final Color sun;

  const _RehlaMarkPainter({required this.ink, required this.sun});

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(size.width / 64);
    final stroke = Paint()
      ..color = ink
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final path = Path()
      ..moveTo(7, 45)
      ..relativeLineTo(7, 0)
      ..relativeLineTo(10, -15.5)
      ..relativeCubicTo(1.2, -1.8, 3.8, -1.8, 5, 0)
      ..lineTo(36, 40)
      ..relativeCubicTo(1.6, 2.4, 4.6, 2.6, 6.4, 0.4)
      ..relativeCubicTo(2.9, -3.6, 7, -3.6, 9.9, 0)
      ..relativeCubicTo(1.2, 1.5, 2.9, 2.2, 4.7, 2.2);
    canvas.drawPath(path, stroke);
    canvas.drawCircle(const Offset(43, 19), 5.5, Paint()..color = sun);
  }

  @override
  bool shouldRepaint(covariant _RehlaMarkPainter old) => old.ink != ink || old.sun != sun;
}
