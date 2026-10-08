import 'package:flutter/material.dart';
import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/constants/dimens.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/routes/router_imports.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/widgets/base_form_option/options_requester/option_controller.dart';
import 'package:rehla/core/widgets/base_form_option/sheet/option_sheet_content.dart';
import 'package:get_it/get_it.dart';


abstract class AppBottomSheets {
  const AppBottomSheets._();

  static Future<T?> showScrollableBodyFixedHeaderSheet<T>({
    required BuildContext context,
    required WidgetBuilder builder,
  }) {
    return showModalBottomSheet<T>(
        context: context,
        backgroundColor: Colors.transparent,
        isDismissible: true,
        isScrollControlled: true,
        enableDrag: true,
        builder: builder);
  }

  static Future<T?> showScrollableBody<T>(
      {required BuildContext context,
      required WidgetBuilder builder,
      BoxConstraints? constraints}) {
    return showModalBottomSheet<T>(
      context: context,
      backgroundColor: context.colors.surface1,
      isDismissible: false,
      isScrollControlled: true,
      enableDrag: false,
      constraints: constraints,
      shape: const OutlineInputBorder(
        borderRadius: Dimens.sheetBorderRadius,
        borderSide: BorderSide.none,
      ),
      builder: builder,
    );
  }

  static Future<void> showOptionsBottomSheet<T>({
    String? bottomSheetTitle,
    required bool showSearch,
    void Function(String v)? onSearch,
    required VoidCallback onSaveTextPressed,
    VoidCallback? onCancelPressed,
    String? customSaveText,
    required OptionController<T> controller,
    required WidgetBuilder contentBuilder,
    required BuildContext context,
    EdgeInsets? contentPadding,
    double? height,
    bool isDismissible = false,
    bool enableDrag = false,
    ObsValue<bool?>? addNewOptionEnabledObs,
    String? addNewOptionButtonText,
    VoidCallback? onAddNewOptionPressed,
    bool isViewMode = false,
  }) async {
    /// to reset temp value when open bottom sheet
    controller.tempValue = controller.selectedValue;

    await showModalBottomSheet(
      context: context,
      elevation: 0.0,
      isDismissible: isDismissible,
      isScrollControlled: true,
      enableDrag: enableDrag,
      backgroundColor: context.colors.surface1,
      barrierColor: context.colors.text.withValues(alpha: 0.35),
      shape: const OutlineInputBorder(
          borderRadius: Dimens.sheetBorderRadius, borderSide: BorderSide.none),
      builder: (context) {
        return ObsValueConsumer(
            observable: addNewOptionEnabledObs ?? ObsValue.withInit(false),
            builder: (context, addNewOptionEnabled) {
              return GestureDetector(
                onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
                child: OptionSheetContent(
                  controller: controller,
                  onSearch: onSearch,
                  contentBuilder: contentBuilder,
                  bottomSheetTitle: bottomSheetTitle,
                  onSaveTextPressed: onSaveTextPressed,
                  customSaveText: customSaveText,
                  showSearch: showSearch,
                  height: height,
                  contentPadding: contentPadding,
                  addNewOptionEnabled: addNewOptionEnabled,
                  addNewOptionButtonText: addNewOptionButtonText,
                  onAddNewOptionPressed: onAddNewOptionPressed,
                  isViewMode: isViewMode,
                ),
              );
            });
      },
    );
  }

}

class SheetActionButton {
  final String title;
  final VoidCallback onPressed;

  const SheetActionButton({required this.title, required this.onPressed});

  factory SheetActionButton.cancel() {
    return SheetActionButton(
        title: Translate.s.cancel, onPressed: () => GetIt.instance<AppRouter>().maybePop());
  }
}
