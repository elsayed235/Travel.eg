import 'package:flutter_bloc/flutter_bloc.dart';

class OptionController<T> extends Cubit<OptionControllerState<T>> {
  bool _disposed = false;

  T? get selectedValue => state.selectedValue;

  T? get tempValue => state.tempValue;

  set selectedValue(T? value) {
    emit(state.copyWith(tempValue: value, selectedValue: value));
  }

  set tempValue(T? value) {
    emit(state.copyWith(tempValue: value, selectedValue: selectedValue));
  }

  OptionController({T? defaultValue})
      : super(OptionControllerState(selectedValue: defaultValue, tempValue: defaultValue));

  void clear() {
    emit(OptionControllerState());
  }

  void refresh() {
    emit(state);
  }

  void dispose() {
    if (!_disposed) {
      _disposed = true;
      super.close();
    }
  }

  void clearTempValue() {
    tempValue = null;
  }

  void confirmTempValue() {
    selectedValue = tempValue;
  }

  @override
  String toString() {
    return "OptionController: \ntempValue $tempValue \nselectedValue $selectedValue";
  }

  void appendSelectedToTemp() {
    tempValue = selectedValue;
  }
}

class OptionControllerState<T> {
  final T? selectedValue;

  final T? tempValue;

  OptionControllerState({this.selectedValue, this.tempValue});

  OptionControllerState<T> copyWith({
    required T? selectedValue,
    required T? tempValue,
  }) {
    return OptionControllerState<T>(
      selectedValue: selectedValue,
      tempValue: tempValue,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OptionControllerState &&
          runtimeType == other.runtimeType &&
          selectedValue == other.selectedValue &&
          tempValue == other.tempValue;

  @override
  int get hashCode => selectedValue.hashCode ^ tempValue.hashCode;
}
