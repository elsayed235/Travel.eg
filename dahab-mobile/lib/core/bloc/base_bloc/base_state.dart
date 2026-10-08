import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/errors/base_error.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'base_state.freezed.dart';

@immutable
@Freezed(equal: false)
class BaseState<T> with _$BaseState<T> {
  const factory BaseState.init() = _Init;

  const factory BaseState.loading() = _Loading;

  const factory BaseState.success(bool changed,[T? model]) = _Success<T>;

  const factory BaseState.failure(BaseError error, VoidCallback callback) = _Failure;
}

extension BaseStateExt<T> on BaseState<T> {
  bool get isSuccess => maybeWhen(success: (changed,_) => true, orElse: () => false);
  bool get isNotSuccess => !isSuccess;

  bool get isLoading => maybeWhen(loading: () => true, orElse: () => false);

  bool get isFailure => maybeWhen(failure: (_, __) => true, orElse: () => false);

  bool get isInit => maybeWhen(init: () => true, orElse: () => false);

  bool get hasData => maybeWhen(success: (changed,data) => data != null, orElse: () => false);

  bool get hasNoData => !hasData;

  T? get data => maybeWhen(success: (changed,data) => data, orElse: () => null);

  BaseError? get error => maybeWhen(failure: (error, _) => error, orElse: () => null);
}
