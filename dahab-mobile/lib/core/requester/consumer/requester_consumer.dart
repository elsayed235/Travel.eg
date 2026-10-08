import 'package:flutter/material.dart';
import 'package:rehla/core/errors/base_error.dart';
import 'package:rehla/core/requester/consumer/requester_state_consumer.dart';
import 'package:rehla/core/requester/requester.dart';
import 'package:rehla/core/requester/state/requester_state.dart';

class RequesterConsumer<T> extends StatelessWidget {
  final Requester<T> requester;
  final void Function(BuildContext context, RequesterState<T> state)? listener;
  final Widget Function(BuildContext context, T data, bool isLoading) successBuilder;
  final Widget Function(BuildContext context, BaseError error, VoidCallback callback)
  failureBuilder;
  final Widget Function(BuildContext context) loadingBuilder;

  const RequesterConsumer(
      {super.key,
        required this.requester,
        required this.successBuilder,
        required this.failureBuilder,
        required this.loadingBuilder,
        this.listener});

  @override
  Widget build(BuildContext context) {
    return RequesterStateConsumer(
        requester: requester,
        listener: listener,
        builder: (context, state) {
          return state.when(
            init: () => loadingBuilder(context),
            loading: () => loadingBuilder(context),
            success: (T data, isLoading) => successBuilder(context, data, isLoading ?? false),
            failure: (error, callback) => failureBuilder(context, error, callback),
          );
        });
  }
}
