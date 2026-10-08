import 'package:flutter/widgets.dart';
import 'package:google_fonts/google_fonts.dart';

/// Display faces (website: Fraunces for Latin, Alexandria for Arabic). Body
/// and UI text stay on IBM Plex Sans Arabic via the theme.
class AppFonts {
  const AppFonts._();

  static String? display(BuildContext context) => Directionality.of(context) == TextDirection.rtl
      ? GoogleFonts.alexandria().fontFamily
      : GoogleFonts.fraunces().fontFamily;
}
