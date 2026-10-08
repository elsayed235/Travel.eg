part of 'account_my_listings_imports.dart';

@RoutePage(name: 'AccountMyListingsRoute')
class AccountMyListings extends StatefulWidget {
  const AccountMyListings({super.key});

  @override
  State<AccountMyListings> createState() => _AccountMyListingsState();
}

class _AccountMyListingsState extends State<AccountMyListings> {
  final AccountRequester requester = AccountRequester();

  @override
  void initState() {
    super.initState();
    requester.request();
  }

  String _statusLabel(AccountListingStatus status) {
    return switch (status) {
      AccountListingStatus.active => Translate.s.account_listing_status_active,
      AccountListingStatus.offerReceived =>
        Translate.s.account_listing_status_offer_received,
      AccountListingStatus.insuranceHeld =>
        Translate.s.account_listing_status_insurance,
      AccountListingStatus.depositPaid =>
        Translate.s.account_listing_status_deposit,
      AccountListingStatus.inProgress =>
        Translate.s.account_listing_status_in_progress,
      AccountListingStatus.lateFeeDue =>
        Translate.s.account_listing_status_late_fee,
      AccountListingStatus.completed =>
        Translate.s.account_listing_status_completed,
      AccountListingStatus.paused => Translate.s.account_listing_status_paused,
    };
  }

  AppChipKind _chipKind(AccountListingStatus status) {
    return switch (status) {
      AccountListingStatus.active => AppChipKind.available,
      AccountListingStatus.offerReceived => AppChipKind.verified,
      AccountListingStatus.insuranceHeld ||
      AccountListingStatus.depositPaid ||
      AccountListingStatus.inProgress =>
        AppChipKind.verified,
      AccountListingStatus.lateFeeDue => AppChipKind.ad,
      AccountListingStatus.completed => AppChipKind.available,
      AccountListingStatus.paused => AppChipKind.ad,
    };
  }

  String _dealLabel(AccountListingDealType deal) {
    return switch (deal) {
      AccountListingDealType.rent => Translate.s.home_rent,
      AccountListingDealType.buy => Translate.s.home_buy,
      AccountListingDealType.both => Translate.s.create_request_deal_both,
    };
  }

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context).toString();
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_my_listings_title),
      body: RequesterConsumer<AccountProfileDomainModel>(
        requester: requester,
        loadingBuilder: (_) => AppScreenShimmer.list(),
        failureBuilder: (context, error, callback) => Center(
          child: TextButton(onPressed: callback, child: Text(Translate.s.retry)),
        ),
        successBuilder: (context, profile, _) {
          final items = profile.myListings;
          if (items.isEmpty) {
            return Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    Translate.s.account_listings_empty_title,
                    style: AppTextStyle.sectionTitle(color: context.colors.text),
                    textAlign: TextAlign.center,
                  ),
                  Gaps.vGap9,
                  Text(
                    Translate.s.account_listings_empty_subtitle,
                    style: AppTextStyle.body(color: context.colors.text2),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            );
          }
          return ListView(
            padding: const EdgeInsetsDirectional.symmetric(
              horizontal: AppSpacing.xl,
              vertical: AppSpacing.lg,
            ),
            children: [
              Text(
                Translate.s.account_my_listings_subtitle,
                style: AppTextStyle.body(color: context.colors.text2),
              ),
              Gaps.vGap9,
              Text(
                Translate.s.account_my_listings_cycle_hint,
                style: AppTextStyle.caption(color: context.colors.text3),
              ),
              Gaps.vGap18,
              ...items.map((item) {
                final published =
                    DateFormat('d MMM', locale).format(item.publishedAt).toLocaleDigits;
                return Padding(
                  padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
                  child: Material(
                    color: context.colors.surface1,
                    borderRadius: AppRadius.cardAll,
                    child: InkWell(
                      onTap: () => AutoRouter.of(context).push(
                        AccountMyListingDetailRoute(listingId: item.id),
                      ),
                      borderRadius: AppRadius.cardAll,
                      splashFactory: NoSplash.splashFactory,
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        decoration: BoxDecoration(
                          borderRadius: AppRadius.cardAll,
                          border: Border.all(color: context.colors.line),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (item.imageUrl != null) ...[
                              ClipRRect(
                                borderRadius: AppRadius.imageAll,
                                child: CachedImage(
                                  url: item.imageUrl!,
                                  width: 64,
                                  height: 64,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              Gaps.hGap13,
                            ],
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          item.title,
                                          style: AppTextStyle.sectionTitle(
                                            color: context.colors.text,
                                          ),
                                        ),
                                      ),
                                      AppChip(
                                        label: _statusLabel(item.status),
                                        kind: _chipKind(item.status),
                                      ),
                                    ],
                                  ),
                                  Gaps.vGap6,
                                  Text(
                                    Translate.s.account_listing_meta(
                                      _dealLabel(item.dealType),
                                      item.categoryName,
                                      published,
                                    ),
                                    style: AppTextStyle.caption(
                                      color: context.colors.text2,
                                    ),
                                  ),
                                  Gaps.vGap6,
                                  AppPrice(
                                    amount: item.price,
                                    unit: item.priceUnit,
                                    alignment: CrossAxisAlignment.start,
                                  ),
                                  Gaps.vGap6,
                                  Text(
                                    Translate.s.account_listing_offers(
                                      item.incomingOffersCount.toLocaleDigits,
                                      item.city,
                                    ),
                                    style: AppTextStyle.caption(
                                      color: context.colors.text3,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              }),
            ],
          );
        },
      ),
    );
  }
}
