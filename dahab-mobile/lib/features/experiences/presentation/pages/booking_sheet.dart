part of '../experiences_imports.dart';

const _bookableDays = 14;

/// A departure closer than this is no longer offered (same rule as the website).
const _leadMinutes = 45;

Future<void> showBookingSheet(BuildContext context, Experience experience) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    backgroundColor: context.colors.bg,
    elevation: 0,
    shape: const RoundedRectangleBorder(borderRadius: AppRadius.sheetTop),
    builder: (_) => BookingSheet(experience: experience),
  );
}

/// Day, party size and a real departure from /commerce/availability/rich,
/// then a 15-minute hold. Nothing is paid here.
class BookingSheet extends StatefulWidget {
  final Experience experience;

  const BookingSheet({super.key, required this.experience});

  @override
  State<BookingSheet> createState() => _BookingSheetState();
}

class _Slot {
  final String time;
  final int left;
  final bool soldOut;

  const _Slot(this.time, this.left, this.soldOut);
}

class _BookingSheetState extends State<BookingSheet> {
  late final List<DateTime> _days;
  late DateTime _day;
  int _guests = 2;
  String? _time;
  List<_Slot> _slots = const [];
  var _slotsState = 0; // 0 loading · 1 ready · 2 failed
  var _busy = false;
  String? _error;
  late final TextEditingController _phone;

  Experience get e => widget.experience;

  /// Days after today always qualify; today only while a departure is still
  /// more than 45 minutes away.
  bool _departureAhead(DateTime day) {
    final now = DateTime.now();
    if (day.isAfter(RehlaDates.dateOnly(now)) || e.bookable.timeSlots.isEmpty) return true;
    return e.bookable.timeSlots.any((s) {
      final at = RehlaDates.at(day, s);
      return at == null || at.subtract(const Duration(minutes: 45)).isAfter(now);
    });
  }

  @override
  void initState() {
    super.initState();
    final today = RehlaDates.dateOnly(DateTime.now());
    _days = List.generate(_bookableDays, (i) => today.add(Duration(days: i)));
    _day = _days.firstWhere((d) => e.openOn(d) && _departureAhead(d), orElse: () => today);
    _guests = _guests.clamp(1, e.bookable.maxPerSlot);
    _phone = TextEditingController(text: context.read<UserCubit>().state.model?.phone ?? '');
    _loadSlots();
  }

  @override
  void dispose() {
    _phone.dispose();
    super.dispose();
  }

  Future<void> _loadSlots() async {
    setState(() => _slotsState = 0);
    final reply = await TripRemote.availability(
      serviceType: e.bookable.serviceType,
      skuId: e.bookable.skuId,
      date: RehlaDates.iso(_day),
      guests: _guests,
    );
    if (!mounted) return;
    if (!reply.ok) {
      setState(() => _slotsState = 2);
      return;
    }
    final slots = reply
        .list('slots')
        .map((s) => _Slot(
              s['timeSlot'] as String? ?? '',
              (s['availableCapacity'] as num?)?.toInt() ?? 0,
              s['status'] == 'SOLD_OUT' || ((s['availableCapacity'] as num?)?.toInt() ?? 0) < _guests,
            ))
        .where((s) => s.time.isNotEmpty)
        .toList()
      ..sort((a, b) => (ExperienceBookable.slotMinutes(a.time) ?? 0).compareTo(ExperienceBookable.slotMinutes(b.time) ?? 0));
    setState(() {
      _slots = slots;
      _slotsState = 1;
      if (_time != null && !slots.any((s) => s.time == _time && _selectable(s))) _time = null;
    });
  }

  bool _departed(_Slot s) {
    final at = RehlaDates.at(_day, s.time);
    if (at == null) return false;
    return at.subtract(const Duration(minutes: _leadMinutes)).isBefore(DateTime.now());
  }

  bool _selectable(_Slot s) => !s.soldOut && !_departed(s);

  num get _total => e.bookable.totalFor(_guests);

  Future<void> _continue() async {
    final time = _time;
    if (time == null || _busy) return;
    if (!context.read<AuthCubit>().state.authorized) {
      await AutoRouter.of(context).push(const LoginRoute());
      return;
    }
    if (_phone.text.trim().isEmpty) {
      setState(() => _error = Translate.s.book_phone_missing);
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });

    var tripId = TripStore.instance.bundle?.trip.id;
    if (tripId == null) {
      final created = await TripRemote.createTrip(
        title: e.titleEn,
        start: _day,
        lengthDays: 1,
        travelers: _guests,
      );
      final trip = created.map['trip'];
      if (!created.ok || trip is! Map) {
        _fail(created);
        return;
      }
      tripId = trip['id'] as String;
    }

