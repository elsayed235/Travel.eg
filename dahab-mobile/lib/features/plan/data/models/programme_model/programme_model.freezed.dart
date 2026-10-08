// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'programme_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ProgrammeDayModel _$ProgrammeDayModelFromJson(Map<String, dynamic> json) {
  return _ProgrammeDayModel.fromJson(json);
}

/// @nodoc
mixin _$ProgrammeDayModel {
  int get day => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String? get titleAr => throw _privateConstructorUsedError;
  String get subtitle => throw _privateConstructorUsedError;
  String? get subtitleAr => throw _privateConstructorUsedError;
  List<String> get highlights => throw _privateConstructorUsedError;
  List<String>? get highlightsAr => throw _privateConstructorUsedError;
  String get timeEstimate => throw _privateConstructorUsedError;

  /// Serializes this ProgrammeDayModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProgrammeDayModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProgrammeDayModelCopyWith<ProgrammeDayModel> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProgrammeDayModelCopyWith<$Res> {
  factory $ProgrammeDayModelCopyWith(ProgrammeDayModel value, $Res Function(ProgrammeDayModel) then) =
      _$ProgrammeDayModelCopyWithImpl<$Res, ProgrammeDayModel>;
  @useResult
  $Res call({
    int day,
    String title,
    String? titleAr,
    String subtitle,
    String? subtitleAr,
    List<String> highlights,
    List<String>? highlightsAr,
    String timeEstimate,
  });
}

/// @nodoc
class _$ProgrammeDayModelCopyWithImpl<$Res, $Val extends ProgrammeDayModel>
    implements $ProgrammeDayModelCopyWith<$Res> {
  _$ProgrammeDayModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProgrammeDayModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? day = null,
    Object? title = null,
    Object? titleAr = freezed,
    Object? subtitle = null,
    Object? subtitleAr = freezed,
    Object? highlights = null,
    Object? highlightsAr = freezed,
    Object? timeEstimate = null,
  }) {
    return _then(
      _value.copyWith(
            day: null == day
                ? _value.day
                : day // ignore: cast_nullable_to_non_nullable
                      as int,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            titleAr: freezed == titleAr
                ? _value.titleAr
                : titleAr // ignore: cast_nullable_to_non_nullable
                      as String?,
            subtitle: null == subtitle
                ? _value.subtitle
                : subtitle // ignore: cast_nullable_to_non_nullable
                      as String,
            subtitleAr: freezed == subtitleAr
                ? _value.subtitleAr
                : subtitleAr // ignore: cast_nullable_to_non_nullable
                      as String?,
            highlights: null == highlights
                ? _value.highlights
                : highlights // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            highlightsAr: freezed == highlightsAr
                ? _value.highlightsAr
                : highlightsAr // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            timeEstimate: null == timeEstimate
                ? _value.timeEstimate
                : timeEstimate // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ProgrammeDayModelImplCopyWith<$Res> implements $ProgrammeDayModelCopyWith<$Res> {
  factory _$$ProgrammeDayModelImplCopyWith(_$ProgrammeDayModelImpl value, $Res Function(_$ProgrammeDayModelImpl) then) =
      __$$ProgrammeDayModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int day,
    String title,
    String? titleAr,
    String subtitle,
    String? subtitleAr,
    List<String> highlights,
    List<String>? highlightsAr,
    String timeEstimate,
  });
}

