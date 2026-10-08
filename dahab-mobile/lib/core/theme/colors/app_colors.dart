import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/bloc/device_cubit/device_cubit.dart';
import 'package:flutter_tdd/core/helpers/di.dart';
import 'package:flutter_tdd/core/helpers/global_context.dart';
import 'package:flutter_tdd/core/theme/colors/app_dark_colors.dart';
import 'package:flutter_tdd/core/theme/colors/app_light_colors.dart';

abstract class AppColors {
  static final AppDarkColors _dark = AppDarkColors();
  static final AppLightColors _light = AppLightColors();

  static AppColors get fixedColors => _light;

  static const Color snackBarGreenSuccess = Color(0xFF2E7F5F);
  static const Color snackBarRedError = Color(0xFFB4384C);
  static const Color snackBarYellowAlert = Color(0xFF96701F);
  static const Color onSnack = Color(0xFFFFFFFF);

  static AppColors get noContextInstance =>
      getIt.get<GlobalContext>().context().read<DeviceCubit>().state.model.themeMode ==
              AdaptiveThemeMode.dark
          ? _dark
          : _light;

  /// Binds to [Theme] so AdaptiveTheme swaps rebuild every `context.colors` caller.
  static AppColors of(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    return brightness == Brightness.dark ? _dark : _light;
  }

  /// Screen background.
  Color get bg;

  /// Cards, fields.
  Color get surface1;

  /// Inputs, filters.
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

  /// Primary button fill.
  Color get button;

  /// Primary button label.
  Color get onButton;

  /// Availability / success.
  Color get green;

  Color get greenBg;

  /// Icons and text on a solid green fill (same in both themes).
  Color get onGreen => const Color(0xFFFFFFFF);

  /// Rating, verification.
  Color get amber;

  Color get amberBg;

  /// Late, problems, errors.
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
