part of '../explore_imports.dart';

/// Search line over the map, then one-tap dates.
class BuildExploreTop extends StatelessWidget {
  final ExploreController controller;

  const BuildExploreTop({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
          child: Container(
            height: 50,
            decoration: BoxDecoration(
              color: colors.surface1,
              borderRadius: AppRadius.chipAll,
              border: Border.all(color: colors.line),
            ),
            child: Row(
              children: [
                Gaps.hGap16,
                AppIcon.ui(AppIcons.search, size: 18, color: colors.text3),
                Gaps.hGap8,
                Expanded(
                  child: TextField(
                    controller: controller.search,
                    textInputAction: TextInputAction.search,
                    style: AppTextStyle.s14_w400(color: colors.text),
                    decoration: InputDecoration(
                      isCollapsed: true,
                      filled: false,
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      hintText: Translate.s.map_search_hint,
                      hintStyle: AppTextStyle.s14_w400(color: colors.text3),
                    ),
                  ),
                ),
                ObsValueConsumer(
                  observable: controller.queryObs,
                  builder: (context, q) => q.isEmpty
                      ? Gaps.hGap16
                      : IconButton(
                          onPressed: controller.search.clear,
                          icon: AppIcon.ui(AppIcons.close, size: 16, color: colors.text3),
                          tooltip: MaterialLocalizations.of(context).deleteButtonTooltip,
                        ),
                ),
              ],
            ),
          ),
        ),
        Gaps.vGap10,
        SizedBox(
          height: 36,
          child: ObsValueConsumer(
            observable: controller.dayObs,
            builder: (context, selected) {
              final today = RehlaDates.dateOnly(DateTime.now());
              return ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH),
                itemCount: 7,
                separatorBuilder: (_, _) => Gaps.hGap6,
                itemBuilder: (context, i) {
                  final d = today.add(Duration(days: i));
                  final label = i == 0
                      ? Translate.s.book_today
                      : i == 1
                          ? Translate.s.book_tomorrow
                          : '${RehlaDates.weekday(d, arabic)} ${d.day}';
                  return ExplorePill(
                    label: label,
                    selected: selected == i,
                    floating: true,
                    onTap: () => controller.dayObs.setValue(i),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}

class ExplorePill extends StatelessWidget {
  final String label;
  final bool selected;
  final bool floating;
  final String? icon;
  final VoidCallback onTap;

  const ExplorePill({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.floating = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final fg = selected ? colors.onButton : colors.text;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
        decoration: BoxDecoration(
          color: selected ? colors.button : (floating ? colors.surface1 : colors.surface2),
          borderRadius: AppRadius.chipAll,
          border: Border.all(color: selected ? colors.button : colors.line),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[AppIcon.ui(icon!, size: 14, color: fg), Gaps.hGap4],
            Text(label, style: AppTextStyle.s13_w500(color: fg).copyWith(height: 1.3)),
          ],
        ),
      ),
    );
  }
}
