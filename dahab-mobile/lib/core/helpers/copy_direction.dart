import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart' show Bidi;

/// Content not translated yet arrives in English on an Arabic screen. It
/// reads in its own direction, so its punctuation stays at the end of the
/// line instead of jumping to the start.
abstract final class CopyDirection {
  const CopyDirection._();

  static TextDirection of(String text) => Bidi.detectRtlDirectionality(text) ? TextDirection.rtl : TextDirection.ltr;
}
