import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/extensions/common_extension.dart';
import 'package:flutter_tdd/core/widgets/app_text_span_with_seperator.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_listview/option_item_widget.dart';

enum OptionsDisplayMode { details, summarized }

/// Use to display Selected Options in BaseFormOption
class BaseOptionsDisplayWidget<T> extends StatelessWidget {
  final List<T>? selectedOptions;
  final String? Function(T) titleGetter;
  final ValueChanged<T>? onTap;
  final bool clickable;
  final OptionsDisplayMode optionsDisplayMode;

  const BaseOptionsDisplayWidget({
    super.key,
    required this.selectedOptions,
    required this.titleGetter,
    this.onTap,
    this.clickable = false,
    this.optionsDisplayMode = OptionsDisplayMode.details,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedOptions.isNullOrEmpty) return const SizedBox.shrink();

    /// Single value has only the following case
    if (selectedOptions!.length == 1) {
      return getSingleOptionItem(option: selectedOptions!.first, context: context);
    }

    /// MultiValue cases
    switch (optionsDisplayMode) {
      case OptionsDisplayMode.summarized:
        return getOptionsWidgetSummarizedCase(options: selectedOptions!, context: context);
      case OptionsDisplayMode.details:
        return getOptionsWidgetDetailsCase(context: context, options: selectedOptions!);
    }
  }

  Widget getSingleOptionItem(
      {required T option, required BuildContext context, String? suffixText}) {
    return OptionItemWidget(
      title: titleGetter(option) ?? "",
      suffixText: suffixText,
      onTap: () {
        onTap?.call(option);
      },
    );
  }

  Widget getMultiOptionsTextSpan() {
    return AppTextSpanWithSeparator(
      textsItems: selectedOptions!
          .map((item) => TextSpanItem(
                title: titleGetter(item) ?? "",
                onTap: () {
                  onTap?.call(item);
                },
              ))
          .toList(),
    );
  }

  /// In case of Summarized display, multi Value will be displayed as stacked of main pictures if
  /// they has them, and as Text spans of main titles if there is no pictures.
  Widget getOptionsWidgetSummarizedCase({required BuildContext context, required List<T> options}) {
    return getMultiOptionsTextSpan();
  }

  /// if pictures list is null the value will displayed as text spans, else the main picture
  /// should appear beside the title.
  Widget getOptionsWidgetDetailsCase({required BuildContext context, required List<T> options}) {
    return getMultiOptionsTextSpan();
  }
}
