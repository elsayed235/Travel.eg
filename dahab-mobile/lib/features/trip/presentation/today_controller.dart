part of 'trip_imports.dart';

/// A wind move DayGi can offer: the same outing at a departure the operator
/// actually runs, on a day the trip covers.
class WindMove {
  final TripBooking booking;
  final Experience experience;
  final DateTime day;
  final String slot;

  const WindMove({required this.booking, required this.experience, required this.day, required this.slot});
}

class TodayController {
  /// Ticks every 30 s so countdowns stay true without a rebuild per second.
  final ObsValue<DateTime> nowObs = ObsValue.withInit(DateTime.now());
  final ObsValue<List<EmergencyLine>> emergencyObs = ObsValue.withInit(const []);
  final ObsValue<String?> movingObs = ObsValue.withInit(null);
  final ObsValue<Map<String, (bool, String)>> moveResultObs = ObsValue.withInit(const {});
  Timer? _ticker;

  void init() {
    _ticker = Timer.periodic(const Duration(seconds: 30), (_) => nowObs.setValue(DateTime.now()));
    TripRemote.emergency().then(emergencyObs.setValue);
  }

  /// The next booking that has not started yet (or is under way right now).
  TripBooking? next(TripBundle bundle, DateTime now) {
    for (final b in bundle.bookings) {
      final at = b.startsAt;
      if (at == null) continue;
      if (at.isAfter(now.subtract(const Duration(hours: 1)))) return b;
    }
    return null;
  }

  /// A booking in the next two days whose operator limit is under the live
  /// wind, and the operator's earliest departure tomorrow inside the trip.
  WindMove? windMove(TripBundle bundle, DateTime now) {
    final live = ExperienceCatalogue.instance.live;
    if (live == null) return null;
    final catalogue = ExperienceCatalogue.instance;
    final trip = bundle.trip;
    for (final b in bundle.bookings) {
      final at = b.startsAt;
      if (at == null || at.isBefore(now) || at.difference(now).inHours > 36) continue;
      final e = catalogue.bySku(b.skuId);
      if (e == null || e.windOk(live.windKnots)) continue;
      final day = RehlaDates.dateOnly(at).add(const Duration(days: 1));
      final last = trip.end ?? trip.start?.add(Duration(days: trip.days - 1));
      if (last != null && day.isAfter(last)) return WindMove(booking: b, experience: e, day: day, slot: '');
      if (!e.openOn(day) || e.bookable.timeSlots.isEmpty) return WindMove(booking: b, experience: e, day: day, slot: '');
      final slots = [...e.bookable.timeSlots]
        ..sort((x, y) => (ExperienceBookable.slotMinutes(x) ?? 0).compareTo(ExperienceBookable.slotMinutes(y) ?? 0));
      return WindMove(booking: b, experience: e, day: day, slot: slots.first);
    }
    return null;
  }

  Future<void> move(WindMove m) async {
    if (m.slot.isEmpty || movingObs.getValue() != null) return;
    movingObs.setValue(m.booking.id);
    final reply = await TripRemote.reschedule(
      bookingId: m.booking.id,
      tripId: m.booking.tripId,
      date: RehlaDates.iso(m.day),
      time: m.slot,
    );
    final results = {...moveResultObs.getValue()};
    results[m.booking.id] = reply.ok
        ? (true, Translate.s.today_moved(RehlaDates.slot(m.slot)))
        : (false, (reply.message ?? '').isNotEmpty ? reply.message! : Translate.s.today_move_failed);
    moveResultObs.setValue(results);
    movingObs.setValue(null);
    if (reply.ok) await TripStore.instance.refresh();
  }

  Future<void> call(String raw) async {
    final number = raw.split('/').first.replaceAll(RegExp(r'[^\d+]'), '');
    if (number.isEmpty) return;
    await launchUrl(Uri(scheme: 'tel', path: number));
  }

  void dispose() => _ticker?.cancel();
}
