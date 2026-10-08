import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';

class AppBottomNavItem {
  final IconData icon;
  final String label;

  const AppBottomNavItem({required this.icon, required this.label});
}

/// Bottom nav with a filled square center action (not a FAB).
class AppBottomNav extends StatelessWidget {
  final int index;
  final ValueChanged<int> onChanged;
  final List<AppBottomNavItem> items;
  final String centerLabel;
  final VoidCallback? onCenterTap;

  const AppBottomNav({
    super.key,
    required this.index,
    required this.onChanged,
    required this.items,
    required this.centerLabel,
    this.onCenterTap,
  }) : assert(items.length == 4, 'AppBottomNav expects 4 side items around the center action');

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: context.colors.bg,
        border: Border(top: BorderSide(color: context.colors.line)),
      ),
      padding: EdgeInsetsDirectional.only(
        start: AppSpacing.sm,
        end: AppSpacing.sm,
        top: AppSpacing.sm,
        bottom: MediaQuery.paddingOf(context).bottom + AppSpacing.sm,
      ),
      child: Row(
        children: [
          Expanded(child: _NavSide(item: items[0], selected: index == 0, onTap: () => onChanged(0))),
          Expanded(child: _NavSide(item: items[1], selected: index == 1, onTap: () => onChanged(1))),
          _CenterAction(label: centerLabel, onTap: onCenterTap),
          Expanded(child: _NavSide(item: items[2], selected: index == 2, onTap: () => onChanged(2))),
          Expanded(child: _NavSide(item: items[3], selected: index == 3, onTap: () => onChanged(3))),
        ],
      ),
    );
  }
}

class _NavSide extends StatelessWidget {
  final AppBottomNavItem item;
  final bool selected;
  final VoidCallback onTap;

  const _NavSide({required this.item, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final color = selected ? context.colors.text : context.colors.text3;
    return InkWell(
      onTap: onTap,
      splashFactory: NoSplash.splashFactory,
      highlightColor: Colors.transparent,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(item.icon, size: 22, color: color),
          Gaps.vGap4,
          Text(item.label, style: AppTextStyle.micro(color: color)),
        ],
      ),
    );
  }
}

class _CenterAction extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;

  const _CenterAction({required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Material(
            color: context.colors.button,
            borderRadius: AppRadius.buttonAll,
            child: InkWell(
              onTap: onTap,
              borderRadius: AppRadius.buttonAll,
              splashFactory: NoSplash.splashFactory,
              child: SizedBox(
                width: 44,
                height: 44,
                child: Icon(Icons.add, color: context.colors.onButton, size: 24),
              ),
            ),
          ),
          Gaps.vGap4,
          Text(label, style: AppTextStyle.micro(color: context.colors.text)),
        ],
      ),
    );
  }
}
