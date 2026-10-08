import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_tdd/core/constants/app_loader_widget.dart';
import 'package:flutter_tdd/core/constants/gaps.dart';
import 'package:flutter_tdd/core/errors/base_error.dart';
import 'package:flutter_tdd/core/localization/translate.dart';
import 'package:flutter_tdd/core/theme/colors/app_colors.dart';
import 'package:flutter_tdd/core/theme/colors/colors_extension.dart';
import 'package:flutter_tdd/core/theme/text/app_text_style.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/option_controller.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/sheet/hint_text.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/sheet/option_button_decoration.dart';
import 'package:get/utils.dart';

class OptionsButton<T> extends StatefulWidget {
  final String hintText;
  final OptionController<T> controller;
  final String? iconPath;
  final Function(BuildContext context, T item) valueBuilder;
  final VoidCallback onPressed;
  final VoidCallback? onClearPressed;
  final bool coloredIconWhenValueFilled;
  final bool showDecoration;
  final bool showClearIcon;
  final bool showClearIconIfNoValue;
  final Widget? customSuffixIcon;
  final BoxConstraints? constraints;
  final Border? border;
  final BaseError? error;

  const OptionsButton(
      {super.key,
      required this.hintText,
      this.iconPath,
      required this.controller,
      required this.valueBuilder,
      required this.onPressed,
      this.coloredIconWhenValueFilled = false,
      this.showDecoration = true,
      this.customSuffixIcon,
      this.onClearPressed,
      this.showClearIcon = false,
      this.border,
      this.showClearIconIfNoValue = false,
      this.constraints,
      this.error});

  @override
  State<OptionsButton<T>> createState() => _OptionsButtonState<T>();

  factory OptionsButton.customText({required String hintText}) {
    return OptionsButton(
      hintText: hintText,
      customSuffixIcon: const SizedBox(),
      controller: OptionController(),
      valueBuilder: (context, item) => const SizedBox(),
      onPressed: () {},
    );
  }

  factory OptionsButton.empty() {
    return OptionsButton(
      hintText: '...',
      controller: OptionController(),
      valueBuilder: (context, item) => const SizedBox(),
      onPressed: () {},
    );
  }

  factory OptionsButton.error({required BaseError error, required VoidCallback onPressed}) {
    return OptionsButton(
      hintText: '...',
      controller: OptionController(),
      error: error,
      border: Border.all(color: AppColors.snackBarRedError),
      valueBuilder: (context, item) => const SizedBox(),
      onPressed: onPressed,
    );
  }

  factory OptionsButton.loading() {
    return OptionsButton(
      hintText: Translate.s.loadingText,
      controller: OptionController(),
      valueBuilder: (context, item) => const AppLoaderWidget.smallProgress(),
      onPressed: () {},
    );
  }
}

class _OptionsButtonState<T> extends State<OptionsButton<T>> {
  @override
  Widget build(BuildContext context) {
    if (widget.iconPath != null) assert(widget.iconPath!.toLowerCase().endsWith('svg'));
    if (widget.showDecoration) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          GestureDetector(
            onTap: widget.onPressed,
            child: OptionButtonDecoration(
              constraints: widget.constraints,
              border: widget.border,
              child: Row(
                children: [
                  /// Prefix with width 44 like TextFormField
                  Expanded(
                    child: Row(
                      children: [
                        if (widget.iconPath != null)
                          SizedBox(
                            width: 20,
                            child: SizedBox.square(
                                dimension: 18,
                                child: SvgPicture.asset(
                                  widget.iconPath!,
                                  color: widget.coloredIconWhenValueFilled &&
                                          widget.controller.selectedValue != null
                                      ? context.colors.primary
                                      : AppColors.noContextInstance.blackOpacity,
                                  fit: BoxFit.contain,
                                )),
                          ),
                        if (widget.iconPath != null) Gaps.hGap12,

                        /// Value
                        Expanded(
                            child: _ValueBuilder(
                                controller: widget.controller,
                                hintText: widget.hintText,
                                valueBuilder: widget.valueBuilder)),
                        customSuffixIcon(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (widget.error != null)
            Row(
              children: [
                Padding(
                  padding: const EdgeInsetsDirectional.only(top: 4),
                  child: Text(
                    widget.error!.message,
                    style: const AppTextStyle.s10_w400(color: AppColors.snackBarRedError),
                  ),
                ),
              ],
            ),
        ],
      );
    } else {
      return GestureDetector(
        onTap: widget.onPressed,
        child: _ValueBuilder(
            controller: widget.controller,
            hintText: widget.hintText,
            valueBuilder: widget.valueBuilder),
      );
    }
  }

  Widget customSuffixIcon() {
    return BlocBuilder<OptionController<T>, OptionControllerState<T>>(
      bloc: widget.controller,
      buildWhen: (previous, current) => previous != current,
      builder: (context, _) {
        bool isNotAnEmptyList = (widget.controller.selectedValue is List
            ? (widget.controller.selectedValue as List).isNotEmpty
            : true);
        return Row(
          children: [
            if ((widget.controller.selectedValue != null &&
                    isNotAnEmptyList &&
                    widget.showClearIcon) ||
                widget.showClearIconIfNoValue) ...[
              /// Clear icon
              if (widget.onClearPressed != null)
                InkWell(
                  onTap: () {
                    widget.controller.clear();
                    widget.onClearPressed?.call();
                  },
                  child: Icon(
                    Icons.clear,
                    size: 20,
                    color: AppColors.noContextInstance.blackOpacity,
                  ),
                ),

              /// Padding
              widget.customSuffixIcon == null ? Gaps.hGap5 : Gaps.hGap12
            ],

            /// Suffix
            widget.customSuffixIcon ??
                Icon(Icons.keyboard_arrow_down_rounded, size: 20, color: AppColors.noContextInstance.blackOpacity),
          ],
        );
      },
    );
  }
}

class _ValueBuilder<T> extends StatelessWidget {
  final OptionController<T> controller;
  final String hintText;
  final Function(BuildContext context, T item) valueBuilder;

  const _ValueBuilder(
      {Key? key, required this.controller, required this.hintText, required this.valueBuilder})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<OptionController<T>, OptionControllerState<T>>(
        bloc: controller,
        buildWhen: (previous, current) => previous != current,
        builder: (context, _) {
          return controller.selectedValue == null ||
                  (controller.selectedValue is List && controller.selectedValue.isBlank == true) ||
                  valueBuilder(context, controller.selectedValue as T) == null
              ? HintText(
                  hintText: hintText,
                )
              : valueBuilder(context, controller.selectedValue as T);
        });
  }
}
