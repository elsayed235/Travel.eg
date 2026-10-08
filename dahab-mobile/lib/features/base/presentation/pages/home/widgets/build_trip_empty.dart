part of 'home_widgets_imports.dart';

/// No confirmed trip yet. The tab stays in the bar — it is where today will
/// live — and the only action is to start the plan that fills it.
class BuildTripEmpty extends StatelessWidget {
  final RehlaDestination destination;
  final VoidCallback onPlan;

  const BuildTripEmpty({super.key, required this.destination, required this.onPlan});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    return ListView(
      padding: EdgeInsetsDirectional.fromSTEB(
        AppSpacing.screenH,
        AppSpacing.lg,
        AppSpacing.screenH,
        AppSpacing.xxl + MediaQuery.paddingOf(context).bottom,
      ),
      children: [
        ClipRRect(
          borderRadius: AppRadius.cardAll,
          child: SizedBox(
            height: 156,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(destination.heroImagePath, fit: BoxFit.cover),
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [colors.scrim.withValues(alpha: 0.05), colors.scrim.withValues(alpha: 0.72)],
                    ),
                  ),
                ),
                PositionedDirectional(
                  start: AppSpacing.lg,
                  end: AppSpacing.lg,
                  bottom: AppSpacing.md,
                  child: Text(
                    destination.label(arabic),
                    style: AppTextStyle.s20_w600(color: colors.onImage).copyWith(fontFamily: AppFonts.display(context)),
                  ),
                ),
              ],
            ),
          ),
        ),
        Gaps.vGap18,
        Text(
          Translate.s.trip_empty_title,
          style: AppTextStyle.s20_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
        ),
        Gaps.vGap6,
        Text(
          Translate.s.trip_empty_body,
          style: AppTextStyle.s13_w500(color: colors.text2).copyWith(fontWeight: FontWeight.w400, height: 1.45),
        ),
        Gaps.vGap13,
        FilledButton(
          onPressed: onPlan,
          style: FilledButton.styleFrom(
            backgroundColor: colors.button,
            foregroundColor: colors.onButton,
            minimumSize: const Size.fromHeight(46),
            shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
            textStyle: AppTextStyle.s14_w600(color: colors.onButton),
          ),
          child: Text(Translate.s.trip_empty_cta),
        ),
      ],
    );
  }
}
