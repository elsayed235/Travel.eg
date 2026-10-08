import 'package:intl/intl.dart' as international;

extension StringExtension on String? {
  /// Return true only if
  ///
  /// value is not empty && value is not null
  bool get isNotBlank => this?.isNotEmpty == true;

  bool get isBlank => this == null || (this ?? '').isEmpty;

  bool get isRTL => international.Bidi.detectRtlDirectionality(this!);
}

