import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_fonts.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/utils/arabic_numerals.dart';
import 'package:rehla/core/widgets/GenericTextField.dart';
import 'package:rehla/core/widgets/app_icon.dart';
import 'package:rehla/core/widgets/rehla_mark.dart';
import 'package:rehla/features/general/presentation/widgets/build_preference_switches.dart';

/// Shared radii for the auth flow: fields and buttons match.
class AuthRadius {
  AuthRadius._();

  static const double field = 14;
  static const BorderRadius fieldAll = BorderRadius.all(Radius.circular(field));
}

/// Auth shell: soft atmosphere, a round back button, and (for multi-step
/// flows) where the user is in the sequence.
class BuildAuthScaffold extends StatelessWidget {
  final Widget child;
  final bool showBack;
  final VoidCallback? onBack;

  /// Kept for existing callers; the hero decides its own branding now.
  final bool brandHero;

  /// Spoken name for the back control. Login uses "Back to Dahab".
  final String? backLabel;

  /// 1-based step in a multi-step flow (forgot → code → new password).
  final int? step;
  final int? totalSteps;

  const BuildAuthScaffold({
    super.key,
    required this.child,
    this.showBack = true,
    this.onBack,
    this.backLabel,
    this.brandHero = true,
    this.step,
    this.totalSteps,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: colors.bg,
        body: Stack(
          fit: StackFit.expand,
          children: [
            const BuildAuthAtmosphere(),
            SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Padding(
                    padding: const EdgeInsetsDirectional.fromSTEB(
                      AppSpacing.xl,
                      AppSpacing.sm,
                      AppSpacing.xl,
                      0,
                    ),
                    child: SizedBox(
                      height: 48,
                      child: Row(
                        children: [
                          if (showBack)
                            _RoundBackButton(
                              label: backLabel,
                              onTap: onBack ?? () => AutoRouter.of(context).maybePop(),
                            ),
                          const Spacer(),
                          if (step != null && totalSteps != null) ...[
                            BuildAuthSteps(step: step!, total: totalSteps!),
                            Gaps.hGap10,
                          ],
                          const BuildPreferencesButton(),
                        ],
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => FocusScope.of(context).unfocus(),
                      behavior: HitTestBehavior.opaque,
                      child: child,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RoundBackButton extends StatelessWidget {
  final VoidCallback onTap;
  final String? label;

  const _RoundBackButton({required this.onTap, this.label});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Tooltip(
      message: label ?? MaterialLocalizations.of(context).backButtonTooltip,
      child: Material(
        color: colors.surface1,
        shape: CircleBorder(side: BorderSide(color: colors.line)),
        child: InkWell(
          onTap: onTap,
          splashFactory: NoSplash.splashFactory,
          customBorder: const CircleBorder(),
          child: SizedBox.square(
            dimension: 44,
            child: Center(child: AppIcon.ui(AppIcons.back, size: 20, color: colors.text, mirrorInRtl: true)),
          ),
        ),
      ),
    );
  }
}

/// "Step 2 of 3" with a segment per step; done and current steps are ink.
class BuildAuthSteps extends StatelessWidget {
  final int step;
  final int total;

  const BuildAuthSteps({super.key, required this.step, required this.total});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      label: Translate.s.auth_step(step.toArabicDigits, total.toArabicDigits),
      excludeSemantics: true,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            Translate.s.auth_step(step.toArabicDigits, total.toArabicDigits),
            style: AppTextStyle.micro(color: colors.text2),
          ),
          Gaps.hGap8,
          for (var i = 1; i <= total; i++) ...[
            if (i > 1) Gaps.hGap4,
            AnimatedContainer(
              duration: const Duration(milliseconds: 240),
              width: i == step ? 18 : 8,
              height: 4,
              decoration: BoxDecoration(
                color: i <= step ? colors.text : colors.line2,
                borderRadius: const BorderRadius.all(Radius.circular(2)),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Two quiet washes: lagoon and coral, the same pair the website uses.
class BuildAuthAtmosphere extends StatelessWidget {
  const BuildAuthAtmosphere({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return IgnorePointer(
      child: Stack(
        fit: StackFit.expand,
        children: [
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: const Alignment(-0.85, -1.05),
                radius: 1.15,
                colors: [
                  colors.button.withValues(alpha: 0.16),
                  colors.button.withValues(alpha: 0),
                ],
              ),
            ),
          ),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: const Alignment(0.95, -0.55),
                radius: 0.9,
                colors: [
                  colors.highlight.withValues(alpha: 0.12),
                  colors.highlight.withValues(alpha: 0),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Login / register opener: a single destination mark, then the display title.
class BuildAuthHero extends StatelessWidget {
  final String title;
  final String subtitle;

  const BuildAuthHero({super.key, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      children: [
        Container(
          width: 72,
          height: 72,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: colors.surface1,
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: colors.line),
          ),
          child: RehlaMark(size: 44, color: colors.button, sunColor: colors.highlight),
        ),
        Gaps.vGap13,
        Text(
          title,
          textAlign: TextAlign.center,
          style: AppTextStyle.h3(color: colors.text).copyWith(
            fontFamily: AppFonts.display(context),
            fontWeight: FontWeight.w600,
          ),
        ),
        Gaps.vGap6,
        ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 300),
          child: Text(
            subtitle,
            textAlign: TextAlign.center,
            style: AppTextStyle.body(color: colors.text2),
          ),
        ),
      ],
    );
  }
}

/// Header for the inner steps: an icon for what this step is about,
/// then the title and what to do.
class BuildAuthHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  final String icon;

  const BuildAuthHeader({
    super.key,
    required this.title,
    required this.subtitle,
    this.icon = AppIcons.lock,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: colors.surface1,
            borderRadius: AppRadius.buttonAll,
            border: Border.all(color: colors.line),
          ),
          child: AppIcon.ui(icon, size: 26, color: colors.button),
        ),
        Gaps.vGap18,
        Text(
          title,
          style: AppTextStyle.display(color: colors.text).copyWith(
            fontFamily: AppFonts.display(context),
          ),
        ),
        Gaps.vGap8,
        Text(subtitle, style: AppTextStyle.body(color: colors.text2)),
        Gaps.vGap24,
      ],
    );
  }
}

/// Auth text field: label above, icon inside, ink border on focus.
class BuildAuthTextField extends StatelessWidget {
  final String label;
  final String icon;
  final TextEditingController controller;
  final FieldTypes fieldTypes;
  final TextInputType type;
  final TextInputAction action;
  final String? Function(String? value) validate;
  final String? hint;
  final VoidCallback? onSubmit;
  final TextDirection? textDirection;

  const BuildAuthTextField({
    super.key,
    required this.label,
    required this.icon,
    required this.controller,
    required this.fieldTypes,
    required this.type,
    required this.action,
    required this.validate,
    this.hint,
    this.onSubmit,
    this.textDirection,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTextStyle.s13_w500(color: colors.text)),
        Gaps.vGap8,
        GenericTextField(
          controller: controller,
          fieldTypes: fieldTypes,
          type: type,
          action: action,
          validate: validate,
          hint: hint,
          hintColor: colors.text3,
          textDirection: textDirection,
          radius: AuthRadius.fieldAll,
          fillColor: colors.surface2,
          enableBorderColor: colors.surface2,
          focusBorderColor: colors.text,
          prefixIcon: AppIcon.ui(icon, size: 20, color: colors.text2),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.lg + 2,
          ),
          onSubmit: onSubmit,
        ),
      ],
    );
  }
}

/// Live checklist for the password rules the validator enforces.
class BuildAuthPasswordRules extends StatelessWidget {
  final TextEditingController controller;

  const BuildAuthPasswordRules({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<TextEditingValue>(
      valueListenable: controller,
      builder: (context, value, _) {
        final text = value.text;
        final rules = [
          (Translate.s.auth_pw_rule_length, text.length >= 8),
          (Translate.s.auth_pw_rule_case, RegExp('[A-Z]').hasMatch(text) && RegExp('[a-z]').hasMatch(text)),
          (Translate.s.auth_pw_rule_number, RegExp('[0-9]').hasMatch(text)),
          (Translate.s.auth_pw_rule_symbol, RegExp(r'[!@#$&*~]').hasMatch(text)),
        ];
        final met = rules.where((r) => r.$2).length;
        final colors = context.colors;
        return Padding(
          padding: const EdgeInsets.only(top: AppSpacing.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  for (var i = 0; i < rules.length; i++) ...[
                    if (i > 0) Gaps.hGap4,
                    Expanded(
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        height: 4,
                        decoration: BoxDecoration(
                          color: i < met
                              ? (met == rules.length ? colors.green : colors.amber)
                              : colors.line,
                          borderRadius: const BorderRadius.all(Radius.circular(2)),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              Gaps.vGap9,
              Wrap(
                spacing: AppSpacing.lg,
                runSpacing: AppSpacing.xs,
                children: [
                  for (final (label, ok) in rules)
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AppIcon.ui(
                          ok ? AppIcons.checkCircle : AppIcons.radioOff,
                          size: 14,
                          color: ok ? colors.green : colors.text3,
                        ),
                        Gaps.hGap4,
                        Text(label, style: AppTextStyle.micro(color: ok ? colors.text : colors.text2)),
                      ],
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

/// Full-width outlined action, paired with the primary LoadingButton.
class BuildAuthSecondaryButton extends StatelessWidget {
  final String label;
  final String? icon;
  final VoidCallback onTap;

  const BuildAuthSecondaryButton({super.key, required this.label, required this.onTap, this.icon});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Material(
      color: colors.surface1,
      shape: RoundedRectangleBorder(
        borderRadius: AuthRadius.fieldAll,
        side: BorderSide(color: colors.line2),
      ),
      child: InkWell(
        onTap: onTap,
        customBorder: const RoundedRectangleBorder(borderRadius: AuthRadius.fieldAll),
        child: SizedBox(
          height: 54,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                AppIcon.ui(icon!, size: 18, color: colors.text),
                Gaps.hGap8,
              ],
              Text(label, style: AppTextStyle.s14_w500(color: colors.text)),
            ],
          ),
        ),
      ),
    );
  }
}

class BuildAuthFooterLink extends StatelessWidget {
  final String prompt;
  final String action;
  final VoidCallback onTap;

  const BuildAuthFooterLink({
    super.key,
    required this.prompt,
    required this.action,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(prompt, style: AppTextStyle.body(color: colors.text2)),
        TextButton(
          onPressed: onTap,
          style: TextButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
            minimumSize: const Size(0, 40),
          ),
          child: Text(action, style: AppTextStyle.s14_w600(color: colors.text)),
        ),
      ],
    );
  }
}

/// Groups a form's fields. No card: fields sit on the page.
class BuildAuthSurface extends StatelessWidget {
  final Widget child;

  const BuildAuthSurface({super.key, required this.child});

  @override
  Widget build(BuildContext context) => child;
}

class BuildAuthDivider extends StatelessWidget {
  final String label;

  const BuildAuthDivider({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Container(height: 1, color: context.colors.line)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
          child: Text(label, style: AppTextStyle.micro(color: context.colors.text3)),
        ),
        Expanded(child: Container(height: 1, color: context.colors.line)),
      ],
    );
  }
}

/// The website's one identity line. Not a marketplace trust strip.
class BuildAuthTrustRow extends StatelessWidget {
  const BuildAuthTrustRow({super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      Translate.s.auth_trust_line,
      textAlign: TextAlign.center,
      style: AppTextStyle.caption(color: context.colors.text3),
    );
  }
}
