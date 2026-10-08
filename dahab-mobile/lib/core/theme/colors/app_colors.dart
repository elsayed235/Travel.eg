import 'package:flutter/material.dart';
import 'package:rehla/core/helpers/di.dart';
import 'package:rehla/core/helpers/global_context.dart';
import 'package:rehla/core/theme/colors/rehla_palettes.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';

/// Colour tokens. Values come from [RehlaPalettes] for the active destination
/// and light/dark mode, carried in [ThemeData] by [RehlaColorsExtension].
abstract class AppColors {
  /// Palette that never changes with the place or mode (Dahab, light).
  static AppColors get fixedColors => RehlaPalettes.of(RehlaDestination.dahab, Brightness.light);

  static const Color snackBarGreenSuccess = Color(0xFF1F6B47);
  static const Color snackBarRedError = Color(0xFFA23A22);
  static const Color snackBarYellowAlert = Color(0xFF8A5A0B);
  static const Color onSnack = Color(0xFFFFFFFF);

  /// For code without a BuildContext (form sheets): the app's current palette.
  static AppColors get noContextInstance => of(getIt.get<GlobalContext>().context());

  /// Binds to [Theme] so destination and dark-mode swaps rebuild every
  /// `context.colors` caller.
  static AppColors of(BuildContext context) {
    final theme = Theme.of(context);
    return theme.extension<RehlaColorsExtension>()?.colors ??
        RehlaPalettes.of(RehlaDestination.dahab, theme.brightness);
  }

  /// Screen background.
  Color get bg;

  /// Cards.
  Color get surface1;

  /// Inputs, filters, raised rows.
  Color get surface2;

  /// Icon tiles, secondary buttons.
  Color get surface3;

  /// 1px hairline dividers.
  Color get line;

  /// Stronger border (emphasis).
  Color get line2;

  /// Primary text.
  Color get text;

  /// Secondary text.
  Color get text2;

  /// Tertiary / disabled.
  Color get text3;

  /// The one action colour (lagoon in Dahab): primary buttons, active states.
  Color get button;

  /// Label on [button].
  Color get onButton;

  /// Soft tint of the action colour: selected chips, hover, badges.
  Color get actionWash;

  /// The single highlight per view (sunset coral in Dahab).
  Color get highlight;

  Color get highlightBg;

  /// Success / availability.
  Color get green;

  Color get greenBg;

  /// Icons and text on a solid green fill (same in every palette).
  Color get onGreen => const Color(0xFFFFFFFF);

  /// Text and glass over photography (same in every palette and mode).
  Color get onImage => const Color(0xFFFFFFFF);

  /// Darkening behind text on photos; near-black granite, never pure black.
  Color get scrim => const Color(0xFF0B1418);

  /// Warnings, estimates.
  Color get amber;

  Color get amberBg;

  /// Problems, errors.
  Color get red;

  /// Magr aliases — mapped to tokens, never duplicate hex.
  Color get primary => button;

  Color get secondary => green;

  Color get background => bg;

  Color get white => surface1;

  Color get black => text;

  Color get appBarColor => bg;

  Color get blackOpacity => text2;

  Color get greyWhite => line;

  Color get disableGray => text3;
}
