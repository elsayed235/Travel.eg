part of '../experiences_imports.dart';

class CheckoutOrder {
  final Experience experience;
  final String tripId;
  final DateTime day;
  final String time;
  final int guests;
  final num shownTotal;
  final String holdToken;
  final num heldTotal;
  final DateTime? expiresAt;
  final String attemptKey;
  final String name;
  final String email;
  final String phone;

  const CheckoutOrder({
    required this.experience,
    required this.tripId,
    required this.day,
    required this.time,
    required this.guests,
    required this.shownTotal,
    required this.holdToken,
    required this.heldTotal,
    required this.expiresAt,
    required this.attemptKey,
    required this.name,
    required this.email,
    required this.phone,
  });
}

/// One transparent step: the hold timer, the itemised price, the real
/// cancellation deadline, how payment happens. "Booked" and "operator
/// confirmed" are shown as the two separate states they are.
class CheckoutPage extends StatefulWidget {
  final CheckoutOrder order;

  const CheckoutPage({super.key, required this.order});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  Timer? _ticker;
  Duration _left = Duration.zero;
  late num _amount = widget.order.heldTotal;
  var _busy = false;
  String? _notice;
  bool _noticeIsPrice = false;
  _Booked? _booked;

  CheckoutOrder get o => widget.order;

  bool get _expired => o.expiresAt != null && _left <= Duration.zero;

  @override
  void initState() {
    super.initState();
    if (o.heldTotal != o.shownTotal) {
      _notice = Translate.s.pay_price_changed(AppMoney.egp(o.heldTotal));
      _noticeIsPrice = true;
    }
    _tick();
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
  }

