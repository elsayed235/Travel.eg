import 'package:flutter/material.dart';
import 'package:rehla/core/constants/gaps.dart';
import 'package:rehla/core/theme/app_radius.dart';
import 'package:rehla/core/theme/app_spacing.dart';
import 'package:rehla/core/theme/colors/colors_extension.dart';
import 'package:rehla/core/theme/text/app_text_style.dart';
import 'package:rehla/core/utils/arabic_numerals.dart';

class DayAvailability {
  final int available;
  final int total;

  const DayAvailability({required this.available, required this.total});

  bool get isBooked => available <= 0;
  bool get isFree => available >= total && total > 0;
  bool get isPartial => available > 0 && available < total;
}

/// Horizontal day strip: free / partial / booked / picked.
class AppAvailabilityCalendar extends StatelessWidget {
  final DateTime month;
  final Map<DateTime, DayAvailability> data;
  final DateTime? selected;
  final ValueChanged<DateTime> onPick;

  const AppAvailabilityCalendar({
    super.key,
    required this.month,
    required this.data,
    required this.selected,
    required this.onPick,
  });

  static DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

  static const _weekdayLabels = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];

  /// Saturday-first index matching Arabic marketplace calendars.
  int _satFirstIndex(DateTime d) => d.weekday % 7;

  @override
  Widget build(BuildContext context) {
    final daysInMonth = DateUtils.getDaysInMonth(month.year, month.month);
    final days = List.generate(
      daysInMonth,
      (i) => DateTime(month.year, month.month, i + 1),
    );

    return SizedBox(
      height: 72,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: days.length,
        separatorBuilder: (_, _) => Gaps.hGap6,
        itemBuilder: (context, index) {
          final day = days[index];
          final key = _dateOnly(day);
          final availability = data[key];
          final isSelected = selected != null && _dateOnly(selected!) == key;
          return _DayCell(
            weekdayLabel: _weekdayLabels[_satFirstIndex(day)],
            dayNumber: day.day.toArabicDigits,
            isSelected: isSelected,
            isBooked: availability?.isBooked ?? false,
            isPartial: availability?.isPartial ?? false,
            onTap: availability?.isBooked == true ? null : () => onPick(day),
          );
        },
      ),
    );
  }
}

class _DayCell extends StatelessWidget {
  final String weekdayLabel;
  final String dayNumber;
  final bool isSelected;
  final bool isBooked;
  final bool isPartial;
  final VoidCallback? onTap;

  const _DayCell({
    required this.weekdayLabel,
    required this.dayNumber,
    required this.isSelected,
    required this.isBooked,
    required this.isPartial,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color bg;
    final Color fg;
    if (isSelected) {
      bg = context.colors.button;
      fg = context.colors.onButton;
    } else if (isPartial) {
      bg = context.colors.amberBg;
      fg = context.colors.amber;
    } else if (isBooked) {
      bg = context.colors.surface2;
      fg = context.colors.text3;
    } else {
      bg = context.colors.surface2;
      fg = context.colors.text2;
    }

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOutCubic,
        width: 42,
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: AppRadius.buttonAll,
          border: Border.all(
            color: isSelected ? context.colors.button : context.colors.line,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              weekdayLabel,
              style: AppTextStyle.micro(color: fg),
            ),
            Gaps.vGap4,
            Text(
              dayNumber,
              style: AppTextStyle.caption(color: fg).copyWith(
                fontWeight: FontWeight.w600,
                decoration: isBooked && !isSelected ? TextDecoration.lineThrough : null,
                decorationColor: fg,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