/// @nodoc
class __$$ProgrammeDayModelImplCopyWithImpl<$Res> extends _$ProgrammeDayModelCopyWithImpl<$Res, _$ProgrammeDayModelImpl>
    implements _$$ProgrammeDayModelImplCopyWith<$Res> {
  __$$ProgrammeDayModelImplCopyWithImpl(_$ProgrammeDayModelImpl _value, $Res Function(_$ProgrammeDayModelImpl) _then)
    : super(_value, _then);

  /// Create a copy of ProgrammeDayModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? day = null,
    Object? title = null,
    Object? titleAr = freezed,
    Object? subtitle = null,
    Object? subtitleAr = freezed,
    Object? highlights = null,
    Object? highlightsAr = freezed,
    Object? timeEstimate = null,
  }) {
    return _then(
      _$ProgrammeDayModelImpl(
        day: null == day
            ? _value.day
            : day // ignore: cast_nullable_to_non_nullable
                  as int,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        titleAr: freezed == titleAr
            ? _value.titleAr
            : titleAr // ignore: cast_nullable_to_non_nullable
                  as String?,
        subtitle: null == subtitle
            ? _value.subtitle
            : subtitle // ignore: cast_nullable_to_non_nullable
                  as String,
        subtitleAr: freezed == subtitleAr
            ? _value.subtitleAr
            : subtitleAr // ignore: cast_nullable_to_non_nullable
                  as String?,
        highlights: null == highlights
            ? _value._highlights
            : highlights // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        highlightsAr: freezed == highlightsAr
            ? _value._highlightsAr
            : highlightsAr // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        timeEstimate: null == timeEstimate
            ? _value.timeEstimate
            : timeEstimate // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$ProgrammeDayModelImpl extends _ProgrammeDayModel {
  const _$ProgrammeDayModelImpl({
    required this.day,
    this.title = '',
    this.titleAr,
    this.subtitle = '',
    this.subtitleAr,
    final List<String> highlights = const [],
    final List<String>? highlightsAr,
    this.timeEstimate = '',
  }) : _highlights = highlights,
       _highlightsAr = highlightsAr,
       super._();

  factory _$ProgrammeDayModelImpl.fromJson(Map<String, dynamic> json) => _$$ProgrammeDayModelImplFromJson(json);

  @override
  final int day;
  @override
  @JsonKey()
  final String title;
  @override
  final String? titleAr;
  @override
  @JsonKey()
  final String subtitle;
  @override
  final String? subtitleAr;
  final List<String> _highlights;
  @override
  @JsonKey()
  List<String> get highlights {
    if (_highlights is EqualUnmodifiableListView) return _highlights;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_highlights);
  }

  final List<String>? _highlightsAr;
  @override
  List<String>? get highlightsAr {
    final value = _highlightsAr;
    if (value == null) return null;
    if (_highlightsAr is EqualUnmodifiableListView) return _highlightsAr;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  @JsonKey()
  final String timeEstimate;

  @override
  String toString() {
    return 'ProgrammeDayModel(day: $day, title: $title, titleAr: $titleAr, subtitle: $subtitle, subtitleAr: $subtitleAr, highlights: $highlights, highlightsAr: $highlightsAr, timeEstimate: $timeEstimate)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProgrammeDayModelImpl &&
            (identical(other.day, day) || other.day == day) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.titleAr, titleAr) || other.titleAr == titleAr) &&
            (identical(other.subtitle, subtitle) || other.subtitle == subtitle) &&
            (identical(other.subtitleAr, subtitleAr) || other.subtitleAr == subtitleAr) &&
            const DeepCollectionEquality().equals(other._highlights, _highlights) &&
            const DeepCollectionEquality().equals(other._highlightsAr, _highlightsAr) &&
            (identical(other.timeEstimate, timeEstimate) || other.timeEstimate == timeEstimate));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    day,
    title,
    titleAr,
    subtitle,
    subtitleAr,
    const DeepCollectionEquality().hash(_highlights),
    const DeepCollectionEquality().hash(_highlightsAr),
    timeEstimate,
  );

  /// Create a copy of ProgrammeDayModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProgrammeDayModelImplCopyWith<_$ProgrammeDayModelImpl> get copyWith =>
      __$$ProgrammeDayModelImplCopyWithImpl<_$ProgrammeDayModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProgrammeDayModelImplToJson(this);
  }
}

abstract class _ProgrammeDayModel extends ProgrammeDayModel {
  const factory _ProgrammeDayModel({
    required final int day,
    final String title,
    final String? titleAr,
    final String subtitle,
    final String? subtitleAr,
    final List<String> highlights,
    final List<String>? highlightsAr,
    final String timeEstimate,
  }) = _$ProgrammeDayModelImpl;
  const _ProgrammeDayModel._() : super._();

  factory _ProgrammeDayModel.fromJson(Map<String, dynamic> json) = _$ProgrammeDayModelImpl.fromJson;

