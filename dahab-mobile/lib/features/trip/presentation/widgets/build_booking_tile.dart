part of '../trip_imports.dart';

/// One booked outing in the list: when, what, and the two states the
/// website keeps apart: paid or pay on arrival, and confirmed or waiting.
class BuildBookingTile extends StatelessWidget {
  final TripBooking booking;

  const BuildBookingTile({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final b = booking;
    final at = b.startsAt;
    final e = ExperienceCatalogue.instance.bySku(b.skuId);
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.sm),
      child: GestureDetector(
        onTap: () => showVoucher(context, b),
        child: Container(
          padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
          decoration: BoxDecoration(
            color: colors.surface1,
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: colors.line),
          ),
          child: Row(
            children: [
              Container(
                width: 52,
                padding: const EdgeInsetsDirectional.symmetric(vertical: AppSpacing.sm),
                decoration: BoxDecoration(color: colors.surface2, borderRadius: AppRadius.imageAll),
                child: Column(
                  children: [
                    Text(at == null ? '—' : RehlaDates.weekday(at, arabic), style: AppTextStyle.micro(color: colors.text3)),
                    Text(at == null ? '' : '${at.day}', style: AppTextStyle.s18_w700(color: colors.text)),
                  ],
                ),
              ),
              Gaps.hGap12,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      e?.title(arabic) ?? (b.title.isNotEmpty ? b.title : b.serviceType),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyle.s14_w600(color: colors.text),
                    ),
                    Gaps.vGap4,
                    Text(
                      [if (at != null) RehlaDates.clock(at), Translate.s.pay_guests(b.passengers), AppMoney.egp(b.amountEgp)].join(' · '),
                      style: AppTextStyle.caption(color: colors.text2),
                    ),
                    Gaps.vGap6,
                    Wrap(
                      spacing: AppSpacing.xs,
                      runSpacing: AppSpacing.xs,
                      children: [
                        _State(
                          label: b.stage >= 0 ? Translate.s.today_confirmed : Translate.s.today_pending,
                          tone: b.stage >= 0 ? colors.green : colors.amber,
                          bg: b.stage >= 0 ? colors.greenBg : colors.amberBg,
                        ),
                        _State(
                          label: b.paid ? Translate.s.today_paid : Translate.s.xp_pay_on_arrival,
                          tone: colors.text2,
                          bg: colors.surface2,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              AppIcon.ui(AppIcons.qr, size: 22, color: colors.text3),
            ],
          ),
        ),
      ),
    );
  }
}

class _State extends StatelessWidget {
  final String label;
  final Color tone;
  final Color bg;

  const _State({required this.label, required this.tone, required this.bg});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.sm, vertical: 2),
      decoration: BoxDecoration(color: bg, borderRadius: AppRadius.chipAll),
      child: Text(label, style: AppTextStyle.micro(color: tone).copyWith(fontWeight: FontWeight.w600)),
    );
  }
}
