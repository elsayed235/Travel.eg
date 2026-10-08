part of 'home_widgets_imports.dart';

/// The kept plan, as the trip: photo, status, price, and the days in order.
/// Sending it is a separate step — the team confirms it with local hosts.
class BuildTripBody extends StatelessWidget {
  final KeptTrip trip;
  final VoidCallback onChange;
  final VoidCallback onSend;

  const BuildTripBody({super.key, required this.trip, required this.onChange, required this.onSend});

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
            height: 172,
            child: Stack(
              fit: StackFit.expand,
              children: [
                _TripPhoto(trip: trip),
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
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _Status(sent: trip.sent),
                      Gaps.vGap6,
                      Text(
                        trip.title(arabic),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyle.s20_w600(
                          color: colors.onImage,
                        ).copyWith(fontFamily: AppFonts.display(context), height: 1.2),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        Gaps.vGap13,
        Text(
          trip.tagline(arabic),
          style: AppTextStyle.s13_w500(color: colors.text2).copyWith(fontWeight: FontWeight.w400, height: 1.45),
        ),
        Gaps.vGap9,
        Wrap(
          spacing: AppSpacing.md,
          runSpacing: AppSpacing.xs,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            Text(Translate.s.plan_card_days(trip.durationDays), style: AppTextStyle.s13_w500(color: colors.text)),
            Text(
              AppMoney.egp(trip.startingPriceEgp),
              textDirection: TextDirection.ltr,
              style: AppTextStyle.price(color: colors.text),
            ),
            if (trip.priceIsEstimate)
              Text(Translate.s.plan_card_estimate, style: AppTextStyle.s12_w500(color: colors.amber)),
          ],
        ),
        Gaps.vGap18,
        Text(
          Translate.s.trip_days_title,
          style: AppTextStyle.sectionTitle(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
        ),
        Gaps.vGap9,
        for (var i = 0; i < trip.days.length; i++) _TripDay(day: trip.days[i], last: i == trip.days.length - 1),
        Gaps.vGap8,
        if (!trip.sent)
          FilledButton(
            onPressed: onSend,
            style: FilledButton.styleFrom(
              backgroundColor: colors.button,
              foregroundColor: colors.onButton,
              minimumSize: const Size.fromHeight(46),
              shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
            ),
            child: Text(Translate.s.trip_send, style: AppTextStyle.s14_w600(color: colors.onButton)),
          )
        else
          Text(Translate.s.trip_sent_note, style: AppTextStyle.caption(color: colors.text2)),
        Align(
          alignment: AlignmentDirectional.center,
          child: TextButton(
            onPressed: onChange,
            child: Text(Translate.s.trip_change, style: AppTextStyle.s13_w500(color: colors.button)),
          ),
        ),
      ],
    );
  }
}

class _Status extends StatelessWidget {
  final bool sent;

  const _Status({required this.sent});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
      decoration: BoxDecoration(
        color: sent ? colors.button : colors.scrim.withValues(alpha: 0.45),
        borderRadius: AppRadius.chipAll,
      ),
      child: Text(
        sent ? Translate.s.trip_status_sent : Translate.s.trip_status_draft,
        style: AppTextStyle.s12_w600(color: colors.onImage),
      ),
    );
  }
}

class _TripPhoto extends StatelessWidget {
  final KeptTrip trip;

  const _TripPhoto({required this.trip});

  @override
  Widget build(BuildContext context) {
    final fallback = Image.asset(trip.destination.heroImagePath, fit: BoxFit.cover);
    if (trip.heroImage.isEmpty) return fallback;
    return Image.network(
      AppConfig.instance.assetUrl(trip.heroImage),
      fit: BoxFit.cover,
      errorBuilder: (_, _, _) => fallback,
    );
  }
}

class _TripDay extends StatelessWidget {
  final ProgrammeDay day;
  final bool last;

  const _TripDay({required this.day, required this.last});

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
                  child: Text(
                    '${day.day}',
                    style: AppTextStyle.s11_w400(color: colors.button).copyWith(fontWeight: FontWeight.w700),
                  ),
                ),
                if (!last) Expanded(child: Container(width: 1.5, color: colors.line)),
              ],
            ),
          ),
          Gaps.hGap10,
          Expanded(
            child: Padding(
              padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(day.title(arabic), style: AppTextStyle.s14_w600(color: colors.text)),
                  if (day.subtitle(arabic).isNotEmpty) ...[
                    Gaps.vGap4,
                    Text(day.subtitle(arabic), style: AppTextStyle.caption(color: colors.text2)),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
