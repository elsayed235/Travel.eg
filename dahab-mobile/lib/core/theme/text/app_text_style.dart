import 'package:flutter/material.dart';

// ignore_for_file: non_constant_identifier_names

class AppTextStyle extends TextStyle {
  const AppTextStyle() : super();

  static const FontWeight weight500 = FontWeight.w600;
  static const double titleHeight = 1.35;
  static const double bodyHeight = 1.5;

  /// Magr size/weight constructors. Prefer named tokens below for new UI.
  const AppTextStyle.s8_w400({required Color color})
      : super(color: color, fontSize: 8, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.s9_w400({required Color color})
      : super(color: color, fontSize: 9, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.s10_w400({required Color color})
      : super(color: color, fontSize: 10, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.s10_w500({required Color color})
      : super(color: color, fontSize: 10, fontWeight: weight500, height: bodyHeight);

  const AppTextStyle.s11_w400({required Color color})
      : super(color: color, fontSize: 11, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.s12_w400({required Color color})
      : super(color: color, fontSize: 12, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.s12_w300({required Color color})
      : super(color: color, fontSize: 12, fontWeight: FontWeight.w300, height: bodyHeight);

  const AppTextStyle.s12_w500({required Color color})
      : super(color: color, fontSize: 12, fontWeight: weight500, height: bodyHeight);

  const AppTextStyle.s12_w600({required Color color})
      : super(color: color, fontSize: 12, fontWeight: FontWeight.w600, height: bodyHeight);

  const AppTextStyle.s12_w700({required Color color})
      : super(color: color, fontSize: 12, fontWeight: FontWeight.w700, height: bodyHeight);

  const AppTextStyle.s13_w500({required Color color})
      : super(color: color, fontSize: 13, fontWeight: weight500, height: bodyHeight);

  const AppTextStyle.s14_w400({required Color color})
      : super(color: color, fontSize: 14, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.s14_w500({required Color color})
      : super(color: color, fontSize: 14, fontWeight: weight500, height: titleHeight);

  const AppTextStyle.s14_w600({required Color color})
      : super(color: color, fontSize: 14, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.s14_w800({required Color color})
      : super(color: color, fontSize: 14, fontWeight: FontWeight.w800, height: titleHeight);

  const AppTextStyle.s16_w400({required Color color})
      : super(color: color, fontSize: 16, fontWeight: FontWeight.w400, height: titleHeight);

  const AppTextStyle.s16_w500({required Color color})
      : super(color: color, fontSize: 16, fontWeight: weight500, height: titleHeight);

  const AppTextStyle.s16_w700({required Color color})
      : super(color: color, fontSize: 16, fontWeight: FontWeight.w700, height: titleHeight);

  const AppTextStyle.s16_w800({required Color color})
      : super(color: color, fontSize: 16, fontWeight: FontWeight.w800, height: titleHeight);

  const AppTextStyle.s18_w400({required Color color})
      : super(color: color, fontSize: 18, fontWeight: FontWeight.w400, height: titleHeight);

  const AppTextStyle.s18_w500({required Color color})
      : super(color: color, fontSize: 18, fontWeight: weight500, height: titleHeight);

  const AppTextStyle.s18_w600({required Color color})
      : super(color: color, fontSize: 18, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.s18_w700({required Color color})
      : super(color: color, fontSize: 18, fontWeight: FontWeight.w700, height: titleHeight);

  const AppTextStyle.s20_w500({required Color color})
      : super(color: color, fontSize: 20, fontWeight: weight500, height: titleHeight);

  const AppTextStyle.s20_w600({required Color color})
      : super(color: color, fontSize: 20, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.s24_w700({required Color color})
      : super(color: color, fontSize: 24, fontWeight: FontWeight.w700, height: titleHeight);

  const AppTextStyle.s32_w700({required Color color})
      : super(color: color, fontSize: 32, fontWeight: FontWeight.w700, height: titleHeight);

  const AppTextStyle.h1({required Color color})
      : super(color: color, fontSize: 40, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.h2({required Color color})
      : super(color: color, fontSize: 32, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.h3({required Color color})
      : super(color: color, fontSize: 24, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.h4({required Color color})
      : super(color: color, fontSize: 16, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.h5({required Color color})
      : super(color: color, fontSize: 14, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.h6({required Color color})
      : super(color: color, fontSize: 12, fontWeight: FontWeight.w600, height: titleHeight);

  /// Named tokens from FLUTTER_SPEC.md — use these for new screens.
  /// Home headline. No letter-spacing: Arabic letters join.
  const AppTextStyle.display({required Color color})
      : super(color: color, fontSize: 30, fontWeight: FontWeight.w700, height: 1.25);

  const AppTextStyle.screenTitle({required Color color})
      : super(color: color, fontSize: 19, fontWeight: FontWeight.w700, height: titleHeight);

  const AppTextStyle.sectionTitle({required Color color})
      : super(color: color, fontSize: 14, fontWeight: FontWeight.w600, height: titleHeight);

  const AppTextStyle.itemTitle({required Color color})
      : super(color: color, fontSize: 13.5, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.price({required Color color})
      : super(
          color: color,
          fontSize: 17,
          fontWeight: FontWeight.w600,
          height: titleHeight,
          letterSpacing: -0.34,
        );

  const AppTextStyle.priceUnit({required Color color})
      : super(color: color, fontSize: 11, fontWeight: FontWeight.w300, height: bodyHeight);

  const AppTextStyle.body({required Color color})
      : super(color: color, fontSize: 13, fontWeight: FontWeight.w400, height: bodyHeight);

  const AppTextStyle.caption({required Color color})
      : super(color: color, fontSize: 11.5, fontWeight: FontWeight.w300, height: bodyHeight);

  const AppTextStyle.micro({required Color color})
      : super(color: color, fontSize: 10, fontWeight: FontWeight.w300, height: bodyHeight);
}
