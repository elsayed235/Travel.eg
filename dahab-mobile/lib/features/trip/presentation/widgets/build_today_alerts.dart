part of '../trip_imports.dart';

/// DayGi's wind note: the live reading is over the operator's limit for a
/// booked outing, so it offers the operator's first departure tomorrow.
class BuildWindAlert extends StatelessWidget {
  final TodayController controller;
  final WindMove move;

  const BuildWindAlert({super.key, required this.controller, required this.move});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final live = ExperienceCatalogue.instance.live;
    final e = move.experience;
    return Container(
      padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colors.amberBg,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.amber.withValues(alpha: 0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AppIcon.ui(AppIcons.sparkle, size: 15, color: colors.amber),
              Gaps.hGap6,
              Text('DayGi', style: AppTextStyle.s12_w700(color: colors.amber)),
              Gaps.hGap6,
              AppIcon.ui(AppIcons.wind, size: 15, color: colors.amber),
            ],
          ),
          Gaps.vGap8,
          Text(
            Translate.s.today_wind_alert(
              (live?.windKnots ?? 0).round(),
              e.title(arabic),
              (e.maxWindKnots ?? 0).round(),
            ),
            style: AppTextStyle.s14_w500(color: colors.text).copyWith(height: 1.5),
          ),
          if (move.slot.isNotEmpty) ...[
            Gaps.vGap4,
            Text(
              Translate.s.today_wind_offer(RehlaDates.slot(move.slot), RehlaDates.day(move.day, arabic)),
              style: AppTextStyle.s13_w500(color: colors.text2),
            ),
          ],
          Gaps.vGap12,
          ObsValueConsumer(
            observable: controller.moveResultObs,
            builder: (context, results) {
              final result = results[move.booking.id];
              if (result != null) {
                return Text(result.$2, style: AppTextStyle.s13_w500(color: result.$1 ? colors.green : colors.red));
              }
              return Row(
                children: [
                  if (move.slot.isNotEmpty)
                    ObsValueConsumer(
                      observable: controller.movingObs,
                      builder: (context, moving) => GestureDetector(
                        onTap: moving == null ? () => controller.move(move) : null,
                        child: Container(
                          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
                          decoration: BoxDecoration(color: colors.button, borderRadius: AppRadius.buttonAll),
                          child: moving == move.booking.id
                              ? SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: colors.onButton))
                              : Text(Translate.s.today_move_it, style: AppTextStyle.s13_w500(color: colors.onButton)),
                        ),
                      ),
                    ),
                  if (move.slot.isNotEmpty) Gaps.hGap8,
                  GestureDetector(
                    onTap: () => ShellActions.askDaygi(Translate.s.today_wind_ask(e.title(arabic))),
                    child: Padding(
                      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                      child: Text(Translate.s.today_wind_other, style: AppTextStyle.s13_w500(color: colors.button)),
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

/// Emergency numbers from the server's Dahab knowledge, with the diving
/// line first: the hyperbaric chamber.
class BuildEmergency extends StatelessWidget {
  final List<EmergencyLine> lines;
  final Future<void> Function(String) onCall;

  const BuildEmergency({super.key, required this.lines, required this.onCall});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final sorted = [...lines]..sort((a, b) => _rank(a.service).compareTo(_rank(b.service)));
    return Container(
      decoration: BoxDecoration(
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.red.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.sm),
            child: Row(
              children: [
                AppIcon.ui(AppIcons.sos, size: 16, color: colors.red),
                Gaps.hGap6,
                Text(Translate.s.today_emergency, style: AppTextStyle.s14_w600(color: colors.text)),
              ],
            ),
          ),
          for (final l in sorted)
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => onCall(l.number),
              child: Padding(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                child: Row(
                  children: [
                    Expanded(child: Text(_label(l.service), style: AppTextStyle.s13_w500(color: colors.text2))),
                    Text(l.number.split('/').first.trim(), textDirection: TextDirection.ltr, style: AppTextStyle.s13_w500(color: colors.text)),
                    Gaps.hGap8,
                    AppIcon.ui(AppIcons.call, size: 16, color: colors.red),
                  ],
                ),
              ),
            ),
          Gaps.vGap6,
        ],
      ),
    );
  }

  static int _rank(String service) {
    final s = service.toLowerCase();
    if (s.contains('hyperbaric')) return 0;
    if (s.contains('hospital')) return 1;
    return 2;
  }

  static String _label(String service) {
    final s = service.toLowerCase();
    if (s.contains('hyperbaric')) return Translate.s.today_em_hyperbaric;
    if (s.contains('hospital')) return Translate.s.today_em_hospital;
    if (s.contains('police')) return Translate.s.today_em_police;
    return service;
  }
}
