import 'package:flutter_tdd/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:flutter_tdd/core/extensions/common_extension.dart';
import 'package:flutter_tdd/core/extensions/string_helper_extension.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/base_form_option.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/collection_helper/collection_helper.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_requester/option_controller.dart';

class FormOptionSelectionCalculator<T, S> {
  final BaseFormOption<T, S> formOptionWidget;
  final OptionController<List<T>> optionController;

  FormOptionSelectionCalculator({required this.formOptionWidget, required this.optionController});

  final ObsValue<bool> loadingObs = ObsValue.withInit(false);

  /// re calculate selected items to ensure that they are included in options list and they are
  /// resolved
  void reCalculateSelectedItems(List<T> incomingSelectedItems) async {
    optionController.selectedValue = incomingSelectedItems;
    if (incomingSelectedItems.isNullOrEmpty) {
      loadingObs.setValue(false);
      return;
    }
    List<T>? selectedItems = await _reCalculateSelectedItemsFromRequester();
    _reassignSelectedItems(selectedItems);
  }

  void _reassignSelectedItems(List<T>? calculatedSelectedItems) {
    if (CollectionHelper.isNotIdenticalOptionsList(
        valueIdGetter: formOptionWidget.valueIdGetter,
        incomingSelectedItems: calculatedSelectedItems,
        currentSelectedItems: optionController.selectedValue)) {
      optionController.selectedValue = calculatedSelectedItems;
      formOptionWidget.onSaveValue(calculatedSelectedItems, formOptionWidget.isMultiple);
    } else if (isThereAnySelectedNotResolved) {
      optionController.selectedValue = calculatedSelectedItems;
    }
  }

  bool get isThereAnySelectedNotResolved {
    return optionController.selectedValue
            ?.any((element) => formOptionWidget.valueMainTitleGetter(element).isBlank) ??
        true;
  }

  Future<List<T>?> _reCalculateSelectedItemsFromRequester() async {
    loadingObs.setValue(true);
    List<T> options = List<T>.from(await formOptionWidget.optionsRequester.options);
    loadingObs.setValue(false);
    return _reCalculateSelectedItemsFromOption(options);
  }

  List<T>? _reCalculateSelectedItemsFromOption(List<T> options) {
    List<T> includedItems = [];
    List<String?> selectedOptionIds = (optionController.selectedValue ?? [])
        .map((e) => formOptionWidget.valueIdGetter(e))
        .toList();
    for (var option in options) {
      if (selectedOptionIds.contains(formOptionWidget.valueIdGetter(option))) {
        includedItems.add(option);
      }
    }
    return includedItems.isEmpty ? null : includedItems;
  }
}
