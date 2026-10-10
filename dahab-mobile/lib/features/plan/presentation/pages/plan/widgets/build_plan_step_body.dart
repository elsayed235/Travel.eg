part of 'plan_widgets_imports.dart';

class BuildPlanStepBody extends StatelessWidget {
  final PlanController controller;
  final PlanStep step;

  const BuildPlanStepBody({super.key, required this.controller, required this.step});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.answersObs,
      builder: (context, a) => switch (step) {
        PlanStep.destination => _DestinationStep(controller: controller, answers: a),
        PlanStep.when => _NightsStep(controller: controller, answers: a),
        PlanStep.party => _Stagger(
          children: [
            for (final p in PlanParty.values)
              BuildPlanOption(
                selected: a.party == p,
                icon: PlanLabels.partyIcon(p),
                title: PlanLabels.party(p),
                sub: PlanLabels.partySub(p),
                onTap: () => controller.answer(a.copyWith(party: p), advance: true),
              ),
          ],
        ),
        PlanStep.vibes => _VibesStep(controller: controller, answers: a),
        PlanStep.pace => _Stagger(
          children: [
            for (final p in PlanPace.values)
              BuildPlanOption(
                selected: a.pace == p,
                title: PlanLabels.pace(p),
                sub: PlanLabels.paceSub(p),
                extra: Padding(
                  padding: const EdgeInsetsDirectional.only(top: AppSpacing.md),
                  child: _TempoDots(pace: p),
                ),
                onTap: () => controller.answer(a.copyWith(pace: p), advance: true),
              ),
          ],
        ),
        PlanStep.budget => _Stagger(
          children: [
            for (final b in PlanBudget.values)
              BuildPlanOption(
                selected: a.budget == b,
                title: PlanLabels.budget(b),
                sub:
                    '${AppMoney.egp(b.dailyFromEgp)} – ${AppMoney.egp(b.dailyToEgp)} ${Translate.s.plan_budget_perDay}',
                onTap: () => controller.answer(a.copyWith(budget: b), advance: true),
              ),
          ],
        ),
      },
    );
  }
}

/// Options arrive one after another, not all at once.
class _Stagger extends StatelessWidget {
  final List<Widget> children;

  const _Stagger({required this.children});

  @override
  Widget build(BuildContext context) {
    final tempo = context.destination.tempo;
    return Column(
      children: [
        for (var i = 0; i < children.length; i++)
          Padding(
            padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.sm),
            child: AppEntrance(
              delay: Duration(milliseconds: 60 * i),
              duration: tempo,
              child: children[i],
            ),
          ),
      ],
    );
  }
}

class _DestinationStep extends StatelessWidget {
  final PlanController controller;
  final PlanAnswers answers;

  const _DestinationStep({required this.controller, required this.answers});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    return _Stagger(
      children: [
        for (final d in RehlaDestination.values)
          _SelectTile(
            selected: answers.destination == d,
            onTap: () => controller.chooseDestination(context, d),
            child: Padding(
              padding: const EdgeInsetsDirectional.all(AppSpacing.sm),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: AppRadius.imageAll,
                    child: Image.asset(d.heroImagePath, width: 64, height: 64, fit: BoxFit.cover),
                  ),
                  Gaps.hGap12,
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          d.label(arabic),
                          style: AppTextStyle.s16_w500(
                            color: colors.text,
                          ).copyWith(fontFamily: AppFonts.display(context), fontWeight: FontWeight.w600),
                        ),
                        Gaps.vGap4,
                        Text(
                          d.tagline(arabic),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyle.caption(color: colors.text3),
                        ),
                      ],
                    ),
                  ),
                  Gaps.hGap8,
                  _Check(selected: answers.destination == d),
                  Gaps.hGap6,
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// A bordered tile that washes in the action colour when chosen.
class _SelectTile extends StatelessWidget {
  final bool selected;
  final VoidCallback onTap;
  final Widget child;

  const _SelectTile({required this.selected, required this.onTap, required this.child});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      selected: selected,
      button: true,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        decoration: BoxDecoration(
          color: selected ? colors.actionWash : colors.surface1,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(color: selected ? colors.button : colors.line, width: selected ? 1.4 : 1),
        ),
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(borderRadius: AppRadius.buttonAll, onTap: onTap, child: child),
        ),
      ),
    );
  }
}

class _Check extends StatelessWidget {
  final bool selected;

