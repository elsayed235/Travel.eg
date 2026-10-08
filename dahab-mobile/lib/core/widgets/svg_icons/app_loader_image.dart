import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_tdd/core/helpers/color_helper.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';

class AppLoaderImage extends StatelessWidget {
  final double size;
  final Color? color;

  const AppLoaderImage({super.key, required this.size, this.color});

  @override
  Widget build(BuildContext context) {
    final color = this.color ?? context.colors.primary;
    return SizedBox.square(
      dimension: size,
      child: SvgPicture.string(
        """<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="60" cy="60" r="58" transform="rotate(-180 60 60)" stroke="#E6E6E6" stroke-width="4"/>
<mask id="mask0_785_4935" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-7" y="-11" width="49" height="141">
<rect width="32.0312" height="140.469" rx="16.0156" transform="matrix(-1 0 0 1 25.875 -10.6875)" fill="white"/>
</mask>
<g mask="url(#mask0_785_4935)">
<circle cx="60" cy="60" r="58" transform="rotate(-180 60 60)" stroke="url(#paint0_linear_785_4935)" stroke-width="4"/>
</g>
<defs>
<linearGradient id="paint0_linear_785_4935" x1="60" y1="2" x2="60" y2="118" gradientUnits="userSpaceOnUse">
<stop offset="0.104167" stop-color="#${ColorHelper.colorToHex(color)}"
 stop-opacity="0"/>
<stop offset="0.510417" stop-color="#${ColorHelper.colorToHex(color)}"/>
<stop offset="0.890625" stop-color="#${ColorHelper.colorToHex(color)}" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>""",
        height: size,
        width: size,
      ),
    );
  }
}
