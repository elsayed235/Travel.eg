import 'package:collection/collection.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/features/plan/domain/models/programme_domain_model.dart';

/// The guided planner's matching rule — a straight port of the website's
/// src/services/planMatcher.ts so the app and the site rank plans the same way.
///
/// Deterministic on purpose: answers are scored against each programme's own
/// attributes and every score carries the reasons that produced it, so the UI
/// can say why a plan fits instead of asking to be trusted.
sealed class MatchReason {
  const MatchReason();
}

class VibesReason extends MatchReason {
  final int matched;
  final int asked;
  const VibesReason(this.matched, this.asked);
}

class PaceReason extends MatchReason {
  const PaceReason();
}

class BudgetReason extends MatchReason {
  const BudgetReason();
}

class LengthReason extends MatchReason {
  final int days;
  const LengthReason(this.days);
}

class FamilyReason extends MatchReason {
  const FamilyReason();
}

class CoupleReason extends MatchReason {
  const CoupleReason();
}

class PlanMatch {
  final ProgrammeDomainModel programme;

  /// 0–100.
  final int score;
  final List<MatchReason> reasons;

  const PlanMatch(this.programme, this.score, this.reasons);
}

enum PlanSort { best, price, short, calm }

class PlanMatcher {
  const PlanMatcher._();

  static PlanMatch score(ProgrammeDomainModel p, PlanAnswers a) {
    final reasons = <MatchReason>[];
    final tags = p.interests.toSet();
    double score = 0;

    // Vibes — 45
    if (a.vibes.isNotEmpty) {
      final matched = a.vibes.where((v) => v.tags.any(tags.contains)).length;
      score += 45 * (matched / a.vibes.length);
      if (matched > 0) reasons.add(VibesReason(matched, a.vibes.length));
    } else {
      score += 27;
    }

    // Pace — 25
    if (a.pace != null) {
      final d = (a.pace!.index - p.pace.index).abs();
      score += d == 0 ? 25 : (d == 1 ? 12 : 0);
      if (d == 0) reasons.add(const PaceReason());
    } else {
      score += 15;
    }

    // Budget — 15. Spending less than planned is still a fit; stretching is not.
    if (a.budget != null) {
      final d = (a.budget!.index - p.budget.index).abs();
      final under = p.budget.index <= a.budget!.index;
      score += d == 0 ? 15 : (under ? 11 : (d == 1 ? 5 : 0));
      if (d == 0 || under) reasons.add(const BudgetReason());
    } else {
      score += 10;
    }

    // Length — 15 (a stay of N nights is N + 1 days)
    if (a.nights != null) {
      final off = (p.durationDays - (a.nights! + 1)).abs();
      score += 15 * (1 - off / 4).clamp(0, 1);
      if (off <= 1) reasons.add(LengthReason(p.durationDays));
    } else {
      score += 12;
    }

    // Party nudges
    if (a.party == PlanParty.family) {
      if (p.intensityScore >= 4) {
        score -= 12;
      } else if (p.intensityScore <= 2) {
        score += 4;
        reasons.add(const FamilyReason());
      }
    }
    if (a.party == PlanParty.couple && p.idealForEn.toLowerCase().contains('couple')) {
      score += 6;
      reasons.add(const CoupleReason());
    }
    if (a.party == PlanParty.friends && p.pace == PlanPace.active) score += 4;

    // JS Math.round rounds .5 up; Dart's round() rounds half away from zero —
    // identical for the non-negative scores here.
    return PlanMatch(p, score.clamp(0, 100).round(), reasons);
  }

  /// Programmes of the chosen destination, best first; ties go to the shorter trip.
  static List<PlanMatch> rank(List<ProgrammeDomainModel> programmes, PlanAnswers a) {
    final list = programmes.where((p) => p.destination == a.destination).map((p) => score(p, a)).toList();
    // Stable, like Array.prototype.sort, so equal plans keep catalogue order.
    mergeSort(
      list,
      compare: (x, y) {
        final byScore = y.score.compareTo(x.score);
        return byScore != 0 ? byScore : x.programme.durationDays.compareTo(y.programme.durationDays);
      },
    );
    return list;
  }

  static List<PlanMatch> sort(List<PlanMatch> matches, PlanSort by) {
    final list = [...matches];
    switch (by) {
      case PlanSort.price:
        mergeSort(list, compare: (a, b) => a.programme.startingPriceEgp.compareTo(b.programme.startingPriceEgp));
      case PlanSort.short:
        mergeSort(list, compare: (a, b) => a.programme.durationDays.compareTo(b.programme.durationDays));
      case PlanSort.calm:
        mergeSort(list, compare: (a, b) => a.programme.intensityScore.compareTo(b.programme.intensityScore));
      case PlanSort.best:
        mergeSort(list, compare: (a, b) => b.score.compareTo(a.score));
    }
    return list;
  }
}
