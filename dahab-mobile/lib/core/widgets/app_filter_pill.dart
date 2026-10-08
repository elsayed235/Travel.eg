import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

/// Filter pill used on Home (إيجار / شراء / date / الأقرب).
class AppFilterPill extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback? onTap;

  const AppFilterPill({
    super.key,
    required this.label,
    this.selected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? context.colors.button : context.colors.surface2,
      borderRadius: AppRadius.buttonAll,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.buttonAll,
        splashFactory: NoSplash.splashFactory,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
          child: Text(
            label,
            style: AppTextStyle.caption(
              color: selected ? context.colors.onButton : context.colors.text,
            ).copyWith(fontWeight: FontWeight.w500),
          ),
        ),
      ),
    );
  }
}
