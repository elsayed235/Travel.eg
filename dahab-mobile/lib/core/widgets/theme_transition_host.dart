import 'package:flutter/material.dart';
import 'package:rehla/core/helpers/theme_transition_service.dart';

/// Full-screen cover host for [ThemeTransitionService].
/// Mount once under [MaterialApp] so theme swaps stay visually continuous.
class ThemeTransitionHost extends StatefulWidget {
  final Widget child;

  const ThemeTransitionHost({super.key, required this.child});

  @override
  State<ThemeTransitionHost> createState() => _ThemeTransitionHostState();
}

class _ThemeTransitionHostState extends State<ThemeTransitionHost>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fade;
  Color _coverColor = Colors.transparent;
  bool _showCover = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 220),
    );
    _fade = CurvedAnimation(parent: _controller, curve: Curves.easeInOutCubic);
    ThemeTransitionService.instance.setHandler(_runTransition);
  }

  @override
  void dispose() {
    ThemeTransitionService.instance.clearHandler();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _runTransition(Color coverColor, VoidCallback changeTheme) async {
    setState(() {
      _coverColor = coverColor;
      _showCover = true;
    });
    await _controller.forward(from: 0);
    changeTheme();
    // Let AdaptiveTheme + DeviceCubit rebuild under the cover.
    await Future<void>.delayed(const Duration(milliseconds: 80));
    if (!mounted) return;
    await _controller.reverse();
    if (!mounted) return;
    setState(() => _showCover = false);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      alignment: Alignment.topLeft,
      children: [
        widget.child,
        if (_showCover)
          IgnorePointer(
            child: FadeTransition(
              opacity: _fade,
              child: ColoredBox(color: _coverColor),
            ),
          ),
      ],
    );
  }
}
