import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/utils/arabic_numerals.dart';
import 'package:rehla/core/widgets/GenericTextField.dart';
import 'package:rehla/core/widgets/app_brand_logo.dart';
import 'package:rehla/core/widgets/app_reach_radar.dart';

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

  /// 1-based step in a multi-step flow (forgot → code → new password).
  final int? step;
  final int? totalSteps;

  const BuildAuthScaffold({
    super.key,
    required this.child,
    this.showBack = true,
    this.onBack,
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
                      height: 44,
                      child: Row(
                        children: [
                          if (showBack)
                            _RoundBackButton(
                              onTap: onBack ?? () => AutoRouter.of(context).maybePop(),
                            ),
                          const Spacer(),
                          if (step != null && totalSteps != null)
                            BuildAuthSteps(step: step!, total: totalSteps!),
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

  const _RoundBackButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Tooltip(
      message: MaterialLocalizations.of(context).backButtonTooltip,
      child: Material(
        color: colors.surface1,
        shape: CircleBorder(side: BorderSide(color: colors.line)),
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: SizedBox.square(
            dimension: 42,
            child: Icon(Icons.arrow_back_rounded, size: 20, color: colors.text),
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

/// A single soft green glow at the top: the same light as the splash radar.
class BuildAuthAtmosphere extends StatelessWidget {
  const BuildAuthAtmosphere({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return IgnorePointer(
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: const Alignment(0, -1.1),
            radius: 1.1,
            colors: [
              colors.green.withValues(alpha: 0.09),
              colors.green.withValues(alpha: 0.0),
            ],
          ),
        ),
      ),
    );
  }
}

/// Login / register opener: the brand inside the live reach radar, as on
/// the splash, then the page title.
class BuildAuthHero extends StatelessWidget {
  final String title;
  final String subtitle;

  const BuildAuthHero({super.key, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    const radar = 172.0;
    const disc = radar * 0.40;
    return Column(
      children: [
        AppReachRadar(
          size: radar,
          dotCount: 10,
          sweepDuration: const Duration(seconds: 5),
          center: Container(
            width: disc,
            height: disc,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: colors.surface1,
              shape: BoxShape.circle,
              border: Border.all(color: colors.line),
              boxShadow: [
                BoxShadow(color: colors.green.withValues(alpha: 0.12), blurRadius: 22),
              ],
            ),
            child: SizedBox.square(
              dimension: disc * 0.68,
              child: const FittedBox(child: AppBrandLogo(framed: false)),
            ),
          ),
        ),
        Gaps.vGap13,
        Text(
          title,
          textAlign: TextAlign.center,
          style: AppTextStyle.h3(color: colors.text).copyWith(fontWeight: FontWeight.w700),
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
  final IconData icon;

  const BuildAuthHeader({
    super.key,
    required this.title,
    required this.subtitle,
    this.icon = Icons.lock_reset_rounded,
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
            color: colors.greenBg,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 26, color: colors.green),
        ),
        Gaps.vGap18,
        Text(
          title,
          style: AppTextStyle.display(color: colors.text).copyWith(fontSize: 26),
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
  final IconData icon;
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
          prefixIcon: Icon(icon, size: 20, color: colors.text2),
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
                        Icon(
                          ok ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
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
  final IconData? icon;
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
                Icon(icon, size: 18, color: colors.text),
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

/// The three guarantees of a deal, each with its own icon.
class BuildAuthTrustRow extends StatelessWidget {
  const BuildAuthTrustRow({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final items = [
      (Icons.qr_code_2_rounded, Translate.s.auth_trust_code),
      (Icons.shield_outlined, Translate.s.auth_trust_payment),
      (Icons.star_outline_rounded, Translate.s.auth_trust_reviews),
    ];
    return Row(
      children: [
        for (final (icon, label) in items)
          Expanded(
            child: Column(
              children: [
                Icon(icon, size: 18, color: colors.green),
                Gaps.vGap4,
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: AppTextStyle.micro(color: colors.text2),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
