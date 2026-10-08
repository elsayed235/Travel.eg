import 'package:flutter/material.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/utils/arabic_numerals.dart';

class AppPrice extends StatelessWidget {
  final num amount;
  final String? currency;
  final String? unit;
  final bool muted;
  final CrossAxisAlignment alignment;

  const AppPrice({
    super.key,
    required this.amount,
    this.currency = 'ج',
    this.unit,
    this.muted = false,
    this.alignment = CrossAxisAlignment.end,
  });

  @override
  Widget build(BuildContext context) {
    final color = muted ? context.colors.text2 : context.colors.text;
    final amountText = currency == null || currency!.isEmpty
        ? amount.toArabicDigits
        : '${amount.toArabicDigits} $currency';
    return Column(
      crossAxisAlignment: alignment,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(amountText, style: AppTextStyle.price(color: color)),
        if (unit != null)
          Text(unit!, style: AppTextStyle.priceUnit(color: context.colors.text2)),
      ],
    );
  }
}
