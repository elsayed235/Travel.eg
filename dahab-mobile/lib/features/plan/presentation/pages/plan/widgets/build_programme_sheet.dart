part of 'plan_widgets_imports.dart';

/// A plan up close: photo, what it holds, and each day.
class BuildProgrammeSheet extends StatelessWidget {
  final PlanMatch match;
  final ObsValue<List<KeptTrip>> saved;
  final VoidCallback onSave;
  final VoidCallback onRequest;

  const BuildProgrammeSheet({super.key, required this.match, required this.saved, required this.onSave, required this.onRequest});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final p = match.programme;
    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.92,
      minChildSize: 0.5,
      maxChildSize: 0.96,
      builder: (context, scroll) => Column(
        children: [
          Expanded(
            child: ListView(
              controller: scroll,
              padding: EdgeInsets.zero,
              children: [
                Stack(
                  children: [
                    AspectRatio(
                      aspectRatio: 16 / 10,
                      child: Hero(
                        tag: 'plan-hero-${p.id}',
                        child: BuildProgrammeImage(programme: p),
                      ),
                    ),
                    PositionedDirectional(
                      top: AppSpacing.md,
                      start: 0,
                      end: 0,
                      child: Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          decoration: BoxDecoration(
                            color: colors.onImage.withValues(alpha: 0.8),
                            borderRadius: AppRadius.chipAll,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(
                    AppSpacing.screenH,
                    AppSpacing.lg,
                    AppSpacing.screenH,
                    AppSpacing.xl,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (p.badge(arabic).isNotEmpty) ...[
                        Text(p.badge(arabic), style: AppTextStyle.s12_w600(color: colors.highlight)),
                        Gaps.vGap6,
                      ],
                      Text(
                        p.title(arabic),
                        style: AppTextStyle.s20_w600(
                          color: colors.text,
                        ).copyWith(fontFamily: AppFonts.display(context), height: 1.25),
                      ),
                      Gaps.vGap6,
                      Text(
                        p.tagline(arabic),
                        style: AppTextStyle.s13_w500(
                          color: colors.text2,
                        ).copyWith(fontWeight: FontWeight.w400, height: 1.45),
                      ),
                      Gaps.vGap12,
                      Wrap(
                        spacing: AppSpacing.md,
                        runSpacing: AppSpacing.xs,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          _Fact(icon: AppIcons.calendar, text: Translate.s.plan_card_days(p.durationDays)),
                          BuildPaceMeter(score: p.intensityScore),
                          _Fact(icon: AppIcons.clock, text: Translate.s.plan_card_freeTime(p.freeTimeScore)),
                        ],
                      ),
                      if (p.highlights(arabic).isNotEmpty) ...[
                        Gaps.vGap18,
                        _SectionTitle(Translate.s.plan_detail_highlights),
                        for (final h in p.highlights(arabic)) _Bullet(text: h, icon: AppIcons.sparkle),
                      ],
                      if (p.included(arabic).isNotEmpty) ...[
                        Gaps.vGap18,
                        _SectionTitle(Translate.s.plan_detail_included),
                        for (final h in p.included(arabic)) _Bullet(text: h, icon: AppIcons.check),
                      ],
                      if (p.days.isNotEmpty) ...[
                        Gaps.vGap18,
                        _SectionTitle(Translate.s.plan_detail_dayByDay),
                        for (final d in p.days) _DayRow(day: d, last: d == p.days.last),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsetsDirectional.fromSTEB(
                AppSpacing.screenH,
                AppSpacing.md,
                AppSpacing.screenH,
                AppSpacing.md,
              ),
              decoration: BoxDecoration(
                color: colors.surface1,
                border: Border(top: BorderSide(color: colors.line)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      Expanded(child: BuildPlanPrice(programme: p)),
                      ObsValueConsumer(
                        observable: saved,
                        builder: (context, list) {
                          final isSaved = list.any((t) => t.id == p.id);
                          return BuildSavePlanButton(
                            saved: isSaved,
                            height: 44,
                            onTap: () {
                              // Saving closes the sheet so the confirmation, and the way
                              // to the list, are in view; un-saving stays put.
                              if (!isSaved) Navigator.of(context).pop();
                              onSave();
                            },
                          );
                        },
                      ),
                    ],
                  ),
                  Align(
                    alignment: AlignmentDirectional.centerEnd,
                    child: TextButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                        onRequest();
                      },
                      child: Text(Translate.s.plan_card_request, style: AppTextStyle.s13_w500(color: colors.button)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;

  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
    child: Text(
      text,
      style: AppTextStyle.s16_w500(
        color: context.colors.text,
      ).copyWith(fontFamily: AppFonts.display(context), fontWeight: FontWeight.w600),
    ),
  );
}

class _Bullet extends StatelessWidget {
  final String text;
  final String icon;

  const _Bullet({required this.text, required this.icon});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.sm),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.only(top: 3),
            child: AppIcon.ui(icon, size: 14, color: colors.button),
          ),
          Gaps.hGap9,
          Expanded(
            child: Text(
              text,
              textDirection: CopyDirection.of(text),
              style: AppTextStyle.s13_w500(color: colors.text).copyWith(fontWeight: FontWeight.w400),
            ),
          ),
        ],
      ),
    );
  }
}

/// A day on the route: a dot on a line, then what happens.
class _DayRow extends StatelessWidget {
  final ProgrammeDay day;
  final bool last;

  const _DayRow({required this.day, required this.last});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 24,
            child: Column(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(color: colors.actionWash, shape: BoxShape.circle),
                  child: Text('${day.day}', style: AppTextStyle.s12_w700(color: colors.button)),
                ),
                if (!last) Expanded(child: Container(width: 1.5, color: colors.line)),
              ],
            ),
          ),
          Gaps.hGap13,
          Expanded(
            child: Padding(
              padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.xl),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(Translate.s.plan_detail_day(day.day), style: AppTextStyle.micro(color: colors.text3)),
                  Text(
                    day.title(arabic),
                    textDirection: CopyDirection.of(day.title(arabic)),
                    style: AppTextStyle.s14_w600(color: colors.text),
                  ),
                  if (day.subtitle(arabic).isNotEmpty) ...[
                    Gaps.vGap4,
                    Text(
                      day.subtitle(arabic),
                      textDirection: CopyDirection.of(day.subtitle(arabic)),
                      style: AppTextStyle.s13_w500(color: colors.text2).copyWith(fontWeight: FontWeight.w400),
                    ),
                  ],
                  for (final h in day.highlights(arabic))
                    Padding(
                      padding: const EdgeInsetsDirectional.only(top: AppSpacing.xs),
                      child: Text(
                        '• $h',
                        textDirection: CopyDirection.of(h),
                        style: AppTextStyle.s13_w500(color: colors.text2).copyWith(fontWeight: FontWeight.w400),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
