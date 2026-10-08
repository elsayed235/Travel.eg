import 'package:rehla/features/plan/domain/models/plan_vibe.dart';

/// A hand-picked moment of the place. Carries no price: picks lead to the
/// planner, where prices come from the server.
class EditorialPick {
  final String id;
  final String titleEn;
  final String titleAr;
  final String metaEn;
  final String metaAr;
  final String image;
  final List<PlanVibe> vibes;

  const EditorialPick({
    required this.id,
    required this.titleEn,
    required this.titleAr,
    required this.metaEn,
    required this.metaAr,
    required this.image,
    required this.vibes,
  });

  String title(bool arabic) => arabic ? titleAr : titleEn;
  String meta(bool arabic) => arabic ? metaAr : metaEn;
}