  const _Check({required this.selected});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      width: 20,
      height: 20,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: selected ? colors.button : Colors.transparent,
        border: Border.all(color: selected ? colors.button : colors.line2, width: 1.6),
      ),
      child: AnimatedScale(
        scale: selected ? 1 : 0,
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOutBack,
        child: AppIcon.ui(AppIcons.check, size: 13, color: colors.onButton),
      ),
    );
  }
}

class _NightsStep extends StatelessWidget {
  final PlanController controller;
  final PlanAnswers answers;

  const _NightsStep({required this.controller, required this.answers});

  static const _choices = [2, 3, 4, 5, 7];

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final flexible = controller.isAnswered(PlanStep.when) && answers.nights == null;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            for (var i = 0; i < _choices.length; i++) ...[
              if (i > 0) Gaps.hGap8,
              Expanded(
                child: AppEntrance(
                  delay: Duration(milliseconds: 40 * i),
                  child: SizedBox(
                    height: 64,
                    child: _SelectTile(
                      selected: answers.nights == _choices[i],
                      onTap: () =>
                          controller.answer(answers.copyWith(nights: _choices[i], setNights: true), advance: true),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            '${_choices[i]}',
                            style: AppTextStyle.s20_w600(
                              color: colors.text,
                            ).copyWith(fontFamily: AppFonts.display(context), height: 1.1),
                          ),
                          Text(
                            Translate.s.plan_when_nightsUnit,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppTextStyle.micro(color: colors.text3),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
        Gaps.vGap8,
        SizedBox(
          height: 44,
          child: _SelectTile(
            selected: flexible,
            onTap: () => controller.answer(answers.copyWith(nights: null, setNights: true), advance: true),
            child: Center(
              child: Text(
                Translate.s.plan_when_flexible,
                style: AppTextStyle.s13_w500(color: flexible ? colors.text : colors.text2),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _VibesStep extends StatelessWidget {
  final PlanController controller;
  final PlanAnswers answers;

  const _VibesStep({required this.controller, required this.answers});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final vibes = vibesByDestination[answers.destination]!;
    return GridView(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: EdgeInsets.zero,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: MediaQuery.sizeOf(context).width >= 600 ? 3 : 2,
        mainAxisSpacing: AppSpacing.sm,
        crossAxisSpacing: AppSpacing.sm,
        mainAxisExtent: 48,
      ),
      children: [
        for (var i = 0; i < vibes.length; i++)
          AppEntrance(
            delay: Duration(milliseconds: 40 * i),
            child: Builder(
              builder: (context) {
                final v = vibes[i];
                final selected = answers.vibes.contains(v);
                return Semantics(
                  checked: selected,
                  child: _SelectTile(
                    selected: selected,
                    onTap: () => controller.toggleVibe(v),
                    child: Padding(
                      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.sm),
                      child: Row(
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 220),
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: selected ? colors.button : colors.surface2,
                              borderRadius: AppRadius.buttonAll,
                            ),
                            child: AppIcon.ui(
                              PlanLabels.vibeIcon(v),
                              size: 16,
                              color: selected ? colors.onButton : colors.text2,
                            ),
                          ),
                          Gaps.hGap8,
                          Expanded(
                            child: Text(
                              PlanLabels.vibe(v),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTextStyle.s13_w500(color: colors.text).copyWith(fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }
}

/// "Slow / balanced / full" felt, not just read: four dots breathing at the
/// pace's tempo.
class _TempoDots extends StatefulWidget {
  final PlanPace pace;

  const _TempoDots({required this.pace});

  @override
  State<_TempoDots> createState() => _TempoDotsState();
}

class _TempoDotsState extends State<_TempoDots> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: Duration(
      milliseconds: switch (widget.pace) {
        PlanPace.relaxed => 2400,
        PlanPace.balanced => 1400,
        PlanPace.active => 700,
      },
    ),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.maybeDisableAnimationsOf(context) ?? false) {
      _c.value = 0.5;
    } else if (!_c.isAnimating) {
      _c.repeat();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = context.colors.button;
    return AnimatedBuilder(
      animation: _c,
      builder: (context, _) => Row(
        children: [
          for (var i = 0; i < 4; i++)
            Padding(
              padding: const EdgeInsetsDirectional.only(end: AppSpacing.sm),
              child: Opacity(
                // Each dot peaks a quarter-cycle after the previous one.
                opacity: 0.25 + 0.75 * (0.5 - 0.5 * math.cos(2 * math.pi * ((_c.value - i / 4) % 1))),
                child: Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
