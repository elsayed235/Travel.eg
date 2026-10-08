part of 'explore_widgets_imports.dart';

class BuildExploreBody extends StatelessWidget {
  final ExploreController controller;

  const BuildExploreBody({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return RequesterConsumer<ExploreDomainModel>(
      requester: controller.exploreRequester,
      loadingBuilder: (_) => AppScreenShimmer.explore(),
      failureBuilder: (context, error, callback) => Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(error.message, style: AppTextStyle.body(color: context.colors.red)),
              Gaps.vGap13,
              TextButton(onPressed: callback, child: Text(Translate.s.retry)),
            ],
          ),
        ),
      ),
      successBuilder: (context, data, _) {
        return ObsValueConsumer(
          observable: controller.queryObs,
          builder: (context, query) {
            return ObsValueConsumer(
              observable: controller.categoryIdObs,
              builder: (context, categoryId) {
                return ObsValueConsumer(
                  observable: controller.sortObs,
                  builder: (context, sort) {
                    return ObsValueConsumer(
                      observable: controller.radiusKmObs,
                      builder: (context, radiusKm) => ObsValueConsumer(
                        observable: controller.smartSearchObs,
                        builder: (context, smart) {
                          final results = controller.filtered(
                            data,
                            query: query,
                            categoryId: categoryId,
                            sort: sort,
                            radiusKm: radiusKm,
                            smart: smart,
                          );
                          return ListView(
                            padding: const EdgeInsetsDirectional.symmetric(
                              horizontal: AppSpacing.xl,
                              vertical: AppSpacing.lg,
                            ),
                            children: [
                              BuildExploreHeader(
                                locationLabel: data.locationLabel,
                                radiusKm: radiusKm,
                                radiusOptions: ExploreController.radiusOptions,
                                onRadiusChanged: controller.setRadius,
                              ),
                              Gaps.vGap16,
                              BuildExploreSearch(controller: controller),
                              BuildExploreSmartSearch(controller: controller, query: query),
                              Gaps.vGap18,
                              BuildExploreCategories(
                                selectedId: smart?.categoryId ?? categoryId,
                                counts: controller.categoryCounts(data, radiusKm),
                                onChanged: controller.onCategoryChanged,
                              ),
                              Gaps.vGap18,
                              BuildExploreToolbar(
                                count: results.length,
                                sort: sort,
                                onSortChanged: controller.onSortChanged,
                              ),
                              Gaps.vGap9,
                              if (results.isEmpty)
                                BuildExploreEmpty(
                                  radiusKm: radiusKm,
                                  nextRadiusKm: controller.nextRadius(),
                                  onCreateRequest: () => controller.openCreateRequest(context),
                                  onWidenRadius: controller.widenRadius,
                                )
                              else
                                for (final item in results) ...[
                                  AppRequestCard(
                                    listing: item.toListing(),
                                    onOpen: () => controller.openListing(context, item.id),
                                  ),
                                  Gaps.vGap9,
                                ],
                              Gaps.vGap24,
                            ],
                          );
                        },
                      ),
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
  }
}
