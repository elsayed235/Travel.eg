import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/core/helpers/device_settings.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

/// العربية / English, the same pill the website puts on sign-in.
/// Lives in general because every screen that speaks to the traveler needs it.
class BuildLanguageSwitch extends StatelessWidget {
  const BuildLanguageSwitch({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DeviceCubit, DeviceState>(
      buildWhen: (prev, next) => prev.model.locale != next.model.locale,
      builder: (context, state) {
        final code = state.model.locale.languageCode;
        return _Pill(
          children: [
            _Segment(
              label: Translate.s.account_lang_ar,
              selected: code == 'ar',
              onTap: () => DeviceSettings.setLanguage(context, const Locale('ar', 'EG')),
            ),
            _Segment(
              label: Translate.s.account_lang_en,
              selected: code == 'en',
              onTap: () => DeviceSettings.setLanguage(context, const Locale('en')),
            ),
          ],
        );
      },
    );
  }
}

/// Light, dark, or follow the phone. The website paints both; the app has to
/// as well, before anyone has an account to open settings from.
class BuildThemeSwitch extends StatelessWidget {
  const BuildThemeSwitch({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DeviceCubit, DeviceState>(
      buildWhen: (prev, next) => prev.model.themeMode != next.model.themeMode,
      builder: (context, state) {
        final mode = state.model.themeMode;
        return _Pill(
          children: [
            _IconSegment(
              icon: Icons.light_mode_outlined,
              label: Translate.s.account_theme_light,
              selected: mode == AdaptiveThemeMode.light,
              onTap: () => DeviceSettings.setTheme(context, AdaptiveThemeMode.light),
            ),
            _IconSegment(
              icon: Icons.dark_mode_outlined,
              label: Translate.s.account_theme_dark,
              selected: mode == AdaptiveThemeMode.dark,
              onTap: () => DeviceSettings.setTheme(context, AdaptiveThemeMode.dark),
            ),
            _IconSegment(
              icon: Icons.phone_iphone,
              label: Translate.s.account_theme_system,
              selected: mode == AdaptiveThemeMode.system,
              onTap: () => DeviceSettings.setTheme(context, AdaptiveThemeMode.system),
            ),
          ],
        );
      },
    );
  }
}

class _Pill extends StatelessWidget {
  final List<Widget> children;

  const _Pill({required this.children});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.surface2,
        borderRadius: AppRadius.chipAll,
        border: Border.all(color: colors.line),
      ),
      child: Padding(
        padding: const EdgeInsets.all(2),
        child: Row(mainAxisSize: MainAxisSize.min, children: children),
      ),
    );
  }
}

class _Segment extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _Segment({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: selected ? colors.button : Colors.transparent,
      borderRadius: AppRadius.chipAll,
      child: InkWell(
        onTap: onTap,
        splashFactory: NoSplash.splashFactory,
        customBorder: const StadiumBorder(),
        child: Padding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
          child: Text(
            label,
            style: AppTextStyle.micro(color: selected ? colors.onButton : colors.text3),
          ),
        ),
      ),
    );
  }
}

class _IconSegment extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _IconSegment({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Tooltip(
      message: label,
      child: Material(
        color: selected ? colors.button : Colors.transparent,
        borderRadius: AppRadius.chipAll,
        child: InkWell(
          onTap: onTap,
          splashFactory: NoSplash.splashFactory,
          customBorder: const StadiumBorder(),
          child: SizedBox(
            width: 32,
            height: 28,
            child: Icon(icon, size: 16, color: selected ? colors.onButton : colors.text3),
          ),
        ),
      ),
    );
  }
}

/// The two switches together, with a gap. Auth uses this; account can too.
class BuildPreferenceSwitches extends StatelessWidget {
  const BuildPreferenceSwitches({super.key});

  @override
  Widget build(BuildContext context) {
    return const Wrap(
      spacing: AppSpacing.md,
      runSpacing: AppSpacing.md,
      alignment: WrapAlignment.end,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        BuildThemeSwitch(),
        BuildLanguageSwitch(),
      ],
    );
  }
}
