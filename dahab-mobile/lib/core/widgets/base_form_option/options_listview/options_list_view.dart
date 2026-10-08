import 'package:flutter/material.dart';
import 'package:flutter_tdd/core/constants/app_loader_widget.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/base_form_option.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_listview/display_format_enum.dart';
import 'package:flutter_tdd/core/widgets/base_form_option/options_listview/selectable_option_item_widget.dart';

class OptionsListView<T> extends StatelessWidget {
  final List<T> items;
  final FormFieldState formState;
  final bool isLoading;
  final void Function(T item) onSelect;
  final bool Function(T item) isItemSelected;
  final OptionItemBuilder<T>? optionItemBuilder;
  final String? Function(T?) valueMainTitleGetter;

  const OptionsListView({
    super.key,
    required this.items,
    required this.formState,
    required this.isLoading,
    required this.onSelect,
    required this.isItemSelected,
    required this.optionItemBuilder,
    required this.valueMainTitleGetter,
  });

  @override
  Widget build(BuildContext context) {
    final int itemCount = items.length + (isLoading ? 1 : 0);
    return ListView.builder(
      itemCount: itemCount,
      physics: const BouncingScrollPhysics(),
      itemBuilder: (context, index) {
        if (index == itemCount - 1 && isLoading) {
          return Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              itemCount > 1
                  ? const AppLoaderWidget.smallProgress()
                  : const AppLoaderWidget.largeLogo(),
            ],
          );
        }
        if (optionItemBuilder != null) {
          return optionItemBuilder!.call(items[index], isItemSelected, onSelect);
        } else {
          return SelectableOptionItemWidget(
            onTap: () => onSelect((items[index])),
            isSelected: isItemSelected(items[index]),
            title: valueMainTitleGetter(items[index]) ?? "",
          );
        }
      },
    );
  }

  static OptionsListView of<T>({
    required DisplayFormatEnum? displayFormat,
    required List<T> items,
    required FormFieldState formState,
    required bool isLoading,
    required void Function(T item) onSelect,
    required bool Function(T item) isItemSelected,
    OptionItemBuilder<T>? optionItemBuilder,
    required String? Function(T?) valueMainTitleGetter,
    required bool isSearchApplied,
    required bool isMultiple,
  }) {
    return OptionsListView<T>(
      items: items,
      formState: formState,
      isLoading: isLoading,
      onSelect: onSelect,
      isItemSelected: isItemSelected,
      optionItemBuilder: optionItemBuilder,
      valueMainTitleGetter: valueMainTitleGetter,
    );
  }
}
