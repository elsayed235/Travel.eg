import 'package:flutter/material.dart';
import 'package:rehla/core/constants/dimens.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/widgets/base_form_option/options_listview/check_icon.dart';
import 'package:rehla/core/widgets/base_form_option/options_listview/option_item_widget.dart';
class SelectableOptionItemWidget extends StatelessWidget {
  final GestureTapCallback? onTap;
  final bool isSelected;
  final String title;
  final Widget? prefix;
  final TextStyle? selectedTextStyle;

  const SelectableOptionItemWidget({
    super.key,
    this.onTap,
    required this.isSelected,
    required this.title,
    this.prefix,
    this.selectedTextStyle,
  });

  TextStyle _selectedTextStyle(BuildContext context) =>
      selectedTextStyle ?? AppTextStyle.s14_w400(color: context.colors.black);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: InkWell(
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected ? context.colors.button : context.colors.line,
            ),
            borderRadius: Dimens.chipBorderRadius,
          ),
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            mainAxisSize: MainAxisSize.max,
            children: [
              Gaps.hGap8,
              CheckIcon(
                size: 24,
                color: isSelected ? context.colors.button : Colors.transparent,
              ),
              Expanded(
                child: OptionItemWidget(
                  constraints: const BoxConstraints(maxWidth: 290),
                  title: title,
                  prefix: prefix,
                  titleTextStyle: isSelected ? _selectedTextStyle(context) : null,
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
