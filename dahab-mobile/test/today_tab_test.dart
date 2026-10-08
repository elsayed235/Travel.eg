import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/colors/rehla_palettes.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/trip/data/trip_remote.dart';
import 'package:rehla/features/trip/domain/models/trip_booking.dart';
import 'package:rehla/features/trip/domain/trip_store.dart';
import 'package:rehla/features/trip/presentation/trip_imports.dart';

TripBooking _booking({required DateTime at, required String state, String driver = '', String code = ''}) {
  String two(int v) => v.toString().padLeft(2, '0');
  return TripBooking.fromJson({
    'id': 'BK-1',
    'bookingRef': 'REF-1',
    'tripId': 'TRIP-1',
    'skuId': 'SKU-NONE',
    'serviceType': 'activity',
    'title': 'Eel Garden Sunset Snorkel',
    'amountEGP': 900,
    'paymentState': 'PENDING',
    'supplierState': state,
    'passengersCount': 2,
    'pickupLocation': 'Lighthouse',
    'scheduledDate': '${at.year}-${two(at.month)}-${two(at.day)}',
    'scheduledTime': '${two(at.hour)}:${two(at.minute)}',
    'confirmationCode': code,
    'assignedResource': {'driverName': driver, 'vehicleModel': 'Toyota Hiace', 'vehiclePlate': 'ج ن ب 4821', 'driverPhone': '+201000000000'},
  });
}

Widget _host(Widget child) {
  const d = RehlaDestination.dahab;
  return MaterialApp(
    theme: ThemeData(extensions: [RehlaColorsExtension(RehlaPalettes.of(d, Brightness.light), d)]),
    home: Scaffold(body: child),
  );
}

void main() {
  setUpAll(() => Translate.initForTest());

  tearDown(() => TripStore.instance.bundleObs.setValue(null));

  testWidgets('on a trip day the tab is Today: next outing, driver, timeline, voucher', (tester) async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    TripStore.instance.bundleObs.setValue(
      TripBundle(
        trip: ServerTrip(
          id: 'TRIP-1',
          title: 'Dahab',
          status: 'PLANNED',
          start: today.subtract(const Duration(days: 1)),
          end: today.add(const Duration(days: 3)),
          lengthDays: 5,
        ),
        bookings: [_booking(at: now.add(const Duration(hours: 2)), state: 'ASSIGNED', driver: 'Ahmed', code: 'RH-7731')],
      ),
    );
    final controller = TodayController();
    await tester.pumpWidget(_host(TripTab(controller: controller, fallback: const Text('fallback'))));
    await tester.pump();

    expect(find.text(Translate.s.today_title), findsOneWidget);
    expect(find.textContaining(Translate.s.today_day_of(2, 5).toUpperCase()), findsOneWidget);
    expect(find.text('Eel Garden Sunset Snorkel'), findsOneWidget);
    expect(find.text('Ahmed'), findsOneWidget);
    expect(find.text('ج ن ب 4821'), findsOneWidget);
    expect(find.text(Translate.s.today_step_driver), findsOneWidget);
    expect(find.text('RH-7731'), findsOneWidget);
    expect(find.text(Translate.s.today_voucher_offline), findsOneWidget);
    expect(find.text('fallback'), findsNothing);
    controller.dispose();
  });

  testWidgets('before the operator confirms, says so instead of a timeline', (tester) async {
    final now = DateTime.now();
    final start = DateTime(now.year, now.month, now.day).add(const Duration(days: 4));
    TripStore.instance.bundleObs.setValue(
      TripBundle(
        trip: ServerTrip(id: 'TRIP-1', title: 'Dahab', status: 'PLANNED', start: start, end: start.add(const Duration(days: 2)), lengthDays: 3),
        bookings: [_booking(at: start.add(const Duration(hours: 9)), state: 'PENDING')],
      ),
    );
    final controller = TodayController();
    await tester.pumpWidget(_host(TripTab(controller: controller, fallback: const Text('fallback'))));
    await tester.pump();

    expect(find.text(Translate.s.trip_days_to_go(4)), findsOneWidget);
    expect(find.text(Translate.s.today_waiting_operator), findsOneWidget);
    expect(find.text(Translate.s.today_step_driver), findsNothing);
    expect(find.text('REF-1'), findsOneWidget);
    controller.dispose();
  });

  testWidgets('without a booked trip the fallback shows', (tester) async {
    final controller = TodayController();
    await tester.pumpWidget(_host(TripTab(controller: controller, fallback: const Text('fallback'))));
    expect(find.text('fallback'), findsOneWidget);
    controller.dispose();
  });
}
