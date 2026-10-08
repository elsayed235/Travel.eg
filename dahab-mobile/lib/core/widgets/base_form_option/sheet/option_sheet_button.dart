import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/option_controller.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/sheet/option_button.dart';
import 'package:flutter_tdd/core/widgets/bottom_sheet_views/app_bottom_sheets.dart';

enum OptionSheetMode { clickAndSave, saveButton }

class OptionSheetButton<T> extends StatefulWidget {
  final String hintText;
  final OptionController<T> controller;
  final String? iconPath;
  final Function(BuildContext context, T item) valueBuilder;
  final Widget Function(BuildContext context) content;
  final String? customSaveText;
  final double? sheetHeight;
  final BoxConstraints? constraints;
  final VoidCallback onSaveTextPressed;
  final String bottomSheetTitle;
  final bool disable;
  final bool showSearch;
  final bool showDecoration;
  final void Function(String value)? onSearch;
  final Widget? customSuffixIcon;
  final VoidCallback? onClearPressed;
  final Border? border;
  final VoidCallback? onTap;
  final ObsValue<bool?>? addNewOptionEnabledObs;
  final String? addNewOptionButtonText;
  final VoidCallback? onAddNewOptionPressed;
  final bool isViewMode;
  final OptionSheetMode optionSheetMode;

  const OptionSheetButton({
    super.key,
    required this.hintText,
    required this.bottomSheetTitle,
    required this.controller,
    this.iconPath,
    required this.valueBuilder,
    required this.content,
    this.customSaveText,
    this.onSearch,
    this.sheetHeight,
    this.onTap,
    this.showSearch = false,
    this.disable = false,
    this.showDecoration = true,
    required this.onSaveTextPressed,
    this.customSuffixIcon,
    this.onClearPressed,
    this.border,
    this.constraints,
    this.addNewOptionEnabledObs,
    this.addNewOptionButtonText,
    this.onAddNewOptionPressed,
    this.isViewMode = false,
    this.optionSheetMode = OptionSheetMode.saveButton,
  });

  @override
  State<OptionSheetButton<T>> createState() => OptionSheetButtonState<T>();
}

class OptionSheetButtonState<T> extends State<OptionSheetButton<T>> {


  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      ignoring: widget.isViewMode,
      child: OptionsButton<T>(
        hintText: widget.hintText,
        controller: widget.controller,
        valueBuilder: widget.valueBuilder,
        iconPath: widget.iconPath,
        customSuffixIcon: widget.customSuffixIcon,
        showDecoration: widget.showDecoration,
        onClearPressed: widget.onClearPressed,
        showClearIcon: true,
        constraints: widget.constraints,
        border: widget.border,
        onPressed: () {
          if (!widget.disable) {
            if (widget.onSearch != null) {
              /// TODO Abdelkarim check with Tarek
              //widget.onSearch!("");
            }
            if (widget.onTap != null) {
              widget.onTap!();
            }
            showOptionsSheet(context);
          }
        },
      ),
    );
  }

  void showOptionsSheet(BuildContext context) {
    AppBottomSheets.showOptionsBottomSheet(
            bottomSheetTitle: widget.bottomSheetTitle,
            showSearch: widget.showSearch,
            contentPadding: const EdgeInsets.only(top: 8, left: 24, right: 24, bottom: 24),
            onSaveTextPressed: () {
              widget.onSaveTextPressed();
            },
            enableDrag: widget.optionSheetMode != OptionSheetMode.saveButton,
            controller: widget.controller,
            contentBuilder: widget.content,
            customSaveText: widget.customSaveText,
            onSearch: widget.onSearch,
            height: widget.sheetHeight,
            addNewOptionEnabledObs: widget.addNewOptionEnabledObs ?? ObsValue.withInit(false),
            addNewOptionButtonText: widget.addNewOptionButtonText,
            onAddNewOptionPressed: widget.onAddNewOptionPressed,
            isViewMode: widget.isViewMode,
            context: context);

  }
}
