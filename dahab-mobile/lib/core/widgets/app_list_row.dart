import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class AppListRow extends StatelessWidget {
  final String title;
  final Widget thumbnail;
  final String metaLine;
  final List<Widget> chips;
  final Widget trailing;

  const AppListRow({
    super.key,
    required this.title,
    required this.thumbnail,
    required this.metaLine,
    required this.chips,
    required this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: context.colors.line)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: AppRadius.imageAll,
            child: SizedBox(width: 64, height: 64, child: thumbnail),
          ),
          Gaps.hGap13,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTextStyle.itemTitle(color: context.colors.text)),
                Gaps.vGap4,
                Text(metaLine, style: AppTextStyle.caption(color: context.colors.text2)),
                if (chips.isNotEmpty) ...[
                  Gaps.vGap6,
                  Wrap(spacing: AppSpacing.sm, runSpacing: AppSpacing.xs, children: chips),
                ],
              ],
            ),
          ),
          Gaps.hGap9,
          trailing,
        ],
      ),
    );
  }
}
