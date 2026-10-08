import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/features/trip/data/trip_remote.dart';
import 'package:rehla/features/trip/domain/models/trip_booking.dart';

/// The traveler's booked trip, shared by Home ("3 days to your trip") and the
/// Trip tab, which turns into "Today" once the trip is under way.
class TripStore {
  TripStore._();

  static final TripStore instance = TripStore._();

  final ObsValue<TripBundle?> bundleObs = ObsValue.withInit(null);
  final ObsValue<bool> loadingObs = ObsValue.withInit(false);

  String? _userId;

  TripBundle? get bundle => bundleObs.getValue();

  /// Days until the first day, when the trip has not started.
  int? daysToGo(DateTime now) {
    final start = bundle?.trip.start;
    if (start == null) return null;
    final today = DateTime(now.year, now.month, now.day);
    final d = start.difference(today).inDays;
    return d > 0 ? d : null;
  }

  int? dayToday(DateTime now) => bundle?.trip.dayOf(now);

  Future<void> load(String? userId) async {
    if (userId == null || userId.isEmpty) {
      _userId = null;
      bundleObs.setValue(null);
      await TripRemote.cache(null);
      return;
    }
    if (_userId != userId) {
      _userId = userId;
      final cached = await TripRemote.cached();
      if (cached != null) bundleObs.setValue(cached);
    }
    await refresh();
  }

  Future<void> refresh() async {
    final userId = _userId;
    if (userId == null) return;
    loadingObs.setValue(true);
    final trips = await TripRemote.myTrips(userId);
    if (trips == null) {
      loadingObs.setValue(false);
      return;
    }
    final trip = _pick(trips);
    if (trip == null) {
      bundleObs.setValue(null);
      await TripRemote.cache(null);
      loadingObs.setValue(false);
      return;
    }
    final bookings = await TripRemote.bookings(trip.id);
    if (bookings != null) {
      bookings.sort((a, b) => (a.startsAt ?? DateTime(9999)).compareTo(b.startsAt ?? DateTime(9999)));
      final next = TripBundle(trip: trip, bookings: bookings.where((b) => !b.cancelled).toList());
      bundleObs.setValue(next);
      await TripRemote.cache(next);
    }
    loadingObs.setValue(false);
  }

  /// Under way today first, then the nearest one ahead, then the latest.
  ServerTrip? _pick(List<ServerTrip> trips) {
    final now = DateTime.now();
    final live = trips.where((t) => t.live).toList();
    if (live.isEmpty) return null;
    for (final t in live) {
      if (t.dayOf(now) != null) return t;
    }
    final today = DateTime(now.year, now.month, now.day);
    final ahead = live.where((t) => t.start != null && !t.start!.isBefore(today)).toList()
      ..sort((a, b) => a.start!.compareTo(b.start!));
    if (ahead.isNotEmpty) return ahead.first;
    return null;
  }
}
