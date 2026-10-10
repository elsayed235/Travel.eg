part of '../explore_imports.dart';

enum SearchDuration { any, short, half, full }

enum SearchSort { best, priceLow, priceHigh, short }

/// What the traveler narrowed the catalogue to. Immutable so the filter
/// sheet can edit a draft and count its results before applying it.
@immutable
class SearchFilters {
  final int? day;
  final num? maxPrice;
  final SearchDuration duration;
  final bool beginner;
  final bool windOk;
  final SearchSort sort;

  const SearchFilters({
    this.day,
    this.maxPrice,
    this.duration = SearchDuration.any,
    this.beginner = false,
    this.windOk = false,
    this.sort = SearchSort.best,
  });

  /// Filters that narrow the list; sorting only reorders it.
  int get count =>
      (day != null ? 1 : 0) +
      (maxPrice != null ? 1 : 0) +
      (duration != SearchDuration.any ? 1 : 0) +
      (beginner ? 1 : 0) +
      (windOk ? 1 : 0);

  bool get isDefault => count == 0 && sort == SearchSort.best;

  SearchFilters copyWith({
    int? Function()? day,
    num? Function()? maxPrice,
    SearchDuration? duration,
    bool? beginner,
    bool? windOk,
    SearchSort? sort,
  }) =>
      SearchFilters(
        day: day != null ? day() : this.day,
        maxPrice: maxPrice != null ? maxPrice() : this.maxPrice,
        duration: duration ?? this.duration,
        beginner: beginner ?? this.beginner,
        windOk: windOk ?? this.windOk,
        sort: sort ?? this.sort,
      );

  List<Experience> apply(List<Experience> all, LiveConditions? live, ExploreKind kind, String query) {
    final q = query.trim().toLowerCase();
    final now = DateTime.now();
    final d = day == null ? null : RehlaDates.dateOnly(now).add(Duration(days: day!));
    final out = all.where((e) {
      if (d != null) {
        if (!e.openOn(d)) return false;
        if (day == 0 && e.bookable.timeSlots.isNotEmpty) {
          final ahead = e.bookable.timeSlots.any((s) {
            final at = RehlaDates.at(d, s);
            return at == null || at.subtract(const Duration(minutes: 45)).isAfter(now);
          });
          if (!ahead) return false;
        }
      }
      if (!ExploreController.kindMatches(e, kind)) return false;
      if (q.isNotEmpty && !ExploreController.queryMatches(e, q)) return false;
      if (maxPrice != null && e.bookable.priceEgp > maxPrice!) return false;
      final m = e.durationMinutes;
      switch (duration) {
        case SearchDuration.any:
          break;
        case SearchDuration.short:
          if (m <= 0 || m >= 180) return false;
        case SearchDuration.half:
          if (m < 180 || m > 360) return false;
        case SearchDuration.full:
          if (m <= 360) return false;
      }
      if (beginner && !e.firstTimerFriendly) return false;
      if (windOk && !e.windOk(live?.windKnots)) return false;
      return true;
    }).toList();
    int byPrice(Experience a, Experience b) => a.bookable.priceEgp.compareTo(b.bookable.priceEgp);
    switch (sort) {
      case SearchSort.best:
        out.sort((a, b) {
          final wa = a.windOk(live?.windKnots) ? 0 : 1;
          final wb = b.windOk(live?.windKnots) ? 0 : 1;
          return wa != wb ? wa - wb : byPrice(a, b);
        });
      case SearchSort.priceLow:
        out.sort(byPrice);
      case SearchSort.priceHigh:
        out.sort((a, b) => byPrice(b, a));
      case SearchSort.short:
        out.sort((a, b) => (a.durationMinutes <= 0 ? 9999 : a.durationMinutes)
            .compareTo(b.durationMinutes <= 0 ? 9999 : b.durationMinutes));
    }
    return out;
  }
}
