import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:rehla/features/plan/data/models/programme_model/programme_model.dart';
import 'package:rehla/features/plan/domain/matching/plan_matcher.dart';
import 'package:rehla/features/plan/domain/models/plan_answers.dart';
import 'package:rehla/core/theme/destination/rehla_destination.dart';

/// The app must rank plans exactly like the website. The fixture is produced
/// by the website's own matcher (src/services/planMatcher.ts) over the real
/// programme catalogue; regenerate it when either changes.
void main() {
  final fixture = jsonDecode(File('test/fixtures/plan_parity.json').readAsStringSync()) as Map<String, dynamic>;
  final programmes = [
    for (final p in fixture['programmes'] as List) ProgrammeModel.fromJson(p as Map<String, dynamic>).toDomainModel(),
  ];

  // The website encodes pace/budget by their wire names; the app's answers
  // use enums, so translate the fixture's answers.
  PlanAnswers answersOf(Map<String, dynamic> a) => PlanAnswers.fromJson({
    ...a,
    'pace': a['pace'] == null ? null : PlanPace.fromWire(a['pace'] as String).name,
    'budget': a['budget'] == null ? null : PlanBudget.fromWire(a['budget'] as String).name,
  });

  String kindOf(MatchReason r) => switch (r) {
    VibesReason() => 'vibes',
    PaceReason() => 'pace',
    BudgetReason() => 'budget',
    LengthReason() => 'length',
    FamilyReason() => 'family',
    CoupleReason() => 'couple',
  };

  test('maps every programme in the catalogue', () {
    expect(programmes, isNotEmpty);
    expect(programmes.map((p) => p.destination.name).toSet(), containsAll(['dahab', 'nuweiba', 'siwa']));
  });

  test('ranks, scores and explains like the website for every fixture case', () {
    final cases = fixture['cases'] as List;
    for (final c in cases) {
      final answers = answersOf((c as Map<String, dynamic>)['answers'] as Map<String, dynamic>);
      final expected = c['ranked'] as List;
      final actual = PlanMatcher.rank(programmes, answers);
      final where = jsonEncode(c['answers']);
      expect(actual.map((m) => m.programme.id).toList(), expected.map((e) => e['id']).toList(), reason: 'order for $where');
      expect(actual.map((m) => m.score).toList(), expected.map((e) => e['score']).toList(), reason: 'scores for $where');
      expect(
        actual.map((m) => m.reasons.map(kindOf).toList()).toList(),
        expected.map((e) => List<String>.from(e['reasons'] as List)).toList(),
        reason: 'reasons for $where',
      );
    }
  });

  test('answers survive a save and restore', () {
    final a = PlanAnswers.fromJson({
      'destination': 'siwa',
      'nights': 3,
      'party': 'couple',
      'vibes': ['wellness', 'stars'],
      'pace': 'relaxed',
      'budget': 'premium',
    });
    final back = PlanAnswers.fromJson(a.toJson());
    expect(back.toJson(), a.toJson());
  });

  test('switching place drops vibes the new place does not offer', () {
    const a = PlanAnswers(destination: RehlaDestination.dahab, vibes: []);
    final withDiving = a.copyWith(vibes: [...vibesByDestination[a.destination]!.take(2)]);
    final inSiwa = withDiving.copyWith(destination: RehlaDestination.siwa);
    expect(inSiwa.vibes.every(vibesByDestination[inSiwa.destination]!.contains), isTrue);
  });
}
