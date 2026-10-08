import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class AppSegmented extends StatelessWidget {
  final List<String> items;
  final int index;
  final ValueChanged<int> onChanged;

  const AppSegmented({
    super.key,
    required this.items,
    required this.index,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xs),
      decoration: BoxDecoration(
        color: context.colors.surface2,
        borderRadius: AppRadius.buttonAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Row(
        children: [
          for (var i = 0; i < items.length; i++)
            Expanded(
              child: GestureDetector(
                onTap: () => onChanged(i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: i == index ? context.colors.button : Colors.transparent,
                    borderRadius: AppRadius.buttonAll,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    items[i],
                    style: AppTextStyle.sectionTitle(
                      color: i == index ? context.colors.onButton : context.colors.text2,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
