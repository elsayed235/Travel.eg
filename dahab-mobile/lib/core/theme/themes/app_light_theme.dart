import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/colors/app_colors.dart';
import 'package:flutter_tdd/core/theme/colors/app_light_colors.dart';
import 'package:flutter_tdd/core/theme/themes/app_theme.dart';
import 'package:google_fonts/google_fonts.dart';

class AppLightTheme extends AppTheme {
  final AppColors _colors = AppLightColors();

  @override
  ThemeData get theme => ThemeData(
        useMaterial3: true,
        fontFamily: AppTheme.fontFamily,
        textTheme: GoogleFonts.ibmPlexSansArabicTextTheme(),
        colorScheme: colorScheme,
        brightness: Brightness.light,
        splashFactory: NoSplash.splashFactory,
        highlightColor: Colors.transparent,
        splashColor: Colors.transparent,
        scaffoldBackgroundColor: _colors.bg,
        dividerTheme: DividerThemeData(color: _colors.line, thickness: 1, space: 1),
        cardTheme: CardThemeData(
          elevation: 0,
          color: _colors.surface1,
          surfaceTintColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: AppRadius.cardAll,
            side: BorderSide(color: _colors.line),
          ),
        ),
        radioTheme: RadioThemeData(
          fillColor: WidgetStateProperty.all(_colors.green),
        ),
        checkboxTheme: CheckboxThemeData(
          fillColor: WidgetStateProperty.all(_colors.button),
          checkColor: WidgetStateProperty.all(_colors.onButton),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: _colors.bg,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: true,
          systemOverlayStyle: const SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarBrightness: Brightness.light,
            statusBarIconBrightness: Brightness.dark,
          ),
          iconTheme: IconThemeData(color: _colors.text, size: 21),
        ),
        bottomNavigationBarTheme: BottomNavigationBarThemeData(
          backgroundColor: _colors.bg,
          elevation: 0,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: _colors.surface2,
          hintStyle: TextStyle(color: _colors.text2, decorationThickness: 0),
          labelStyle: TextStyle(color: _colors.text2, decorationThickness: 0),
          errorStyle: TextStyle(color: _colors.red, height: 0.8),
          border: OutlineInputBorder(borderRadius: AppRadius.buttonAll),
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(elevation: 0),
        // TextButton = a text action: no fill, text-coloured. Filled buttons
        // (AppTextButton, LoadingButton) set their own background.
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            elevation: WidgetStateProperty.all(0),
            overlayColor: WidgetStateProperty.all(_colors.text.withValues(alpha: 0.06)),
            foregroundColor: WidgetStateProperty.resolveWith((states) {
              if (states.contains(WidgetState.disabled)) {
                return _colors.text3;
              }
              return _colors.text;
            }),
            backgroundColor: WidgetStateProperty.all(Colors.transparent),
            padding: WidgetStateProperty.all<EdgeInsetsGeometry>(
              const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            shape: WidgetStateProperty.all<OutlinedBorder>(
              RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
            ),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: _colors.button,
            foregroundColor: _colors.onButton,
            shadowColor: Colors.transparent,
            surfaceTintColor: Colors.transparent,
            shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
          ),
        ),
        snackBarTheme: SnackBarThemeData(backgroundColor: _colors.green),
      );

  @override
  ColorScheme get colorScheme => ColorScheme(
        primary: _colors.button,
        onPrimary: _colors.onButton,
        secondary: _colors.green,
        onSecondary: _colors.onButton,
        error: _colors.red,
        onError: _colors.onButton,
        surface: _colors.surface1,
        onSurface: _colors.text,
        brightness: Brightness.light,
      );
}
