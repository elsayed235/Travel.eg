import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_icon.dart';

/// Short celebration — haptic + compact dialog (not a toast).
abstract class AppQuietSuccess {
  const AppQuietSuccess._();

  static Future<void> show(
    BuildContext context, {
    required String title,
    String? subtitle,
  }) async {
    HapticFeedback.mediumImpact();
    if (!context.mounted) return;
    await showGeneralDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'success',
      barrierColor: context.colors.text.withValues(alpha: 0.35),
      transitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (ctx, anim, secondary) {
        return Center(
          child: Material(
            color: Colors.transparent,
            child: Container(
              margin: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.xxl),
              padding: const EdgeInsetsDirectional.all(AppSpacing.xl),
              decoration: BoxDecoration(
                color: context.colors.surface1,
                borderRadius: AppRadius.cardAll,
                border: Border.all(color: context.colors.line),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: context.colors.greenBg,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: AppIcon.ui(AppIcons.check, color: context.colors.green, size: 24),
                  ),
                  Gaps.vGap13,
                  Text(
                    title,
                    style: AppTextStyle.sectionTitle(color: context.colors.text),
                    textAlign: TextAlign.center,
                  ),
                  if (subtitle != null && subtitle.isNotEmpty) ...[
                    Gaps.vGap6,
                    Text(
                      subtitle,
                      style: AppTextStyle.caption(color: context.colors.text2),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
      transitionBuilder: (ctx, anim, secondary, child) {
        return FadeTransition(
          opacity: CurvedAnimation(parent: anim, curve: Curves.easeOutCubic),
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.94, end: 1).animate(
              CurvedAnimation(parent: anim, curve: Curves.easeOutCubic),
            ),
            child: child,
          ),
        );
      },
    );
  }
}
