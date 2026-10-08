import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/app_spacing.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';

/// Compact switch: الكل / معروض / مطلوب (0 / 1 / 2).
class AppMarketSideSwitch extends StatelessWidget {
  final int index;
  final ValueChanged<int> onChanged;

  const AppMarketSideSwitch({
    super.key,
    required this.index,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final items = [
      Translate.s.market_side_all,
      Translate.s.market_side_offer_short,
      Translate.s.market_side_request_short,
    ];
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xs),
      decoration: BoxDecoration(
        color: context.colors.surface2,
        borderRadius: AppRadius.chipAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < items.length; i++) ...[
            if (i > 0) Gaps.hGap4,
            _Segment(
              label: items[i],
              selected: index == i,
              onTap: () => onChanged(i),
            ),
          ],
        ],
      ),
    );
  }
}

class _Segment extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _Segment({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.xs,
        ),
        decoration: BoxDecoration(
          color: selected ? context.colors.button : Colors.transparent,
          borderRadius: AppRadius.chipAll,
        ),
        child: Text(
          label,
          style: AppTextStyle.micro(
            color: selected ? context.colors.onButton : context.colors.text2,
          ).copyWith(fontWeight: FontWeight.w500),
        ),
      ),
    );
  }
}