  @override
  int get day;
  @override
  String get title;
  @override
  String? get titleAr;
  @override
  String get subtitle;
  @override
  String? get subtitleAr;
  @override
  List<String> get highlights;
  @override
  List<String>? get highlightsAr;
  @override
  String get timeEstimate;

  /// Create a copy of ProgrammeDayModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProgrammeDayModelImplCopyWith<_$ProgrammeDayModelImpl> get copyWith => throw _privateConstructorUsedError;
}

ProgrammeModel _$ProgrammeModelFromJson(Map<String, dynamic> json) {
  return _ProgrammeModel.fromJson(json);
}

/// @nodoc
mixin _$ProgrammeModel {
  String get id => throw _privateConstructorUsedError;
  String? get destination => throw _privateConstructorUsedError;
  bool get priceIsEstimate => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get titleAr => throw _privateConstructorUsedError;
  String get tagline => throw _privateConstructorUsedError;
  String get taglineAr => throw _privateConstructorUsedError;
  int get durationDays => throw _privateConstructorUsedError;
  String get idealFor => throw _privateConstructorUsedError;
  String? get pace => throw _privateConstructorUsedError;
  int get intensityScore => throw _privateConstructorUsedError;
  int get freeTimeScore => throw _privateConstructorUsedError;
  num get startingPriceEGP => throw _privateConstructorUsedError;
  String get heroImage => throw _privateConstructorUsedError;
  String get badge => throw _privateConstructorUsedError;
  String get badgeAr => throw _privateConstructorUsedError;
  List<String> get highlights => throw _privateConstructorUsedError;
  List<String> get highlightsAr => throw _privateConstructorUsedError;
  List<String> get includedItems => throw _privateConstructorUsedError;
  List<String> get includedItemsAr => throw _privateConstructorUsedError;
  List<String> get defaultInterests => throw _privateConstructorUsedError;
  String? get defaultBudget => throw _privateConstructorUsedError;
  List<ProgrammeDayModel> get dayByDay => throw _privateConstructorUsedError;

  /// Serializes this ProgrammeModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProgrammeModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProgrammeModelCopyWith<ProgrammeModel> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProgrammeModelCopyWith<$Res> {
  factory $ProgrammeModelCopyWith(ProgrammeModel value, $Res Function(ProgrammeModel) then) =
      _$ProgrammeModelCopyWithImpl<$Res, ProgrammeModel>;
  @useResult
  $Res call({
    String id,
    String? destination,
    bool priceIsEstimate,
    String title,
    String titleAr,
    String tagline,
    String taglineAr,
    int durationDays,
    String idealFor,
    String? pace,
    int intensityScore,
    int freeTimeScore,
    num startingPriceEGP,
    String heroImage,
    String badge,
    String badgeAr,
    List<String> highlights,
    List<String> highlightsAr,
    List<String> includedItems,
    List<String> includedItemsAr,
    List<String> defaultInterests,
    String? defaultBudget,
    List<ProgrammeDayModel> dayByDay,
  });
}