  void _tick() {
    final end = o.expiresAt;
    if (end == null) return;
    final left = end.difference(DateTime.now());
    setState(() => _left = left.isNegative ? Duration.zero : left);
    if (left.isNegative) _ticker?.cancel();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  Future<void> _confirm() async {
    if (_busy || _expired) return;
    setState(() {
      _busy = true;
      _notice = null;
    });
    final reply = await TripRemote.checkout(
      tripId: o.tripId,
      name: o.name,
      phone: o.phone,
      email: o.email,
      key: '${o.attemptKey}-PAY',
      item: {
        'serviceType': o.experience.bookable.serviceType,
        'skuId': o.experience.bookable.skuId,
        'holdToken': o.holdToken,
        'scheduledDate': RehlaDates.iso(o.day),
        'scheduledTime': o.time,
        'amountEGP': _amount,
        'passengersCount': o.guests,
      },
    );
    if (!mounted) return;
    if (reply.ok) {
      final bookings = reply.list('bookings');
      final first = bookings.isNotEmpty ? bookings.first : const <String, dynamic>{};
      final ref = (first['confirmationCode'] ?? first['bookingRef'] ?? reply.map['transactionId'] ?? '') as String;
      _ticker?.cancel();
      setState(() {
        _busy = false;
        _booked = _Booked(ref);
      });
      unawaited(TripStore.instance.refresh());
      return;
    }
    final current = reply.details?['currentAmountEGP'];
    setState(() {
      _busy = false;
      if (reply.code == 'PRICE_CHANGED' && current is num) {
        _amount = current;
        _notice = Translate.s.pay_price_changed(AppMoney.egp(current));
        _noticeIsPrice = true;
      } else if (reply.code == 'HOLD_EXPIRED') {
        _left = Duration.zero;
        _notice = Translate.s.pay_expired;
        _noticeIsPrice = false;
      } else {
        _notice = reply.unreachable ? Translate.s.auth_server_missing : (reply.message ?? Translate.s.pay_failed);
        _noticeIsPrice = false;
      }
    });
  }

  void _openTrip() {
    Navigator.of(context).popUntil((r) => r.isFirst);
    ShellActions.openTab(ShellActions.trip);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final e = o.experience;
    final rate = ExperienceCatalogue.instance.usdRate;
    final usd = rate != null && rate > 0 ? (_amount / rate).round() : null;
    final deadline = ExperienceFit.deadline(e, o.day, o.time);
    final when = RehlaDates.at(o.day, o.time);
    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        foregroundColor: colors.text,
        title: Text(
          _booked == null ? Translate.s.pay_title : Translate.s.pay_done_title,
          style: AppTextStyle.s18_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
        ),
      ),
      body: ListView(
        padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, AppSpacing.md, AppSpacing.screenH, AppSpacing.xxl),
        children: [
          if (_booked == null && o.expiresAt != null) _HoldTimer(left: _left),
          if (_booked != null) _BookedStates(booked: _booked!, supplier: e.bookable.supplier(arabic)),
          Gaps.vGap16,
          Container(
            padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: colors.surface1,
              borderRadius: AppRadius.cardAll,
              border: Border.all(color: colors.line),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: AppRadius.imageAll,
                      child: SizedBox(width: 56, height: 56, child: RehlaPhoto(webPath: e.webPhoto, asset: e.assetPhoto)),
                    ),
                    Gaps.hGap12,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(e.title(arabic), maxLines: 2, style: AppTextStyle.s14_w600(color: colors.text)),
                          Gaps.vGap4,
                          Text(
                            [
                              if (when != null) RehlaDates.dayClock(when, arabic),
                              Translate.s.pay_guests(o.guests),
                            ].join(' · '),
                            style: AppTextStyle.caption(color: colors.text2),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                Gaps.vGap16,
                Divider(height: 1, color: colors.line),
                Gaps.vGap12,
                _Line(
                  label: e.bookable.perPerson
                      ? '\u2066${o.guests} × ${AppMoney.egp(e.bookable.priceEgp)}\u2069'
                      : e.title(arabic),
                  value: AppMoney.egp(_amount),
                ),
                Gaps.vGap8,
                Divider(height: 1, color: colors.line),
                Gaps.vGap12,
                _Line(label: Translate.s.pay_total, value: AppMoney.egp(_amount), strong: true),
                Gaps.vGap4,
                Text(
                  usd != null ? Translate.s.pay_currency_note(usd) : Translate.s.pay_currency_note_egp,
                  style: AppTextStyle.caption(color: colors.text3),
                ),
                if (deadline != null) ...[
                  Gaps.vGap12,
                  Row(
                    children: [
                      AppIcon.ui(AppIcons.calendarCheck, size: 16, color: colors.green),
                      Gaps.hGap6,
                      Expanded(
                        child: Text(
                          Translate.s.pay_cancel_until(RehlaDates.dayClock(deadline, arabic)),
                          style: AppTextStyle.s12_w500(color: colors.green),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          if (_booked == null) ...[
            Gaps.vGap18,
            Text(Translate.s.pay_method, style: AppTextStyle.s14_w600(color: colors.text)),
            Gaps.vGap8,
            Container(
              padding: const EdgeInsetsDirectional.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: colors.actionWash,
                borderRadius: AppRadius.buttonAll,
                border: Border.all(color: colors.button),
              ),
              child: Row(
                children: [
                  AppIcon.ui(AppIcons.wallet, color: colors.button),
                  Gaps.hGap12,
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(Translate.s.pay_cash, style: AppTextStyle.s14_w600(color: colors.text)),
                        Text(Translate.s.pay_cash_hint(e.bookable.supplier(arabic)), style: AppTextStyle.caption(color: colors.text2)),
                      ],
                    ),
                  ),
                  AppIcon.ui(AppIcons.radioOn, color: colors.button, size: 20),
                ],
              ),
            ),
            if (_notice != null) ...[
              Gaps.vGap12,
              Text(_notice!, style: AppTextStyle.s13_w500(color: _noticeIsPrice ? colors.amber : colors.red)),
            ],
            Gaps.vGap18,
            if (_expired)
              OutlinedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  showBookingSheet(context, e);
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: colors.button,
                  minimumSize: const Size.fromHeight(52),
                  side: BorderSide(color: colors.button),
                  shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                ),
                child: Text(Translate.s.pay_pick_again),
              )
            else
              FilledButton(
                onPressed: _busy ? null : _confirm,
                style: FilledButton.styleFrom(
                  backgroundColor: colors.button,
                  foregroundColor: colors.onButton,
                  minimumSize: const Size.fromHeight(52),
                  shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                  textStyle: AppTextStyle.s16_w500(color: colors.onButton),
                ),
                child: _busy
                    ? SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: colors.onButton))
                    : Text('${Translate.s.pay_confirm} · ${AppMoney.egp(_amount)}'),
              ),
          ] else ...[
            Gaps.vGap18,
            FilledButton(
              onPressed: _openTrip,
              style: FilledButton.styleFrom(
                backgroundColor: colors.button,
                foregroundColor: colors.onButton,
                minimumSize: const Size.fromHeight(52),
                shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
                textStyle: AppTextStyle.s16_w500(color: colors.onButton),
              ),
              child: Text(Translate.s.pay_open_trip),
            ),
          ],
        ],
      ),
    );
  }
}

