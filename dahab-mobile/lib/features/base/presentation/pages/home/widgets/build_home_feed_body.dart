part of 'home_widgets_imports.dart';

class BuildHomeFeedBody extends StatelessWidget {
  final HomeController controller;

  const BuildHomeFeedBody({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return RequesterConsumer<HomeFeedDomainModel>(
      requester: controller.feedRequester,
      loadingBuilder: (_) => AppScreenShimmer.home(),
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
      successBuilder: (context, feed, _) {
        return ObsValueConsumer(
          observable: controller.categoryIdObs,
          builder: (context, categoryId) {
            final listings = controller.filterListings(
              feed.listings,
              categoryId: categoryId,
            );
            return ListView(
              padding: const EdgeInsetsDirectional.symmetric(
                horizontal: AppSpacing.xl,
                vertical: AppSpacing.lg,
              ),
              children: [
                BuildHomeHeader(
                  feed: feed,
                  onSearch: () => controller.openExplore(context),
                  onNotifications: () =>
                      AutoRouter.of(context).push(const AccountNotificationsRoute()),
                ),
                BuildHomeAskHero(
                  onType: () => controller.openCreateRequest(context),
                  onVoice: () => controller.openAiRequest(context, voice: true),
                  onExample: (text) => controller.openAiRequest(context, text: text),
                ),
                Gaps.vGap32,
                BuildHomeSectionHeader(
                  visibleCount: listings.length,
                  onViewAll: () => controller.openExplore(context, categoryId: categoryId),
                ),
                Gaps.vGap9,
                BuildHomeCategories(
                  selectedId: categoryId,
                  listings: feed.listings,
                  onChanged: controller.onCategoryChanged,
                ),
                Gaps.vGap16,
                if (listings.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: AppSpacing.xxl),
                    child: Column(
                      children: [
                        Text(
                          Translate.s.home_side_empty,
                          style: AppTextStyle.caption(color: context.colors.text2),
                          textAlign: TextAlign.center,
                        ),
                        TextButton(
                          onPressed: () => controller.openCreateRequest(context),
                          child: Text(
                            Translate.s.home_request_title,
                            style: AppTextStyle.caption(color: context.colors.text),
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  ..._requestCards(context, listings),
                Gaps.vGap24,
              ],
            );
          },
        );
      },
    );
  }
}

/// Soonest-needed request first and large, the rest as standard cards.
List<Widget> _requestCards(BuildContext context, List<ListingDomainModel> listings) {
  void open(ListingDomainModel l) =>
      AutoRouter.of(context).push(ListingRoute(listingId: l.id));

  final sorted = [...listings]..sort((a, b) => a.needBy.compareTo(b.needBy));
  final featured = sorted.length >= 2 ? sorted.first : null;
  final rest = featured == null ? sorted : sorted.skip(1);
  return [
    if (featured != null) ...[
      AppFeaturedRequestCard(listing: featured, onOpen: () => open(featured)),
      Gaps.vGap13,
    ],
    for (final l in rest) ...[
      AppRequestCard(listing: l, onOpen: () => open(l)),
      Gaps.vGap9,
    ],
  ];
}
