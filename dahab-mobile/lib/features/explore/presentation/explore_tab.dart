part of 'explore_imports.dart';

/// Discover: the Dahab map and the list underneath it, reading the same
/// results. Tap a price pin to narrow the list to that place; drag the sheet
/// up for the full list.
class ExploreTab extends StatefulWidget {
  final ExploreController controller;

  const ExploreTab({super.key, required this.controller});

  @override
  State<ExploreTab> createState() => _ExploreTabState();
}

class _ExploreTabState extends State<ExploreTab> {
  ExploreController get c => widget.controller;

  @override
  void initState() {
    super.initState();
    ExperienceCatalogue.instance.ensureLoaded();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final top = MediaQuery.paddingOf(context).top;
    return ObsValueConsumer(
      observable: ExperienceCatalogue.instance.stateObs,
      builder: (context, state) {
        // Read every filter here so the builder rebuilds on each of them.
        c.queryObs.getValue();
        c.dayObs.getValue();
        c.kindObs.getValue();
        final place = c.placeObs.getValue();
        final mapItems = c.results(state.items, state.live, anyPlace: true);
        final listItems = c.results(state.items, state.live);
        return Stack(
          children: [
            Positioned.fill(
              child: BuildDahabMap(
                experiences: mapItems,
                selectedPlace: place,
                onPin: c.selectPlace,
              ),
            ),
            PositionedDirectional(
              start: 0,
              end: 0,
              top: 0,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [colors.bg, colors.bg.withValues(alpha: 0.85), colors.bg.withValues(alpha: 0)],
                    stops: const [0, 0.6, 1],
                  ),
                ),
                child: Padding(
                  padding: EdgeInsetsDirectional.only(top: top + AppSpacing.md, bottom: AppSpacing.xl),
                  child: BuildExploreTop(controller: c),
                ),
              ),
            ),
            DraggableScrollableSheet(
              controller: c.sheet,
              initialChildSize: 0.46,
              minChildSize: ExploreController.sheetMin,
              maxChildSize: ExploreController.sheetMax,
              snap: true,
              snapSizes: const [ExploreController.sheetMid],
              builder: (context, scroll) => DecoratedBox(
                decoration: BoxDecoration(
                  color: colors.bg,
                  borderRadius: AppRadius.sheetTop,
                  border: Border(top: BorderSide(color: colors.line)),
                ),
                child: CustomScrollView(
                  controller: scroll,
                  slivers: [
                    SliverToBoxAdapter(child: _SheetHead(controller: c, state: state, count: listItems.length)),
                    if (state.loading && state.items.isEmpty)
                      SliverToBoxAdapter(child: _Note(text: Translate.s.map_loading))
                    else if (state.failed)
                      SliverToBoxAdapter(
                        child: _Note(
                          text: Translate.s.map_failed,
                          action: Translate.s.book_retry,
                          onAction: ExperienceCatalogue.instance.reload,
                        ),
                      )
                    else if (listItems.isEmpty)
                      SliverToBoxAdapter(child: _Note(text: Translate.s.map_empty))
                    else
                      SliverPadding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                          AppSpacing.screenH,
                          0,
                          AppSpacing.screenH,
                          AppSpacing.xxl + MediaQuery.paddingOf(context).bottom,
                        ),
                        sliver: SliverList.separated(
                          itemCount: listItems.length,
                          separatorBuilder: (_, _) => Gaps.vGap13,
                          itemBuilder: (context, i) => BuildExperienceRow(
                            experience: listItems[i],
                            live: state.live,
                            selected: place != null,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _SheetHead extends StatelessWidget {
  final ExploreController controller;
  final CatalogueState state;
  final int count;

  const _SheetHead({required this.controller, required this.state, required this.count});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final dayIndex = controller.dayObs.getValue();
    final kind = controller.kindObs.getValue();
    final placeId = controller.placeObs.getValue();
    ExperiencePlace? place;
    for (final e in state.items) {
      if (e.placeId == placeId) {
        place = e.place;
        break;
      }
    }
    final headline = dayIndex == 0
        ? Translate.s.map_open_today(count)
        : Translate.s.map_open_on(count, RehlaDates.day(controller.day, arabic));
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(AppSpacing.screenH, AppSpacing.md, AppSpacing.screenH, AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(color: colors.line2, borderRadius: AppRadius.chipAll),
            ),
          ),
          Gaps.vGap13,
          Row(
            children: [
              Expanded(
                child: Text(
                  headline,
                  style: AppTextStyle.s18_w600(color: colors.text).copyWith(fontFamily: AppFonts.display(context)),
                ),
              ),
              if (state.live != null)
                Text(
                  WindLabel.knots(state.live!.windKnots),
                  style: AppTextStyle.s12_w600(color: colors.text3),
                ),
            ],
          ),
          if (state.offline) ...[
            Gaps.vGap4,
            Text(Translate.s.map_offline, style: AppTextStyle.caption(color: colors.amber)),
          ],
          Gaps.vGap10,
          SizedBox(
            height: 36,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                if (place != null) ...[
                  ExplorePill(
                    label: place.name(arabic),
                    icon: AppIcons.close,
                    selected: true,
                    onTap: () => controller.selectPlace(null),
                  ),
                  Gaps.hGap6,
                ],
                for (final k in ExploreKind.values) ...[
                  ExplorePill(
                    label: _kindLabel(k),
                    selected: kind == k,
                    onTap: () => controller.kindObs.setValue(k),
                  ),
                  Gaps.hGap6,
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  static String _kindLabel(ExploreKind k) {
    switch (k) {
      case ExploreKind.all:
        return Translate.s.map_kind_all;
      case ExploreKind.sea:
        return Translate.s.map_kind_sea;
      case ExploreKind.desert:
        return Translate.s.map_kind_desert;
      case ExploreKind.culture:
        return Translate.s.map_kind_culture;
    }
  }
}

class _Note extends StatelessWidget {
  final String text;
  final String? action;
  final VoidCallback? onAction;

  const _Note({required this.text, this.action, this.onAction});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Padding(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.screenH, vertical: AppSpacing.xl),
      child: Column(
        children: [
          Text(text, textAlign: TextAlign.center, style: AppTextStyle.body(color: colors.text2)),
          if (action != null)
            TextButton(onPressed: onAction, child: Text(action!, style: AppTextStyle.s13_w500(color: colors.button))),
        ],
      ),
    );
  }
}
