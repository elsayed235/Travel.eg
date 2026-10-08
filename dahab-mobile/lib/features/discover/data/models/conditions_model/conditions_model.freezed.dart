// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'conditions_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ConditionsModel _$ConditionsModelFromJson(Map<String, dynamic> json) {
  return _ConditionsModel.fromJson(json);
}

/// @nodoc
mixin _$ConditionsModel {
  String get destination => throw _privateConstructorUsedError;
  String? get observedAt => throw _privateConstructorUsedError;
  String get source => throw _privateConstructorUsedError;
  num get airTemperatureC => throw _privateConstructorUsedError;
  num? get waterTemperatureC => throw _privateConstructorUsedError;
  num get windKnots => throw _privateConstructorUsedError;
  String get windDirection => throw _privateConstructorUsedError;
  String? get sunset => throw _privateConstructorUsedError;

  /// Serializes this ConditionsModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ConditionsModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ConditionsModelCopyWith<ConditionsModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ConditionsModelCopyWith<$Res> {
  factory $ConditionsModelCopyWith(
    ConditionsModel value,
    $Res Function(ConditionsModel) then,
  ) = _$ConditionsModelCopyWithImpl<$Res, ConditionsModel>;
  @useResult
  $Res call({
    String destination,
    String? observedAt,
    String source,
    num airTemperatureC,
    num? waterTemperatureC,
    num windKnots,
    String windDirection,
    String? sunset,
  });
}

