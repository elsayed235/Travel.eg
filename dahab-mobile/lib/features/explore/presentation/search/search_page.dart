part of '../explore_imports.dart';

/// Every Dahab outing in one searchable list: type to search (Arabic and
/// mood words work), tap a kind, narrow with filters. Opened from a Home
/// door already set to what the door promised.
class SearchPage extends StatefulWidget {
  final ExploreKind kind;
  final String query;

  const SearchPage({super.key, this.kind = ExploreKind.all, this.query = ''});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  late final TextEditingController _search = TextEditingController(text: widget.query);
  late ExploreKind _kind = widget.kind;
  var _filters = const SearchFilters();

  @override
  void initState() {
    super.initState();
    ExperienceCatalogue.instance.ensureLoaded();
    _search.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  void _askDaygi(String? question) {
    Navigator.of(context).maybePop();
    ShellActions.askDaygi(question);
  }

  Future<void> _openFilters(List<Experience> all, LiveConditions? live) async {
    FocusScope.of(context).unfocus();
    final next = await showSearchFiltersSheet(
      context,
      filters: _filters,
      all: all,
      live: live,
      count: (f) => f.apply(all, live, _kind, _search.text).length,
    );
    if (next != null && mounted) setState(() => _filters = next);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        bottom: false,
        child: ObsValueConsumer(
          observable: ExperienceCatalogue.instance.stateObs,
          builder: (context, state) {
            final results = _filters.apply(state.items, state.live, _kind, _search.text);
            return Column(
              children: [
                _SearchHeader(
                  controller: _search,
                  filterCount: _filters.count,
                  onBack: () => Navigator.of(context).maybePop(),
                  onFilters: () => _openFilters(state.items, state.live),
                ),
                _KindChips(kind: _kind, onChanged: (k) => setState(() => _kind = k)),
                Expanded(child: _body(context, state, results)),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _body(BuildContext context, CatalogueState state, List<Experience> results) {
    final colors = context.colors;
    final query = _search.text.trim();
    final bottom = AppSpacing.xxl + MediaQuery.paddingOf(context).bottom;
    if (state.loading && state.items.isEmpty) {
      return ListView(
        padding: EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.md, AppSpacing.xl, bottom),
        children: [
          for (var i = 0; i < 3; i++)
            Container(
              height: 250,
              margin: const EdgeInsets.only(bottom: AppSpacing.lg),
              decoration: BoxDecoration(color: colors.surface1, borderRadius: AppRadius.cardAll),
            ),
        ],
      );
    }
    if (state.items.isEmpty) {
      return _Empty(
        icon: AppIcons.info,
        title: Translate.s.info_load_failed,
        action: Translate.s.retry,
        onAction: ExperienceCatalogue.instance.reload,
      );
    }
    final sortLabel = switch (_filters.sort) {
      SearchSort.best => Translate.s.search_sort_best,
      SearchSort.priceLow => Translate.s.search_sort_price_low,
      SearchSort.priceHigh => Translate.s.search_sort_price_high,
      SearchSort.short => Translate.s.search_sort_short,
    };
    return CustomScrollView(
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.md, AppSpacing.xl, AppSpacing.md),
          sliver: SliverToBoxAdapter(
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    Translate.s.search_results(results.length.toLocaleDigits),
                    style: AppTextStyle.s14_w500(color: colors.text),
                  ),
                ),
                AppIcon.ui(AppIcons.sliders, size: 14, color: colors.text3),
                Gaps.hGap6,
                Text(sortLabel, style: AppTextStyle.caption(color: colors.text3)),
              ],
            ),
          ),
        ),
        if (query.isNotEmpty)
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.xl, 0, AppSpacing.xl, AppSpacing.lg),
            sliver: SliverToBoxAdapter(
              child: GroupedSection(
                children: [
                  GroupedRow(
                    icon: AppIcons.sparkle,
                    tint: GroupedTint.lagoon,
                    title: Translate.s.search_ask_daygi(query),
                    onTap: () => _askDaygi(query),
                  ),
                ],
              ),
            ),
          ),
        if (results.isEmpty)
          SliverToBoxAdapter(
            child: _Empty(
              icon: AppIcons.search,
              title: Translate.s.search_empty_title,
              body: Translate.s.search_empty_body,
              action: _filters.count > 0 || _kind != ExploreKind.all || query.isNotEmpty ? Translate.s.search_clear : null,
              onAction: () => setState(() {
                _filters = const SearchFilters();
                _kind = ExploreKind.all;
                _search.clear();
              }),
            ),
          )
        else
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
            sliver: SliverList.separated(
              itemCount: results.length,
              separatorBuilder: (_, _) => Gaps.vGap16,
              itemBuilder: (context, i) => AppEntrance(
                delay: Duration(milliseconds: 40 * math.min(i, 5)),
                child: BuildExperienceRow(experience: results[i], live: state.live),
              ),
            ),
          ),
        SliverPadding(
          padding: EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.xxl, AppSpacing.xl, bottom),
          sliver: SliverToBoxAdapter(child: _Services(onAsk: _askDaygi)),
        ),
      ],
    );
  }
}

