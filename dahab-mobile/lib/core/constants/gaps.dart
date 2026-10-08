import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rehla/core/theme/app_spacing.dart';

import 'dimens.dart';

class Gaps {
  const Gaps._();

  static Widget hGap4 = const SizedBox(width: Dimens.dp4);
  static Widget hGap5 = const SizedBox(width: Dimens.dp5);
  static Widget hGap6 = const SizedBox(width: AppSpacing.sm);
  static Widget hGap8 = const SizedBox(width: Dimens.dp8);
  static Widget hGap9 = const SizedBox(width: AppSpacing.md);
  static Widget hGap10 = const SizedBox(width: Dimens.dp10);
  static Widget hGap12 = const SizedBox(width: Dimens.dp12);
  static Widget hGap13 = const SizedBox(width: Dimens.dp13);
  static Widget hGap14 = const SizedBox(width: Dimens.dp14);
  static Widget hGap15 = const SizedBox(width: Dimens.dp15);
  static Widget hGap16 = const SizedBox(width: Dimens.dp16);
  static Widget hGap18 = const SizedBox(width: AppSpacing.xl);
  static Widget hGap22 = const SizedBox(width: Dimens.dp22);
  static Widget hGap24 = const SizedBox(width: AppSpacing.xxl);
  static Widget hGap32 = const SizedBox(width: Dimens.dp32);

  static Widget hGap(int value) => SizedBox(width: value.w);

  static Widget vGap4 = const SizedBox(height: Dimens.dp4);
  static Widget vGap5 = const SizedBox(height: Dimens.dp5);
  static Widget vGap6 = const SizedBox(height: AppSpacing.sm);
  static Widget vGap8 = const SizedBox(height: Dimens.dp8);
  static Widget vGap9 = const SizedBox(height: AppSpacing.md);
  static Widget vGap10 = const SizedBox(height: Dimens.dp10);
  static Widget vGap12 = const SizedBox(height: Dimens.dp12);
  static Widget vGap13 = const SizedBox(height: Dimens.dp13);
  static Widget vGap14 = const SizedBox(height: Dimens.dp14);
  static Widget vGap15 = const SizedBox(height: Dimens.dp15);
  static Widget vGap16 = const SizedBox(height: Dimens.dp16);
  static Widget vGap18 = const SizedBox(height: AppSpacing.xl);
  static Widget vGap20 = const SizedBox(height: Dimens.dp20);
  static Widget vGap24 = const SizedBox(height: Dimens.dp24);
  static Widget vGap32 = const SizedBox(height: Dimens.dp32);
  static Widget vGap50 = const SizedBox(height: Dimens.dp50);
  static Widget vGap64 = const SizedBox(height: Dimens.dp64);
  static Widget vGap128 = const SizedBox(height: Dimens.dp128);
  static Widget vGap256 = const SizedBox(height: Dimens.dp256);

  static Widget vGap(double value) => SizedBox(height: value);

  static const Widget line = Divider();

  static const Widget vLine = SizedBox(
    width: 0.6,
    height: 24.0,
    child: VerticalDivider(),
  );

  static const Widget empty = Offstage(
    offstage: true,
    child: SizedBox.shrink(),
  );
}
