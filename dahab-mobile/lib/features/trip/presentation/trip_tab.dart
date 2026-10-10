part of 'trip_imports.dart';

/// The Trip tab. With booked outings it reads the server's trip; on the
/// days of the trip it becomes "Today". Without one it shows [fallback]
/// (the plan kept on this phone, or the empty state).
class TripTab extends StatelessWidget {
  final TodayController controller;
  final Widget fallback;

  const TripTab({super.key, required this.controller, required this.fallback});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: TripStore.instance.bundleObs,
      builder: (context, bundle) {
        if (bundle == null) return fallback;
        return ObsValueConsumer(
          observable: controller.nowObs,
          builder: (context, now) => _TripView(controller: controller, bundle: bundle, now: now),
        );
      },
    );
  }
}

class _TripView extends StatelessWidget {
  final TodayController controller;
  final TripBundle bundle;
  final DateTime now;

  const _TripView({required this.controller, required this.bundle, required this.now});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final trip = bundle.trip;
    final day = trip.dayOf(now);
    final next = controller.next(bundle, now);
    final move = controller.windMove(bundle, now);
    final later = bundle.bookings.where((b) => b != next && (b.startsAt?.isAfter(now) ?? true)).toList();
    final past = bundle.bookings.where((b) => b != next && (b.startsAt?.isBefore(now) ?? false)).toList();
    final toGo = TripStore.instance.daysToGo(now);

    final eyebrow = day != null
        ? '${Translate.s.today_day_of(day, trip.days)} · ${RehlaDates.day(now, arabic)}'
        : trip.start == null
            ? trip.title
            : '${RehlaDates.day(trip.start!, arabic)} – ${RehlaDates.day(trip.start!.add(Duration(days: trip.days - 1)), arabic)}';
    final title = day != null
        ? Translate.s.today_title
        : toGo != null
            ? Translate.s.trip_days_to_go(toGo)
            : Translate.s.trip_title;

    return RefreshIndicator(
      color: colors.button,
      backgroundColor: colors.surface1,
      onRefresh: TripStore.instance.refresh,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: EdgeInsetsDirectional.fromSTEB(
          AppSpacing.screenH,
          AppSpacing.xl,
          AppSpacing.screenH,
          AppSpacing.xxl + MediaQuery.paddingOf(context).bottom,
        ),
        children: [
          Text(eyebrow.toUpperCase(), style: AppTextStyle.micro(color: colors.text3).copyWith(letterSpacing: arabic ? 0 : 1.2)),
          Gaps.vGap6,
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Text(title, style: AppTextStyle.s24_w700(color: colors.text).copyWith(fontFamily: AppFonts.display(context))),
              ),
              const _ConditionsChip(),
            ],
          ),
          if (bundle.offline) ...[
            Gaps.vGap10,
            Row(
              children: [
                AppIcon.ui(AppIcons.offline, size: 14, color: colors.text3),
                Gaps.hGap6,
                Expanded(child: Text(Translate.s.today_offline, style: AppTextStyle.caption(color: colors.text3))),
              ],
            ),
          ],
          Gaps.vGap18,
          if (move != null) ...[
            BuildWindAlert(controller: controller, move: move),
            Gaps.vGap13,
          ],
          if (next != null) ...[
            BuildTodayNext(controller: controller, booking: next, now: now),
            Gaps.vGap24,
          ],
          if (bundle.bookings.isEmpty) _NoBookings(),
          if (later.isNotEmpty) ...[
            Text(Translate.s.today_later, style: AppTextStyle.s16_w700(color: colors.text)),
            Gaps.vGap10,
            for (final b in later) BuildBookingTile(booking: b),
            Gaps.vGap18,
          ],
          if (past.isNotEmpty) ...[
            Text(Translate.s.today_done, style: AppTextStyle.s14_w600(color: colors.text3)),
            Gaps.vGap10,
            for (final b in past) Opacity(opacity: 0.6, child: BuildBookingTile(booking: b)),
            Gaps.vGap18,
          ],
          ObsValueConsumer(
            observable: controller.emergencyObs,
            builder: (context, lines) => lines.isEmpty ? const SizedBox.shrink() : BuildEmergency(lines: lines, onCall: controller.call),
          ),
        ],
      ),
    );
  }
}

class _ConditionsChip extends StatelessWidget {
  const _ConditionsChip();

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return ObsValueConsumer(
      observable: ExperienceCatalogue.instance.stateObs,
      builder: (context, state) {
        final live = state.live;
        if (live == null) return const SizedBox.shrink();
        return Container(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
          decoration: BoxDecoration(
            color: colors.surface1,
            borderRadius: AppRadius.chipAll,
            border: Border.all(color: colors.line),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              AppIcon.ui(AppIcons.sun, size: 14, color: colors.highlight),
              Gaps.hGap4,
              Text('${live.airC.round()}°', style: AppTextStyle.s12_w600(color: colors.text)),
              Text('  ·  ', style: AppTextStyle.micro(color: colors.text3)),
              AppIcon.ui(AppIcons.wind, size: 14, color: colors.button),
              Gaps.hGap4,
              Text(Translate.s.today_wind(live.windKnots.round()), style: AppTextStyle.s12_w600(color: colors.text)),
            ],
          ),
        );
      },
    );
  }
}

class _NoBookings extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsetsDirectional.all(AppSpacing.xl),
      margin: const EdgeInsetsDirectional.only(bottom: AppSpacing.xl),
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(Translate.s.today_none_title, style: AppTextStyle.s16_w700(color: colors.text)),
          Gaps.vGap6,
          Text(Translate.s.today_none_body, style: AppTextStyle.s13_w500(color: colors.text2).copyWith(height: 1.5)),
          Gaps.vGap13,
          GestureDetector(
            onTap: () => ShellActions.openTab(ShellActions.discover),
            child: Text(Translate.s.today_none_action, style: AppTextStyle.s14_w600(color: colors.button)),
          ),
        ],
      ),
    );
  }
}
