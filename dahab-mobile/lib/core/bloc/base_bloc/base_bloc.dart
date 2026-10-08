import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../errors/base_error.dart';
import 'base_state.dart';

class BaseBloc<T> extends Cubit<BaseState<T>> {
  BaseBloc([T? data]) : super(data != null ? BaseState.success( true, data) : const BaseState.init());

  T? _data;
  bool _dataChanged = true;

  T? get data => _data;

  BaseError? get error => state.whenOrNull(failure: (error, callback) => error);

  bool get hasData => data != null;

  bool get hasNoData => data == null;

  bool get isSuccess => state.whenOrNull(success: (changed,model) => true) ?? false;

  bool get isFail => (state.whenOrNull(failure: (error, callback) => true) ?? false);

  bool get isLoading => (state.whenOrNull(loading: () => true) ?? false);

  bool get isNotLoading => !isLoading;

  void loadingState() {
    emit(const BaseState.loading());
  }

  void successState([T? data]) {
    _data = data;
    _dataChanged = !_dataChanged;
    emit(BaseState.success(_dataChanged, _data));
  }

  void failedState(BaseError error, VoidCallback callback) {
    emit(BaseState.failure(error, callback));
  }

  void reset() {
    _data = null;
    emit(const BaseState.init());
  }
}
