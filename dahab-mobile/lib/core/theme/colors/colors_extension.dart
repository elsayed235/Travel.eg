import 'package:flutter/material.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';

extension ThemeExtension on BuildContext {
  ThemeData get theme => Theme.of(this);

  TextTheme get textTheme => theme.textTheme;

  AppColors get colors => AppColors.of(this);

  /// Short alias used in new screens: `context.c.surface1`
  AppColors get c => colors;
}
