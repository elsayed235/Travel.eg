import 'package:flutter/material.dart';
import 'package:rehla/core/constants/dimens.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/widgets/bottom_sheet_views/draggable_scrollable/app_draggable_scrollable_sheet.dart';

class ScrollableBodyFixedHeaderDraggableSheet extends StatelessWidget {
  final Widget header;
  final ScrollableWidgetBuilder bodyBuilder;

  const ScrollableBodyFixedHeaderDraggableSheet({super.key, required this.header, required this.bodyBuilder});

  @override
  Widget build(BuildContext context) {
    return AppDraggableScrollableSheet(
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            borderRadius: Dimens.sheetBorderRadius,
            color: context.colors.surface1,
          ),
          padding: const EdgeInsetsDirectional.only(start: AppSpacing.xl, end: AppSpacing.xl, top: AppSpacing.xxl, bottom: AppSpacing.sm),
          child: NestedScrollView(
            physics: const NeverScrollableScrollPhysics(),
            controller: scrollController,
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                /// Header
                SliverToBoxAdapter(child: header)
              ];
            },
            body: bodyBuilder(context, scrollController),
          ),
        );
      },
    );
  }
}
