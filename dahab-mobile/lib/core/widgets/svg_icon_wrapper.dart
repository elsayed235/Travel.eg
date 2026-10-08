import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SvgIconWrapper extends StatelessWidget {
  const SvgIconWrapper({
    super.key,
    required this.size,
    this.color,
    this.pureIcon = false,
    required this.iconPath,
  })  : assert(size != 0),
        height = 0,
        width = 0;

  const SvgIconWrapper.rect({
    super.key,
    required this.iconPath,
    required this.height,
    required this.width,
    this.color,
  })  : size = 0,
        pureIcon = false;

  final double size;
  final double height;
  final double width;
  final Color? color;
  final bool pureIcon;
  final String iconPath;

  @override
  Widget build(BuildContext context) {
    if (size == 0) {
      return SvgPicture.asset(iconPath, color: color, width: width, height: height);
    }
    if (pureIcon) {
      return SvgPicture.asset(iconPath, color: color, width: size, height: size);
    }
    return SizedBox.square(
      dimension: size,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SvgPicture.asset(iconPath, color: color, width: size, height: size),
        ],
      ),
    );
  }
}
