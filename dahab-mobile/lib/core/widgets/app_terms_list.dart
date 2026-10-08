import 'package:flutter/material.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class AppTermItem {
  final String label;
  final String value;

  const AppTermItem({required this.label, required this.value});
}

class AppTermsList extends StatelessWidget {
  final List<AppTermItem> terms;

  const AppTermsList({super.key, required this.terms});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var i = 0; i < terms.length; i++) ...[
          Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  terms[i].label,
                  style: AppTextStyle.body(color: context.colors.text2),
                ),
                const SizedBox(width: AppSpacing.lg),
                Expanded(
                  child: Text(
                    terms[i].value,
                    textAlign: TextAlign.end,
                    style: AppTextStyle.body(color: context.colors.text),
                  ),
                ),
              ],
            ),
          ),
          if (i != terms.length - 1)
            Divider(height: 1, thickness: 1, color: context.colors.line),
        ],
      ],
    );
  }
}