class _SearchHeader extends StatelessWidget {
  final TextEditingController controller;
  final int filterCount;
  final VoidCallback onBack;
  final VoidCallback onFilters;

  const _SearchHeader({
    required this.controller,
    required this.filterCount,
    required this.onBack,
    required this.onFilters,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.sm, AppSpacing.sm, AppSpacing.xl, AppSpacing.md),
      child: Row(
        children: [
          Semantics(
            button: true,
            label: MaterialLocalizations.of(context).backButtonTooltip,
            child: InkResponse(
              onTap: onBack,
              radius: 22,
              child: SizedBox.square(
                dimension: 44,
                child: Center(child: AppIcon.ui(AppIcons.back, size: 22, color: colors.text, mirrorInRtl: true)),
              ),
            ),
          ),
          Gaps.hGap4,
          Expanded(
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                color: colors.surface1,
                borderRadius: AppRadius.chipAll,
                border: Border.all(color: colors.line),
              ),
              child: Row(
                children: [
                  Gaps.hGap16,
                  AppIcon.ui(AppIcons.search, size: 18, color: colors.text3),
                  Gaps.hGap8,
                  Expanded(
                    child: TextField(
                      controller: controller,
                      textInputAction: TextInputAction.search,
                      style: AppTextStyle.s14_w400(color: colors.text),
                      decoration: InputDecoration(
                        isCollapsed: true,
                        filled: false,
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        hintText: Translate.s.map_search_hint,
                        hintStyle: AppTextStyle.s14_w400(color: colors.text3),
                      ),
                    ),
                  ),
                  if (controller.text.isNotEmpty)
                    Semantics(
                      button: true,
                      label: MaterialLocalizations.of(context).deleteButtonTooltip,
                      child: InkResponse(
                        onTap: controller.clear,
                        radius: 20,
                        child: SizedBox.square(
                          dimension: 44,
                          child: Center(child: AppIcon.ui(AppIcons.close, size: 16, color: colors.text3)),
                        ),
                      ),
                    )
                  else
                    Gaps.hGap16,
                ],
              ),
            ),
          ),
          Gaps.hGap8,
          Semantics(
            button: true,
            label: filterCount > 0
                ? Translate.s.search_filters_count(filterCount.toLocaleDigits)
                : Translate.s.search_filters,
            excludeSemantics: true,
            child: GestureDetector(
              onTap: onFilters,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: filterCount > 0 ? colors.button : colors.surface1,
                  borderRadius: AppRadius.chipAll,
                  border: Border.all(color: filterCount > 0 ? colors.button : colors.line),
                ),
                child: Stack(
                  clipBehavior: Clip.none,
                  alignment: Alignment.center,
                  children: [
                    AppIcon.ui(AppIcons.sliders, size: 20, color: filterCount > 0 ? colors.onButton : colors.text),
                    if (filterCount > 0)
                      PositionedDirectional(
                        top: -2,
                        end: -2,
                        child: Container(
                          width: 18,
                          height: 18,
                          decoration: BoxDecoration(
                            color: colors.highlight,
                            shape: BoxShape.circle,
                            border: Border.all(color: colors.bg, width: 2),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            filterCount.toLocaleDigits,
                            style: AppTextStyle.s9_w400(color: colors.onImage).copyWith(fontWeight: FontWeight.w700),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _KindChips extends StatelessWidget {
  final ExploreKind kind;
  final ValueChanged<ExploreKind> onChanged;

  const _KindChips({required this.kind, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final kinds = [
      (ExploreKind.all, Translate.s.map_kind_all),
      (ExploreKind.sea, Translate.s.map_kind_sea),
      (ExploreKind.desert, Translate.s.map_kind_desert),
      (ExploreKind.culture, Translate.s.map_kind_culture),
    ];
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
        itemCount: kinds.length,
        separatorBuilder: (_, _) => Gaps.hGap8,
        itemBuilder: (context, i) => Center(
          child: ExplorePill(
            label: kinds[i].$2,
            selected: kind == kinds[i].$1,
            onTap: () {
              HapticFeedback.selectionClick();
              onChanged(kinds[i].$1);
            },
          ),
        ),
      ),
    );
  }
}

class _Empty extends StatelessWidget {
  final String icon;
  final String title;
  final String? body;
  final String? action;
  final VoidCallback? onAction;

  const _Empty({required this.icon, required this.title, this.body, this.action, this.onAction});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl, vertical: AppSpacing.xxl * 1.5),
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(color: colors.surface2, shape: BoxShape.circle),
            alignment: Alignment.center,
            child: AppIcon.ui(icon, size: 26, color: colors.text2),
          ),
          Gaps.vGap16,
          Text(title, textAlign: TextAlign.center, style: AppTextStyle.s16_w500(color: colors.text)),
          if (body != null) ...[
            Gaps.vGap6,
            Text(body!, textAlign: TextAlign.center, style: AppTextStyle.body(color: colors.text2)),
          ],
          if (action != null && onAction != null) ...[
            Gaps.vGap16,
            OutlinedButton(
              onPressed: onAction,
              style: OutlinedButton.styleFrom(
                foregroundColor: colors.text,
                side: BorderSide(color: colors.line2),
                minimumSize: const Size(140, 44),
                shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonAll),
              ),
              child: Text(action!),
            ),
          ],
        ],
      ),
    );
  }
}

/// The verticals the app doesn't list as outings (stays, food, rides, help):
/// DayGi answers those, so they sit under the results as questions.
class _Services extends StatelessWidget {
  final ValueChanged<String?> onAsk;

  const _Services({required this.onAsk});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final doors = DiscoverContent.doors(RehlaDestination.dahab).where((d) => d.asksDaygi).toList();
    if (doors.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            AppIcon.ui(AppIcons.sparkle, size: 16, color: colors.button),
            Gaps.hGap6,
            Text(Translate.s.search_services, style: AppTextStyle.s14_w500(color: colors.text)),
          ],
        ),
        Gaps.vGap12,
        Wrap(
          spacing: AppSpacing.md,
          runSpacing: AppSpacing.md,
          children: [
            for (final door in doors)
              Material(
                color: colors.surface1,
                shape: StadiumBorder(side: BorderSide(color: colors.line)),
                child: InkWell(
                  customBorder: const StadiumBorder(),
                  onTap: () => onAsk(door.ask(arabic)),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AppIcon(door.icon, size: 16, color: colors.button),
                        Gaps.hGap8,
                        Text(door.label(arabic), style: AppTextStyle.s14_w400(color: colors.text)),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
