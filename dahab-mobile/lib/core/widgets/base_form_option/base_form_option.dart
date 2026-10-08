import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/constants/app_loader_widget.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/extensions/common_extension.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/requester/consumer/requester_consumer.dart';
import 'package:rehla/core/requester/consumer/requester_state_consumer.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/base_form_option/collection_helper/collection_helper.dart';
import 'package:rehla/core/widgets/base_form_option/form_option_selection_calculator.dart';
import 'package:rehla/core/widgets/base_form_option/options_listview/display_format_enum.dart';
import 'package:rehla/core/widgets/base_form_option/options_listview/options_list_view.dart';
import 'package:rehla/core/widgets/base_form_option/options_requester/base_options_display_widget.dart';
import 'package:rehla/core/widgets/base_form_option/options_requester/base_options_requester.dart';
import 'package:rehla/core/widgets/base_form_option/options_requester/local_options_requester.dart';
import 'package:rehla/core/widgets/base_form_option/options_requester/option_controller.dart';
import 'package:rehla/core/widgets/base_form_option/options_requester/option_matchers/string_option_matcher.dart';
import 'package:rehla/core/widgets/base_form_option/sheet/option_sheet_button.dart';
import 'package:rehla/core/widgets/shimmers/base_shimmer_widget.dart';



typedef OptionItemBuilder<T> = Widget Function(
    T item, bool Function(T item) isItemSelected, ValueChanged<T> onSelect);

class BaseFormOption<T, S> extends StatefulWidget {
  final String bottomSheetTitle;
  final String hintText;
  final bool showSearch;
  final bool isMultiple;
  final void Function(List<T>? values, bool iMultiple) onSaveValue;
  final BaseOptionsRequester<T, S> optionsRequester;
  final List<T>? selectedItems;
  final String? Function(T?) valueIdGetter;
  final String? Function(T?) valueMainTitleGetter;
  final OptionItemBuilder<T>? optionItemBuilder;
  final VoidCallback? onClearPressed;
  final bool? showDecoration;
  final ObsValue<bool?>? addNewOptionEnabledObs;
  final String? addNewOptionButtonText;
  final VoidCallback? onAddNewOptionPressed;
  final BaseOptionsDisplayWidget Function(List<T>?)? selectedOptionBuilder;
  final EdgeInsetsGeometry? padding;
  final String? Function(List<T>?)? validator;
  final DisplayFormatEnum? displayFormat;

  const BaseFormOption({
    super.key,
    this.padding = const EdgeInsets.all(0),
    required this.hintText,
    required this.bottomSheetTitle,
    required this.showSearch,
    required this.onSaveValue,
    required this.optionsRequester,
    required this.selectedItems,
    required this.isMultiple,
    required this.valueIdGetter,
    required this.valueMainTitleGetter,
    this.showDecoration,
    this.selectedOptionBuilder,
    this.optionItemBuilder,
    this.onClearPressed,
    this.addNewOptionEnabledObs,
    this.addNewOptionButtonText,
    this.onAddNewOptionPressed,
    this.validator,
    this.displayFormat,
  });

  static BaseFormOption singleLocalOption<T>({
    Key? key,
    padding = const EdgeInsets.all(0),
    required String hintText,
    required String bottomSheetTitle,
    required ValueChanged<T?> onSaveValue,
    required List<T> options,
    required T? selectedItem,
    required String? Function(T?) valueIdGetter,
    required String? Function(T?) valueMainTitleGetter,
    bool? showDecoration,
    bool showSearch = false,
    BaseOptionsDisplayWidget Function(T?)? selectedOptionBuilder,
    OptionItemBuilder<T>? optionItemBuilder,
    VoidCallback? onClearPressed,
    String? Function(T?)? validator,
  }) {
    BaseOptionsRequester<T, String> optionsRequester = LocalOptionsRequester(
        optionMatcher: StringOptionMatcher(
          stringGetter: (option) {
            return valueMainTitleGetter(option);
          },
        ),
        options: options);
    return BaseFormOption<T, String>(
        key: key,
        padding: padding,
        hintText: hintText,
        validator: (items) => validator?.call(items?.first),
        bottomSheetTitle: bottomSheetTitle,
        showSearch: showSearch,
        onSaveValue: (items, isMulti) {
          onSaveValue(items?.first);
        },
        optionsRequester: optionsRequester,
        selectedItems: selectedItem != null ? [selectedItem] : null,
        isMultiple: false,
        onClearPressed: onClearPressed,
        optionItemBuilder: optionItemBuilder,
        selectedOptionBuilder:
            selectedOptionBuilder != null ? (items) => selectedOptionBuilder(items?.first) : null,
        showDecoration: showDecoration,
        valueIdGetter: valueIdGetter,
        valueMainTitleGetter: valueMainTitleGetter);
  }

