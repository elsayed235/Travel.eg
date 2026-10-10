import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_icon.dart';

/// An inset group of rows with a small heading above and an optional note
/// below; hairlines between rows start after the icon, like a native list.
class GroupedSection extends StatelessWidget {
  final String? title;
  final String? footer;
  final List<Widget> children;

  const GroupedSection({super.key, this.title, this.footer, required this.children});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (title != null)
          Padding(
            padding: const EdgeInsetsDirectional.only(start: AppSpacing.xs, bottom: AppSpacing.md),
            child: Semantics(
              header: true,
              child: Text(title!, style: AppTextStyle.s13_w500(color: colors.text2)),
            ),
          ),
        DecoratedBox(
          decoration: BoxDecoration(
            color: colors.surface1,
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: colors.line),
          ),
          child: ClipRRect(
            borderRadius: AppRadius.cardAll,
            child: Column(
              children: [
                for (var i = 0; i < children.length; i++) ...[
                  if (i > 0)
                    Divider(
                      height: 1,
                      thickness: 1,
                      color: colors.line,
                      indent: children[i] is GroupedRow ? 64 : AppSpacing.lg,
                    ),
                  children[i],
                ],
              ],
            ),
          ),
        ),
        if (footer != null)
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.xs, AppSpacing.md, AppSpacing.xs, 0),
            child: Text(footer!, style: AppTextStyle.caption(color: colors.text3)),
          ),
      ],
    );
  }
}

enum GroupedTint { lagoon, coral, green, amber, red, neutral }

/// A 52pt row: tinted icon tile, title (+ optional hint), a value or custom
/// trailing, and a chevron that points the reading direction.
class GroupedRow extends StatelessWidget {
  final String icon;
  final GroupedTint tint;
  final String title;
  final String? subtitle;
  final String? value;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool destructive;
  final bool external;
  final bool chevron;

  const GroupedRow({
    super.key,
    required this.icon,
    required this.title,
    this.tint = GroupedTint.neutral,
    this.subtitle,
    this.value,
    this.trailing,
    this.onTap,
    this.destructive = false,
    this.external = false,
    this.chevron = true,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final accent = destructive
        ? colors.red
        : switch (tint) {
            GroupedTint.lagoon => colors.button,
            GroupedTint.coral => colors.highlight,
            GroupedTint.green => colors.green,
            GroupedTint.amber => colors.amber,
            GroupedTint.red => colors.red,
            GroupedTint.neutral => colors.text2,
          };
    final row = ConstrainedBox(
      constraints: const BoxConstraints(minHeight: 56),
      child: Padding(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
        child: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: accent.withValues(alpha: tint == GroupedTint.neutral && !destructive ? 0.10 : 0.14),
                borderRadius: const BorderRadius.all(Radius.circular(10)),
              ),
              alignment: Alignment.center,
              child: AppIcon.ui(icon, size: 18, color: accent),
            ),
            Gaps.hGap16,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: AppTextStyle.s16_w400(color: destructive ? colors.red : colors.text),
                  ),
                  if (subtitle != null && subtitle!.isNotEmpty) ...[
                    Gaps.vGap4,
                    Text(
                      subtitle!,
                      style: AppTextStyle.caption(color: colors.text3),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            if (value != null) ...[
              Gaps.hGap10,
              Text(value!, style: AppTextStyle.s14_w400(color: colors.text3)),
            ],
            if (trailing != null) ...[Gaps.hGap10, trailing!],
            if (onTap != null && chevron && trailing == null) ...[
              Gaps.hGap6,
              external
                  ? AppIcon.ui(AppIcons.external, size: 16, color: colors.text3)
                  : AppIcon.ui(AppIcons.chevron, size: 18, color: colors.text3, mirrorInRtl: true),
            ],
          ],
        ),
      ),
    );
    if (onTap == null) return Semantics(container: true, child: row);
    return Semantics(
      button: true,
      child: _Pressable(
        onTap: () {
          HapticFeedback.selectionClick();
          onTap!();
        },
        child: row,
      ),
    );
  }
}

/// Press feedback without a ripple: the row dims to surface2 while held.
class _Pressable extends StatefulWidget {
  final VoidCallback onTap;
  final Widget child;

  const _Pressable({required this.onTap, required this.child});

  @override
  State<_Pressable> createState() => _PressableState();
}

class _PressableState extends State<_Pressable> {
  var _down = false;

  void _set(bool v) {
    if (_down != v) setState(() => _down = v);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: (_) => _set(true),
      onTapCancel: () => _set(false),
      onTapUp: (_) => _set(false),
      onTap: widget.onTap,
      child: AnimatedContainer(
        duration: Duration(milliseconds: _down ? 60 : 220),
        color: _down ? context.colors.surface2 : Colors.transparent,
        child: widget.child,
      ),
    );
  }
}
