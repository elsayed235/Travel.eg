// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'conditions_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ConditionsModelImpl _$$ConditionsModelImplFromJson(
  Map<String, dynamic> json,
) => _$ConditionsModelImpl(
  destination: json['destination'] as String,
  observedAt: json['observedAt'] as String?,
  source: json['source'] as String? ?? '',
  airTemperatureC: json['airTemperatureC'] as num,
  waterTemperatureC: json['waterTemperatureC'] as num?,
  windKnots: json['windKnots'] as num,
  windDirection: json['windDirection'] as String? ?? '',
  sunset: json['sunset'] as String?,
);

Map<String, dynamic> _$$ConditionsModelImplToJson(
  _$ConditionsModelImpl instance,
) => <String, dynamic>{
  'destination': instance.destination,
  'observedAt': instance.observedAt,
  'source': instance.source,
  'airTemperatureC': instance.airTemperatureC,
  'waterTemperatureC': instance.waterTemperatureC,
  'windKnots': instance.windKnots,
  'windDirection': instance.windDirection,
  'sunset': instance.sunset,
};
