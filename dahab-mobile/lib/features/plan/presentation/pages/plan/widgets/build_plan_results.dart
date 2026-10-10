part of 'plan_widgets_imports.dart';

/// Plans that fit, with reasons — or every plan in the place, sortable.
class BuildPlanResults extends StatelessWidget {
  final PlanController controller;

  const BuildPlanResults({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return RequesterConsumer<List<ProgrammeDomainModel>>(
      requester: controller.programmesRequester,
      loadingBuilder: (_) => const BuildPlanBuilding(),
      failureBuilder: (context, error, retry) => Center(
        child: Padding(
          padding: const EdgeInsetsDirectional.all(AppSpacing.xxl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AppIcon.ui(AppIcons.offline, size: 40, color: colors.text3),
              Gaps.vGap12,
              Text(
                Translate.s.plan_loadFailed,
                textAlign: TextAlign.center,
                style: AppTextStyle.s14_w400(color: colors.text2),
              ),
              Gaps.vGap12,
              TextButton(onPressed: retry, child: Text(Translate.s.retry)),
            ],
          ),
        ),
      ),
      successBuilder: (context, programmes, _) => ObsValueConsumer(
        observable: controller.answersObs,
        builder: (context, answers) => ObsValueConsumer(
          observable: controller.showAllObs,
          builder: (context, showAll) => ObsValueConsumer(
            observable: controller.sortObs,
            builder: (context, sort) {
              final matches = controller.matchesFrom(programmes);
              final list = controller.visible(matches);
              return _ResultsList(
                controller: controller,
                list: list,
                showAll: showAll,
                sort: sort,
                destination: answers.destination,
              );
            },
          ),
        ),
      ),
    );
  }
}

class _ResultsList extends StatelessWidget {
  final PlanController controller;
  final List<PlanMatch> list;
  final bool showAll;
  final PlanSort sort;
  final RehlaDestination destination;

  const _ResultsList({
    required this.controller,
    required this.list,
    required this.showAll,
    required this.sort,
    required this.destination,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final place = destination.label(context.isArabic);
    final heading = showAll
        ? Translate.s.plan_results_allTitle(place)
        : (list.length == 1 ? Translate.s.plan_results_titleOne : Translate.s.plan_results_title(list.length));

    return ListView(
      padding: EdgeInsetsDirectional.fromSTEB(
        AppSpacing.screenH,
        0,
        AppSpacing.screenH,
        AppSpacing.xl + MediaQuery.paddingOf(context).bottom,
      ),
      children: [
        AppEntrance(
          key: ValueKey(heading),
          child: Text(
            heading,
            style: AppTextStyle.s20_w600(
              color: colors.text,
            ).copyWith(fontFamily: AppFonts.display(context), height: 1.25),
          ),
        ),
        Gaps.vGap9,
        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: [
            OutlinedButton.icon(
              onPressed: controller.editAnswers,
              icon: const AppIcon.ui(AppIcons.edit, size: 14),
              label: Text(Translate.s.plan_results_edit),
              style: _pill(colors.text, colors.line2),
            ),
            OutlinedButton.icon(
              onPressed: () => controller.showAllObs.setValue(!showAll),
              icon: AppIcon.ui(showAll ? AppIcons.sparkle : AppIcons.list, size: 14),
              label: Text(showAll ? Translate.s.plan_results_showMatches : Translate.s.plan_results_showAll),
              style: _pill(colors.button, colors.button),
            ),
            ObsValueConsumer(
              observable: controller.savedObs,
              builder: (context, saved) => saved.isEmpty
                  ? const SizedBox.shrink()
                  : OutlinedButton.icon(
                      onPressed: controller.seePlans,
                      icon: AppIcon.ui(AppIcons.check, size: 14, color: colors.green),
                      label: Text(Translate.s.plans_count('${saved.length}')),
                      style: _pill(colors.green, colors.green.withValues(alpha: 0.5)),
                    ),
            ),
          ],
        ),
        if (!destination.liveCatalogue) ...[
          Gaps.vGap13,
          Container(
            padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
            decoration: BoxDecoration(color: colors.amberBg, borderRadius: AppRadius.buttonAll),
            child: Text(
              Translate.s.plan_early_note(place),
              style: AppTextStyle.s13_w500(color: colors.text).copyWith(fontWeight: FontWeight.w400),
            ),
          ),
        ],
        AnimatedSize(
          duration: destination.tempo,
          curve: Curves.easeOutCubic,
          child: showAll
              ? Padding(
                  padding: const EdgeInsetsDirectional.only(top: AppSpacing.lg),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        for (final s in PlanSort.values)
                          Padding(
                            padding: const EdgeInsetsDirectional.only(end: AppSpacing.sm),
                            child: ChoiceChip(
                              label: Text(PlanLabels.sort(s)),
                              selected: sort == s,
                              onSelected: (_) => controller.sortObs.setValue(s),
                              showCheckmark: false,
                              selectedColor: colors.button,
                              backgroundColor: colors.surface1,
                              side: BorderSide(color: sort == s ? colors.button : colors.line),
                              shape: const StadiumBorder(),
                              labelStyle: AppTextStyle.s13_w500(color: sort == s ? colors.onButton : colors.text2),
                            ),
                          ),
                      ],
                    ),
                  ),
                )
              : const SizedBox(width: double.infinity),
        ),
        Gaps.vGap13,
        if (list.isEmpty)
          Padding(
            padding: const EdgeInsetsDirectional.symmetric(vertical: AppSpacing.xxl * 2),
            child: Text(
              Translate.s.plan_noMatches,
              textAlign: TextAlign.center,
              style: AppTextStyle.s14_w400(color: colors.text2),
            ),
          )
        else
          for (var i = 0; i < list.length; i++)
            Padding(
              padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
              child: AppEntrance(
                // Re-enter when the order changes, so sorting is visible.
                key: ValueKey('${list[i].programme.id}-$showAll-$sort-$i'),
                delay: Duration(milliseconds: 80 * i),
                duration: destination.tempo,
                child: ObsValueConsumer(
                  observable: controller.busyIdObs,
                  builder: (context, busyId) => ObsValueConsumer(
                    observable: controller.savedObs,
                    builder: (context, _) => BuildPlanCard(
                      match: list[i],
                      emphasise: !showAll && i == 0,
                      busy: busyId == list[i].programme.id,
                      saved: controller.isSaved(list[i].programme.id),
                      onOpen: () => controller.openProgramme(context, list[i]),
                      onSave: () => controller.toggleSaved(list[i].programme),
                      onRequest: () => controller.requestPlan(context, list[i].programme),
                    ),
                  ),
                ),
              ),
            ),
        Center(
          child: TextButton(
            onPressed: () => controller.startOver(destination),
            child: Text(Translate.s.plan_startOver, style: AppTextStyle.s13_w500(color: colors.text3)),
          ),
        ),
      ],
    );
  }

  ButtonStyle _pill(Color fg, Color border) => OutlinedButton.styleFrom(
    foregroundColor: fg,
    side: BorderSide(color: border),
    shape: const StadiumBorder(),
    minimumSize: const Size(0, 34),
    padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md),
    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
    textStyle: AppTextStyle.s12_w600(color: fg),
  );
}
