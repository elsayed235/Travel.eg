part of 'home_widgets_imports.dart';

/// Every saved plan in one place, newest first: photo, status, length and
/// price. A tap opens the plan day by day; sending stays a separate step.
class BuildSavedPlans extends StatelessWidget {
  final List<KeptTrip> plans;
  final ValueChanged<KeptTrip> onOpen;
  final ValueChanged<KeptTrip> onRemove;
  final VoidCallback onNew;

  const BuildSavedPlans({
    super.key,
    required this.plans,
    required this.onOpen,
    required this.onRemove,
    required this.onNew,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return ListView(
      padding: EdgeInsetsDirectional.fromSTEB(
        AppSpacing.screenH,
        AppSpacing.xl,
        AppSpacing.screenH,
        AppSpacing.xxl + MediaQuery.paddingOf(context).bottom,
      ),
      children: [
        Text(
          Translate.s.plans_title,
          style: AppTextStyle.s24_w700(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
        ),
        Gaps.vGap6,
        Text(
          Translate.s.plans_subtitle,
          style: AppTextStyle.s13_w500(color: colors.text2).copyWith(fontWeight: FontWeight.w400, height: 1.45),
        ),
        Gaps.vGap18,
        for (var i = 0; i < plans.length; i++)
          Padding(
            padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
            child: AppEntrance(
              key: ValueKey(plans[i].id),
              delay: Duration(milliseconds: 60 * i),
              child: _PlanRow(plan: plans[i], onOpen: onOpen, onRemove: onRemove),
            ),
          ),
        Gaps.vGap6,
        OutlinedButton.icon(
          onPressed: onNew,
          icon: AppIcon.ui(AppIcons.plus, size: 16, color: colors.button),
          label: Text(Translate.s.plans_new, style: AppTextStyle.s14_w600(color: colors.button)),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size.fromHeight(46),
            side: BorderSide(color: colors.button.withValues(alpha: 0.5)),
            shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
          ),
        ),
      ],
    );
  }
}

class _PlanRow extends StatelessWidget {
  final KeptTrip plan;
  final ValueChanged<KeptTrip> onOpen;
  final ValueChanged<KeptTrip> onRemove;

  const _PlanRow({required this.plan, required this.onOpen, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    return Material(
      color: colors.surface1,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.cardAll, side: BorderSide(color: colors.line)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => onOpen(plan),
        child: Padding(
          padding: const EdgeInsetsDirectional.all(AppSpacing.md),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: AppRadius.imageAll,
                child: SizedBox(width: 84, height: 84, child: BuildTripPhoto(trip: plan)),
              ),
              Gaps.hGap12,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    BuildTripStatus(sent: plan.sent, onImage: false),
                    Gaps.vGap6,
                    Text(
                      plan.title(arabic),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyle.s14_w600(color: colors.text).copyWith(height: 1.3),
                    ),
                    Gaps.vGap4,
                    Text.rich(
                      TextSpan(
                        children: [
                          TextSpan(text: '${plan.destination.label(arabic)} · ${Translate.s.plan_card_days(plan.durationDays)} · '),
                          TextSpan(text: AppMoney.egp(plan.startingPriceEgp)),
                        ],
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyle.caption(color: colors.text2),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () => onRemove(plan),
                tooltip: Translate.s.plans_remove,
                icon: AppIcon.ui(AppIcons.close, size: 18, color: colors.text3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// One saved plan, full screen: the trip view plus a way to remove it.
/// It follows the list, so sending updates the status here and removing
/// the plan closes the page.
class SavedPlanPage extends StatelessWidget {
  final String id;
  final ObsValue<List<KeptTrip>> plans;
  final ValueChanged<KeptTrip> onSend;
  final ValueChanged<KeptTrip> onRemove;
  final VoidCallback onChange;

  const SavedPlanPage({
    super.key,
    required this.id,
    required this.plans,
    required this.onSend,
    required this.onRemove,
    required this.onChange,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.of(context).maybePop(),
          tooltip: Translate.s.home_back,
          icon: AppIcon.ui(AppIcons.back, color: colors.text, mirrorInRtl: true),
        ),
        title: Text(Translate.s.plans_detail_title, style: AppTextStyle.s16_w500(color: colors.text)),
        actions: [
          ObsValueConsumer(
            observable: plans,
            builder: (context, list) {
              final plan = list.where((t) => t.id == id).firstOrNull;
              if (plan == null) return const SizedBox.shrink();
              return TextButton(
                onPressed: () {
                  Navigator.of(context).maybePop();
                  onRemove(plan);
                },
                child: Text(Translate.s.plans_remove, style: AppTextStyle.s13_w500(color: colors.red)),
              );
            },
          ),
          Gaps.hGap8,
        ],
      ),
      body: ObsValueConsumer(
        observable: plans,
        builder: (context, list) {
          final plan = list.where((t) => t.id == id).firstOrNull;
          if (plan == null) return const SizedBox.shrink();
          return BuildTripBody(
            trip: plan,
            onChange: () {
              Navigator.of(context).maybePop();
              onChange();
            },
            onSend: () => onSend(plan),
          );
        },
      ),
    );
  }
}
