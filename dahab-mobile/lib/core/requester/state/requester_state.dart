import 'package:flutter/foundation.dart';
import 'package:flutter_tdd/core/errors/base_error.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'requester_state.freezed.dart';

@immutable
@Freezed(equal: false)
class RequesterState<T> with _$RequesterState<T> {
  const RequesterState._();

  const factory RequesterState.init() = _Init;

  const factory RequesterState.loading() = _Loading;

  const factory RequesterState.success(T data,
      [
      /// True when a transparent loading is occurring
      bool? isLoading]) = _Success<T>;

  const factory RequesterState.failure(BaseError error, VoidCallback callback) = _Failure;

  bool get isSuccess => maybeWhen(orElse: () => false, success: (data, isLoading) => true);

  bool get isLoadingData => maybeWhen(orElse: () => false, loading: () => true);

  // ignore: library_private_types_in_public_api
  _Success<T>? get asSuccess {
    if (isSuccess) {
      return this as _Success<T>;
    } else {
      return null;
    }
  }

  bool get isLoadingTransparently => maybeWhen(
        success: (data, isLoading) => isLoading ?? false,
        orElse: () => false,
      );
}

extension RequesterStateExtension<T> on RequesterState<T> {
  RequesterState<T> copy(){
    return when(
      init: () => const RequesterState.init(),
      loading: () => const RequesterState.loading(),
      success: (data, isLoading) => RequesterState.success(data, isLoading),
      failure: (error, callback) => RequesterState.failure(error, callback),
    );
  }
}
