import 'package:flutter/material.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:shimmer/shimmer.dart';

class BaseShimmerWidget extends StatelessWidget {
  final Widget child;
  const BaseShimmerWidget({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: context.colors.surface2,
      highlightColor: context.colors.surface3,
      period: const Duration(milliseconds: 1000),
      child: child,
    );
  }
}