/// @nodoc
class _$ProgrammeModelCopyWithImpl<$Res, $Val extends ProgrammeModel> implements $ProgrammeModelCopyWith<$Res> {
  _$ProgrammeModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProgrammeModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? destination = freezed,
    Object? priceIsEstimate = null,
    Object? title = null,
    Object? titleAr = null,
    Object? tagline = null,
    Object? taglineAr = null,
    Object? durationDays = null,
    Object? idealFor = null,
    Object? pace = freezed,
    Object? intensityScore = null,
    Object? freeTimeScore = null,
    Object? startingPriceEGP = null,
    Object? heroImage = null,
    Object? badge = null,
    Object? badgeAr = null,
    Object? highlights = null,
    Object? highlightsAr = null,
    Object? includedItems = null,
    Object? includedItemsAr = null,
    Object? defaultInterests = null,
    Object? defaultBudget = freezed,
    Object? dayByDay = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            destination: freezed == destination
                ? _value.destination
                : destination // ignore: cast_nullable_to_non_nullable
                      as String?,
            priceIsEstimate: null == priceIsEstimate
                ? _value.priceIsEstimate
                : priceIsEstimate // ignore: cast_nullable_to_non_nullable
                      as bool,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            titleAr: null == titleAr
                ? _value.titleAr
                : titleAr // ignore: cast_nullable_to_non_nullable
                      as String,
            tagline: null == tagline
                ? _value.tagline
                : tagline // ignore: cast_nullable_to_non_nullable
                      as String,
            taglineAr: null == taglineAr
                ? _value.taglineAr
                : taglineAr // ignore: cast_nullable_to_non_nullable
                      as String,
            durationDays: null == durationDays
                ? _value.durationDays
                : durationDays // ignore: cast_nullable_to_non_nullable
                      as int,
            idealFor: null == idealFor
                ? _value.idealFor
                : idealFor // ignore: cast_nullable_to_non_nullable
                      as String,
            pace: freezed == pace
                ? _value.pace
                : pace // ignore: cast_nullable_to_non_nullable
                      as String?,
            intensityScore: null == intensityScore
                ? _value.intensityScore
                : intensityScore // ignore: cast_nullable_to_non_nullable
                      as int,
            freeTimeScore: null == freeTimeScore
                ? _value.freeTimeScore
                : freeTimeScore // ignore: cast_nullable_to_non_nullable
                      as int,
            startingPriceEGP: null == startingPriceEGP
                ? _value.startingPriceEGP
                : startingPriceEGP // ignore: cast_nullable_to_non_nullable
                      as num,
            heroImage: null == heroImage
                ? _value.heroImage
                : heroImage // ignore: cast_nullable_to_non_nullable
                      as String,
            badge: null == badge
                ? _value.badge
                : badge // ignore: cast_nullable_to_non_nullable
                      as String,
            badgeAr: null == badgeAr
                ? _value.badgeAr
                : badgeAr // ignore: cast_nullable_to_non_nullable
                      as String,
            highlights: null == highlights
                ? _value.highlights
                : highlights // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            highlightsAr: null == highlightsAr
                ? _value.highlightsAr
                : highlightsAr // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            includedItems: null == includedItems
                ? _value.includedItems
                : includedItems // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            includedItemsAr: null == includedItemsAr
                ? _value.includedItemsAr
                : includedItemsAr // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            defaultInterests: null == defaultInterests
                ? _value.defaultInterests
                : defaultInterests // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            defaultBudget: freezed == defaultBudget
                ? _value.defaultBudget
                : defaultBudget // ignore: cast_nullable_to_non_nullable
                      as String?,
            dayByDay: null == dayByDay
                ? _value.dayByDay
                : dayByDay // ignore: cast_nullable_to_non_nullable
                      as List<ProgrammeDayModel>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ProgrammeModelImplCopyWith<$Res> implements $ProgrammeModelCopyWith<$Res> {
  factory _$$ProgrammeModelImplCopyWith(_$ProgrammeModelImpl value, $Res Function(_$ProgrammeModelImpl) then) =
      __$$ProgrammeModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String? destination,
    bool priceIsEstimate,
    String title,
    String titleAr,
    String tagline,
    String taglineAr,
    int durationDays,
    String idealFor,
    String? pace,
    int intensityScore,
    int freeTimeScore,
    num startingPriceEGP,
    String heroImage,
    String badge,
    String badgeAr,
    List<String> highlights,
    List<String> highlightsAr,
    List<String> includedItems,
    List<String> includedItemsAr,
    List<String> defaultInterests,
    String? defaultBudget,
    List<ProgrammeDayModel> dayByDay,
  });
}

