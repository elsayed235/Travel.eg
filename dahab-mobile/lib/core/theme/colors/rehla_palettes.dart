import 'package:flutter/material.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';

/// Granite & Lagoon, per destination and per light/dark — the same values as
/// the website's src/styles/tokens.css, so the app and the site read as one
/// brand. One action colour (lagoon, or the place's equivalent) and one
/// highlight per view.
class RehlaColors extends AppColors {
  RehlaColors({
    required this.bg,
    required this.surface1,
    required this.surface2,
    required this.surface3,
    required this.line,
    required this.line2,
    required this.text,
    required this.text2,
    required this.text3,
    required this.button,
    required this.onButton,
    required this.actionWash,
    required this.highlight,
    required this.highlightBg,
    required this.green,
    required this.greenBg,
    required this.amber,
    required this.amberBg,
    required this.red,
  });

  @override
  final Color bg;
  @override
  final Color surface1;
  @override
  final Color surface2;
  @override
  final Color surface3;
  @override
  final Color line;
  @override
  final Color line2;
  @override
  final Color text;
  @override
  final Color text2;
  @override
  final Color text3;
  @override
  final Color button;
  @override
  final Color onButton;
  @override
  final Color actionWash;
  @override
  final Color highlight;
  @override
  final Color highlightBg;
  @override
  final Color green;
  @override
  final Color greenBg;
  @override
  final Color amber;
  @override
  final Color amberBg;
  @override
  final Color red;
}

class RehlaPalettes {
  const RehlaPalettes._();

  static RehlaColors of(RehlaDestination d, Brightness b) =>
      b == Brightness.dark ? _dark[d]! : _light[d]!;

  // Semantic colours do not change with the place.
  static const _posDark = Color(0xFF7FD1A8), _posDarkBg = Color(0x1F7FD1A8);
  static const _warnDark = Color(0xFFF2C46B), _warnDarkBg = Color(0x1FF2C46B);
  static const _critDark = Color(0xFFF4917E);
  static const _posLight = Color(0xFF1F6B47), _posLightBg = Color(0xFFE6F2EC);
  static const _warnLight = Color(0xFF8A5A0B), _warnLightBg = Color(0xFFFBF1DC);
  static const _critLight = Color(0xFFA23A22);

  static final Map<RehlaDestination, RehlaColors> _dark = {
    // Dahab · Granite & Lagoon (abyss)
    RehlaDestination.dahab: RehlaColors(
      bg: const Color(0xFF0B151C),
      surface1: const Color(0xFF0F1C25),
      surface2: const Color(0xFF13222C),
      surface3: const Color(0xFF1B2E3A),
      line: const Color(0x1AECE9E2),
      line2: const Color(0x33ECE9E2),
      text: const Color(0xFFECE9E2),
      text2: const Color(0xFFBAC3C7),
      text3: const Color(0xFF8C9AA2),
      button: const Color(0xFF3CC2BC),
      onButton: const Color(0xFF032220),
      actionWash: const Color(0x243CC2BC),
      highlight: const Color(0xFFF08A6C),
      highlightBg: const Color(0x24F08A6C),
      green: _posDark, greenBg: _posDarkBg, amber: _warnDark, amberBg: _warnDarkBg, red: _critDark,
    ),
    // Nuweiba · Driftwood & Shallows
    RehlaDestination.nuweiba: RehlaColors(
      bg: const Color(0xFF0F1A1E),
      surface1: const Color(0xFF14242A),
      surface2: const Color(0xFF182B32),
      surface3: const Color(0xFF203841),
      line: const Color(0x1AE8EAE6),
      line2: const Color(0x33E8EAE6),
      text: const Color(0xFFE8EAE6),
      text2: const Color(0xFFB3BDBE),
      text3: const Color(0xFF8A9799),
      button: const Color(0xFF86C6D2),
      onButton: const Color(0xFF062026),
      actionWash: const Color(0x2486C6D2),
      highlight: const Color(0xFFE0AE83),
      highlightBg: const Color(0x24E0AE83),
      green: _posDark, greenBg: _posDarkBg, amber: _warnDark, amberBg: _warnDarkBg, red: _critDark,
    ),
    // Siwa · Salt & Palm
    RehlaDestination.siwa: RehlaColors(
      bg: const Color(0xFF16130F),
      surface1: const Color(0xFF1F1B16),
      surface2: const Color(0xFF26211B),
      surface3: const Color(0xFF302A22),
      line: const Color(0x1AF1EBDF),
      line2: const Color(0x33F1EBDF),
      text: const Color(0xFFF1EBDF),
      text2: const Color(0xFFC6BAA8),
      text3: const Color(0xFF9A8E7E),
      button: const Color(0xFFA8C99A),
      onButton: const Color(0xFF14230F),
      actionWash: const Color(0x24A8C99A),
      highlight: const Color(0xFFE7A07D),
      highlightBg: const Color(0x24E7A07D),
      green: _posDark, greenBg: _posDarkBg, amber: _warnDark, amberBg: _warnDarkBg, red: _critDark,
    ),
  };

