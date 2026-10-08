import 'package:flutter/material.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class PinFieldWidget extends StatelessWidget {
  final Function(String) onComplete;
  final ValueChanged<String>? onChanged;
  final EdgeInsetsGeometry? margin;

  const PinFieldWidget({
    super.key,
    required this.onComplete,
    this.onChanged,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin ?? EdgeInsets.zero,
      child: Directionality(
        textDirection: TextDirection.ltr,
        child: PinCodeTextField(
          length: 6,
          appContext: context,
          onChanged: onChanged ?? (_) {},
          backgroundColor: Colors.transparent,
          animationType: AnimationType.fade,
          keyboardType: TextInputType.number,
          pinTheme: PinTheme(
            shape: PinCodeFieldShape.box,
            borderRadius: BorderRadius.circular(14),
            fieldHeight: 58,
            fieldWidth: 48,
            borderWidth: 1.5,
            inactiveColor: context.colors.surface2,
            activeColor: context.colors.green,
            selectedColor: context.colors.text,
            selectedFillColor: context.colors.surface2,
            inactiveFillColor: context.colors.surface2,
            activeFillColor: context.colors.surface2,
            disabledColor: context.colors.line,
          ),
          textStyle: AppTextStyle.h4(color: context.colors.text).copyWith(fontSize: 20),
          animationDuration: const Duration(milliseconds: 220),
          enableActiveFill: true,
          onCompleted: onComplete,
        ),
      ),
    );
  }
}
