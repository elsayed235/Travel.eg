import 'package:flutter/material.dart';

class AppConfig {

  AppConfig._();
  static AppConfig instance = AppConfig._();

  String get defaultLanguage => 'en';

  /// Host of the REHLA web app (also serves photography under /images).
  String get hostUrl => const String.fromEnvironment('APP_BASE_URL');

  String get baseUrl => hostUrl + const String.fromEnvironment('APP_API');

  /// Absolute URL for a public asset path such as `images/hero/x.webp`.
  String assetUrl(String path) => hostUrl + (path.startsWith('/') ? path.substring(1) : path);

  static BoxConstraints get textFieldConstrains =>
      const BoxConstraints(minHeight: 50, maxHeight: 50);

  static BoxConstraints? fromHeight(double? height) =>
      height!=null?BoxConstraints(minHeight: height, maxHeight: height):null;
}