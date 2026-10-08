import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class AppField extends StatelessWidget {
  final String label;
  final String value;
  final bool isPlaceholder;
  final VoidCallback? onTap;

  const AppField({
    super.key,
    required this.label,
    required this.value,
    this.isPlaceholder = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.lg),
        decoration: BoxDecoration(
          color: context.colors.surface2,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(color: context.colors.line),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: AppTextStyle.caption(color: context.colors.text2)),
            Gaps.vGap4,
            Text(
              value,
              style: AppTextStyle.body(
                color: isPlaceholder ? context.colors.text3 : context.colors.text,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