    final key = TripRemote.attemptKey('EXP');
    final hold = await TripRemote.hold(
      tripId: tripId,
      skuId: e.bookable.skuId,
      date: RehlaDates.iso(_day),
      timeSlot: time,
      guests: _guests,
      key: '$key-HOLD-0-${e.bookable.skuId}',
    );
    if (!mounted) return;
    if (!hold.ok) {
      _fail(hold);
      if (hold.status == 409) _loadSlots();
      return;
    }
    final user = context.read<UserCubit>().state.model;
    final navigator = Navigator.of(context);
    navigator.pop();
    navigator.push(
      RehlaPageRoute<void>(
        builder: (_) => CheckoutPage(
          order: CheckoutOrder(
            experience: e,
            tripId: tripId!,
            day: _day,
            time: time,
            guests: _guests,
            shownTotal: _total,
            holdToken: hold.map['holdToken'] as String? ?? '',
            heldTotal: hold.map['amountEGP'] as num? ?? _total,
            expiresAt: DateTime.tryParse(hold.map['expiresAt'] as String? ?? '')?.toLocal(),
            attemptKey: key,
            name: user?.getFullName ?? '',
            email: user?.email ?? '',
            phone: _phone.text.trim(),
          ),
        ),
      ),
    );
  }

  void _fail(ApiReply reply) {
    if (!mounted) return;
    setState(() {
      _busy = false;
      _error = reply.unreachable ? Translate.s.auth_server_missing : (reply.message ?? Translate.s.book_failed);
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final signedIn = context.watch<AuthCubit>().state.authorized;
    return Padding(
      padding: EdgeInsetsDirectional.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: ListView(
        shrinkWrap: true,
        padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, AppSpacing.lg, AppSpacing.screenH, AppSpacing.xxl),
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(color: colors.line2, borderRadius: AppRadius.chipAll),
            ),
          ),
          Gaps.vGap18,
          Text(
            Translate.s.book_title,
            style: AppTextStyle.s20_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
          ),
          Gaps.vGap4,
          Text(
            '${e.title(arabic)} · ${e.bookable.supplier(arabic)}',
            maxLines: 2,
            style: AppTextStyle.body(color: colors.text2),
          ),
          Gaps.vGap18,
          _Label(Translate.s.book_date),
          SizedBox(
            height: 74,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _days.length,
              separatorBuilder: (_, _) => Gaps.hGap8,
              itemBuilder: (context, i) {
                final d = _days[i];
                final open = e.openOn(d);
                final selected = d == _day;
                return _DayChip(
                  top: i == 0 ? Translate.s.book_today : (i == 1 ? Translate.s.book_tomorrow : RehlaDates.weekday(d, arabic)),
                  day: '${d.day}',
                  month: RehlaDates.month(d, arabic),
                  selected: selected,
                  enabled: open,
                  onTap: () {
                    setState(() => _day = d);
                    _loadSlots();
                  },
                );
              },
            ),
          ),
          Gaps.vGap18,
          Row(
            children: [
              Expanded(child: _Label(Translate.s.book_guests)),
              _Stepper(
                value: _guests,
                min: 1,
                max: e.bookable.maxPerSlot,
                onChanged: (v) {
                  setState(() => _guests = v);
                  _loadSlots();
                },
              ),
            ],
          ),
          Gaps.vGap18,
          _Label(Translate.s.book_time),
          _slotsBody(context),
          Gaps.vGap18,
          if (signedIn) ...[
            _Label(Translate.s.book_phone),
            TextField(
              controller: _phone,
              keyboardType: TextInputType.phone,
              textDirection: TextDirection.ltr,
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9+ ]'))],
              style: AppTextStyle.s14_w400(color: colors.text),
              decoration: InputDecoration(
                filled: true,
                fillColor: colors.surface1,
                isDense: true,
                contentPadding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.lg),
                prefixIcon: AppIcon.ui(AppIcons.call, size: 18, color: colors.text3),
                border: OutlineInputBorder(borderRadius: AppRadius.buttonAll, borderSide: BorderSide(color: colors.line)),
                enabledBorder: OutlineInputBorder(borderRadius: AppRadius.buttonAll, borderSide: BorderSide(color: colors.line)),
                focusedBorder: OutlineInputBorder(borderRadius: AppRadius.buttonAll, borderSide: BorderSide(color: colors.button)),
              ),
            ),
            Gaps.vGap18,
          ],
          Row(
            children: [
              Text(Translate.s.book_total, style: AppTextStyle.s14_w500(color: colors.text2)),
              const Spacer(),
              if (e.bookable.perPerson)
                Padding(
                  padding: const EdgeInsetsDirectional.only(end: AppSpacing.md),
                  child: Text(
                    '\u2066$_guests × ${AppMoney.egp(e.bookable.priceEgp)}\u2069',
                    style: AppTextStyle.caption(color: colors.text3),
                  ),
                ),
              Text(AppMoney.egp(_total), textDirection: TextDirection.ltr, style: AppTextStyle.price(color: colors.text)),
            ],
          ),
          if (_error != null) ...[
            Gaps.vGap12,
            Text(_error!, style: AppTextStyle.s13_w500(color: colors.red)),
          ],
          Gaps.vGap13,
          FilledButton(
            onPressed: _time == null || _busy ? null : _continue,
            style: FilledButton.styleFrom(
              backgroundColor: colors.button,
              foregroundColor: colors.onButton,
              disabledBackgroundColor: colors.surface3,
              disabledForegroundColor: colors.text3,
              minimumSize: const Size.fromHeight(52),
              shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
              textStyle: AppTextStyle.s16_w500(color: colors.onButton),
            ),
            child: _busy
                ? SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: colors.onButton))
                : Text(signedIn ? Translate.s.book_continue : Translate.s.book_sign_in),
          ),
          Gaps.vGap8,
          Text(Translate.s.book_hold_note, textAlign: TextAlign.center, style: AppTextStyle.caption(color: colors.text3)),
        ],
      ),
    );
  }

  Widget _slotsBody(BuildContext context) {
    final colors = context.colors;
    if (_slotsState == 0) {
      return Padding(
        padding: const EdgeInsetsDirectional.symmetric(vertical: AppSpacing.md),
        child: Text(Translate.s.book_slots_loading, style: AppTextStyle.body(color: colors.text3)),
      );
    }
    if (_slotsState == 2) {
      return Row(
        children: [
          Expanded(child: Text(Translate.s.book_slots_error, style: AppTextStyle.body(color: colors.text2))),
          TextButton(onPressed: _loadSlots, child: Text(Translate.s.book_retry, style: AppTextStyle.s13_w500(color: colors.button))),
        ],
      );
    }
    if (_slots.isEmpty) {
      return Text(Translate.s.book_slots_none, style: AppTextStyle.body(color: colors.text2));
    }
    return Wrap(
      spacing: AppSpacing.sm,
      runSpacing: AppSpacing.sm,
      children: [
        for (final s in _slots)
          _SlotChip(
            time: RehlaDates.slot(s.time),
            note: s.soldOut
                ? Translate.s.book_sold_out
                : _departed(s)
                    ? Translate.s.book_departed
                    : (s.left <= 3 ? Translate.s.book_left(s.left) : null),
            selected: _time == s.time,
            enabled: _selectable(s),
            onTap: () => setState(() => _time = s.time),
          ),
      ],
    );
  }
}

