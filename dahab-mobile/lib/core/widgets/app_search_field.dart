import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_icon.dart';

/// Search bar with trailing tools (hashtag + search).
class AppSearchField extends StatelessWidget {
  final String hint;
  final List<Widget> leadingTools;
  final VoidCallback? onTap;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;

  const AppSearchField({
    super.key,
    required this.hint,
    this.leadingTools = const [],
    this.onTap,
    this.controller,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 44,
        padding: const EdgeInsetsDirectional.only(start: AppSpacing.md, end: AppSpacing.xs),
        decoration: BoxDecoration(
          color: context.colors.surface1,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(color: context.colors.line),
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                onChanged: onChanged,
                readOnly: onTap != null,
                onTap: onTap,
                style: AppTextStyle.body(color: context.colors.text),
                decoration: InputDecoration(
                  isDense: true,
                  fillColor: Colors.transparent,
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  hintText: hint,
                  hintStyle: AppTextStyle.body(color: context.colors.text3),
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ),
            if (leadingTools.isNotEmpty) ...[
              Container(
                width: 1,
                height: 20,
                color: context.colors.line,
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
              ),
              ...leadingTools,
            ],
          ],
        ),
      ),
    );
  }
}

class AppSearchToolButton extends StatelessWidget {
  final String icon;
  final VoidCallback? onTap;
  final bool filled;

  const AppSearchToolButton({
    super.key,
    required this.icon,
    this.onTap,
    this.filled = false,
  });

  @override
  Widget build(BuildContext context) {
    final child = AppIcon.ui(
      icon,
      size: 18,
      color: filled ? context.colors.onButton : context.colors.text2,
    );
    return Padding(
      padding: const EdgeInsetsDirectional.only(start: AppSpacing.xs),
      child: Material(
        color: filled ? context.colors.button : Colors.transparent,
        borderRadius: AppRadius.buttonAll,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppRadius.buttonAll,
          splashFactory: NoSplash.splashFactory,
          child: SizedBox(width: 36, height: 36, child: Center(child: child)),
        ),
      ),
    );
  }
}
