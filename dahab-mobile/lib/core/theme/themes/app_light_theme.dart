import 'package:flutter/material.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/theme/themes/rehla_theme.dart';

/// Light ("salt") theme for a destination.
class AppLightTheme extends RehlaTheme {
  AppLightTheme([RehlaDestination destination = RehlaDestination.dahab]) : super(destination, Brightness.light);
}
