
import 'package:flutter/material.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';
import 'package:rehla/core/theme/themes/app_theme.dart';

class CustomInputTextStyle extends TextStyle{

  final String lang;
  final Color? textColor;

  const CustomInputTextStyle({required this.lang,this.textColor});


  @override
  String get fontFamily => AppTheme.fontFamily;

  @override
  double get fontSize => 13;

  @override
  double get height => 1.5;

  @override
  Color get color => textColor??AppColors.noContextInstance.text;

}