/// @nodoc
class __$$ProgrammeModelImplCopyWithImpl<$Res> extends _$ProgrammeModelCopyWithImpl<$Res, _$ProgrammeModelImpl>
    implements _$$ProgrammeModelImplCopyWith<$Res> {
  __$$ProgrammeModelImplCopyWithImpl(_$ProgrammeModelImpl _value, $Res Function(_$ProgrammeModelImpl) _then)
    : super(_value, _then);

  /// Create a copy of ProgrammeModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? destination = freezed,
    Object? priceIsEstimate = null,
    Object? title = null,
    Object? titleAr = null,
    Object? tagline = null,
    Object? taglineAr = null,
    Object? durationDays = null,
    Object? idealFor = null,
    Object? pace = freezed,
    Object? intensityScore = null,
    Object? freeTimeScore = null,
    Object? startingPriceEGP = null,
    Object? heroImage = null,
    Object? badge = null,
    Object? badgeAr = null,
    Object? highlights = null,
    Object? highlightsAr = null,
    Object? includedItems = null,
    Object? includedItemsAr = null,
    Object? defaultInterests = null,
    Object? defaultBudget = freezed,
    Object? dayByDay = null,
  }) {
    return _then(
      _$ProgrammeModelImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        destination: freezed == destination
            ? _value.destination
            : destination // ignore: cast_nullable_to_non_nullable
                  as String?,
        priceIsEstimate: null == priceIsEstimate
            ? _value.priceIsEstimate
            : priceIsEstimate // ignore: cast_nullable_to_non_nullable
                  as bool,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        titleAr: null == titleAr
            ? _value.titleAr
            : titleAr // ignore: cast_nullable_to_non_nullable
                  as String,
        tagline: null == tagline
            ? _value.tagline
            : tagline // ignore: cast_nullable_to_non_nullable
                  as String,
        taglineAr: null == taglineAr
            ? _value.taglineAr
            : taglineAr // ignore: cast_nullable_to_non_nullable
                  as String,
        durationDays: null == durationDays
            ? _value.durationDays
            : durationDays // ignore: cast_nullable_to_non_nullable
                  as int,
        idealFor: null == idealFor
            ? _value.idealFor
            : idealFor // ignore: cast_nullable_to_non_nullable
                  as String,
        pace: freezed == pace
            ? _value.pace
            : pace // ignore: cast_nullable_to_non_nullable
                  as String?,
        intensityScore: null == intensityScore
            ? _value.intensityScore
            : intensityScore // ignore: cast_nullable_to_non_nullable
                  as int,
        freeTimeScore: null == freeTimeScore
            ? _value.freeTimeScore
            : freeTimeScore // ignore: cast_nullable_to_non_nullable
                  as int,
        startingPriceEGP: null == startingPriceEGP
            ? _value.startingPriceEGP
            : startingPriceEGP // ignore: cast_nullable_to_non_nullable
                  as num,
        heroImage: null == heroImage
            ? _value.heroImage
            : heroImage // ignore: cast_nullable_to_non_nullable
                  as String,
        badge: null == badge
            ? _value.badge
            : badge // ignore: cast_nullable_to_non_nullable
                  as String,
        badgeAr: null == badgeAr
            ? _value.badgeAr
            : badgeAr // ignore: cast_nullable_to_non_nullable
                  as String,
        highlights: null == highlights
            ? _value._highlights
            : highlights // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        highlightsAr: null == highlightsAr
            ? _value._highlightsAr
            : highlightsAr // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        includedItems: null == includedItems
            ? _value._includedItems
            : includedItems // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        includedItemsAr: null == includedItemsAr
            ? _value._includedItemsAr
            : includedItemsAr // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        defaultInterests: null == defaultInterests
            ? _value._defaultInterests
            : defaultInterests // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        defaultBudget: freezed == defaultBudget
            ? _value.defaultBudget
            : defaultBudget // ignore: cast_nullable_to_non_nullable
                  as String?,
        dayByDay: null == dayByDay
            ? _value._dayByDay
            : dayByDay // ignore: cast_nullable_to_non_nullable
                  as List<ProgrammeDayModel>,
      ),
    );
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$ProgrammeModelImpl extends _ProgrammeModel {
  const _$ProgrammeModelImpl({
    required this.id,
    this.destination,
    this.priceIsEstimate = false,
    this.title = '',
    this.titleAr = '',
    this.tagline = '',
    this.taglineAr = '',
    this.durationDays = 1,
    this.idealFor = '',
    this.pace,
    this.intensityScore = 3,
    this.freeTimeScore = 0,
    this.startingPriceEGP = 0,
    this.heroImage = '',
    this.badge = '',
    this.badgeAr = '',
    final List<String> highlights = const [],
    final List<String> highlightsAr = const [],
    final List<String> includedItems = const [],
    final List<String> includedItemsAr = const [],
    final List<String> defaultInterests = const [],
    this.defaultBudget,
    final List<ProgrammeDayModel> dayByDay = const [],
  }) : _highlights = highlights,
       _highlightsAr = highlightsAr,
       _includedItems = includedItems,
       _includedItemsAr = includedItemsAr,
       _defaultInterests = defaultInterests,
       _dayByDay = dayByDay,
       super._();

  factory _$ProgrammeModelImpl.fromJson(Map<String, dynamic> json) => _$$ProgrammeModelImplFromJson(json);

  @override
  final String id;
  @override
  final String? destination;
  @override
  @JsonKey()
  final bool priceIsEstimate;
  @override
  @JsonKey()
  final String title;
  @override
  @JsonKey()
  final String titleAr;
  @override
  @JsonKey()
  final String tagline;
  @override
  @JsonKey()
  final String taglineAr;
  @override
  @JsonKey()
  final int durationDays;
  @override
  @JsonKey()
  final String idealFor;
  @override
  final String? pace;
  @override
  @JsonKey()
  final int intensityScore;
  @override
  @JsonKey()
  final int freeTimeScore;
  @override
  @JsonKey()
  final num startingPriceEGP;
  @override
  @JsonKey()
  final String heroImage;
  @override
  @JsonKey()
  final String badge;
  @override
  @JsonKey()
  final String badgeAr;
  final List<String> _highlights;
  @override
  @JsonKey()
  List<String> get highlights {
    if (_highlights is EqualUnmodifiableListView) return _highlights;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_highlights);
  }

  final List<String> _highlightsAr;
  @override
  @JsonKey()
  List<String> get highlightsAr {
    if (_highlightsAr is EqualUnmodifiableListView) return _highlightsAr;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_highlightsAr);
  }

  final List<String> _includedItems;
  @override
  @JsonKey()
  List<String> get includedItems {
    if (_includedItems is EqualUnmodifiableListView) return _includedItems;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_includedItems);
  }

  final List<String> _includedItemsAr;
  @override
  @JsonKey()
  List<String> get includedItemsAr {
    if (_includedItemsAr is EqualUnmodifiableListView) return _includedItemsAr;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_includedItemsAr);
  }

  final List<String> _defaultInterests;
  @override
  @JsonKey()
  List<String> get defaultInterests {
    if (_defaultInterests is EqualUnmodifiableListView) return _defaultInterests;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_defaultInterests);
  }

  @override
  final String? defaultBudget;
  final List<ProgrammeDayModel> _dayByDay;
  @override
  @JsonKey()
  List<ProgrammeDayModel> get dayByDay {
    if (_dayByDay is EqualUnmodifiableListView) return _dayByDay;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_dayByDay);
  }

  @override
  String toString() {
    return 'ProgrammeModel(id: $id, destination: $destination, priceIsEstimate: $priceIsEstimate, title: $title, titleAr: $titleAr, tagline: $tagline, taglineAr: $taglineAr, durationDays: $durationDays, idealFor: $idealFor, pace: $pace, intensityScore: $intensityScore, freeTimeScore: $freeTimeScore, startingPriceEGP: $startingPriceEGP, heroImage: $heroImage, badge: $badge, badgeAr: $badgeAr, highlights: $highlights, highlightsAr: $highlightsAr, includedItems: $includedItems, includedItemsAr: $includedItemsAr, defaultInterests: $defaultInterests, defaultBudget: $defaultBudget, dayByDay: $dayByDay)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProgrammeModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.destination, destination) || other.destination == destination) &&
            (identical(other.priceIsEstimate, priceIsEstimate) || other.priceIsEstimate == priceIsEstimate) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.titleAr, titleAr) || other.titleAr == titleAr) &&
            (identical(other.tagline, tagline) || other.tagline == tagline) &&
            (identical(other.taglineAr, taglineAr) || other.taglineAr == taglineAr) &&
            (identical(other.durationDays, durationDays) || other.durationDays == durationDays) &&
            (identical(other.idealFor, idealFor) || other.idealFor == idealFor) &&
            (identical(other.pace, pace) || other.pace == pace) &&
            (identical(other.intensityScore, intensityScore) || other.intensityScore == intensityScore) &&
            (identical(other.freeTimeScore, freeTimeScore) || other.freeTimeScore == freeTimeScore) &&
            (identical(other.startingPriceEGP, startingPriceEGP) || other.startingPriceEGP == startingPriceEGP) &&
            (identical(other.heroImage, heroImage) || other.heroImage == heroImage) &&
            (identical(other.badge, badge) || other.badge == badge) &&
            (identical(other.badgeAr, badgeAr) || other.badgeAr == badgeAr) &&
            const DeepCollectionEquality().equals(other._highlights, _highlights) &&
            const DeepCollectionEquality().equals(other._highlightsAr, _highlightsAr) &&
            const DeepCollectionEquality().equals(other._includedItems, _includedItems) &&
            const DeepCollectionEquality().equals(other._includedItemsAr, _includedItemsAr) &&
            const DeepCollectionEquality().equals(other._defaultInterests, _defaultInterests) &&
            (identical(other.defaultBudget, defaultBudget) || other.defaultBudget == defaultBudget) &&
            const DeepCollectionEquality().equals(other._dayByDay, _dayByDay));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    destination,
    priceIsEstimate,
    title,
    titleAr,
    tagline,
    taglineAr,
    durationDays,
    idealFor,
    pace,
    intensityScore,
    freeTimeScore,
    startingPriceEGP,
    heroImage,
    badge,
    badgeAr,
    const DeepCollectionEquality().hash(_highlights),
    const DeepCollectionEquality().hash(_highlightsAr),
    const DeepCollectionEquality().hash(_includedItems),
    const DeepCollectionEquality().hash(_includedItemsAr),
    const DeepCollectionEquality().hash(_defaultInterests),
    defaultBudget,
    const DeepCollectionEquality().hash(_dayByDay),
  ]);

  /// Create a copy of ProgrammeModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProgrammeModelImplCopyWith<_$ProgrammeModelImpl> get copyWith =>
      __$$ProgrammeModelImplCopyWithImpl<_$ProgrammeModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProgrammeModelImplToJson(this);
  }
}

