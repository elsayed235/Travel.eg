part of 'value_state_manager_import.dart';

class ObsValueConsumer<T> extends StatelessWidget {
  final ObsValue<T> observable;
  final Widget Function(BuildContext context, T value) builder;
  final void Function(BuildContext context, T value)? listener;
  final bool Function(T, T)? buildWhen;

  const ObsValueConsumer({
    super.key,
    required this.observable,
    required this.builder,
    this.listener,
    this.buildWhen,
  });

  @override
  Widget build(BuildContext context) {
    return observable.consumer(
      mainContext: context,
      buildChild: builder,
      listener: listener,
      buildWhen: buildWhen,
    );
  }
}
