import 'package:flutter/material.dart';

class AppDraggableScrollableSheet extends StatelessWidget {
  final ScrollableWidgetBuilder builder;
  final double? childSize;

  const AppDraggableScrollableSheet({
    super.key,
    required this.builder,
    this.childSize,
  });

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: childSize ?? .8,
      minChildSize: childSize ?? .5,
      maxChildSize: childSize ?? .9,
      builder: builder,
    );
  }
}
