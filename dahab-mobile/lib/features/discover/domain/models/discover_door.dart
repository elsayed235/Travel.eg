import 'package:flutter/widgets.dart';
import 'package:rehla/features/plan/domain/models/plan_vibe.dart';

/// A door into the place (website: CATEGORY_DOORS). A door either starts the
/// planner already set to what it promised ([planVibes]) or, for verticals the
/// app does not list yet, asks DayGi the question for you ([askEn]/[askAr]).
class DiscoverDoor {
  final String id;
  final IconData icon;
  final String labelEn;
  final String labelAr;
  final List<PlanVibe> planVibes;
  final String? askEn;
  final String? askAr;

  const DiscoverDoor({
    required this.id,
    required this.icon,
    required this.labelEn,
    required this.labelAr,
    this.planVibes = const [],
    this.askEn,
    this.askAr,
  });

  String label(bool arabic) => arabic ? labelAr : labelEn;
  String? ask(bool arabic) => arabic ? askAr : askEn;
  bool get asksDaygi => askEn != null;
}
