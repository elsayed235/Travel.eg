import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/theme/colors/app_colors.dart';
import 'package:flutter_tdd/core/widgets/svg_icon_wrapper.dart';
import 'package:flutter_tdd/res.dart';

class CheckIcon extends StatelessWidget {
  final double size;
  final Color? color;

  const CheckIcon({super.key, this.size = 24, this.color});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: size,
      width: size,
      child: SvgIconWrapper(
        iconPath: Res.check,
        size: size,
        color: color ?? AppColors.fixedColors.primary,
      ),
    );
  }
}
