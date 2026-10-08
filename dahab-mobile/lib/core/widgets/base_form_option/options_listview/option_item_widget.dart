import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/theme/colors/app_colors.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';

class OptionItemWidget extends StatelessWidget {
  final String title;
  final Widget? prefix;
  final int prefixGap;
  final TextStyle? titleTextStyle;
  final VoidCallback? onTap;
  final BoxConstraints? constraints;
  final String? suffixText;
  final Widget? suffix;

  const OptionItemWidget({
    super.key,
    required this.title,
    this.prefix,
    this.prefixGap = 8,
    this.titleTextStyle,
    this.onTap,
    this.constraints,
    this.suffixText,
    this.suffix,
  });



  TextStyle _textStyle(BuildContext context) =>
      titleTextStyle ?? AppTextStyle.s14_w400(color: AppColors.noContextInstance.blackOpacity);

  @override
  Widget build(BuildContext context) {
    final hasSuffix = suffix != null;
    return Container(
      constraints: constraints,
      child: InkWell(
        onTap: onTap,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (prefix != null) prefix!,
            if (prefix != null) Gaps.hGap(prefixGap),
            Flexible(
              /// This line because we want the txt to take all available space in case there
              /// is suffix widget (to align the suffix to the end of the line)
              fit: hasSuffix ? FlexFit.tight : FlexFit.loose,
              child: Text.rich(
                TextSpan(
                  style: _textStyle(context),
                  children: [
                    TextSpan(
                      text: title,
                      style: _textStyle(context),
                    ),
                    if (suffixText != null)
                      TextSpan(
                        text: suffixText!,
                        style: _textStyle(context),
                      ),
                  ],
                ),
              ),
            ),
            if (hasSuffix) ...[suffix!],
          ],
        ),
      ),
    );
  }
}
