import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_tdd/core/requester/requester.dart';
import 'package:flutter_tdd/core/requester/state/requester_state.dart';

class RequesterStateConsumer<T> extends StatelessWidget {
  final Requester<T> requester;
  final void Function(BuildContext context, RequesterState<T> state)? listener;
  final Widget Function(BuildContext context, RequesterState<T> state) builder;

  const RequesterStateConsumer({
    super.key,
    required this.requester,
    required this.builder,
    this.listener,
  });

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<Requester<T>, RequesterState<T>>(
      bloc: requester,
      listener: (context, state) => listener?.call(context, state),
      builder: (context, state) {
        return builder(context, state);
      },
    );
  }
}
