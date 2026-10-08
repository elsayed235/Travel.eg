import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/colors/rehla_palettes.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/theme/themes/app_theme.dart';

/// ThemeData for one destination in one mode (Granite & Lagoon). Flat and
/// hairline-bordered: no ripples, no elevation, no surface tint — depth comes
/// from photography and spacing, as on the website.
class RehlaTheme extends AppTheme {
  RehlaTheme(this.destination, this.brightness) : _c = RehlaPalettes.of(destination, brightness);

  final RehlaDestination destination;
  final Brightness brightness;
  final RehlaColors _c;

  bool get _dark => brightness == Brightness.dark;

  @override
  ThemeData get theme => ThemeData(
        useMaterial3: true,
        brightness: brightness,
        fontFamily: AppTheme.fontFamily,
        textTheme: GoogleFonts.ibmPlexSansArabicTextTheme(
          (_dark ? ThemeData.dark() : ThemeData.light()).textTheme,
        ).apply(bodyColor: _c.text, displayColor: _c.text),
        colorScheme: colorScheme,
        extensions: [RehlaColorsExtension(_c, destination)],
        splashFactory: NoSplash.splashFactory,
        highlightColor: Colors.transparent,
        splashColor: Colors.transparent,
        scaffoldBackgroundColor: _c.bg,
        dividerTheme: DividerThemeData(color: _c.line, thickness: 1, space: 1),
        cardTheme: CardThemeData(
          elevation: 0,
          color: _c.surface1,
          surfaceTintColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: AppRadius.cardAll, side: BorderSide(color: _c.line)),
        ),
        radioTheme: RadioThemeData(fillColor: WidgetStateProperty.all(_c.button)),
        checkboxTheme: CheckboxThemeData(
          fillColor: WidgetStateProperty.all(_c.button),
          checkColor: WidgetStateProperty.all(_c.onButton),
        ),
        switchTheme: SwitchThemeData(
          thumbColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? _c.onButton : _c.surface1),
          trackColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? _c.button : _c.surface3),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: _c.bg,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: true,
          systemOverlayStyle: SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarBrightness: brightness,
            statusBarIconBrightness: _dark ? Brightness.light : Brightness.dark,
          ),
          iconTheme: IconThemeData(color: _c.text, size: 22),
        ),
        bottomNavigationBarTheme: BottomNavigationBarThemeData(backgroundColor: _c.bg, elevation: 0),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: _c.surface2,
          hintStyle: TextStyle(color: _c.text3, decorationThickness: 0),
          labelStyle: TextStyle(color: _c.text2, decorationThickness: 0),
          errorStyle: TextStyle(color: _c.red, height: 0.9),
          border: const OutlineInputBorder(borderRadius: AppRadius.buttonAll, borderSide: BorderSide.none),
          enabledBorder: OutlineInputBorder(borderRadius: AppRadius.buttonAll, borderSide: BorderSide(color: _c.line)),
          focusedBorder: OutlineInputBorder(borderRadius: AppRadius.buttonAll, borderSide: BorderSide(color: _c.button, width: 1.5)),
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(elevation: 0),
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            elevation: WidgetStateProperty.all(0),
            overlayColor: WidgetStateProperty.all(_c.actionWash),
            foregroundColor: WidgetStateProperty.resolveWith(
              (s) => s.contains(WidgetState.disabled) ? _c.text3 : _c.button,
            ),
            backgroundColor: WidgetStateProperty.all(Colors.transparent),
            padding: WidgetStateProperty.all<EdgeInsetsGeometry>(const EdgeInsets.symmetric(horizontal: 12, vertical: 8)),
            shape: WidgetStateProperty.all<OutlinedBorder>(const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll)),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: _c.button,
            foregroundColor: _c.onButton,
            shadowColor: Colors.transparent,
            surfaceTintColor: Colors.transparent,
            shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
          ),
        ),
        bottomSheetTheme: BottomSheetThemeData(
          backgroundColor: _c.surface1,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
        ),
        snackBarTheme: SnackBarThemeData(backgroundColor: _c.text, contentTextStyle: TextStyle(color: _c.bg)),
        pageTransitionsTheme: const PageTransitionsTheme(
          builders: {
            TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
            TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
          },
        ),
      );

  @override
  ColorScheme get colorScheme => ColorScheme(
        primary: _c.button,
        onPrimary: _c.onButton,
        secondary: _c.highlight,
        onSecondary: _c.onButton,
        error: _c.red,
        onError: _c.onButton,
        surface: _c.surface1,
        onSurface: _c.text,
        brightness: brightness,
      );
}
