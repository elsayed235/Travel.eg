import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/device_cubit/device_cubit.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/helpers/device_settings.dart';
import 'package:rehla/core/helpers/theme_transition_service.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/colors/rehla_palettes.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_icon.dart';

/// One quiet control for language and appearance: a pill that names the
/// current language and opens [showPreferencesSheet]. Used on sign-in, where
/// there is no account yet to open settings from.
class BuildPreferencesButton extends StatelessWidget {
  final bool onImage;

  const BuildPreferencesButton({super.key, this.onImage = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return BlocBuilder<DeviceCubit, DeviceState>(
      buildWhen: (a, b) => a.model.locale != b.model.locale,
      builder: (context, state) {
        final language = state.model.locale.languageCode == 'ar'
            ? Translate.s.account_lang_ar
            : Translate.s.account_lang_en;
        final fg = onImage ? colors.onImage : colors.text;
        return Semantics(
          button: true,
          label: Translate.s.prefs_button_label(language),
          onTap: () => showPreferencesSheet(context),
          excludeSemantics: true,
          child: Material(
            color: onImage ? colors.scrim.withValues(alpha: 0.32) : colors.surface1,
            shape: StadiumBorder(
              side: BorderSide(color: onImage ? colors.onImage.withValues(alpha: 0.28) : colors.line),
            ),
            child: InkWell(
              onTap: () => showPreferencesSheet(context),
              customBorder: const StadiumBorder(),
              splashFactory: NoSplash.splashFactory,
              child: SizedBox(
                height: 40,
                child: Padding(
                  padding: const EdgeInsetsDirectional.only(start: AppSpacing.md, end: AppSpacing.lg),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      AppIcon.ui(AppIcons.globe, size: 18, color: fg),
                      Gaps.hGap6,
                      Text(language, style: AppTextStyle.s13_w500(color: fg)),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

Future<void> showPreferencesSheet(BuildContext context) {
  return showModalBottomSheet<void>(
    context: context,
    useSafeArea: true,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    elevation: 0,
    builder: (_) => const _PreferencesSheet(),
  );
}

/// Paints its own surface so it re-themes in place when appearance changes
/// while it is open.
class _PreferencesSheet extends StatelessWidget {
  const _PreferencesSheet();

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(color: colors.surface1, borderRadius: AppRadius.sheetTop),
      padding: EdgeInsetsDirectional.fromSTEB(
        AppSpacing.xl,
        AppSpacing.md,
        AppSpacing.xl,
        AppSpacing.xl + MediaQuery.paddingOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: AppSpacing.xl),
              decoration: BoxDecoration(color: colors.line2, borderRadius: AppRadius.chipAll),
            ),
          ),
          Text(Translate.s.prefs_title, style: AppTextStyle.s20_w600(color: colors.text)),
          Gaps.vGap18,
          _Label(Translate.s.prefs_language),
          const BuildLanguageOptions(),
          Gaps.vGap24,
          _Label(Translate.s.prefs_appearance),
          const BuildAppearancePicker(),
          Gaps.vGap24,
          SizedBox(
            height: 50,
            child: FilledButton(
              onPressed: () => Navigator.of(context).maybePop(),
              style: FilledButton.styleFrom(
                backgroundColor: colors.button,
                foregroundColor: colors.onButton,
                shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
              ),
              child: Text(Translate.s.prefs_done, style: AppTextStyle.s16_w500(color: colors.onButton)),
            ),
          ),
        ],
      ),
    );
  }
}

class _Label extends StatelessWidget {
  final String text;

  const _Label(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.only(start: AppSpacing.xs, bottom: AppSpacing.md),
      child: Text(text, style: AppTextStyle.s13_w500(color: context.colors.text2)),
    );
  }
}

/// العربية / English as a grouped list with a check, each name in its own
/// script so it reads to whoever needs it.
class BuildLanguageOptions extends StatelessWidget {
  const BuildLanguageOptions({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return BlocBuilder<DeviceCubit, DeviceState>(
      buildWhen: (a, b) => a.model.locale != b.model.locale,
      builder: (context, state) {
        final code = state.model.locale.languageCode;
        return DecoratedBox(
          decoration: BoxDecoration(
            color: colors.surface2,
            borderRadius: AppRadius.buttonAll,
            border: Border.all(color: colors.line),
          ),
          child: Column(
            children: [
              _LanguageRow(
                label: Translate.s.account_lang_ar,
                selected: code == 'ar',
                onTap: () => _set(context, const Locale('ar', 'EG'), code),
              ),
              Divider(height: 1, thickness: 1, color: colors.line, indent: AppSpacing.lg, endIndent: AppSpacing.lg),
              _LanguageRow(
                label: Translate.s.account_lang_en,
                selected: code == 'en',
                onTap: () => _set(context, const Locale('en'), code),
              ),
            ],
          ),
        );
      },
    );
  }

  static void _set(BuildContext context, Locale locale, String current) {
    if (locale.languageCode == current) return;
    HapticFeedback.selectionClick();
    DeviceSettings.setLanguage(context, locale);
  }
}

class _LanguageRow extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _LanguageRow({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      button: true,
      selected: selected,
      label: label,
      onTap: onTap,
      excludeSemantics: true,
      child: InkWell(
        onTap: onTap,
        splashFactory: NoSplash.splashFactory,
        borderRadius: AppRadius.buttonAll,
        child: SizedBox(
          height: 52,
          child: Padding(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg),
            child: Row(
              children: [
                Expanded(child: Text(label, style: AppTextStyle.s16_w400(color: colors.text))),
                AnimatedScale(
                  scale: selected ? 1 : 0,
                  duration: const Duration(milliseconds: 220),
                  curve: Curves.easeOutBack,
                  child: AppIcon.ui(AppIcons.check, size: 20, color: colors.button),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Light, dark, or follow the phone, as three small previews of the screen
/// itself, painted from the live palette of the current place.
class BuildAppearancePicker extends StatelessWidget {
  const BuildAppearancePicker({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DeviceCubit, DeviceState>(
      buildWhen: (a, b) => a.model.themeMode != b.model.themeMode,
      builder: (context, state) {
        final mode = state.model.themeMode;
        return Row(
          children: [
            for (final (i, option) in const [
              AdaptiveThemeMode.light,
              AdaptiveThemeMode.dark,
              AdaptiveThemeMode.system,
            ].indexed) ...[
              if (i > 0) Gaps.hGap10,
              Expanded(
                child: _AppearanceTile(
                  mode: option,
                  selected: mode == option,
                  onTap: () => _set(context, option, mode),
                ),
              ),
            ],
          ],
        );
      },
    );
  }

  static Future<void> _set(BuildContext context, AdaptiveThemeMode mode, AdaptiveThemeMode current) async {
    if (mode == current) return;
    HapticFeedback.selectionClick();
    final destination = Theme.of(context).extension<RehlaColorsExtension>()?.destination ?? RehlaDestination.dahab;
    final next = switch (mode) {
      AdaptiveThemeMode.light => Brightness.light,
      AdaptiveThemeMode.dark => Brightness.dark,
      AdaptiveThemeMode.system => MediaQuery.platformBrightnessOf(context),
    };
    if (next == Theme.of(context).brightness) {
      await DeviceSettings.setTheme(context, mode);
      return;
    }
    final cover = RehlaPalettes.of(destination, next).bg;
    await ThemeTransitionService.instance.transition(cover, () {
      if (context.mounted) DeviceSettings.setTheme(context, mode);
    });
  }
}

class _AppearanceTile extends StatelessWidget {
  final AdaptiveThemeMode mode;
  final bool selected;
  final VoidCallback onTap;

  const _AppearanceTile({required this.mode, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final destination = Theme.of(context).extension<RehlaColorsExtension>()?.destination ?? RehlaDestination.dahab;
    final light = RehlaPalettes.of(destination, Brightness.light);
    final dark = RehlaPalettes.of(destination, Brightness.dark);
    final (label, icon) = switch (mode) {
      AdaptiveThemeMode.light => (Translate.s.account_theme_light, AppIcons.sun),
      AdaptiveThemeMode.dark => (Translate.s.account_theme_dark, AppIcons.moon),
      AdaptiveThemeMode.system => (Translate.s.account_theme_system, AppIcons.device),
    };
    return Semantics(
      button: true,
      selected: selected,
      label: label,
      onTap: onTap,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Column(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOutCubic,
              height: 92,
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                borderRadius: AppRadius.buttonAll,
                border: Border.all(color: selected ? colors.button : colors.line, width: selected ? 2 : 1),
              ),
              child: ClipRRect(
                borderRadius: const BorderRadius.all(Radius.circular(AppRadius.button - 3)),
                child: switch (mode) {
                  AdaptiveThemeMode.light => _MiniScreen(palette: light),
                  AdaptiveThemeMode.dark => _MiniScreen(palette: dark),
                  AdaptiveThemeMode.system => Row(
                      children: [
                        Expanded(child: _MiniScreen(palette: light, half: true)),
                        Expanded(child: _MiniScreen(palette: dark, half: true)),
                      ],
                    ),
                },
              ),
            ),
            Gaps.vGap8,
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AppIcon.ui(icon, size: 15, color: selected ? colors.button : colors.text2),
                Gaps.hGap4,
                Flexible(
                  child: Text(
                    label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: (selected ? AppTextStyle.s13_w500(color: colors.text) : AppTextStyle.s13_w500(color: colors.text2)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// A screen in miniature: a header bar, a card and the action colour.
class _MiniScreen extends StatelessWidget {
  final RehlaColors palette;
  final bool half;

  const _MiniScreen({required this.palette, this.half = false});

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: palette.bg,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.sm),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _bar(palette.text.withValues(alpha: 0.7), half ? 0.8 : 0.5, 5),
            Gaps.vGap6,
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: palette.surface1,
                  borderRadius: const BorderRadius.all(Radius.circular(5)),
                  border: Border.all(color: palette.line),
                ),
                padding: const EdgeInsets.all(AppSpacing.xs),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _bar(palette.text2.withValues(alpha: 0.6), 0.9, 3),
                    Gaps.vGap4,
                    _bar(palette.text3.withValues(alpha: 0.6), 0.6, 3),
                    const Spacer(),
                    _bar(palette.button, half ? 1 : 0.55, 7),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _bar(Color color, double widthFactor, double height) => FractionallySizedBox(
        widthFactor: widthFactor,
        child: Container(
          height: height,
          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.all(Radius.circular(height))),
        ),
      );
}