  static final Map<RehlaDestination, RehlaColors> _light = {
    // Dahab · salt
    RehlaDestination.dahab: RehlaColors(
      bg: const Color(0xFFF5F4F0),
      surface1: const Color(0xFFFFFFFF),
      surface2: const Color(0xFFECEAE4),
      surface3: const Color(0xFFDEDAD1),
      line: const Color(0x1A0D1A22),
      line2: const Color(0x330D1A22),
      text: const Color(0xFF0B151C),
      text2: const Color(0xFF4B4744),
      text3: const Color(0xFF6F6863),
      button: const Color(0xFF0E7C7A),
      onButton: const Color(0xFFFFFFFF),
      actionWash: const Color(0x170E7C7A),
      highlight: const Color(0xFFB4523A),
      highlightBg: const Color(0x1AD2694C),
      green: _posLight, greenBg: _posLightBg, amber: _warnLight, amberBg: _warnLightBg, red: _critLight,
    ),
    RehlaDestination.nuweiba: RehlaColors(
      bg: const Color(0xFFF2F1EB),
      surface1: const Color(0xFFFFFFFF),
      surface2: const Color(0xFFE9E7DE),
      surface3: const Color(0xFFDDDAD0),
      line: const Color(0x1A1D2A2E),
      line2: const Color(0x331D2A2E),
      text: const Color(0xFF1D2A2E),
      text2: const Color(0xFF4F5A5C),
      text3: const Color(0xFF6E7779),
      button: const Color(0xFF2D7787),
      onButton: const Color(0xFFFFFFFF),
      actionWash: const Color(0x1A2D7787),
      highlight: const Color(0xFF9A6638),
      highlightBg: const Color(0x1CA97447),
      green: _posLight, greenBg: _posLightBg, amber: _warnLight, amberBg: _warnLightBg, red: _critLight,
    ),
    RehlaDestination.siwa: RehlaColors(
      bg: const Color(0xFFF6F2EA),
      surface1: const Color(0xFFFFFDF8),
      surface2: const Color(0xFFEDE6D9),
      surface3: const Color(0xFFE2D9C8),
      line: const Color(0x1A2A2520),
      line2: const Color(0x332A2520),
      text: const Color(0xFF2A2520),
      text2: const Color(0xFF5A5047),
      text3: const Color(0xFF7A6E62),
      button: const Color(0xFF4A7445),
      onButton: const Color(0xFFFFFFFF),
      actionWash: const Color(0x1A4A7445),
      highlight: const Color(0xFFA9573A),
      highlightBg: const Color(0x1AA9573A),
      green: _posLight, greenBg: _posLightBg, amber: _warnLight, amberBg: _warnLightBg, red: _critLight,
    ),
  };
}

/// Carries the active palette inside [ThemeData], so `context.colors` rebuilds
/// with every theme or destination swap.
@immutable
class RehlaColorsExtension extends ThemeExtension<RehlaColorsExtension> {
  const RehlaColorsExtension(this.colors, this.destination);

  final RehlaColors colors;
  final RehlaDestination destination;

  @override
  RehlaColorsExtension copyWith({RehlaColors? colors, RehlaDestination? destination}) =>
      RehlaColorsExtension(colors ?? this.colors, destination ?? this.destination);

  // Swaps happen under ThemeTransitionHost's cover, so no colour blending.
  @override
  RehlaColorsExtension lerp(covariant RehlaColorsExtension? other, double t) =>
      t < 0.5 || other == null ? this : other;
}
