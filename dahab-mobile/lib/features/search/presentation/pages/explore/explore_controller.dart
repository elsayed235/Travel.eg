part of 'explore_imports.dart';

class ExploreController {
  ExploreController({AiRepository? aiRepository})
      : _ai = aiRepository ?? defaultAiRepository();

  final AiRepository _ai;
  final ExploreRequester exploreRequester = ExploreRequester();
  final TextEditingController searchController = TextEditingController();

  final ObsValue<String> queryObs = ObsValue.withInit('');
  final ObsValue<String> categoryIdObs = ObsValue.withInit('all');
  final ObsValue<ExploreSort> sortObs = ObsValue.withInit(ExploreSort.nearest);
  final ObsValue<int> radiusKmObs = ObsValue.withInit(25);

  // Smart search: free text or voice, understood by the AI gateway.
  final ObsValue<SmartSearchDomainModel?> smartSearchObs = ObsValue.withInit(null);
  final ObsValue<bool> smartSearchingObs = ObsValue.withInit(false);
  final ObsValue<bool> listeningObs = ObsValue.withInit(false);

  bool _loaded = false;

  void ensureLoaded({int? defaultRadiusKm}) {
    if (defaultRadiusKm != null) {
      radiusKmObs.setValue(defaultRadiusKm);
    }
    if (_loaded) return;
    _loaded = true;
    exploreRequester.request();
  }

  void onQueryChanged(String value) {
    final smart = smartSearchObs.getValue();
    if (smart != null && smart.query != value.trim()) smartSearchObs.setValue(null);
    queryObs.setValue(value.trim());
  }

  /// Search button: short queries stay literal, sentences go to smart search.
  void onSearchPressed() {
    final text = searchController.text.trim();
    if (text.split(RegExp(r'\s+')).length >= 2) {
      runSmartSearch(text);
    } else {
      onQueryChanged(text);
    }
  }

  Future<void> runSmartSearch(String text) async {
    final query = text.trim();
    if (query.isEmpty || smartSearchingObs.getValue()) return;
    FocusManager.instance.primaryFocus?.unfocus();
    if (searchController.text != query) searchController.text = query;
    queryObs.setValue(query);
    smartSearchingObs.setValue(true);
    final result = await _ai.parseSearch(
      text: query,
      categoryIds: AppCategories.withAll.map((c) => c.id).where((id) => id != 'all').toList(),
    );
    smartSearchingObs.setValue(false);
    final smart = result.data;
    if (smart == null || smart.isEmpty) return;
    smartSearchObs.setValue(smart);
    AiTracker.track('ai_smart_search', {'has_category': smart.categoryId == null ? 0 : 1});
  }

  void clearSmartSearch() {
    smartSearchObs.setValue(null);
    searchController.clear();
    queryObs.setValue('');
  }

  Future<void> toggleVoiceSearch() async {
    final speech = SpeechInputService.instance;
    if (listeningObs.getValue()) {
      await speech.stop();
      return;
    }
    FocusManager.instance.primaryFocus?.unfocus();
    var heard = '';
    final started = await speech.start(
      onResult: (words, _) {
        heard = words;
        searchController.text = words;
      },
      onDone: () {
        if (!listeningObs.getValue()) return;
        listeningObs.setValue(false);
        if (heard.trim().isNotEmpty) {
          AiTracker.track('ai_voice_search');
          runSmartSearch(heard);
        }
      },
    );
    if (!started) {
      AppSnackBar.showSimpleToast(msg: Translate.s.ai_voice_unavailable);
      return;
    }
    listeningObs.setValue(true);
  }

  void onCategoryChanged(String id) => categoryIdObs.setValue(id);

  void onSortChanged(ExploreSort sort) => sortObs.setValue(sort);

  static const radiusOptions = [5, 15, 25, 50, 100];

  void setRadius(int km) => radiusKmObs.setValue(km);

  /// Next wider radius, or null when already at the widest.
  int? nextRadius() {
    final current = radiusKmObs.getValue();
    for (final km in radiusOptions) {
      if (km > current) return km;
    }
    return null;
  }

  void widenRadius() {
    final next = nextRadius();
    if (next != null) radiusKmObs.setValue(next);
  }

  /// Requests per category inside the current radius (for the chips).
  Map<String, int> categoryCounts(ExploreDomainModel data, int radiusKm) {
    final inRange = data.listings.where((l) => l.distanceKm <= radiusKm);
    final counts = <String, int>{'all': inRange.length};
    for (final l in inRange) {
      counts[l.categoryId] = (counts[l.categoryId] ?? 0) + 1;
    }
    return counts;
  }

  void openCreateRequest(BuildContext context) {
    AuthSession.requireAuthThen(
      context,
      () async => AutoRouter.of(context).push(CreateRequestRoute()),
    );
  }

  void openListing(BuildContext context, String listingId) {
    AutoRouter.of(context).push(ListingRoute(listingId: listingId));
  }

  List<ExploreListingDomainModel> filtered(
    ExploreDomainModel data, {
    required String query,
    required String categoryId,
    required ExploreSort sort,
    required int radiusKm,
    SmartSearchDomainModel? smart,
  }) {
    if (smart != null) return _smartFiltered(data, smart, sort: sort, radiusKm: radiusKm);
    var list = data.listings.where((item) {
      if (item.distanceKm > radiusKm) return false;
      if (categoryId != 'all' && item.categoryId != categoryId) return false;
      if (query.isNotEmpty) {
        final q = query.toLowerCase();
        final haystack =
            '${item.title} ${item.requesterName} ${item.categoryName}'.toLowerCase();
        if (!haystack.contains(q)) return false;
      }
      return true;
    }).toList();

    list.sort((a, b) {
      switch (sort) {
        case ExploreSort.nearest:
          return a.distanceKm.compareTo(b.distanceKm);
        case ExploreSort.soonest:
          return a.needBy.compareTo(b.needBy);
      }
    });
    return list;
  }

  /// Ranks by keyword hits; a matched category keeps items with no hits.
  List<ExploreListingDomainModel> _smartFiltered(
    ExploreDomainModel data,
    SmartSearchDomainModel smart, {
    required ExploreSort sort,
    required int radiusKm,
  }) {
    int hits(ExploreListingDomainModel item) {
      final haystack = '${item.title} ${item.categoryName}';
      return smart.keywords.where(haystack.contains).length;
    }

    final scored = <(ExploreListingDomainModel, int)>[];
    for (final item in data.listings) {
      if (item.distanceKm > radiusKm) continue;
      final inCategory = smart.categoryId == null || item.categoryId == smart.categoryId;
      final score = hits(item);
      if (smart.categoryId != null ? !inCategory : score == 0) continue;
      scored.add((item, score));
    }
    scored.sort((a, b) {
      if (a.$2 != b.$2) return b.$2.compareTo(a.$2);
      return sort == ExploreSort.nearest
          ? a.$1.distanceKm.compareTo(b.$1.distanceKm)
          : a.$1.needBy.compareTo(b.$1.needBy);
    });
    return scored.map((e) => e.$1).toList();
  }

  void dispose() {
    if (listeningObs.getValue()) SpeechInputService.instance.stop();
    searchController.dispose();
  }
}
