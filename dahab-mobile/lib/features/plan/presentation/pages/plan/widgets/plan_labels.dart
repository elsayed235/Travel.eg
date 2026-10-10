part of 'plan_widgets_imports.dart';

/// Copy and icons for the planner's options, in one place.
class PlanLabels {
  const PlanLabels._();

  static String question(PlanStep s) => switch (s) {
    PlanStep.destination => Translate.s.plan_q_destination,
    PlanStep.when => Translate.s.plan_q_when,
    PlanStep.party => Translate.s.plan_q_party,
    PlanStep.vibes => Translate.s.plan_q_vibes,
    PlanStep.pace => Translate.s.plan_q_pace,
    PlanStep.budget => Translate.s.plan_q_budget,
  };

  static String? hint(PlanStep s) => switch (s) {
    PlanStep.when => Translate.s.plan_q_whenHint,
    PlanStep.vibes => Translate.s.plan_q_vibesHint,
    _ => null,
  };

  static String vibe(PlanVibe v) => switch (v) {
    PlanVibe.sea => Translate.s.plan_vibe_sea,
    PlanVibe.diving => Translate.s.plan_vibe_diving,
    PlanVibe.adventure => Translate.s.plan_vibe_adventure,
    PlanVibe.desert => Translate.s.plan_vibe_desert,
    PlanVibe.wellness => Translate.s.plan_vibe_wellness,
    PlanVibe.culture => Translate.s.plan_vibe_culture,
    PlanVibe.food => Translate.s.plan_vibe_food,
    PlanVibe.unplug => Translate.s.plan_vibe_unplug,
    PlanVibe.stars => Translate.s.plan_vibe_stars,
    PlanVibe.nature => Translate.s.plan_vibe_nature,
  };

  static String vibeIcon(PlanVibe v) => switch (v) {
    PlanVibe.sea => AppIcons.waves,
    PlanVibe.diving => AppIcons.dive,
    PlanVibe.adventure => AppIcons.mountain,
    PlanVibe.desert => AppIcons.mountain,
    PlanVibe.wellness => AppIcons.wellness,
    PlanVibe.culture => AppIcons.bank,
    PlanVibe.food => AppIcons.food,
    PlanVibe.unplug => AppIcons.offline,
    PlanVibe.stars => AppIcons.sparkle,
    PlanVibe.nature => AppIcons.hike,
  };

  static String party(PlanParty p) => switch (p) {
    PlanParty.solo => Translate.s.plan_party_solo,
    PlanParty.couple => Translate.s.plan_party_couple,
    PlanParty.friends => Translate.s.plan_party_friends,
    PlanParty.family => Translate.s.plan_party_family,
  };

  static String partySub(PlanParty p) => switch (p) {
    PlanParty.solo => Translate.s.plan_party_soloSub,
    PlanParty.couple => Translate.s.plan_party_coupleSub,
    PlanParty.friends => Translate.s.plan_party_friendsSub,
    PlanParty.family => Translate.s.plan_party_familySub,
  };

  static String partyIcon(PlanParty p) => switch (p) {
    PlanParty.solo => AppIcons.user,
    PlanParty.couple => AppIcons.heart,
    PlanParty.friends => AppIcons.group,
    PlanParty.family => AppIcons.group,
  };

  static String pace(PlanPace p) => switch (p) {
    PlanPace.relaxed => Translate.s.plan_pace_relaxed,
    PlanPace.balanced => Translate.s.plan_pace_balanced,
    PlanPace.active => Translate.s.plan_pace_active,
  };

  static String paceSub(PlanPace p) => switch (p) {
    PlanPace.relaxed => Translate.s.plan_pace_relaxedSub,
    PlanPace.balanced => Translate.s.plan_pace_balancedSub,
    PlanPace.active => Translate.s.plan_pace_activeSub,
  };

  static String budget(PlanBudget b) => switch (b) {
    PlanBudget.budget => Translate.s.plan_budget_budget,
    PlanBudget.moderate => Translate.s.plan_budget_moderate,
    PlanBudget.premium => Translate.s.plan_budget_premium,
  };

  static String sort(PlanSort s) => switch (s) {
    PlanSort.best => Translate.s.plan_sort_best,
    PlanSort.price => Translate.s.plan_sort_price,
    PlanSort.short => Translate.s.plan_sort_short,
    PlanSort.calm => Translate.s.plan_sort_calm,
  };

  static String reason(MatchReason r) => switch (r) {
    VibesReason(:final matched, :final asked) => Translate.s.plan_reason_vibes(matched, asked),
    PaceReason() => Translate.s.plan_reason_pace,
    BudgetReason() => Translate.s.plan_reason_budget,
    LengthReason(:final days) => Translate.s.plan_reason_length(days),
    FamilyReason() => Translate.s.plan_reason_family,
    CoupleReason() => Translate.s.plan_reason_couple,
  };
}
