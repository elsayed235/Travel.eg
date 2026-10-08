part of 'account_widgets_imports.dart';

class BuildAccountDarkModeRow extends StatelessWidget {
  final bool isDark;

  const BuildAccountDarkModeRow({super.key, required this.isDark});

  Future<void> _toggle(BuildContext context) async {
    final coverColor = isDark ? AppLightColors().bg : AppDarkColors().bg;
    final mode = isDark ? AdaptiveThemeMode.light : AdaptiveThemeMode.dark;
    await ThemeTransitionService.instance.transition(coverColor, () {
      if (!context.mounted) return;
      // AdaptiveTheme drives MaterialApp ThemeData; DeviceCubit stays in sync for prefs/UI.
      if (isDark) {
        AdaptiveTheme.of(context).setLight();
      } else {
        AdaptiveTheme.of(context).setDark();
      }
      context.read<DeviceCubit>().updateThemeMode(mode);
      DeviceSettings.persistThemeMode(mode);
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _toggle(context),
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.lg,
        ),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: context.colors.surface2,
                borderRadius: AppRadius.buttonAll,
              ),
              alignment: Alignment.center,
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Icon(
                  isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                  key: ValueKey(isDark),
                  size: 18,
                  color: context.colors.text2,
                ),
              ),
            ),
            Gaps.hGap13,
            Expanded(
              child: Text(
                Translate.s.account_dark_mode,
                style: AppTextStyle.body(color: context.colors.text),
              ),
            ),
            BuildAccountDarkModeToggle(isDark: isDark),
          ],
        ),
      ),
    );
  }
}

class BuildAccountDarkModeToggle extends StatelessWidget {
  final bool isDark;

  const BuildAccountDarkModeToggle({super.key, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeInOut,
      width: 46,
      height: 26,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppRadius.sheet),
        color: isDark ? context.colors.button : context.colors.surface3,
        border: Border.all(color: context.colors.line),
      ),
      padding: const EdgeInsets.all(AppSpacing.xs),
      child: AnimatedAlign(
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeInOut,
        alignment: isDark
            ? AlignmentDirectional.centerEnd
            : AlignmentDirectional.centerStart,
        child: Container(
          width: 18,
          height: 18,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isDark ? context.colors.onButton : context.colors.surface1,
            border: Border.all(color: context.colors.line),
          ),
          alignment: Alignment.center,
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 200),
            child: Icon(
              isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
              key: ValueKey(isDark),
              size: 11,
              color: isDark ? context.colors.button : context.colors.text3,
            ),
          ),
        ),
      ),
    );
  }
}
