part of '../trip_imports.dart';

/// The code the operator scans. It is read from the copy saved on this
/// phone, so it opens with no signal.
class BuildVoucherRow extends StatelessWidget {
  final TripBooking booking;

  const BuildVoucherRow({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final code = _code(booking);
    if (code.isEmpty) return const SizedBox.shrink();
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => showVoucher(context, booking),
      child: Padding(
        padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsetsDirectional.all(4),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(6)),
              child: QrImageView(data: code, size: 52, padding: EdgeInsets.zero),
            ),
            Gaps.hGap12,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(Translate.s.today_voucher, style: AppTextStyle.s14_w600(color: colors.text)),
                  Gaps.vGap4,
                  Row(
                    children: [
                      AppIcon.ui(AppIcons.checkCircle, size: 13, color: colors.green),
                      Gaps.hGap4,
                      Flexible(child: Text(Translate.s.today_voucher_offline, style: AppTextStyle.caption(color: colors.text3))),
                    ],
                  ),
                ],
              ),
            ),
            Text(code, textDirection: TextDirection.ltr, style: AppTextStyle.s12_w600(color: colors.text2)),
            Gaps.hGap4,
            AppIcon.ui(AppIcons.chevron, size: 18, color: colors.text3, mirrorInRtl: true),
          ],
        ),
      ),
    );
  }
}

String _code(TripBooking b) => b.confirmationCode.isNotEmpty ? b.confirmationCode : b.bookingRef;

void showVoucher(BuildContext context, TripBooking booking) {
  final colors = context.colors;
  final arabic = context.isArabic;
  final code = _code(booking);
  final at = booking.startsAt;
  showModalBottomSheet<void>(
    context: context,
    useSafeArea: true,
    backgroundColor: colors.bg,
    elevation: 0,
    shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
    builder: (_) => Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.xxl, AppSpacing.lg, AppSpacing.xxl, AppSpacing.xxl),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 36, height: 4, decoration: BoxDecoration(color: colors.line2, borderRadius: AppRadius.chipAll)),
          Gaps.vGap18,
          Text(_title(booking, arabic), textAlign: TextAlign.center, style: AppTextStyle.s18_w700(color: colors.text)),
          if (at != null) ...[
            Gaps.vGap4,
            Text(RehlaDates.dayClock(at, arabic), style: AppTextStyle.s13_w500(color: colors.text2)),
          ],
          Gaps.vGap18,
          Container(
            padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
            decoration: BoxDecoration(color: Colors.white, borderRadius: AppRadius.cardAll),
            child: QrImageView(data: code, size: 200, padding: EdgeInsets.zero),
          ),
          Gaps.vGap13,
          SelectableText(code, textDirection: TextDirection.ltr, style: AppTextStyle.s18_w600(color: colors.text).copyWith(letterSpacing: 2)),
          Gaps.vGap6,
          Text(
            booking.confirmationCode.isNotEmpty ? Translate.s.today_voucher_hint : Translate.s.today_voucher_ref_hint,
            textAlign: TextAlign.center,
            style: AppTextStyle.caption(color: colors.text3),
          ),
          Gaps.vGap6,
          Text(
            '${Translate.s.pay_guests(booking.passengers)} · ${AppMoney.egp(booking.amountEgp)} · ${booking.paid ? Translate.s.today_paid : Translate.s.xp_pay_on_arrival}',
            style: AppTextStyle.caption(color: colors.text2),
          ),
        ],
      ),
    ),
  );
}
