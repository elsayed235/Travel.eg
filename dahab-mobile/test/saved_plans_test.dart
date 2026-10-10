import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';
import 'package:rehla/features/plan/domain/models/kept_trip.dart';
import 'package:rehla/features/plan/presentation/pages/plan/plan_imports.dart';
import 'package:shared_preferences/shared_preferences.dart';

KeptTrip _trip(String id, {bool sent = false}) => KeptTrip(
  id: id,
  destination: RehlaDestination.dahab,
  titleEn: 'Plan $id',
  titleAr: 'خطة $id',
  taglineEn: '',
  taglineAr: '',
  durationDays: 3,
  startingPriceEgp: 1000,
  priceIsEstimate: true,
  heroImage: '',
  days: const [],
  sent: sent,
);

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('saving keeps every plan, newest first, and survives a restart', () async {
    SharedPreferences.setMockInitialValues({});
    final controller = PlanController();
    await controller.toggleSaved(_trip('a').toProgramme());
    await controller.toggleSaved(_trip('b').toProgramme());
    expect(controller.savedObs.getValue().map((t) => t.id), ['b', 'a']);
    expect(controller.justSavedObs.getValue()?.id, 'b');

    final again = PlanController();
    await again.loadPlans();
    expect(again.savedObs.getValue().map((t) => t.id), ['b', 'a']);
    controller.dispose();
    again.dispose();
  });

  test('saving a saved plan again removes it', () async {
    SharedPreferences.setMockInitialValues({});
    final controller = PlanController();
    await controller.toggleSaved(_trip('a').toProgramme());
    await controller.toggleSaved(_trip('a').toProgramme());
    expect(controller.savedObs.getValue(), isEmpty);
    expect(controller.justSavedObs.getValue(), isNull);
    controller.dispose();
  });

  test('the single plan kept by earlier builds joins the list', () async {
    SharedPreferences.setMockInitialValues({'rehla_trip_v1': jsonEncode(_trip('old', sent: true).toJson())});
    final controller = PlanController();
    await controller.loadPlans();
    final saved = controller.savedObs.getValue();
    expect(saved.map((t) => t.id), ['old']);
    expect(saved.single.sent, isTrue);
    final prefs = await SharedPreferences.getInstance();
    expect(prefs.getString('rehla_trip_v1'), isNull);
    expect(prefs.getString('rehla_plans_v1'), isNotNull);
    controller.dispose();
  });
}
