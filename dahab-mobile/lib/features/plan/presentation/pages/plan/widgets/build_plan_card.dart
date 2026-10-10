part of 'plan_widgets_imports.dart';

/// A plan, with why it fits. The best match is emphasised.
class BuildPlanCard extends StatelessWidget {
  final PlanMatch match;
  final bool emphasise;
  final bool busy;
  final VoidCallback onOpen;
  final bool saved;
  final VoidCallback onSave;
  final VoidCallback onRequest;

  const BuildPlanCard({
    super.key,
    required this.match,
    required this.emphasise,
    required this.busy,
    required this.onOpen,
    required this.saved,
    required this.onSave,
    required this.onRequest,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final p = match.programme;
    return Container(
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: emphasise ? colors.button : colors.line, width: emphasise ? 1.6 : 1),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          InkWell(
            onTap: onOpen,
            child: AspectRatio(
              aspectRatio: 2,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Hero(
                    tag: 'plan-hero-${p.id}',
                    child: BuildProgrammeImage(programme: p),
                  ),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        stops: const [0.4, 1],
                        colors: [colors.scrim.withValues(alpha: 0), colors.scrim.withValues(alpha: 0.7)],
                      ),
                    ),
                  ),
                  PositionedDirectional(
                    top: AppSpacing.md,
                    start: AppSpacing.md,
                    child: _Badge(
                      icon: emphasise ? AppIcons.sparkle : null,
                      label: emphasise
                          ? Translate.s.plan_results_best(match.score)
                          : Translate.s.plan_results_match(match.score),
                    ),
                  ),
                  PositionedDirectional(
                    start: AppSpacing.lg,
                    end: AppSpacing.lg,
                    bottom: AppSpacing.md,
                    child: Text(
                      p.title(arabic),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyle.s16_w500(
                        color: colors.onImage,
                      ).copyWith(fontFamily: AppFonts.display(context), fontWeight: FontWeight.w600, height: 1.25),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.lg, AppSpacing.md, AppSpacing.lg, AppSpacing.xs),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  p.tagline(arabic),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppTextStyle.s13_w500(color: colors.text2).copyWith(fontWeight: FontWeight.w400),
                ),
                Gaps.vGap9,
                Wrap(
                  spacing: AppSpacing.md,
                  runSpacing: AppSpacing.xs,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    _Fact(icon: AppIcons.calendar, text: Translate.s.plan_card_days(p.durationDays)),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AppIcon.ui(AppIcons.gauge, size: 14, color: colors.button),
                        Gaps.hGap6,
                        BuildPaceMeter(score: p.intensityScore),
                      ],
                    ),
                    _Fact(icon: AppIcons.clock, text: Translate.s.plan_card_freeTime(p.freeTimeScore)),
                  ],
                ),
                if (match.reasons.isNotEmpty) ...[
                  Gaps.vGap9,
                  for (final r in match.reasons.take(3))
                    Padding(
                      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.xs),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsetsDirectional.only(top: 2),
                            child: AppIcon.ui(AppIcons.check, size: 14, color: colors.green),
                          ),
                          Gaps.hGap6,
                          Expanded(
                            child: Text(PlanLabels.reason(r), style: AppTextStyle.s12_w500(color: colors.text)),
                          ),
                        ],
                      ),
                    ),
                ],
                Gaps.vGap9,
                Divider(height: 1, color: colors.line),
                Gaps.vGap9,
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Expanded(child: BuildPlanPrice(programme: p)),
                    BuildSavePlanButton(saved: saved, emphasise: emphasise, onTap: onSave),
                  ],
                ),
                Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: TextButton(
                    onPressed: busy ? null : onRequest,
                    style: TextButton.styleFrom(
                      foregroundColor: colors.button,
                      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.xs),
                      minimumSize: const Size(0, 36),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: busy
                        ? SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: colors.button),
                          )
                        : Text(Translate.s.plan_card_request, style: AppTextStyle.s13_w500(color: colors.button)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class BuildPlanPrice extends StatelessWidget {
  final ProgrammeDomainModel programme;

  const BuildPlanPrice({super.key, required this.programme});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (programme.priceIsEstimate)
          Text(Translate.s.plan_card_estimate, style: AppTextStyle.s12_w500(color: colors.amber))
        else
          Text(Translate.s.plan_card_from, style: AppTextStyle.s12_w500(color: colors.text3)),
        Text(
          AppMoney.egp(programme.startingPriceEgp),
          textDirection: TextDirection.ltr,
          style: AppTextStyle.price(color: colors.text),
        ),
        Text(Translate.s.plan_card_perPerson, style: AppTextStyle.priceUnit(color: colors.text3)),
      ],
    );
  }
}

/// Intensity 1–5 as five short bars.
class BuildPaceMeter extends StatelessWidget {
  final int score;

  const BuildPaceMeter({super.key, required this.score});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      label: '${Translate.s.plan_card_pace} $score/5',
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 1; i <= 5; i++)
            Container(
              width: 12,
              height: 6,
              margin: const EdgeInsetsDirectional.only(end: 2),
              decoration: BoxDecoration(
                color: i <= score ? colors.button : colors.line2,
                borderRadius: AppRadius.chipAll,
              ),
            ),
        ],
      ),
    );
  }
}

class _Fact extends StatelessWidget {
  final String icon;
  final String text;

  const _Fact({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        AppIcon.ui(icon, size: 14, color: colors.button),
        Gaps.hGap4,
        Text(text, style: AppTextStyle.s12_w500(color: colors.text2)),
      ],
    );
  }
}

class _Badge extends StatelessWidget {
  final String? icon;
  final String label;

  const _Badge({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
      decoration: BoxDecoration(color: colors.scrim.withValues(alpha: 0.55), borderRadius: AppRadius.chipAll),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[AppIcon.ui(icon!, size: 13, color: colors.onImage), Gaps.hGap4],
          Text(label, style: AppTextStyle.s12_w600(color: colors.onImage)),
        ],
      ),
    );
  }
}
