part of 'explore_imports.dart';

enum ExploreKind { all, sea, desert, culture }

/// Discover: the map and the list read the same filtered results, so a pin
/// narrows the list to its place and the list's count is what the map shows.
class ExploreController {
  final TextEditingController search = TextEditingController();
  final DraggableScrollableController sheet = DraggableScrollableController();
  final ObsValue<String> queryObs = ObsValue.withInit('');
  final ObsValue<int> dayObs = ObsValue.withInit(0);
  final ObsValue<ExploreKind> kindObs = ObsValue.withInit(ExploreKind.all);
  final ObsValue<String?> placeObs = ObsValue.withInit(null);

  static const sheetMin = 0.3;
  static const sheetMid = 0.52;
  static const sheetMax = 0.94;

  ExploreController() {
    search.addListener(() => queryObs.setValue(search.text.trim()));
  }

  DateTime get day => RehlaDates.dateOnly(DateTime.now()).add(Duration(days: dayObs.getValue()));

  /// Opened from a Home pictogram: today, everywhere, this kind of outing.
  void focus({required ExploreKind kind, String query = ''}) {
    kindObs.setValue(kind);
    placeObs.setValue(null);
    dayObs.setValue(0);
    search.text = query;
  }

  void selectPlace(String? placeId) {
    placeObs.setValue(placeObs.getValue() == placeId ? null : placeId);
    if (placeObs.getValue() != null && sheet.isAttached && sheet.size < sheetMid) {
      sheet.animateTo(sheetMid, duration: const Duration(milliseconds: 360), curve: Curves.easeOutCubic);
    }
  }

  /// Open on [day]: in season, and on today only if a departure is still ahead.
  List<Experience> results(List<Experience> all, LiveConditions? live, {bool anyPlace = false}) {
    final d = day;
    final now = DateTime.now();
    final q = queryObs.getValue().toLowerCase();
    final kind = kindObs.getValue();
    final place = anyPlace ? null : placeObs.getValue();
    final out = all.where((e) {
      if (!e.openOn(d)) return false;
      if (dayObs.getValue() == 0 && e.bookable.timeSlots.isNotEmpty) {
        final ahead = e.bookable.timeSlots.any((s) {
          final at = RehlaDates.at(d, s);
          return at == null || at.subtract(const Duration(minutes: 45)).isAfter(now);
        });
        if (!ahead) return false;
      }
      if (place != null && e.placeId != place) return false;
      if (!kindMatches(e, kind)) return false;
      if (q.isNotEmpty && !queryMatches(e, q)) return false;
      return true;
    }).toList();
    out.sort((a, b) {
      final wa = a.windOk(live?.windKnots) ? 0 : 1;
      final wb = b.windOk(live?.windKnots) ? 0 : 1;
      if (wa != wb) return wa - wb;
      return a.bookable.priceEgp.compareTo(b.bookable.priceEgp);
    });
    return out;
  }

  static bool kindMatches(Experience e, ExploreKind kind) {
    switch (kind) {
      case ExploreKind.all:
        return true;
      case ExploreKind.sea:
        return e.isWater;
      case ExploreKind.desert:
        return !e.isWater && e.category != 'culture';
      case ExploreKind.culture:
        return e.category == 'culture' || RegExp('bedouin|moses|catherine|stargaz', caseSensitive: false).hasMatch(e.titleEn);
    }
  }

  static const _synonyms = <String, String>{
    'غطس': 'dive|diving|scuba',
    'غوص': 'dive|diving|scuba',
    'سنوركل': 'snorkel',
    'صحر': 'desert|safari|quad|canyon',
    'سفاري': 'safari',
    'غروب': 'sunset',
    'هادي': 'snorkel|glass|stargaz|pools',
    'quiet': 'snorkel|glass|stargaz|pools',
    'أكل': 'feast|dinner|zarbed',
    'food': 'feast|dinner|zarbed',
    'جبل': 'mount|moses|twilat|climb',
    'كايت': 'kite|surf|wind',
    'مركب': 'boat',
    'تسلق': 'climb|boulder',
  };

  /// [q] is lower-cased; Arabic and mood words map onto English titles.
  static bool queryMatches(Experience e, String q) {
    final hay = [
      e.titleEn,
      e.titleAr,
      e.place?.nameEn ?? '',
      e.place?.nameAr ?? '',
      e.bookable.supplierEn,
      e.bookable.supplierAr,
      e.category,
    ].join(' ').toLowerCase();
    if (hay.contains(q)) return true;
    for (final entry in _synonyms.entries) {
      if (q.contains(entry.key) && RegExp(entry.value, caseSensitive: false).hasMatch(e.titleEn)) return true;
    }
    return false;
  }

  void dispose() {
    search.dispose();
    sheet.dispose();
  }
}