/// @nodoc
class _$ConditionsModelCopyWithImpl<$Res, $Val extends ConditionsModel>
    implements $ConditionsModelCopyWith<$Res> {
  _$ConditionsModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ConditionsModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? destination = null,
    Object? observedAt = freezed,
    Object? source = null,
    Object? airTemperatureC = null,
    Object? waterTemperatureC = freezed,
    Object? windKnots = null,
    Object? windDirection = null,
    Object? sunset = freezed,
  }) {
    return _then(
      _value.copyWith(
            destination: null == destination
                ? _value.destination
                : destination // ignore: cast_nullable_to_non_nullable
                      as String,
            observedAt: freezed == observedAt
                ? _value.observedAt
                : observedAt // ignore: cast_nullable_to_non_nullable
                      as String?,
            source: null == source
                ? _value.source
                : source // ignore: cast_nullable_to_non_nullable
                      as String,
            airTemperatureC: null == airTemperatureC
                ? _value.airTemperatureC
                : airTemperatureC // ignore: cast_nullable_to_non_nullable
                      as num,
            waterTemperatureC: freezed == waterTemperatureC
                ? _value.waterTemperatureC
                : waterTemperatureC // ignore: cast_nullable_to_non_nullable
                      as num?,
            windKnots: null == windKnots
                ? _value.windKnots
                : windKnots // ignore: cast_nullable_to_non_nullable
                      as num,
            windDirection: null == windDirection
                ? _value.windDirection
                : windDirection // ignore: cast_nullable_to_non_nullable
                      as String,
            sunset: freezed == sunset
                ? _value.sunset
                : sunset // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ConditionsModelImplCopyWith<$Res>
    implements $ConditionsModelCopyWith<$Res> {
  factory _$$ConditionsModelImplCopyWith(
    _$ConditionsModelImpl value,
    $Res Function(_$ConditionsModelImpl) then,
  ) = __$$ConditionsModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String destination,
    String? observedAt,
    String source,
    num airTemperatureC,
    num? waterTemperatureC,
    num windKnots,
    String windDirection,
    String? sunset,
  });
}

/// @nodoc
class __$$ConditionsModelImplCopyWithImpl<$Res>
    extends _$ConditionsModelCopyWithImpl<$Res, _$ConditionsModelImpl>
    implements _$$ConditionsModelImplCopyWith<$Res> {
  __$$ConditionsModelImplCopyWithImpl(
    _$ConditionsModelImpl _value,
    $Res Function(_$ConditionsModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ConditionsModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? destination = null,
    Object? observedAt = freezed,
    Object? source = null,
    Object? airTemperatureC = null,
    Object? waterTemperatureC = freezed,
    Object? windKnots = null,
    Object? windDirection = null,
    Object? sunset = freezed,
  }) {
    return _then(
      _$ConditionsModelImpl(
        destination: null == destination
            ? _value.destination
            : destination // ignore: cast_nullable_to_non_nullable
                  as String,
        observedAt: freezed == observedAt
            ? _value.observedAt
            : observedAt // ignore: cast_nullable_to_non_nullable
                  as String?,
        source: null == source
            ? _value.source
            : source // ignore: cast_nullable_to_non_nullable
                  as String,
        airTemperatureC: null == airTemperatureC
            ? _value.airTemperatureC
            : airTemperatureC // ignore: cast_nullable_to_non_nullable
                  as num,
        waterTemperatureC: freezed == waterTemperatureC
            ? _value.waterTemperatureC
            : waterTemperatureC // ignore: cast_nullable_to_non_nullable
                  as num?,
        windKnots: null == windKnots
            ? _value.windKnots
            : windKnots // ignore: cast_nullable_to_non_nullable
                  as num,
        windDirection: null == windDirection
            ? _value.windDirection
            : windDirection // ignore: cast_nullable_to_non_nullable
                  as String,
        sunset: freezed == sunset
            ? _value.sunset
            : sunset // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$ConditionsModelImpl extends _ConditionsModel {
  const _$ConditionsModelImpl({
    required this.destination,
    this.observedAt,
    this.source = '',
    required this.airTemperatureC,
    this.waterTemperatureC,
    required this.windKnots,
    this.windDirection = '',
    this.sunset,
  }) : super._();

  factory _$ConditionsModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ConditionsModelImplFromJson(json);

  @override
  final String destination;
  @override
  final String? observedAt;
  @override
  @JsonKey()
  final String source;
  @override
  final num airTemperatureC;
  @override
  final num? waterTemperatureC;
  @override
  final num windKnots;
  @override
  @JsonKey()
  final String windDirection;
  @override
  final String? sunset;

  @override
  String toString() {
    return 'ConditionsModel(destination: $destination, observedAt: $observedAt, source: $source, airTemperatureC: $airTemperatureC, waterTemperatureC: $waterTemperatureC, windKnots: $windKnots, windDirection: $windDirection, sunset: $sunset)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ConditionsModelImpl &&
            (identical(other.destination, destination) ||
                other.destination == destination) &&
            (identical(other.observedAt, observedAt) ||
                other.observedAt == observedAt) &&
            (identical(other.source, source) || other.source == source) &&
            (identical(other.airTemperatureC, airTemperatureC) ||
                other.airTemperatureC == airTemperatureC) &&
            (identical(other.waterTemperatureC, waterTemperatureC) ||
                other.waterTemperatureC == waterTemperatureC) &&
            (identical(other.windKnots, windKnots) ||
                other.windKnots == windKnots) &&
            (identical(other.windDirection, windDirection) ||
                other.windDirection == windDirection) &&
            (identical(other.sunset, sunset) || other.sunset == sunset));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    destination,
    observedAt,
    source,
    airTemperatureC,
    waterTemperatureC,
    windKnots,
    windDirection,
    sunset,
  );

  /// Create a copy of ConditionsModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ConditionsModelImplCopyWith<_$ConditionsModelImpl> get copyWith =>
      __$$ConditionsModelImplCopyWithImpl<_$ConditionsModelImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ConditionsModelImplToJson(this);
  }
}

abstract class _ConditionsModel extends ConditionsModel {
  const factory _ConditionsModel({
    required final String destination,
    final String? observedAt,
    final String source,
    required final num airTemperatureC,
    final num? waterTemperatureC,
    required final num windKnots,
    final String windDirection,
    final String? sunset,
  }) = _$ConditionsModelImpl;
  const _ConditionsModel._() : super._();

  factory _ConditionsModel.fromJson(Map<String, dynamic> json) =
      _$ConditionsModelImpl.fromJson;

  @override
  String get destination;
  @override
  String? get observedAt;
  @override
  String get source;
  @override
  num get airTemperatureC;
  @override
  num? get waterTemperatureC;
  @override
  num get windKnots;
  @override
  String get windDirection;
  @override
  String? get sunset;

  /// Create a copy of ConditionsModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ConditionsModelImplCopyWith<_$ConditionsModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
