import 'package:flutter/material.dart';

/// REHLA radii (website tokens: --dg-radius-*). Chips and avatars are fully
/// rounded; everything else uses one of four steps.
class AppRadius {
  const AppRadius._();

  static const double image = 12;
  static const double chip = 999;
  static const double button = 12;
  static const double card = 20;
  static const double sheet = 28;

  static const BorderRadius imageAll = BorderRadius.all(Radius.circular(image));
  static const BorderRadius chipAll = BorderRadius.all(Radius.circular(chip));
  static const BorderRadius buttonAll = BorderRadius.all(Radius.circular(button));
  static const BorderRadius cardAll = BorderRadius.all(Radius.circular(card));
  static const BorderRadius sheetTop = BorderRadius.vertical(top: Radius.circular(sheet));
}