class _Label extends StatelessWidget {
  final String text;

  const _Label(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.sm),
      child: Text(text, style: AppTextStyle.s13_w500(color: context.colors.text2)),
    );
  }
}

class _DayChip extends StatelessWidget {
  final String top;
  final String day;
  final String month;
  final bool selected;
  final bool enabled;
  final VoidCallback onTap;

  const _DayChip({
    required this.top,
    required this.day,
    required this.month,
    required this.selected,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final fg = selected ? colors.onButton : (enabled ? colors.text : colors.text3);
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 62,
        decoration: BoxDecoration(
          color: selected ? colors.button : colors.surface1,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(color: selected ? colors.button : colors.line),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(top, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyle.micro(color: fg)),
            Text(day, style: AppTextStyle.s18_w700(color: fg).copyWith(height: 1.2)),
            Text(month, style: AppTextStyle.micro(color: fg)),
          ],
        ),
      ),
    );
  }
}

class _SlotChip extends StatelessWidget {
  final String time;
  final String? note;
  final bool selected;
  final bool enabled;
  final VoidCallback onTap;

  const _SlotChip({required this.time, required this.note, required this.selected, required this.enabled, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final fg = selected ? colors.onButton : (enabled ? colors.text : colors.text3);
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
        decoration: BoxDecoration(
          color: selected ? colors.button : colors.surface1,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(color: selected ? colors.button : colors.line),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(time, textDirection: TextDirection.ltr, style: AppTextStyle.s14_w600(color: fg)),
            if (note != null)
              Text(note!, style: AppTextStyle.micro(color: selected ? colors.onButton : (enabled ? colors.amber : colors.text3))),
          ],
        ),
      ),
    );
  }
}

class _Stepper extends StatelessWidget {
  final int value;
  final int min;
  final int max;
  final ValueChanged<int> onChanged;

  const _Stepper({required this.value, required this.min, required this.max, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    Widget button(String icon, bool enabled, VoidCallback onTap) => GestureDetector(
          onTap: enabled ? onTap : null,
          child: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: enabled ? colors.line2 : colors.line)),
            child: AppIcon.ui(icon, size: 18, color: enabled ? colors.text : colors.text3),
          ),
        );
    return Row(
      children: [
        button(AppIcons.minus, value > min, () => onChanged(value - 1)),
        SizedBox(width: 44, child: Text('$value', textAlign: TextAlign.center, style: AppTextStyle.s16_w700(color: colors.text))),
        button(AppIcons.plus, value < max, () => onChanged(value + 1)),
      ],
    );
  }
}
