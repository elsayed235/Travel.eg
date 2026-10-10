part of 'plan_widgets_imports.dart';

/// "Save plan" ⇄ "Saved ✓". One tap adds the plan to the traveler's list and
/// the button settles into its saved state where it is; a second tap
/// un-saves. The label and the check swap with a short cross-fade.
class BuildSavePlanButton extends StatelessWidget {
  final bool saved;
  final bool emphasise;
  final VoidCallback onTap;
  final double height;

  const BuildSavePlanButton({
    super.key,
    required this.saved,
    required this.onTap,
    this.emphasise = true,
    this.height = 40,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final filled = emphasise && !saved;
    final fg = saved ? colors.green : (filled ? colors.onButton : colors.text);
    final reduce = MediaQuery.disableAnimationsOf(context);
    return Semantics(
      button: true,
      toggled: saved,
      child: AnimatedContainer(
        duration: reduce ? Duration.zero : const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
        height: height,
        decoration: BoxDecoration(
          color: saved ? colors.greenBg : (filled ? colors.button : colors.surface2),
          borderRadius: AppRadius.chipAll,
          border: Border.all(color: saved ? colors.green.withValues(alpha: 0.35) : Colors.transparent),
        ),
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(
            onTap: onTap,
            borderRadius: AppRadius.chipAll,
            child: Padding(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg),
              child: AnimatedSwitcher(
                duration: reduce ? Duration.zero : const Duration(milliseconds: 200),
                transitionBuilder: (child, animation) => FadeTransition(
                  opacity: animation,
                  child: ScaleTransition(scale: Tween(begin: 0.85, end: 1.0).animate(animation), child: child),
                ),
                child: Row(
                  key: ValueKey(saved),
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AppIcon.ui(saved ? AppIcons.check : AppIcons.plus, size: 16, color: fg),
                    Gaps.hGap6,
                    Text(saved ? Translate.s.plan_saved : Translate.s.plan_save, style: AppTextStyle.s14_w600(color: fg)),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
