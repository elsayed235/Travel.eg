import 'package:flutter/material.dart';

/// Design radii from FLUTTER_SPEC.md.
/// Nothing in this app exceeds [sheet]. If a design asks for more, it is wrong.
class AppRadius {
  const AppRadius._();

  static const double image = 6;
  static const double chip = 6;
  static const double button = 8;
  static const double card = 10;
  static const double sheet = 14;

  static const BorderRadius imageAll = BorderRadius.all(Radius.circular(image));
  static const BorderRadius chipAll = BorderRadius.all(Radius.circular(chip));
  static const BorderRadius buttonAll = BorderRadius.all(Radius.circular(button));
  static const BorderRadius cardAll = BorderRadius.all(Radius.circular(card));
  static const BorderRadius sheetTop = BorderRadius.vertical(top: Radius.circular(sheet));
}