class _Booked {
  final String reference;

  const _Booked(this.reference);
}

class _HoldTimer extends StatelessWidget {
  final Duration left;

  const _HoldTimer({required this.left});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final m = left.inMinutes.toString().padLeft(2, '0');
    final s = (left.inSeconds % 60).toString().padLeft(2, '0');
    final ending = left.inSeconds < 120;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
      decoration: BoxDecoration(
        color: ending ? colors.highlightBg : colors.actionWash,
        borderRadius: AppRadius.buttonAll,
      ),
      child: Row(
        children: [
          AppIcon.ui(AppIcons.clock, size: 18, color: ending ? colors.highlight : colors.button),
          Gaps.hGap8,
          Expanded(child: Text(Translate.s.pay_held, style: AppTextStyle.s13_w500(color: colors.text))),
          Text(
            '$m:$s',
            textDirection: TextDirection.ltr,
            style: AppTextStyle.s18_w700(color: ending ? colors.highlight : colors.button)
                .copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
          ),
        ],
      ),
    );
  }
}

/// Two rows, never merged: the booking exists; the operator has not said yes yet.
class _BookedStates extends StatelessWidget {
  final _Booked booked;
  final String supplier;

  const _BookedStates({required this.booked, required this.supplier});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    Widget row(String icon, Color tone, String text) => Padding(
          padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
          child: Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(color: tone.withValues(alpha: 0.14), shape: BoxShape.circle),
                child: AppIcon.ui(icon, size: 16, color: tone),
              ),
              Gaps.hGap10,
              Expanded(child: Text(text, style: AppTextStyle.s14_w500(color: colors.text))),
            ],
          ),
        );
    return Container(
      padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, AppSpacing.xs),
      decoration: BoxDecoration(
        color: colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          row(AppIcons.check, colors.green, Translate.s.pay_state_booked(booked.reference)),
          row(AppIcons.hourglass, colors.amber, Translate.s.pay_state_waiting(supplier)),
          row(AppIcons.wallet, colors.text3, Translate.s.pay_state_payment),
          Padding(
            padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
            child: Text(Translate.s.pay_state_note, style: AppTextStyle.caption(color: colors.text3)),
          ),
        ],
      ),
    );
  }
}

class _Line extends StatelessWidget {
  final String label;
  final String value;
  final bool strong;

  const _Line({required this.label, required this.value, this.strong = false});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            style: strong ? AppTextStyle.s16_w700(color: colors.text) : AppTextStyle.s14_w400(color: colors.text2),
          ),
        ),
        Text(
          value,
          textDirection: TextDirection.ltr,
          style: strong ? AppTextStyle.price(color: colors.text) : AppTextStyle.s14_w500(color: colors.text),
        ),
      ],
    );
  }
}
