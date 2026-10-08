// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:rehla/core/models/api_model/base_api_model.dart';
import 'package:rehla/features/discover/domain/models/conditions_domain_model.dart';

part 'conditions_model.freezed.dart';
part 'conditions_model.g.dart';

@freezed
class ConditionsModel extends BaseApiModel<ConditionsDomainModel> with _$ConditionsModel {
  const ConditionsModel._();

  @JsonSerializable(explicitToJson: true)
  const factory ConditionsModel({
    required String destination,
    String? observedAt,
    @Default('') String source,
    required num airTemperatureC,
    num? waterTemperatureC,
    required num windKnots,
    @Default('') String windDirection,
    String? sunset,
  }) = _ConditionsModel;

  factory ConditionsModel.fromJson(Map<String, dynamic> json) => _$ConditionsModelFromJson(json);

  /// HH:mm for display. An instant (`…Z` or with an offset, like
  /// `observedAt`) is shown on the phone's clock; a bare wall time (like
  /// `sunset`, already the place's local time) is shown as written.
  static String? _clock(String? iso) {
    if (iso == null || iso.length < 16) return null;
    final isInstant = iso.endsWith('Z') || RegExp(r'[+-]\d{2}:?\d{2}$').hasMatch(iso.substring(16));
    if (!isInstant) return iso.substring(11, 16);
    final t = DateTime.tryParse(iso)?.toLocal();
    if (t == null) return null;
    return '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
  }

  @override
  ConditionsDomainModel toDomainModel() => ConditionsDomainModel(
    destination: destination,
    observedClock: _clock(observedAt),
    source: source,
    airTemperatureC: airTemperatureC,
    waterTemperatureC: waterTemperatureC,
    windKnots: windKnots,
    windDirection: windDirection,
    sunsetClock: _clock(sunset),
  );
}