abstract class _ProgrammeModel extends ProgrammeModel {
  const factory _ProgrammeModel({
    required final String id,
    final String? destination,
    final bool priceIsEstimate,
    final String title,
    final String titleAr,
    final String tagline,
    final String taglineAr,
    final int durationDays,
    final String idealFor,
    final String? pace,
    final int intensityScore,
    final int freeTimeScore,
    final num startingPriceEGP,
    final String heroImage,
    final String badge,
    final String badgeAr,
    final List<String> highlights,
    final List<String> highlightsAr,
    final List<String> includedItems,
    final List<String> includedItemsAr,
    final List<String> defaultInterests,
    final String? defaultBudget,
    final List<ProgrammeDayModel> dayByDay,
  }) = _$ProgrammeModelImpl;
  const _ProgrammeModel._() : super._();

  factory _ProgrammeModel.fromJson(Map<String, dynamic> json) = _$ProgrammeModelImpl.fromJson;

  @override
  String get id;
  @override
  String? get destination;
  @override
  bool get priceIsEstimate;
  @override
  String get title;
  @override
  String get titleAr;
  @override
  String get tagline;
  @override
  String get taglineAr;
  @override
  int get durationDays;
  @override
  String get idealFor;
  @override
  String? get pace;
  @override
  int get intensityScore;
  @override
  int get freeTimeScore;
  @override
  num get startingPriceEGP;
  @override
  String get heroImage;
  @override
  String get badge;
  @override
  String get badgeAr;
  @override
  List<String> get highlights;
  @override
  List<String> get highlightsAr;
  @override
  List<String> get includedItems;
  @override
  List<String> get includedItemsAr;
  @override
  List<String> get defaultInterests;
  @override
  String? get defaultBudget;
  @override
  List<ProgrammeDayModel> get dayByDay;

  /// Create a copy of ProgrammeModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProgrammeModelImplCopyWith<_$ProgrammeModelImpl> get copyWith => throw _privateConstructorUsedError;
}
