part of 'listing_imports.dart';

@RoutePage(name: 'ListingRoute')
class Listing extends StatefulWidget {
  final String listingId;

  const Listing({super.key, required this.listingId});

  @override
  State<Listing> createState() => _ListingState();
}

class _ListingState extends State<Listing> {
  late final ListingController controller;

  @override
  void initState() {
    super.initState();
    controller = ListingController(widget.listingId);
    controller.init();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness:
            Theme.of(context).brightness == Brightness.dark ? Brightness.light : Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: context.colors.bg,
        body: RequesterConsumer<ListingDetailDomainModel>(
          requester: controller.detailRequester,
          loadingBuilder: (_) => AppScreenShimmer.listingDetail(),
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
          successBuilder: (context, detail, _) {
            return Column(
              children: [
                Expanded(
                  child: CustomScrollView(
                    slivers: [
                      BuildListingGallery(detail: detail),
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsetsDirectional.symmetric(horizontal: AppSpacing.xl),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Gaps.vGap16,
                              BuildListingHeader(
                                detail: detail,
                                onOwnerTap: () =>
                                    controller.openOwnerProfile(context, detail),
                              ),
                              Gaps.vGap18,
                              BuildListingPriceCards(
                                detail: detail,
                                controller: controller,
                              ),
                              BuildListingAiPrice(guidanceObs: controller.priceGuidanceObs),
                              Gaps.vGap18,
                              BuildListingOfferDetails(detail: detail),
                              Gaps.vGap24,
                              BuildListingAvailability(
                                detail: detail,
                                controller: controller,
                              ),
                              Gaps.vGap18,
                              AppTermsList(terms: detail.terms),
                              Gaps.vGap24,
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                BuildListingBottomBar(detail: detail, controller: controller),
              ],
            );
          },
        ),
      ),
    );
  }
}
