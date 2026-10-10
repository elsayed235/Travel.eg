import 'package:rehla/features/plan/domain/models/plan_vibe.dart';

/// A door into the place (website: CATEGORY_DOORS). A door either starts the
/// planner already set to what it promised ([planVibes]) or, for verticals the
/// app does not list yet, asks DayGi the question for you ([askEn]/[askAr]).
class DiscoverDoor {
  final String id;
  final String labelEn;
  final String labelAr;
  final List<PlanVibe> planVibes;
  final String? askEn;
  final String? askAr;

  const DiscoverDoor({
    required this.id,
    required this.labelEn,
    required this.labelAr,
    this.planVibes = const [],
    this.askEn,
    this.askAr,
  });

  /// Line icon in assets/icons/doors, named after the door.
  String get icon => 'assets/icons/doors/$id.svg';

  /// The website's dimensional pictogram for the door (assets/pictograms),
  /// rendered from the same artwork so both read as one brand.
  String get pictogram => 'assets/pictograms/$id.svg';

  String label(bool arabic) => arabic ? labelAr : labelEn;
  String? ask(bool arabic) => arabic ? askAr : askEn;
  bool get asksDaygi => askEn != null;
}
