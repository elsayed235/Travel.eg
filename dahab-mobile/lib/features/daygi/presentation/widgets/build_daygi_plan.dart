part of '../daygi_imports.dart';

/// "Your plan · Day N" under the chat. Opens into the day's blocks, each
/// with its departure time, a real "why", and Swap / Remove.
class BuildDaygiPlan extends StatelessWidget {
  final DaygiController controller;

  const BuildDaygiPlan({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return ObsValueConsumer(
      observable: ExperienceCatalogue.instance.stateObs,
      builder: (context, _) => ObsValueConsumer(
        observable: controller.planObs,
        builder: (context, plan) {
          final day = controller.dayObs.getValue();
          final open = controller.planOpenObs.getValue();
          final catalogue = ExperienceCatalogue.instance;
          final blocks = plan.on(day);
          final total = blocks.fold<num>(0, (sum, b) => sum + (catalogue.byId(b.experienceId)?.bookable.priceEgp ?? 0));
          return Container(
            decoration: BoxDecoration(
              color: colors.surface1,
              border: Border(top: BorderSide(color: colors.line)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Semantics(
                  button: true,
                  expanded: open,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () => controller.planOpenObs.setValue(!open),
                    child: Padding(
                      padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, AppSpacing.md, AppSpacing.screenH, AppSpacing.md),
                      child: Row(
                        children: [
                          AppIcon.ui(AppIcons.list, size: 16, color: colors.button),
                          Gaps.hGap8,
                          Expanded(
                            child: Text(
                              Translate.s.dg_plan_day(day),
                              style: AppTextStyle.s14_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
                            ),
                          ),
                          if (blocks.isNotEmpty) ...[
                            Text(AppMoney.egp(total), style: AppTextStyle.s14_w600(color: colors.text)),
                            Text(' ${Translate.s.xp_per_person}', style: AppTextStyle.micro(color: colors.text3)),
                          ] else
                            Text(Translate.s.dg_plan_empty_short, style: AppTextStyle.caption(color: colors.text3)),
                          Gaps.hGap6,
                          AnimatedRotation(
                            turns: open ? 0.5 : 0,
                            duration: const Duration(milliseconds: 240),
                            child: AppIcon.ui(AppIcons.chevronUp, size: 20, color: colors.text2),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                AnimatedSize(
                  duration: const Duration(milliseconds: 280),
                  curve: Curves.easeOutCubic,
                  alignment: AlignmentDirectional.topCenter,
                  child: !open
                      ? const SizedBox(width: double.infinity)
                      : ConstrainedBox(
                          constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * 0.34),
                          child: ListView(
                            shrinkWrap: true,
                            padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, 0, AppSpacing.screenH, AppSpacing.md),
                            children: [
                              SizedBox(
                                height: 34,
                                child: ListView.separated(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: plan.days,
                                  separatorBuilder: (_, _) => Gaps.hGap6,
                                  itemBuilder: (context, i) {
                                    final d = i + 1;
                                    final selected = d == day;
                                    final count = plan.on(d).length;
                                    return GestureDetector(
                                      onTap: () => controller.dayObs.setValue(d),
                                      child: AnimatedContainer(
                                        duration: const Duration(milliseconds: 200),
                                        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg),
                                        alignment: Alignment.center,
                                        decoration: BoxDecoration(
                                          color: selected ? colors.button : colors.bg,
                                          borderRadius: AppRadius.chipAll,
                                          border: Border.all(color: selected ? colors.button : colors.line),
                                        ),
                                        child: Text(
                                          count == 0 ? Translate.s.dg_day_n(d) : '${Translate.s.dg_day_n(d)} · $count',
                                          style: AppTextStyle.s12_w600(color: selected ? colors.onButton : colors.text2),
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                              Gaps.vGap10,
                              if (blocks.isEmpty)
                                Padding(
                                  padding: const EdgeInsetsDirectional.symmetric(vertical: AppSpacing.md),
                                  child: Text(Translate.s.dg_plan_empty, style: AppTextStyle.s13_w500(color: colors.text3)),
                                ),
                              for (final b in blocks)
                                if (catalogue.byId(b.experienceId) case final e?)
                                  _Block(
                                    block: b,
                                    experience: e,
                                    canSwap: controller.alternativeFor(b) != null,
                                    onSwap: () => controller.swap(b),
                                    onRemove: () => controller.remove(b),
                                  ),
                            ],
                          ),
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Block extends StatelessWidget {
  final PlanBlock block;
  final Experience experience;
  final bool canSwap;
  final VoidCallback onSwap;
  final VoidCallback onRemove;

  const _Block({required this.block, required this.experience, required this.canSwap, required this.onSwap, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final e = experience;
    final why = ExperienceFit.reason(e, ExperienceCatalogue.instance.live);
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.sm),
      child: XpPressable(
        onTap: () => openExperience(context, e),
        child: Container(
          padding: const EdgeInsetsDirectional.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: colors.bg,
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: why?.warning == true ? colors.amber.withValues(alpha: 0.5) : colors.line),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 48,
                child: Text(
                  RehlaDates.slot(block.slot),
                  style: AppTextStyle.s14_w600(color: colors.button).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(e.title(arabic), maxLines: 2, overflow: TextOverflow.ellipsis, style: AppTextStyle.s14_w500(color: colors.text)),
                    Gaps.vGap4,
                    Text(
                      '${Translate.s.dg_why} ${why?.text ?? (e.bookable.meeting(arabic).isNotEmpty ? e.bookable.meeting(arabic) : ExperienceFit.duration(e.bookable.durationMinutes))}',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyle.caption(color: why?.warning == true ? colors.amber : colors.text3),
                    ),
                    Gaps.vGap8,
                    Row(
                      children: [
                        if (canSwap) _Action(icon: AppIcons.swap, label: Translate.s.dg_swap, onTap: onSwap),
                        if (canSwap) Gaps.hGap6,
                        _Action(icon: AppIcons.close, label: Translate.s.dg_remove, onTap: onRemove),
                        const Spacer(),
                        Text(AppMoney.egp(e.bookable.priceEgp), style: AppTextStyle.s12_w600(color: colors.text2)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Action extends StatelessWidget {
  final String icon;
  final String label;
  final VoidCallback onTap;

  const _Action({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
        decoration: BoxDecoration(color: colors.surface2, borderRadius: AppRadius.chipAll),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AppIcon.ui(icon, size: 14, color: colors.text2),
            Gaps.hGap4,
            Text(label, style: AppTextStyle.s12_w500(color: colors.text2)),
          ],
        ),
      ),
    );
  }
}