  @override
  State<BaseFormOption<T, S>> createState() => BaseFormOptionState<T, S>();
}

class BaseFormOptionState<T, S> extends State<BaseFormOption<T, S>> {
  late OptionController<List<T>> _optionController;
  late FormOptionSelectionCalculator<T, S> _selectedItemCalculator;
  final _key = GlobalKey<FormFieldState<T>>();

  @override
  void initState() {
    _optionController = OptionController<List<T>>();
    _selectedItemCalculator = FormOptionSelectionCalculator<T, S>(
        formOptionWidget: widget, optionController: _optionController);
    _selectedItemCalculator.reCalculateSelectedItems(widget.selectedItems ?? []);
    _refreshSelectionAfterResolve();
    super.initState();
  }

  void _refreshSelectionAfterResolve() {
    _selectedItemCalculator.loadingObs.listen((event) {
      if (event == false) {
        widget.onSaveValue(_optionController.selectedValue, widget.isMultiple);
      }
    });
  }

  @override
  void didUpdateWidget(covariant BaseFormOption<T, S> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (CollectionHelper.isNotIdenticalOptionsList<T>(
        currentSelectedItems: _optionController.selectedValue,
        incomingSelectedItems: widget.selectedItems,
        valueIdGetter: widget.valueIdGetter)) {
      _selectedItemCalculator.reCalculateSelectedItems(widget.selectedItems ?? []);
    }
  }

  void changeSelectedItem(T? selectedItem) {
    _optionController.selectedValue = selectedItem != null ? [selectedItem] : null;
    widget.onSaveValue(_optionController.selectedValue, widget.isMultiple);
  }

  void changeSelectedItems(List<T>? selectedItems) {
    _optionController.selectedValue = selectedItems;
    widget.onSaveValue(_optionController.selectedValue, widget.isMultiple);
  }

