import 'package:flutter/material.dart';
import 'package:rehla/core/constants/dimens.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';

class OptionButtonDecoration extends StatelessWidget {
  final Widget child;
  final BoxConstraints? constraints;
  final EdgeInsetsGeometry? padding;
  final Border? border;

  const OptionButtonDecoration(
      {super.key, required this.child, this.constraints, this.border, this.padding});

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: constraints ?? const BoxConstraints(minHeight: 42, maxHeight: 42),
      padding: padding ?? Dimens.defaultPaddingOfOptionButton,
      width: double.maxFinite,
      decoration: BoxDecoration(
        color: context.colors.surface2,
        borderRadius: Dimens.buttonBorderRadius,
        border: border ?? Border.all(color: context.colors.line, width: 1),
      ),
      child: child,
    );
  }
}
