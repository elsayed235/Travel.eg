import 'package:flutter/material.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/theme/themes/rehla_theme.dart';

/// Dark ("abyss") theme for a destination.
class AppDarkTheme extends RehlaTheme {
  AppDarkTheme([RehlaDestination destination = RehlaDestination.dahab]) : super(destination, Brightness.dark);
}
