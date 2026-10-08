import 'dart:convert';

import 'package:rehla/core/helpers/rehla_dates.dart';
import 'package:rehla/features/experiences/domain/models/experience.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// One block in DayGi's plan: a real catalogue outing at one of its own
/// departure times. Prices are the SKU's, never estimated.
class PlanBlock {
  final String experienceId;
  final int day;
  final String slot;

  const PlanBlock({required this.experienceId, required this.day, required this.slot});

  int get minutes => int.tryParse(RehlaDates.slot(slot).replaceAll(':', '')) ?? 0;

  Map<String, dynamic> toJson() => {'e': experienceId, 'd': day, 's': slot};

  factory PlanBlock.fromJson(Map<String, dynamic> json) =>
      PlanBlock(experienceId: json['e'] as String, day: (json['d'] as num).toInt(), slot: json['s'] as String? ?? '');
}

/// The plan under the chat. It changes block by block (add, swap, remove)
/// and is never regenerated from scratch.
class DayPlan {
  static const _key = 'rehla_daygi_plan_v1';

  final int days;
  final List<PlanBlock> blocks;

  const DayPlan({this.days = 3, this.blocks = const []});

  List<PlanBlock> on(int day) => blocks.where((b) => b.day == day).toList()..sort((a, b) => a.minutes.compareTo(b.minutes));

  bool has(String experienceId) => blocks.any((b) => b.experienceId == experienceId);

  DayPlan withDays(int value) => DayPlan(days: value, blocks: blocks.where((b) => b.day <= value).toList());

  /// Adds [e] on [day] at its first departure that does not collide.
  DayPlan add(Experience e, int day) {
    final taken = on(day).map((b) => b.minutes).toSet();
    final slots = e.bookable.timeSlots.isEmpty ? ['09:00'] : e.bookable.timeSlots;
    final slot = slots.firstWhere(
      (s) => !taken.contains(int.tryParse(RehlaDates.slot(s).replaceAll(':', '')) ?? -1),
      orElse: () => slots.first,
    );
    return DayPlan(days: days, blocks: [...blocks, PlanBlock(experienceId: e.id, day: day, slot: slot)]);
  }

  DayPlan swap(PlanBlock block, Experience replacement) {
    final slots = replacement.bookable.timeSlots;
    final slot = slots.isEmpty ? block.slot : slots.first;
    return DayPlan(
      days: days,
      blocks: [
        for (final b in blocks)
          if (identical(b, block)) PlanBlock(experienceId: replacement.id, day: b.day, slot: slot) else b,
      ],
    );
  }

  DayPlan remove(PlanBlock block) => DayPlan(days: days, blocks: blocks.where((b) => !identical(b, block)).toList());

  static Future<DayPlan> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return const DayPlan();
    try {
      final map = jsonDecode(raw) as Map<String, dynamic>;
      return DayPlan(
        days: (map['days'] as num?)?.toInt() ?? 3,
        blocks: (map['blocks'] as List).whereType<Map>().map((b) => PlanBlock.fromJson(Map<String, dynamic>.from(b))).toList(),
      );
    } catch (_) {
      return const DayPlan();
    }
  }

  Future<void> save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode({'days': days, 'blocks': blocks.map((b) => b.toJson()).toList()}));
  }
}
