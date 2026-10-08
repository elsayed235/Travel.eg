import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/errors/base_error.dart';
import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/core/requester/state/requester_state.dart';

abstract class Requester<T> extends Cubit<RequesterState<T>> {
  Requester({RequesterState<T>? initialState}) : super(initialState ?? const RequesterState.init());

  Future<void> request({bool fromRemote = true});

  /// PLEASE DON'T use these protected method outside subclasses

  @override
  @protected
  void emit(RequesterState<T> state) {
    super.emit(state);
  }

  @protected
  void successState(T data, [bool isLoading = false]) {
    emit(RequesterState.success(data, isLoading));
  }

  @protected
  void failedState(BaseError error, VoidCallback callback) {
    emit(RequesterState.failure(error, callback));
  }

  @protected
  void loadingState() {
    emit(const RequesterState.loading());
  }

  void clear() {
    emit(const RequesterState.init());
  }

  /// This method will wait result and wait loading to finish
  @nonVirtual
  Future<void> waitIfLoading({bool ignoreTransparentLoading = true}) async {
    await Future.delayed(const Duration(milliseconds: 20));
    if (isLoading || (ignoreTransparentLoading == false && isLoadingOrTransparentLoading)) {
      await stream.firstWhere((element) {
        return element.whenOrNull(
          loading: () => false,
          success: (_, isLoading) {
            if (ignoreTransparentLoading == false) {
              return isLoading != true;
            }
            return true;
          },
        ) ??
            true;
      });
    }
  }

  /// This method will request if no data and wait if loading
  /// DO NOT use the result in the general case
  /// DO NOT use the result in the general case
  /// DO NOT use the result in the general case
  @nonVirtual
  Future<MyResult<T>> requestIfNoDataAndWaitIfLoading() async {
    if (hasNoData && !isLoading) {
      await request();
    }
    await waitIfLoading();
    return state.maybeWhen(
      success: (data, isLoading) => MyResult.isSuccess(data),
      failure: (error, callback) => MyResult.isError(error),
      orElse: () => MyResult.isError(BaseError.unknown()),
    );
  }

  /// TODO TEAM Implement this method
  // @nonVirtual
  // Future<MyResult<T>> requestWhileNotSuccess(){
  //
  // }

  T? get data => state.whenOrNull(success: (data, isLoading) => data);

  BaseError? get error => state.whenOrNull(failure: (error, callback) => error);

  bool get hasData => data != null;

  bool get hasError => error != null;

  bool get hasNoData => data == null;

  bool get isSuccess => state.whenOrNull(success: (_, __) => true) ?? false;

  bool get isFail => (state.whenOrNull(failure: (error, callback) => true) ?? false);

  bool get isLoading => (state.whenOrNull(loading: () => true) ?? false);

  bool get isLoadingOrTransparentLoading =>
      (state.whenOrNull(success: (data, isLoading) => isLoading, loading: () => true) ?? false);
}
