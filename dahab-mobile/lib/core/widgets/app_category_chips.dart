import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/utils/arabic_numerals.dart';
import 'package:flutter_tdd/core/widgets/app_category_item.dart';

/// Category filter chips, each with a live count. Zero-count chips are muted.
class AppCategoryChips extends StatelessWidget {
  final String selectedId;
  final Map<String, int> counts;
  final ValueChanged<String> onChanged;

  const AppCategoryChips({
    super.key,
    required this.selectedId,
    required this.counts,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final categories = AppCategories.withAll;
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        clipBehavior: Clip.none,
        itemCount: categories.length,
        separatorBuilder: (_, _) => Gaps.hGap8,
        itemBuilder: (context, i) {
          final item = categories[i];
          return _CategoryChip(
            item: item,
            count: counts[item.id] ?? 0,
            selected: item.id == selectedId,
            onTap: () => onChanged(item.id),
          );
        },
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final AppCategoryItem item;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  const _CategoryChip({
    required this.item,
    required this.count,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final fg = selected ? colors.onButton : (count == 0 ? colors.text3 : colors.text);
    return Semantics(
      selected: selected,
      button: true,
      child: Material(
        color: selected ? colors.button : colors.surface1,
        shape: StadiumBorder(
          side: BorderSide(color: selected ? colors.button : colors.line),
        ),
        child: InkWell(
          onTap: onTap,
          customBorder: const StadiumBorder(),
          child: AnimatedPadding(
            duration: const Duration(milliseconds: 160),
            padding: const EdgeInsetsDirectional.fromSTEB(
              AppSpacing.lg,
              0,
              AppSpacing.md,
              0,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(item.icon, size: 16, color: fg),
                Gaps.hGap6,
                Text(
                  item.label,
                  style: AppTextStyle.s13_w500(color: fg),
                ),
                if (count > 0) ...[
                  Gaps.hGap6,
                  Container(
                    constraints: const BoxConstraints(minWidth: 22),
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 1),
                    decoration: BoxDecoration(
                      color: selected
                          ? colors.onButton.withValues(alpha: 0.16)
                          : colors.surface2,
                      borderRadius: const BorderRadius.all(Radius.circular(10)),
                    ),
                    child: Text(
                      count.toArabicDigits,
                      textAlign: TextAlign.center,
                      style: AppTextStyle.micro(
                        color: selected ? colors.onButton : colors.text2,
                      ),
                    ),
                  ),
                ] else
                  Gaps.hGap4,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
