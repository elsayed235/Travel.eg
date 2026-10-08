import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/theme/app_radius.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';

class BottomSheetHeaderLine extends StatelessWidget {
  const BottomSheetHeaderLine({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 32,
        height: 4,
        decoration: BoxDecoration(
          color: context.colors.line2,
          borderRadius: AppRadius.chipAll,
        ),
      ),
    );
  }
}
