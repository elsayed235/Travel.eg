import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/utils/arabic_numerals.dart';
import 'package:rehla/core/widgets/app_icon.dart';

class AppRating extends StatelessWidget {
  final double value;
  final int count;

  const AppRating({
    super.key,
    required this.value,
    required this.count,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        AppIcon.ui(AppIcons.starFill, size: 14, color: context.colors.amber),
        Gaps.hGap4,
        Text(
          value.toStringAsFixed(1).toArabicDigits,
          style: AppTextStyle.caption(color: context.colors.text),
        ),
        Gaps.hGap4,
        Text(
          '(${count.toArabicDigits})',
          style: AppTextStyle.caption(color: context.colors.text2),
        ),
      ],
    );
  }
}
