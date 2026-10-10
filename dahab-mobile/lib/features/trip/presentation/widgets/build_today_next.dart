part of '../trip_imports.dart';

/// The next outing: when, a live countdown, who is coming and in what,
/// where it stands (confirmed → driver → on the way → arrived), and the
/// voucher the operator scans.
class BuildTodayNext extends StatelessWidget {
  final TodayController controller;
  final TripBooking booking;
  final DateTime now;

  const BuildTodayNext({super.key, required this.controller, required this.booking, required this.now});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final b = booking;
    final at = b.startsAt;
    final soon = at != null && at.difference(now).inMinutes < 60;
    final title = _title(b, arabic);
    return Container(
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.xl, AppSpacing.xl, AppSpacing.xl, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(Translate.s.today_next.toUpperCase(), style: AppTextStyle.micro(color: colors.button).copyWith(letterSpacing: arabic ? 0 : 1.2)),
                    const Spacer(),
                    if (at != null)
                      Container(
                        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
                        decoration: BoxDecoration(color: soon ? colors.amberBg : colors.actionWash, borderRadius: AppRadius.chipAll),
                        child: Text(_countdown(at, now, arabic), style: AppTextStyle.s12_w600(color: soon ? colors.amber : colors.button)),
                      ),
                  ],
                ),
                Gaps.vGap10,
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (at != null) ...[
                      Text(
                        RehlaDates.clock(at),
                        style: AppTextStyle.s24_w700(color: colors.text).copyWith(
                          fontFamily: AppFonts.display(context),
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                      ),
                      Gaps.hGap12,
                    ],
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsetsDirectional.only(top: 4),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(title, style: AppTextStyle.s16_w700(color: colors.text)),
                            if (b.pickup.isNotEmpty) ...[
                              Gaps.vGap4,
                              Row(
                                children: [
                                  AppIcon.ui(AppIcons.pin, size: 14, color: colors.text3),
                                  Gaps.hGap4,
                                  Expanded(child: Text(b.pickup, style: AppTextStyle.caption(color: colors.text2))),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                Gaps.vGap18,
                _Person(booking: b, onCall: controller.call),
                Gaps.vGap18,
                BuildStatusTimeline(stage: b.stage),
                Gaps.vGap18,
              ],
            ),
          ),
          Divider(height: 1, color: colors.line),
          BuildVoucherRow(booking: b),
        ],
      ),
    );
  }

  static String _countdown(DateTime at, DateTime now, bool arabic) {
    final d = at.difference(now);
    if (d.isNegative) return Translate.s.today_under_way;
    if (d.inMinutes < 60) return Translate.s.today_in_m(d.inMinutes.clamp(1, 59));
    if (d.inHours < 24) return Translate.s.today_in_hm(d.inHours, d.inMinutes % 60);
    return RehlaDates.day(at, arabic);
  }
}

String _title(TripBooking b, bool arabic) {
  final e = ExperienceCatalogue.instance.bySku(b.skuId);
  if (e != null) return e.title(arabic);
  return b.title.isNotEmpty ? b.title : b.serviceType;
}

/// Who the traveler meets: the driver (with vehicle and plate), else the
/// guide, else the operator.
class _Person extends StatelessWidget {
  final TripBooking booking;
  final Future<void> Function(String) onCall;

  const _Person({required this.booking, required this.onCall});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final b = booking;
    final String name;
    final String role;
    final String phone;
    if (b.driver(arabic).isNotEmpty) {
      name = b.driver(arabic);
      role = Translate.s.today_driver;
      phone = b.driverPhone;
    } else if (b.guide.isNotEmpty) {
      name = b.guide;
      role = Translate.s.today_guide;
      phone = b.guidePhone;
    } else {
      name = b.supplier(arabic);
      role = Translate.s.today_operator;
      phone = b.supplierPhone;
    }
    if (name.isEmpty) {
      return Text(Translate.s.today_no_person, style: AppTextStyle.caption(color: colors.text3));
    }
    return Row(
      children: [
        Container(
          width: 44,
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(color: colors.actionWash, shape: BoxShape.circle),
          child: Text(name.characters.first.toUpperCase(), style: AppTextStyle.s16_w700(color: colors.button)),
        ),
        Gaps.hGap10,
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: AppTextStyle.s14_w600(color: colors.text)),
              Gaps.vGap4,
              Row(
                children: [
                  Flexible(
                    child: Text(
                      b.vehicle.isNotEmpty && b.driver(arabic).isNotEmpty ? b.vehicle : role,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyle.caption(color: colors.text2),
                    ),
                  ),
                  if (b.plate.isNotEmpty && b.driver(arabic).isNotEmpty) ...[
                    Gaps.hGap6,
                    Container(
                      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.sm, vertical: 1),
                      decoration: BoxDecoration(
                        border: Border.all(color: colors.line2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(b.plate, textDirection: TextDirection.ltr, style: AppTextStyle.s12_w600(color: colors.text)),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
        if (phone.isNotEmpty)
          Semantics(
            button: true,
            label: Translate.s.today_call(name),
            child: GestureDetector(
              onTap: () => onCall(phone),
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(color: colors.button, shape: BoxShape.circle),
                child: AppIcon.ui(AppIcons.call, size: 20, color: colors.onButton),
              ),
            ),
          ),
      ],
    );
  }
}

/// Confirmed → Driver → On the way → Arrived, from the booking's supplier
/// state. Before the operator confirms, says so instead.
class BuildStatusTimeline extends StatelessWidget {
  final int stage;

  const BuildStatusTimeline({super.key, required this.stage});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    if (stage < 0) {
      return Row(
        children: [
          AppIcon.ui(AppIcons.hourglass, size: 16, color: colors.amber),
          Gaps.hGap6,
          Expanded(child: Text(Translate.s.today_waiting_operator, style: AppTextStyle.s13_w500(color: colors.amber))),
        ],
      );
    }
    final steps = [Translate.s.today_step_confirmed, Translate.s.today_step_driver, Translate.s.today_step_way, Translate.s.today_step_arrived];
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < steps.length; i++)
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      width: i == stage ? 14 : 10,
                      height: i == stage ? 14 : 10,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: i <= stage ? colors.button : colors.surface3,
                        border: i == stage ? Border.all(color: colors.actionWash, width: 3) : null,
                      ),
                    ),
                    if (i < steps.length - 1)
                      Expanded(child: Container(height: 2, color: i < stage ? colors.button : colors.line)),
                  ],
                ),
                Gaps.vGap6,
                Text(
                  steps[i],
                  style: AppTextStyle.micro(color: i <= stage ? colors.text : colors.text3).copyWith(
                    fontWeight: i == stage ? FontWeight.w700 : FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
