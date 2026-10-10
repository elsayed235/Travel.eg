import 'dart:math' as math;
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class AppBottomNavItem {
  /// SVG asset paths: the outline at rest, the filled glyph when selected.
  final String icon;
  final String activeIcon;
  final String label;

  const AppBottomNavItem({required this.icon, required this.activeIcon, required this.label});
}

/// Five places: Home · Discover · DayGi · Trip · Account.
///
/// A floating capsule of frosted glass over the content, as in iOS: the page
/// blurs and brightens through it, a specular rim catches the light along the
/// top, and the selected tab sits in a glass lens that springs between tabs.
/// The host stacks it over the tabs and pads them by [AppBottomNav.overlap].
class AppBottomNav extends StatelessWidget {
  final int index;
  final ValueChanged<int> onChanged;
  final List<AppBottomNavItem> items;
  final Duration tempo;

  const AppBottomNav({
    super.key,
    required this.index,
    required this.onChanged,
    required this.items,
    this.tempo = const Duration(milliseconds: 520),
  }) : assert(items.length == 5, 'AppBottomNav expects Home, Discover, DayGi, Trip, Account');

  /// 56: each tab still gives a 48px-tall touch target inside the capsule.
  static const double _height = 56;
  static const double _maxWidth = 520;

  /// Space between the capsule and the bottom edge: tucked into the home
  /// indicator area on notched phones, a clear gap elsewhere.
  static double _gap(BuildContext context) {
    final system = MediaQuery.viewPaddingOf(context).bottom;
    return system > 0 ? math.max(system - AppSpacing.lg, AppSpacing.sm) : AppSpacing.lg;
  }

  /// How much of the screen bottom the bar covers, plus breathing room —
  /// what scrolling content must leave clear to stay readable above it.
  static double overlap(BuildContext context) => _height + _gap(context) + AppSpacing.md;

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final dark = Theme.of(context).brightness == Brightness.dark;
    // Labels stay legible at large text sizes without bursting the capsule.
    final scaler = MediaQuery.textScalerOf(context).clamp(maxScaleFactor: 1.15);
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(AppSpacing.xl, 0, AppSpacing.xl, _gap(context)),
      child: Center(
        heightFactor: 1,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: _maxWidth),
          child: ClipRRect(
            borderRadius: AppRadius.chipAll,
            child: BackdropFilter(
              filter: ImageFilter.compose(
                outer: ColorFilter.matrix(_saturate(dark ? 1.5 : 1.8)),
                inner: ImageFilter.blur(sigmaX: 22, sigmaY: 22),
              ),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: colors.surface1.withValues(alpha: dark ? 0.58 : 0.66),
                  borderRadius: AppRadius.chipAll,
                ),
                child: DecoratedBox(
                  // The rim: a bright hairline that fades down the sides.
                  position: DecorationPosition.foreground,
                  decoration: BoxDecoration(
                    borderRadius: AppRadius.chipAll,
                    border: Border.all(color: dark ? colors.onImage.withValues(alpha: 0.12) : colors.line),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      stops: const [0, 0.45],
                      colors: [
                        colors.onImage.withValues(alpha: dark ? 0.08 : 0.35),
                        colors.onImage.withValues(alpha: 0),
                      ],
                    ),
                  ),
                  child: MediaQuery(
                    data: MediaQuery.of(context).copyWith(textScaler: scaler),
                    child: SizedBox(
                      height: _height,
                      child: Padding(
                        padding: const EdgeInsetsDirectional.all(AppSpacing.xs),
                        child: _Tabs(index: index, items: items, tempo: tempo, onChanged: onChanged),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// Saturation matrix — glass reads as glass because colour behind it
  /// comes through richer, not just blurred.
  static List<double> _saturate(double s) {
    const r = 0.2126, g = 0.7152, b = 0.0722;
    final i = 1 - s;
    return [i * r + s, i * g, i * b, 0, 0, i * r, i * g + s, i * b, 0, 0, i * r, i * g, i * b + s, 0, 0, 0, 0, 0, 1, 0];
  }
}

class _Tabs extends StatelessWidget {
  final int index;
  final List<AppBottomNavItem> items;
  final Duration tempo;
  final ValueChanged<int> onChanged;

  const _Tabs({required this.index, required this.items, required this.tempo, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final dark = Theme.of(context).brightness == Brightness.dark;
    return LayoutBuilder(
      builder: (context, box) {
        final tab = box.maxWidth / items.length;
        final rtl = Directionality.of(context) == TextDirection.rtl;
        final visual = rtl ? items.length - 1 - index : index;
        return Stack(
          children: [
            // The lens. A spring with a little overshoot, like liquid settling.
            AnimatedPositioned(
              duration: tempo,
              curve: const Cubic(0.3, 1.3, 0.4, 1),
              left: visual * tab,
              top: 0,
              bottom: 0,
              width: tab,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: colors.button.withValues(alpha: dark ? 0.2 : 0.13),
                  borderRadius: AppRadius.chipAll,
                  border: Border.all(color: colors.onImage.withValues(alpha: dark ? 0.1 : 0.6)),
                ),
              ),
            ),
            Row(
              children: [
                for (var i = 0; i < items.length; i++)
                  Expanded(
                    child: _Tab(
                      item: items[i],
                      selected: index == i,
                      onTap: () {
                        if (i != index) HapticFeedback.selectionClick();
                        onChanged(i);
                      },
                    ),
                  ),
              ],
            ),
          ],
        );
      },
    );
  }
}

class _Tab extends StatefulWidget {
  final AppBottomNavItem item;
  final bool selected;
  final VoidCallback onTap;

  const _Tab({required this.item, required this.selected, required this.onTap});

  @override
  State<_Tab> createState() => _TabState();
}

class _TabState extends State<_Tab> {
  bool _pressed = false;

  void _press(bool down) {
    if (_pressed != down) setState(() => _pressed = down);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final color = widget.selected ? colors.button : colors.text2;
    return Semantics(
      button: true,
      selected: widget.selected,
      label: widget.item.label,
      onTap: widget.onTap,
      excludeSemantics: true,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (_) => _press(true),
        onTapCancel: () => _press(false),
        onTapUp: (_) => _press(false),
        onTap: widget.onTap,
        child: AnimatedScale(
          scale: _pressed ? 0.9 : 1,
          duration: const Duration(milliseconds: 160),
          curve: Curves.easeOutBack,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                transitionBuilder: (child, a) => ScaleTransition(
                  scale: Tween(begin: 0.8, end: 1.0).animate(a),
                  child: FadeTransition(opacity: a, child: child),
                ),
                child: SvgPicture.asset(
                  widget.selected ? widget.item.activeIcon : widget.item.icon,
                  key: ValueKey(widget.selected),
                  width: 22,
                  height: 22,
                  colorFilter: ColorFilter.mode(color, BlendMode.srcIn),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                widget.item.label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppTextStyle.micro(
                  color: color,
                ).copyWith(fontWeight: widget.selected ? FontWeight.w600 : FontWeight.w500, height: 1.2),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
