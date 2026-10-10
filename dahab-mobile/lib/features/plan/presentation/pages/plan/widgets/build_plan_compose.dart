part of 'plan_widgets_imports.dart';

/// One question per screen: progress, the question, its options, and the
/// way forward. Questions slide in the direction of travel.
class BuildPlanCompose extends StatelessWidget {
  final PlanController controller;

  const BuildPlanCompose({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final destination = context.destination;
    return ObsValueConsumer(
      observable: controller.stepObs,
      builder: (context, index) {
        final step = PlanStep.values[index];
        final total = PlanStep.values.length;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, 0, AppSpacing.screenH, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          Translate.s.plan_title,
                          style: AppTextStyle.s18_w600(
                            color: colors.text,
                          ).copyWith(fontFamily: AppFonts.display(context)),
                        ),
                      ),
                      TextButton(
                        onPressed: () => controller.finish(all: true),
                        style: TextButton.styleFrom(foregroundColor: colors.button),
                        child: Text(Translate.s.plan_skipToAll, style: AppTextStyle.s13_w500(color: colors.button)),
                      ),
                    ],
                  ),
                  Gaps.vGap4,
                  Text(Translate.s.plan_step(index + 1, total), style: AppTextStyle.micro(color: colors.text3)),
                  Gaps.vGap6,
                  // The journey line fills as you answer.
                  ClipRRect(
                    borderRadius: AppRadius.chipAll,
                    child: TweenAnimationBuilder<double>(
                      tween: Tween(end: (index + 1) / total),
                      duration: destination.tempo,
                      curve: Curves.easeOutCubic,
                      builder: (context, v, _) => LinearProgressIndicator(
                        value: v,
                        minHeight: 3,
                        backgroundColor: colors.line,
                        color: colors.button,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: AnimatedSwitcher(
                duration: destination.tempo,
                switchInCurve: Curves.easeOutCubic,
                switchOutCurve: Curves.easeInCubic,
                transitionBuilder: (child, animation) {
                  // Forward: new question comes from the reading end; back: from behind.
                  final dir =
                      controller.directionObs.getValue() * (Directionality.of(context) == TextDirection.rtl ? -1 : 1);
                  final incoming = child.key == ValueKey(step);
                  final dx = (incoming ? 0.12 : -0.12) * dir;
                  return FadeTransition(
                    opacity: animation,
                    child: SlideTransition(
                      position: Tween(begin: Offset(dx, 0), end: Offset.zero).animate(animation),
                      child: child,
                    ),
                  );
                },
                child: ListView(
                  key: ValueKey(step),
                  padding: const EdgeInsetsDirectional.fromSTEB(
                    AppSpacing.screenH,
                    AppSpacing.xl,
                    AppSpacing.screenH,
                    AppSpacing.xl,
                  ),
                  children: [
                    Text(
                      PlanLabels.question(step),
                      style: AppTextStyle.s20_w600(
                        color: colors.text,
                      ).copyWith(fontFamily: AppFonts.display(context), height: 1.25),
                    ),
                    if (PlanLabels.hint(step) != null) ...[
                      Gaps.vGap4,
                      Text(
                        PlanLabels.hint(step)!,
                        style: AppTextStyle.s13_w500(color: colors.text2).copyWith(fontWeight: FontWeight.w400),
                      ),
                    ],
                    Gaps.vGap13,
                    BuildPlanStepBody(controller: controller, step: step),
                  ],
                ),
              ),
            ),
            _Footer(controller: controller, step: step),
          ],
        );
      },
    );
  }
}

class _Footer extends StatelessWidget {
  final PlanController controller;
  final PlanStep step;

  const _Footer({required this.controller, required this.step});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final last = step == PlanStep.budget;
    return ObsValueConsumer(
      observable: controller.answeredObs,
      builder: (context, answered) {
        // Multi-choice waits for "Next"; others show it once answered (to go
        // forward again after "Back").
        final canNext = step == PlanStep.vibes || answered.contains(step);
        return Container(
          padding: EdgeInsetsDirectional.fromSTEB(
            AppSpacing.screenH,
            AppSpacing.md,
            AppSpacing.screenH,
            AppSpacing.md + MediaQuery.paddingOf(context).bottom,
          ),
          decoration: BoxDecoration(
            color: colors.bg,
            border: Border(top: BorderSide(color: colors.line)),
          ),
          child: Row(
            children: [
              if (step.index > 0)
                TextButton.icon(
                  onPressed: controller.back,
                  icon: const AppIcon.ui(AppIcons.back, size: 18),
                  label: Text(Translate.s.plan_back),
                  style: TextButton.styleFrom(foregroundColor: colors.text2),
                ),
              const Spacer(),
              AnimatedOpacity(
                opacity: canNext ? 1 : 0.4,
                duration: const Duration(milliseconds: 200),
                child: FilledButton(
                  onPressed: canNext ? controller.next : null,
                  style: FilledButton.styleFrom(
                    backgroundColor: colors.button,
                    foregroundColor: colors.onButton,
                    disabledBackgroundColor: colors.button,
                    disabledForegroundColor: colors.onButton,
                    minimumSize: const Size(0, 44),
                    padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.xl),
                    shape: const RoundedRectangleBorder(borderRadius: AppRadius.chipAll),
                  ),
                  child: Text(
                    last ? Translate.s.plan_showPlans : Translate.s.plan_next,
                    style: AppTextStyle.s14_w600(color: colors.onButton),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
