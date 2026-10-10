part of 'home_widgets_imports.dart';

/// "Press back again to exit": a small inverted pill that rises just above
/// the bar while the second press would leave the app.
class BuildExitHint extends StatelessWidget {
  final bool visible;

  const BuildExitHint({super.key, required this.visible});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final reduce = MediaQuery.disableAnimationsOf(context);
    final duration = reduce ? Duration.zero : const Duration(milliseconds: 220);
    return ExcludeSemantics(
      excluding: !visible,
      child: Center(
        heightFactor: 1,
        child: AnimatedSlide(
          offset: visible ? Offset.zero : const Offset(0, 0.4),
          duration: duration,
          curve: Curves.easeOutCubic,
          child: AnimatedOpacity(
            opacity: visible ? 1 : 0,
            duration: duration,
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg + 2, vertical: AppSpacing.md),
              decoration: BoxDecoration(
                color: colors.text.withValues(alpha: 0.9),
                borderRadius: AppRadius.chipAll,
              ),
              child: Text(
                Translate.s.home_exit_hint,
                style: AppTextStyle.s12_w500(color: colors.bg),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
