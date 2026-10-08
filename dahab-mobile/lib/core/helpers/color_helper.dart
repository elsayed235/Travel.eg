import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/theme/colors/app_colors.dart';

class ColorHelper {

  static String colorToHex(Color color) {
    return color.value.toRadixString(16).substring(2);
  }

  static Color hexToColor(String? strColor) {
    try{
      var hexColor = strColor?.replaceAll("#", "");
      if (hexColor?.length == 6) {
        hexColor = "FF$hexColor";
      }
      if (hexColor?.length == 8) {
        return Color(int.parse("0x$hexColor"));
      }
      return AppColors.fixedColors.primary;
    }catch(_){
      return AppColors.fixedColors.primary;
    }
  }

  static Color darken(Color color, [double amount = 1]) {
    amount = amount /10.0;
    assert(amount >= 0 && amount <= 1);

    final hsl = HSLColor.fromColor(color);
    final hslDark = hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1.0));

    return hslDark.toColor();
  }

  static Color lighten(Color color, [double amount = 1]) {
    amount = amount /10.0;
    assert(amount >= 0 && amount <= 1);

    final hsl = HSLColor.fromColor(color);
    final hslLight = hsl.withLightness((hsl.lightness + amount).clamp(0.0, 1.0));

    return hslLight.toColor();
  }

}