import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/core/constants/app_constants.dart';
import 'package:rehla/generated/l10n.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Syncs DeviceCubit + AdaptiveTheme + SharedPreferences for locale/theme/radius.
class DeviceSettings {
  const DeviceSettings._();

  static const _themeKey = 'themeMode';
  static const _radiusKey = 'searchRadiusKm';
  static const defaultRadiusKm = 25;

  static Future<void> hydrate(DeviceCubit cubit) async {
    final prefs = await SharedPreferences.getInstance();
    final lang = prefs.getString(ApplicationConstants.keyLanguage);
    final themeName = prefs.getString(_themeKey);
    final radius = prefs.getInt(_radiusKey);

    Locale? locale;
    if (lang == ApplicationConstants.langEN) {
      locale = const Locale('en');
    } else if (lang == ApplicationConstants.langAR) {
      locale = const Locale('ar', 'EG');
    }

    AdaptiveThemeMode? themeMode;
    if (themeName != null) {
      themeMode = AdaptiveThemeMode.values.asNameMap()[themeName];
    }

    if (locale != null) {
      await S.load(locale);
      cubit.updateLanguage(locale);
    }
    if (themeMode != null) {
      cubit.updateThemeMode(themeMode);
    }
    cubit.updateSearchRadiusKm(radius ?? defaultRadiusKm);
  }

  static Future<void> setLanguage(BuildContext context, Locale locale) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(ApplicationConstants.keyLanguage, locale.languageCode);
    await S.load(locale);
    if (!context.mounted) return;
    context.read<DeviceCubit>().updateLanguage(locale);
  }

  static Future<void> setTheme(BuildContext context, AdaptiveThemeMode mode) async {
    await persistThemeMode(mode);
    if (!context.mounted) return;
    context.read<DeviceCubit>().updateThemeMode(mode);
    final adaptive = AdaptiveTheme.of(context);
    switch (mode) {
      case AdaptiveThemeMode.light:
        adaptive.setLight();
      case AdaptiveThemeMode.dark:
        adaptive.setDark();
      case AdaptiveThemeMode.system:
        adaptive.setSystem();
    }
  }

  static Future<void> persistThemeMode(AdaptiveThemeMode mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeKey, mode.name);
  }

  static Future<void> setSearchRadiusKm(BuildContext context, int km) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_radiusKey, km);
    if (!context.mounted) return;
    context.read<DeviceCubit>().updateSearchRadiusKm(km);
  }

  static bool isDark(BuildContext context, AdaptiveThemeMode mode) {
    if (mode == AdaptiveThemeMode.dark) return true;
    if (mode == AdaptiveThemeMode.light) return false;
    return MediaQuery.platformBrightnessOf(context) == Brightness.dark;
  }
}
