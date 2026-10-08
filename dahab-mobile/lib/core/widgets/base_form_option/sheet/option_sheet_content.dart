import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rehla/core/bloc/value_state_manager/value_state_manager_import.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/extensions/common_extension.dart';
import 'package:rehla/core/localization/translate.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/app_colors.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/app_button.dart';
import 'package:rehla/core/widgets/base_form_option/options_requester/option_controller.dart';
import 'package:rehla/core/widgets/base_form_option/sheet/option_sheet_button.dart';
import 'package:rehla/core/widgets/bottom_sheet_views/bottom_sheet_button_widget.dart';
import 'package:rehla/core/widgets/search_form_field/search_form_field.dart';
class OptionSheetContent<T> extends StatefulWidget {
  final String? bottomSheetTitle;
  final bool showSearch;
  final void Function(String v)? onSearch;
  final VoidCallback onSaveTextPressed;
  final String? customSaveText;
  final OptionController<T> controller;
  final WidgetBuilder contentBuilder;
  final double? height;
  final EdgeInsets? contentPadding;
  final bool Function()? allowLeaveConfirmation;
  final VoidCallback? onCancelPressed;
  final bool? addNewOptionEnabled;
  final String? addNewOptionButtonText;
  final VoidCallback? onAddNewOptionPressed;
  final OptionSheetMode optionSheetMode;

  /// When this param is true the buttons will be hidden
  final bool isViewMode;

  const OptionSheetContent(
      {Key? key,
      required this.bottomSheetTitle,
      required this.showSearch,
      this.onSearch,
      required this.onSaveTextPressed,
      this.customSaveText,
      this.allowLeaveConfirmation,
      required this.controller,
      required this.contentBuilder,
      required this.height,
      this.contentPadding,
      this.onCancelPressed,
      this.addNewOptionEnabled,
      this.addNewOptionButtonText,
      this.onAddNewOptionPressed,
      this.isViewMode = false,
      this.optionSheetMode = OptionSheetMode.saveButton})
      : super(key: key);

  @override
  State<OptionSheetContent<T>> createState() => _OptionSheetContentState<T>();
}

class _OptionSheetContentState<T> extends State<OptionSheetContent<T>> {
  final ObsValue<bool> _titleObs = ObsValue.withInit(false);
  bool _isSaveAction = false;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        final shouldPop = await _onWillPop(context);
        if (shouldPop && context.mounted) {
          Navigator.of(context).pop();
        }
      },
      child: Padding(
        padding: MediaQuery.of(context).viewInsets,
        child: GestureDetector(
          onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
          child: SizedBox(
            height: widget.height ?? context.bodyHeightWithoutAppBar * .6,
            child: ClipRRect(
                borderRadius: AppRadius.sheetTop,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Gaps.vGap16,
                    if (!widget.bottomSheetTitle.isNullEmptyOrWhitespace || widget.showSearch)
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.xxl, AppSpacing.xxl, AppSpacing.xxl, AppSpacing.sm),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            if (!widget.bottomSheetTitle.isNullEmptyOrWhitespace)
                              ObsValueConsumer(
                                observable: _titleObs,
                                builder: (context, value) {
                                  if (value) {
                                    return Gaps.empty;
                                  }
                                  return Flexible(
                                    flex: 2,
                                    child: Text(
                                      widget.bottomSheetTitle!,
                                      style: AppTextStyle.s16_w400(
                                        color: AppColors.of(context).blackOpacity,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            if (widget.showSearch && !widget.isViewMode)
                              Flexible(
                                child: SearchFormField(
                                  onChange: widget.onSearch,
                                  onSubmit: widget.onSearch,
                                  onFocus: (val) => _titleObs.setValue(val),
                                ),
                              ),
                          ],
                        ),
                      ),
                    Expanded(
                      child: IgnorePointer(
                        /// Prevents interacting if view mode is true
                        ignoring: widget.isViewMode,
                        child: Container(
                          alignment: Alignment.topCenter,
                          margin: widget.contentPadding ??
                              const EdgeInsetsDirectional.symmetric(vertical: AppSpacing.xl, horizontal: AppSpacing.xxl),
                          child: BlocBuilder(
                              bloc: widget.controller,
                              builder: (context, __) {
                                return widget.contentBuilder(context);
                              }),
                        ),
                      ),
                    ),

                    /// Buttons
                    _sheetButtons(),
                    const SizedBox(height: 16)
                  ],
                )),
          ),
        ),
      ),
    );
  }

  Widget _sheetButtons() {
    if (widget.isViewMode) {
      /// Done button
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            AppTextButton.minPrimary(
              text: Translate.s.done,
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      );
    } else {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          /// Add new option button
          widget.addNewOptionEnabled ?? false
              ? Flexible(
                  child: Padding(
                    padding: const EdgeInsetsDirectional.only(start: 18),
                    child: AppTextButton.maxWhite(
                      onPressed: () {
                        widget.onAddNewOptionPressed?.call();
                      },
                      text: "+ ${widget.addNewOptionButtonText ?? Translate.s.add_new_item}",
                    ),
                  ),
                )
              : const Spacer(),

          /// Save and cancel buttons
          if (widget.optionSheetMode == OptionSheetMode.saveButton)
            BottomSheetButtonWidget(
              onSaveTextPressed: () {
                _isSaveAction = true;
                widget.onSaveTextPressed();
              },
              onCancelPressed: widget.onCancelPressed,
              customSaveText: widget.customSaveText,
              // allowLeaveConfirmation: widget.allowLeaveConfirmation,
            )
        ],
      );
    }
  }

  Future<bool> _onWillPop(BuildContext context) async {
    if (_isSaveAction) {
      return true;
    }
    // if (widget.allowLeaveConfirmation != null) {
    //   if (widget.allowLeaveConfirmation!.call()) {
    //     var result = await AppBottomSheets.showLeavePageConfirm(context);
    //     if (result) {
    //       return true;
    //     }
    //   } else {
    //     return true;
    //   }
    // } else {
    //   return false;
    // }
    return false;
  }
}

extension MediaQueryExtension on BuildContext {
  double get height => MediaQuery.of(this).size.height;

  double get bodyHeight =>
      MediaQuery.of(this).size.height -
          MediaQuery.of(this).viewPadding.top -
          MediaQuery.of(this).viewInsets.top;

  double get bodyHeightWithoutAppBar => bodyHeight - 53;

  double get width => MediaQuery.of(this).size.width;

  double get px => MediaQuery.of(this).devicePixelRatio;

  double get keyBoardHeight => MediaQuery.of(this).viewInsets.bottom;

  bool get isRTLDirection {
    final TextDirection currentDirection = Directionality.of(this);
    return currentDirection == TextDirection.rtl;
  }
}