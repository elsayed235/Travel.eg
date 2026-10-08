import 'package:rehla/features/experiences/domain/experience_catalogue.dart';
import 'package:rehla/features/experiences/domain/models/experience.dart';

/// Turns what was asked into real, bookable cards from the catalogue.
/// Words in either language map to what the outing is; nothing is invented.
class DaygiMatcher {
  const DaygiMatcher._();

  static const _topics = <String, String>{
    'snorkel|سنوركل|شعاب|reef': 'snorkel|reef|pools|eel',
    'dive|diving|scuba|غطس|غوص|غطسة': 'dive|scuba|bells',
    'sunset|غروب|stars|نجوم': 'sunset|stargaz|twilat',
    'desert|صحرا|صحراء|safari|سفاري|canyon|كانيون': 'desert|safari|canyon|quad|4x4',
    'boat|مركب|abu galum|أبو جالوم': 'boat|abu galum|glass bottom',
    'quiet|هادي|هادية|calm|relax|family|عيلة|أطفال': 'snorkel|glass bottom|pools|stargaz',
    'kite|كايت|wind|surf|windsurf': 'kite|surf|wind',
    'climb|تسلق|boulder': 'climb|boulder',
    'mountain|جبل|moses|موسى|sunrise|شروق': 'moses|twilat|mount',
    'first|أول مرة|beginner|مبتدئ|try': 'discover scuba|first|three pools|glass bottom',
    'food|أكل|dinner|عشا|bedouin|بدو': 'feast|zarbed|bedouin',
  };

  /// Up to [limit] outings for [prompt], those inside today's wind limit first.
  static List<Experience> match(String prompt, List<Experience> items, LiveConditions? live, {int limit = 3}) {
    final q = prompt.toLowerCase();
    final scores = <Experience, int>{};
    for (final entry in _topics.entries) {
      if (!RegExp(entry.key, caseSensitive: false).hasMatch(q)) continue;
      final kind = RegExp(entry.value, caseSensitive: false);
      for (final e in items) {
        if (kind.hasMatch(e.titleEn)) scores[e] = (scores[e] ?? 0) + 2;
      }
    }
    for (final e in items) {
      final place = e.place?.nameEn.toLowerCase() ?? '';
      if (place.isNotEmpty && q.contains(place.split(' ').first)) scores[e] = (scores[e] ?? 0) + 1;
    }
    final budget = RegExp(r'budget|cheap|رخيص|ميزانية قليلة|اقتصادي', caseSensitive: false).hasMatch(q);
    final now = DateTime.now();
    final ranked = scores.keys.where((e) => e.openOn(now)).toList()
      ..sort((a, b) {
        final wa = a.windOk(live?.windKnots) ? 0 : 1;
        final wb = b.windOk(live?.windKnots) ? 0 : 1;
        if (wa != wb) return wa - wb;
        final s = scores[b]!.compareTo(scores[a]!);
        if (s != 0) return s;
        return budget ? a.bookable.priceEgp.compareTo(b.bookable.priceEgp) : 0;
      });
    return ranked.take(limit).toList();
  }

  /// "3 days" · "٣ أيام" · "تلات أيام" → 3.
  static int? days(String prompt) {
    const words = {'يومين': 2, 'تلات': 3, 'ثلاث': 3, 'اربع': 4, 'أربع': 4, 'خمس': 5, 'ست': 6, 'سبع': 7, 'two': 2, 'three': 3, 'four': 4, 'five': 5};
    final normalized = prompt.replaceAllMapped(RegExp('[٠-٩]'), (m) => '${m[0]!.codeUnitAt(0) - 0x0660}');
    final digit = RegExp(r'(\d)\s*(days?|nights?|أيام|يوم|ليالي)', caseSensitive: false).firstMatch(normalized);
    if (digit != null) return int.parse(digit.group(1)!).clamp(1, 7);
    for (final w in words.entries) {
      if (RegExp('${w.key}\\s*(أيام|days)?', caseSensitive: false).hasMatch(prompt) &&
          (w.key == 'يومين' || RegExp('${w.key}\\s*(أيام|days)', caseSensitive: false).hasMatch(prompt))) {
        return w.value;
      }
    }
    return null;
  }
}
