import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

enum AppChipKind { neutral, available, verified, ad }

class AppChip extends StatelessWidget {
  final String label;
  final AppChipKind kind;

  const AppChip({
    super.key,
    required this.label,
    this.kind = AppChipKind.neutral,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final Color bg;
    final Color fg;
    final Color? border;
    switch (kind) {
      case AppChipKind.neutral:
        bg = colors.surface2;
        fg = colors.text2;
        border = null;
      case AppChipKind.available:
        bg = colors.greenBg;
        fg = colors.green;
        border = null;
      case AppChipKind.verified:
        bg = colors.amberBg;
        fg = colors.amber;
        border = null;
      case AppChipKind.ad:
        bg = Colors.transparent;
        fg = colors.text2;
        border = colors.line2;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: AppRadius.chipAll,
        border: border == null ? null : Border.all(color: border),
      ),
      child: Text(label, style: AppTextStyle.micro(color: fg)),
    );
  }
}
