/// Presentation-layer only. Models keep real `int` / `DateTime`.
import 'package:intl/intl.dart';

const _ar = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

extension ArabicNum on String {
  String get toArabicDigits =>
      replaceAllMapped(RegExp(r'\d'), (m) => _ar[int.parse(m[0]!)]);

  /// Arabic-Indic when app locale is Arabic; otherwise Latin digits.
  String get toLocaleDigits {
    final code = Intl.getCurrentLocale();
    if (code.startsWith('ar')) return toArabicDigits;
    return this;
  }
}

extension ArabicNumOnNum on num {
  String get toArabicDigits => toString().toArabicDigits;

  String get toLocaleDigits => toString().toLocaleDigits;
}
