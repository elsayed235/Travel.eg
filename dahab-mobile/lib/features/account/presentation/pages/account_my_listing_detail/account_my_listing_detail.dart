part of 'account_my_listing_detail_imports.dart';

@RoutePage(name: 'AccountMyListingDetailRoute')
class AccountMyListingDetail extends StatefulWidget {
  final String listingId;

  const AccountMyListingDetail({super.key, required this.listingId});

  @override
  State<AccountMyListingDetail> createState() => _AccountMyListingDetailState();
}

class _AccountMyListingDetailState extends State<AccountMyListingDetail> {
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

  String _dealLabel(AccountListingDealType deal) {
    return switch (deal) {
      AccountListingDealType.rent => Translate.s.home_rent,
      AccountListingDealType.buy => Translate.s.home_buy,
      AccountListingDealType.both => Translate.s.create_request_deal_both,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_listing_detail_title),
      body: RequesterConsumer<AccountProfileDomainModel>(
        requester: requester,
        loadingBuilder: (_) => AppScreenShimmer.list(),
        failureBuilder: (context, error, callback) => Center(
          child: TextButton(onPressed: callback, child: Text(Translate.s.retry)),
        ),
        successBuilder: (context, profile, _) {
          final match = profile.myListings.where((e) => e.id == widget.listingId);
          if (match.isEmpty) {
            return Center(
              child: Text(
                Translate.s.account_listing_not_found,
                style: AppTextStyle.body(color: context.colors.text2),
              ),
            );
          }
          final item = match.first;
          final locale = Localizations.localeOf(context).toString();
          final published =
              DateFormat('d MMM yyyy', locale).format(item.publishedAt).toLocaleDigits;

          return ListView(
            padding: const EdgeInsetsDirectional.symmetric(
              horizontal: AppSpacing.xl,
              vertical: AppSpacing.lg,
            ),
            children: [
              if (item.imageUrl != null) ...[
                ClipRRect(
                  borderRadius: AppRadius.imageAll,
                  child: CachedImage(
                    url: item.imageUrl!,
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    borderRadius: AppRadius.imageAll,
                    bgColor: context.colors.surface3,
                  ),
                ),
                Gaps.vGap18,
              ],
              Row(
                children: [
                  Expanded(
                    child: Text(
                      item.title,
                      style: AppTextStyle.screenTitle(color: context.colors.text),
                    ),
                  ),
                  AppChip(label: _statusLabel(item.status)),
                ],
              ),
              Gaps.vGap9,
              Text(
                Translate.s.account_listing_meta(
                  _dealLabel(item.dealType),
                  item.categoryName,
                  published,
                ),
                style: AppTextStyle.caption(color: context.colors.text2),
              ),
              Gaps.vGap9,
              AppPrice(
                amount: item.price,
                unit: item.priceUnit,
                alignment: CrossAxisAlignment.start,
              ),
              Gaps.vGap6,
              Text(
                Translate.s.account_listing_qty(
                  '${item.quantity.toLocaleDigits} ${item.quantityUnit}',
                  item.city,
                ),
                style: AppTextStyle.caption(color: context.colors.text3),
              ),
              Gaps.vGap18,
              BuildListingMoneyCycle(cycle: item.moneyCycle),
              Gaps.vGap18,
              Text(
                Translate.s.account_listing_timeline_title,
                style: AppTextStyle.sectionTitle(color: context.colors.text),
              ),
              Gaps.vGap6,
              Text(
                Translate.s.account_listing_timeline_hint,
                style: AppTextStyle.caption(color: context.colors.text2),
              ),
              Gaps.vGap13,
              BuildListingTimeline(steps: item.timeline),
              Gaps.vGap24,
            ],
          );
        },
      ),
    );
  }
}