  @override
  Widget build(BuildContext context) {
    return FormField<T>(
        key: _key,
        validator: (_) => widget.validator?.call(_optionController.selectedValue),
        autovalidateMode: AutovalidateMode.onUserInteraction,
        builder: (formState) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: widget.padding ?? const EdgeInsets.all(0),
                child: RequesterStateConsumer(
                  requester: widget.optionsRequester,
                  builder: (context, state) {
                    return OptionSheetButton<List<T>>(
                      constraints:
                          BoxConstraints(minHeight: const BoxConstraints(minHeight: 42, maxHeight: 42).minHeight),
                      hintText: widget.hintText,
                      bottomSheetTitle: widget.bottomSheetTitle,
                      controller: _optionController,
                      showSearch: widget.showSearch,
                      onSearch: widget.optionsRequester.searchByText,
                      onClearPressed: widget.onClearPressed == null
                          ? null
                          : () {
                              widget.onClearPressed!.call();
                              formState.validate();
                            },
                      showDecoration: widget.showDecoration ?? true,
                      onAddNewOptionPressed: widget.onAddNewOptionPressed,
                      addNewOptionButtonText: widget.addNewOptionButtonText,
                      addNewOptionEnabledObs: widget.addNewOptionEnabledObs,
                      optionSheetMode: widget.isMultiple
                          ? OptionSheetMode.saveButton
                          : OptionSheetMode.clickAndSave,
                      valueBuilder: (_, items) {
                        return ObsValueConsumer(
                          observable: _selectedItemCalculator.loadingObs,
                          builder: (context, isLoading) {
                            if (isLoading) {
                              return BaseShimmerWidget(
                                  child: Container(
                                width: 20,
                                height: 30,
                                color: context.colors.surface1,
                              ));
                            }
                            return IgnorePointer(
                                ignoring: true,
                                child: widget.selectedOptionBuilder != null
                                    ? widget.selectedOptionBuilder!.call(items)
                                    : BaseOptionsDisplayWidget<T>(
                                        selectedOptions: items,
                                        titleGetter: (item) => widget.valueMainTitleGetter(item),
                                      ));
                          },
                        );
                      },
                      onSaveTextPressed: () {
                        _onSave(formState);
                      },
                      onTap: () {
                        if (widget.optionsRequester.state is int) {
                          widget.optionsRequester.request();
                        } else {
                          widget.optionsRequester
                              .resetOptionsWithSelected(_optionController.selectedValue);
                        }
                      },
                      content: (context) {
                        return RequesterConsumer<List<T>>(
                          requester: widget.optionsRequester,

                          /// TODO Abdelkarim Handle failure case
                          failureBuilder: (context, error, _) {
                            return Gaps.empty;
                          },
                          loadingBuilder: (context) {
                            return const AppLoaderWidget.largeLogo();
                          },
                          successBuilder: (context, items, isLoading) {
                            if (items.isNullOrEmpty && !isLoading) {
                              return Text(Translate.s.noResults,
                                  style: AppTextStyle.s13_w500(color: AppColors.noContextInstance.blackOpacity),
                                  textAlign: TextAlign.center);
                            }

                            return OptionsListView.of(
                                displayFormat: widget.displayFormat,
                                formState: formState,
                                isLoading: isLoading,
                                items: items,
                                isMultiple: widget.isMultiple,
                                onSelect: _onSelect,
                                isItemSelected: _isItemSelected,
                                optionItemBuilder: widget.optionItemBuilder,
                                valueMainTitleGetter: widget.valueMainTitleGetter,
                                isSearchApplied: widget.optionsRequester.isSearchApplied);
                          },
                        );
                      },
                    );
                  },
                ),
              ),
              if (formState.hasError) ...[
                Gaps.vGap(4),
                Text(formState.errorText ?? '',
                    style: const AppTextStyle.s12_w400(color: AppColors.snackBarRedError))
              ],
            ],
          );
        });
  }

  bool _isItemSelected(T item) {
    if (widget.isMultiple) {
      return ((_optionController.tempValue) ?? [])
          .map((e) => widget.valueIdGetter(e))
          .toList()
          .contains(widget.valueIdGetter(item));
    }
    return widget.valueIdGetter(item) ==
        widget.valueIdGetter(_optionController.tempValue?.firstOrNull);
  }

  void _onSelect(T item) {
    if (widget.isMultiple) {
      _optionController.tempValue ??= [];
      if (_isItemSelected(item)) {
        List<T> tempList = List.from(_optionController.tempValue ?? []);
        tempList
            .removeWhere((element) => widget.valueIdGetter(element) == widget.valueIdGetter(item));
        _optionController.tempValue = tempList;
      } else {
        _optionController.tempValue = [..._optionController.tempValue ?? [], item];
      }
    } else {
      _optionController.tempValue = [item];

      /// click and save UX is adopt when the value is not multiple
      _onSave(_key.currentState!);
    }
  }

  void _onSave(FormFieldState formState) {
    _optionController.confirmTempValue();
    widget.onSaveValue(_optionController.selectedValue, widget.isMultiple);
    // KeyboardService.instance.unFocusAllTextFields(context: context);
    widget.optionsRequester.isSearchApplied = false;
    Navigator.pop(context);
  }
}
