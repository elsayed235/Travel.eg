part of 'discover_widgets_imports.dart';

/// The quiet way into the planner for people who do not know what they want yet.
class BuildPlanPrompt extends StatelessWidget {
  final VoidCallback onStart;

  const BuildPlanPrompt({super.key, required this.onStart});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsetsDirectional.all(AppSpacing.xl),
      decoration: BoxDecoration(color: colors.actionWash, borderRadius: AppRadius.cardAll),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.route_outlined, color: colors.button, size: 28),
          Gaps.vGap12,
          Text(
            Translate.s.discover_prompt_title,
            style: AppTextStyle.s20_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
          ),
          Gaps.vGap6,
          Text(Translate.s.discover_prompt_body, style: AppTextStyle.s14_w400(color: colors.text2)),
          Gaps.vGap16,
          FilledButton(
            onPressed: onStart,
            style: FilledButton.styleFrom(
              backgroundColor: colors.button,
              foregroundColor: colors.onButton,
              minimumSize: const Size(0, 48),
              padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.xxl),
              shape: const RoundedRectangleBorder(borderRadius: AppRadius.chipAll),
              textStyle: AppTextStyle.s14_w600(color: colors.onButton),
            ),
            child: Text(Translate.s.discover_prompt_cta),
          ),
        ],
      ),
    );
  }
}
