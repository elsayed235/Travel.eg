import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class CustomInputDecoration extends InputDecoration {
  final String lang;
  final String? labelTxt;
  final String? hintTxt;
  final Widget? prefIcon;
  final Widget? sufIcon;
  final Color? enableColor;
  final Color? focsColor;
  final Color? hintColor;
  final Color? customFillColor;
  final BorderRadius? borderRadius;
  final EdgeInsets? padding;

  const CustomInputDecoration(
      {required this.lang,
      this.hintTxt,
      this.labelTxt,
      this.prefIcon,
      this.sufIcon,
      this.hintColor,
      this.customFillColor,
      this.enableColor,
      this.focsColor,
      this.borderRadius,
      this.padding})
      : super();

  AppColors get _c => AppColors.noContextInstance;

  BorderRadius get _radius => borderRadius ?? AppRadius.buttonAll;

  @override
  InputBorder get enabledBorder => OutlineInputBorder(
        borderSide: BorderSide(color: enableColor ?? _c.line, width: 1),
        borderRadius: _radius,
      );

  @override
  InputBorder get focusedBorder => OutlineInputBorder(
        borderRadius: _radius,
        borderSide: BorderSide(color: focusColor ?? _c.line2, width: 1),
      );

  @override
  InputBorder get errorBorder => OutlineInputBorder(
        borderSide: BorderSide(color: _c.red, width: 1),
        borderRadius: _radius,
      );

  @override
  InputBorder get focusedErrorBorder => OutlineInputBorder(
        borderRadius: _radius,
        borderSide: BorderSide(color: _c.red, width: 1),
      );

  @override
  TextStyle get errorStyle => AppTextStyle.caption(color: _c.red);

  @override
  String? get hintText => hintTxt;

  @override
  Widget? get label => labelTxt == null ? super.label : Text(labelTxt ?? "", style: labelStyle);

  @override
  TextStyle get labelStyle => AppTextStyle.body(color: hintColor ?? _c.text2);

  @override
  TextStyle? get hintStyle => AppTextStyle.body(color: hintColor ?? _c.text2);

  @override
  EdgeInsetsGeometry get contentPadding =>
      padding ?? const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.lg);

  @override
  bool get filled => true;

  @override
  Color get fillColor => customFillColor ?? _c.surface2;

  @override
  bool get alignLabelWithHint => true;

  @override
  Widget? get suffixIcon => sufIcon;

  @override
  Widget? get prefixIcon => prefIcon;

  @override
  Color? get focusColor => focsColor;
}
