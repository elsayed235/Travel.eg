import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/helpers/theme_transition_service.dart';
import 'package:rehla/core/theme/colors/rehla_palettes.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/theme/themes/app_dark_theme.dart';
import 'package:rehla/core/theme/themes/app_light_theme.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// The place being explored. Part of the identity, not a filter: switching it
/// re-themes the app (palette per destination) and scopes the content.
class DestinationCubit extends Cubit<RehlaDestination> {
  DestinationCubit([super.initial = RehlaDestination.dahab]);

  static const _key = 'rehla_destination';

  /// Saved choice, or Dahab. Called before the first frame so the app opens
  /// in the right colours.
  static Future<RehlaDestination> hydrate() async {
    final prefs = await SharedPreferences.getInstance();
    return RehlaDestination.fromName(prefs.getString(_key));
  }

  /// Switch place: cover the screen in the new palette's background, swap the
  /// theme underneath, then reveal — no hard cut between identities.
  Future<void> select(BuildContext context, RehlaDestination next) async {
    if (next == state) return;
    final adaptive = AdaptiveTheme.of(context);
    final brightness = Theme.of(context).brightness;
    final cover = RehlaPalettes.of(next, brightness).bg;
    await ThemeTransitionService.instance.transition(cover, () {
      adaptive.setTheme(light: AppLightTheme(next).theme, dark: AppDarkTheme(next).theme);
      emit(next);
    });
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, next.name);
  }
}

extension DestinationContext on BuildContext {
  RehlaDestination get destination => watch<DestinationCubit>().state;
}
