import 'package:flutter/material.dart';

/// One-shot entrance: fade in and rise a little, after [delay]. Lists use it
/// with a growing delay for a stagger. Respects reduced motion.
class AppEntrance extends StatefulWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;
  final Curve curve;
  final double offsetY;

  const AppEntrance({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 520),
    this.curve = Curves.easeOutCubic,
    this.offsetY = 14,
  });

  @override
  State<AppEntrance> createState() => _AppEntranceState();
}

class _AppEntranceState extends State<AppEntrance> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: widget.duration);
  late final Animation<double> _t = CurvedAnimation(parent: _c, curve: widget.curve);

  @override
  void initState() {
    super.initState();
    Future.delayed(widget.delay, () {
      if (mounted) _c.forward();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.maybeDisableAnimationsOf(context) ?? false) _c.value = 1;
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _t,
      child: widget.child,
      builder: (context, child) => Opacity(
        opacity: _t.value,
        child: Transform.translate(offset: Offset(0, widget.offsetY * (1 - _t.value)), child: child),
      ),
    );
  }
}
