part of 'value_state_manager_import.dart';

abstract class ObsValue<T> {
  ObsValue();

  // factory ObsValue.withInit(T initValue) => _ObservableBloc<T>(initValue);
  factory ObsValue.withInit(T initValue) => ObsValue<T>._getX(initValue);
  // factory ObsValue._bloc(T initValue) => _ObservableBloc<T>(initValue);

  factory ObsValue._getX(T initValue) => _ObservableGetX<T>(initValue);

  T getValue();

  void setValue(T val);

  void refresh();

  Widget consumer(
      {required BuildContext mainContext,
        required Widget Function(BuildContext context, T value) buildChild,
        void Function(BuildContext context, T value)? listener,
        bool Function(T, T)? buildWhen,
        bool Function(T, T)? listenWhen});

  void listen(void Function(T value) onChange);
}

class _ObservableBloc<T> extends Cubit<T> implements ObsValue<T> {
  _ObservableBloc(super.initValue);

  @override
  T getValue() {
    return state;
  }

  @override
  void setValue(val) {
    emit(val);
  }

  @override
  Widget consumer(
      {required BuildContext mainContext,
        required Widget Function(BuildContext context, T value) buildChild,
        void Function(BuildContext context, T value)? listener,
        bool Function(T, T)? buildWhen,
        bool Function(T, T)? listenWhen}) {
    return BlocConsumer<_ObservableBloc<T>, T>(
      bloc: this,
      buildWhen: buildWhen,
      listenWhen: listenWhen,
      builder: (context, state) => buildChild(context, state),
      listener: listener ?? (context, value) {},
    );
  }

  @override
  void listen(void Function(T value) onChange) {
    stream.listen((event) {
      onChange(event);
    });
  }

  @override
  void refresh() {
    emit(state);
  }
}

class _ObservableGetX<T> implements ObsValue<T> {
  final Rx<T> _obsValue;

  _ObservableGetX(T initValue) : _obsValue = Rx(initValue);

  @override
  T getValue() {
    return _obsValue.value;
  }

  @override
  void setValue(val) {
    _obsValue.value = val;
  }

  @override
  Widget consumer(
      {required BuildContext mainContext,
        required Widget Function(BuildContext context, T value) buildChild,
        void Function(BuildContext context, T value)? listener,
        bool Function(T, T)? buildWhen,
        bool Function(T, T)? listenWhen}) {
    return Obx(() => buildChild(mainContext, getValue()));
  }

  @override
  void refresh() {
    _obsValue.refresh();
  }

  @override
  void listen(void Function(T value) onChange) {
    _obsValue.listen((event) {
      onChange(event);
    });
  }
}
