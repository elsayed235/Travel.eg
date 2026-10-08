import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:rehla/core/constants/CustomButtonAnimation.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class LoadingButton extends StatelessWidget {
  final GlobalKey<CustomButtonState> btnKey;
  final String title;
  final Function() onTap;
  final Color? textColor;
  final Color? color;
  final Color? borderColor;
  final double? borderRadius;
  final EdgeInsets? margin;
  final double? width;
  final double? height;
  final double? fontSize;
  final String? fontFamily;
  final FontWeight? fontWeight;

  const LoadingButton({
    super.key,
    required this.title,
    required this.onTap,
    this.color,
    this.textColor,
    this.borderRadius,
    this.margin,
    this.borderColor,
    this.fontFamily,
    this.fontSize,
    this.width,
    this.height,
    this.fontWeight,
    required this.btnKey,
  });

  @override
  Widget build(BuildContext context) {
    final fill = color ?? context.colors.button;
    final label = textColor ?? context.colors.onButton;
    final border = borderColor ?? fill;
    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: AppSpacing.sm),
      child: Column(
        children: [
          CustomButtonAnimation(
            key: btnKey,
            onTap: onTap,
            width: width ?? MediaQuery.of(context).size.width,
            minWidth: 45,
            height: height ?? 45,
            color: fill,
            elevation: 0,
            borderRadius: borderRadius ?? AppRadius.button,
            borderSide: BorderSide(color: border, width: 1),
            loader: Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              child: SpinKitRotatingCircle(
                color: label,
                size: 20,
              ),
            ),
            child: Text(
              title,
              style: AppTextStyle.s12_w500(color: label).copyWith(
                fontFamily: fontFamily,
                fontWeight: fontWeight,
                fontSize: fontSize,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
