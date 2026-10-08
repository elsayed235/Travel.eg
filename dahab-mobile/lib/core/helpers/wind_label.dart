import 'package:rehla/core/localization/translate.dart';

/// Wind as the website shows it: knots with the localized unit, and the
/// compass point the server reports (16-point, e.g. "NNE"). English keeps the
/// code; Arabic folds it onto the eight named directions.
class WindLabel {
  WindLabel._();

  static String knots(num value) => '${value.round()} ${Translate.s.unit_knots}';

  static String compass(String raw, {required bool arabic}) {
    if (!arabic) return raw;
    final code = raw.trim().toUpperCase();
    final point = code.length == 3 ? code.substring(1) : code;
    final s = Translate.s;
    return switch (point) {
      'N' => s.compass_n,
      'NE' => s.compass_ne,
      'E' => s.compass_e,
      'SE' => s.compass_se,
      'S' => s.compass_s,
      'SW' => s.compass_sw,
      'W' => s.compass_w,
      'NW' => s.compass_nw,
      _ => raw,
    };
  }
}
