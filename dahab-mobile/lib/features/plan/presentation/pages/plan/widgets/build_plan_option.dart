part of 'plan_widgets_imports.dart';

/// A compact row sized for a thumb: an icon, a title, a "what this means" line and a
/// check that springs in when chosen.
class BuildPlanOption extends StatelessWidget {
  final bool selected;
  final VoidCallback onTap;
  final String? icon;
  final String title;
  final String? sub;
  final Widget? extra;
  final bool multi;

  const BuildPlanOption({
    super.key,
    required this.selected,
    required this.onTap,
    required this.title,
    this.icon,
    this.sub,
    this.extra,
    this.multi = false,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    const duration = Duration(milliseconds: 220);
    return Semantics(
      selected: selected,
      inMutuallyExclusiveGroup: !multi,
      button: true,
      child: AnimatedContainer(
        duration: duration,
        curve: Curves.easeOutCubic,
        decoration: BoxDecoration(
          color: selected ? colors.actionWash : colors.surface1,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(color: selected ? colors.button : colors.line, width: selected ? 1.4 : 1),
        ),
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(
            borderRadius: AppRadius.buttonAll,
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
              child: Row(
                children: [
                  if (icon != null) ...[
                    AnimatedContainer(
                      duration: duration,
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: selected ? colors.button : colors.surface2,
                        borderRadius: AppRadius.buttonAll,
                      ),
                      child: AppIcon.ui(icon!, size: 18, color: selected ? colors.onButton : colors.text2),
                    ),
                    Gaps.hGap12,
                  ],
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title, style: AppTextStyle.s14_w600(color: colors.text)),
                        if (sub != null) ...[Gaps.vGap4, Text(sub!, style: AppTextStyle.caption(color: colors.text3))],
                        ?extra,
                      ],
                    ),
                  ),
                  Gaps.hGap9,
                  AnimatedContainer(
                    duration: duration,
                    width: 20,
                    height: 20,
                    decoration: BoxDecoration(
                      shape: multi ? BoxShape.rectangle : BoxShape.circle,
                      borderRadius: multi ? const BorderRadius.all(Radius.circular(7)) : null,
                      color: selected ? colors.button : Colors.transparent,
                      border: Border.all(color: selected ? colors.button : colors.line2, width: 1.6),
                    ),
                    child: AnimatedScale(
                      scale: selected ? 1 : 0,
                      duration: duration,
                      curve: Curves.easeOutBack,
                      child: AppIcon.ui(AppIcons.check, size: 13, color: colors.onButton),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
