import 'package:rehla/core/models/domain_model/base_domain_model.dart';

/// A measured reading for a destination (GET /api/telemetry/conditions).
/// The strip shows only what was measured: no reading, no strip.
class ConditionsDomainModel extends BaseDomainModel<ConditionsDomainModel> {
  final String destination;

  /// Local clock time of the reading as the server wrote it (HH:mm).
  final String? observedClock;
  final String source;
  final num airTemperatureC;
  final num? waterTemperatureC;
  final num windKnots;
  final String windDirection;

  /// Local sunset (HH:mm).
  final String? sunsetClock;

  const ConditionsDomainModel({
    required this.destination,
    required this.observedClock,
    required this.source,
    required this.airTemperatureC,
    required this.waterTemperatureC,
    required this.windKnots,
    required this.windDirection,
    required this.sunsetClock,
  });
}
