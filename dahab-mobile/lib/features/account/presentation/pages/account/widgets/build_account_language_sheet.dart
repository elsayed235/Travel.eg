part of 'account_widgets_imports.dart';

class BuildAccountLanguageSheet extends StatelessWidget {
  final String currentCode;
  final ValueChanged<Locale> onSelect;

  const BuildAccountLanguageSheet({
    super.key,
    required this.currentCode,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.xl,
          AppSpacing.lg,
          AppSpacing.xl,
          AppSpacing.xl,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              Translate.s.label_choose_language,
              style: AppTextStyle.sectionTitle(color: context.colors.text),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap18,
            _OptionRow(
              title: Translate.s.account_lang_ar,
              selected: currentCode == 'ar',
              onTap: () => onSelect(const Locale('ar', 'EG')),
            ),
            Gaps.vGap9,
            _OptionRow(
              title: Translate.s.account_lang_en,
              selected: currentCode == 'en',
              onTap: () => onSelect(const Locale('en')),
            ),
          ],
        ),
      ),
    );
  }
}

class BuildAccountThemeSheet extends StatelessWidget {
  final AdaptiveThemeMode currentMode;
  final ValueChanged<AdaptiveThemeMode> onSelect;

  const BuildAccountThemeSheet({
    super.key,
    required this.currentMode,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.xl,
          AppSpacing.lg,
          AppSpacing.xl,
          AppSpacing.xl,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              Translate.s.account_theme,
              style: AppTextStyle.sectionTitle(color: context.colors.text),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap18,
            _OptionRow(
              title: Translate.s.account_theme_light,
              selected: currentMode == AdaptiveThemeMode.light,
              onTap: () => onSelect(AdaptiveThemeMode.light),
            ),
            Gaps.vGap9,
            _OptionRow(
              title: Translate.s.account_theme_dark,
              selected: currentMode == AdaptiveThemeMode.dark,
              onTap: () => onSelect(AdaptiveThemeMode.dark),
            ),
            Gaps.vGap9,
            _OptionRow(
              title: Translate.s.account_theme_system,
              selected: currentMode == AdaptiveThemeMode.system,
              onTap: () => onSelect(AdaptiveThemeMode.system),
            ),
          ],
        ),
      ),
    );
  }
}

class BuildAccountLogoutSheet extends StatelessWidget {
  final VoidCallback onConfirm;
  final VoidCallback onCancel;

  const BuildAccountLogoutSheet({
    super.key,
    required this.onConfirm,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.xl,
          AppSpacing.lg,
          AppSpacing.xl,
          AppSpacing.xl,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              Translate.s.account_logout_title,
              style: AppTextStyle.sectionTitle(color: context.colors.text),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap9,
            Text(
              Translate.s.account_logout_subtitle,
              style: AppTextStyle.body(color: context.colors.text2),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap18,
            AppTextButton.maxPrimary(
              text: Translate.s.label_logout,
              onPressed: onConfirm,
            ),
            Gaps.vGap9,
            AppTextButton.maxWhite(
              text: Translate.s.cancel,
              onPressed: onCancel,
            ),
          ],
        ),
      ),
    );
  }
}

class BuildAccountRadiusSheet extends StatelessWidget {
  final int currentKm;
  final ValueChanged<int> onSelect;

  const BuildAccountRadiusSheet({
    super.key,
    required this.currentKm,
    required this.onSelect,
  });

  static const options = [10, 15, 25, 50, 100, 150];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(
          AppSpacing.xl,
          AppSpacing.lg,
          AppSpacing.xl,
          AppSpacing.xl,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              Translate.s.account_radius_title,
              style: AppTextStyle.sectionTitle(color: context.colors.text),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap9,
            Text(
              Translate.s.account_radius_hint,
              style: AppTextStyle.body(color: context.colors.text2),
              textAlign: TextAlign.center,
            ),
            Gaps.vGap18,
            for (final km in options) ...[
              _OptionRow(
                title: Translate.s.account_radius_value(km.toLocaleDigits),
                selected: currentKm == km,
                onTap: () => onSelect(km),
              ),
              if (km != options.last) Gaps.vGap9,
            ],
          ],
        ),
      ),
    );
  }
}

class _OptionRow extends StatelessWidget {
  final String title;
  final bool selected;
  final VoidCallback onTap;

  const _OptionRow({
    required this.title,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? context.colors.surface2 : context.colors.surface1,
      borderRadius: AppRadius.buttonAll,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.buttonAll,
        splashFactory: NoSplash.splashFactory,
        child: Container(
          padding: const EdgeInsetsDirectional.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.lg,
          ),
          decoration: BoxDecoration(
            borderRadius: AppRadius.buttonAll,
            border: Border.all(
              color: selected ? context.colors.button : context.colors.line,
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: Text(title, style: AppTextStyle.body(color: context.colors.text)),
              ),
              Icon(
                selected ? Icons.check_circle : Icons.circle_outlined,
                size: 20,
                color: selected ? context.colors.button : context.colors.text3,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
