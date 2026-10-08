part of 'account_my_reviews_imports.dart';

@RoutePage(name: 'AccountMyReviewsRoute')
class AccountMyReviews extends StatefulWidget {
  const AccountMyReviews({super.key});

  @override
  State<AccountMyReviews> createState() => _AccountMyReviewsState();
}

class _AccountMyReviewsState extends State<AccountMyReviews> {
  final AccountRequester requester = AccountRequester();
  final ObsValue<int> filterObs = ObsValue.withInit(0);

  @override
  void initState() {
    super.initState();
    requester.request();
  }

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context).toString();
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_my_reviews_title),
      body: RequesterConsumer<AccountProfileDomainModel>(
        requester: requester,
        loadingBuilder: (_) => AppScreenShimmer.list(rows: 4),
        failureBuilder: (context, error, callback) => Center(
          child: TextButton(onPressed: callback, child: Text(Translate.s.retry)),
        ),
        successBuilder: (context, profile, _) {
          return ObsValueConsumer(
            observable: filterObs,
            builder: (context, filter) {
              final items = profile.reviews.where((r) {
                if (filter == 1) return r.givenByMe;
                if (filter == 2) return !r.givenByMe;
                return true;
              }).toList();

              return ListView(
                padding: const EdgeInsetsDirectional.symmetric(
                  horizontal: AppSpacing.xl,
                  vertical: AppSpacing.lg,
                ),
                children: [
                  Text(
                    Translate.s.account_my_reviews_subtitle,
                    style: AppTextStyle.body(color: context.colors.text2),
                  ),
                  Gaps.vGap13,
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        AppFilterPill(
                          label: Translate.s.orders_filter_all,
                          selected: filter == 0,
                          onTap: () => filterObs.setValue(0),
                        ),
                        Gaps.hGap8,
                        AppFilterPill(
                          label: Translate.s.account_reviews_given,
                          selected: filter == 1,
                          onTap: () => filterObs.setValue(1),
                        ),
                        Gaps.hGap8,
                        AppFilterPill(
                          label: Translate.s.account_reviews_received,
                          selected: filter == 2,
                          onTap: () => filterObs.setValue(2),
                        ),
                      ],
                    ),
                  ),
                  Gaps.vGap18,
                  if (items.isEmpty)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xxl),
                      child: Text(
                        Translate.s.account_reviews_empty,
                        style: AppTextStyle.body(color: context.colors.text2),
                        textAlign: TextAlign.center,
                      ),
                    )
                  else
                    ...items.map((item) {
                      final date = DateFormat('d MMM yyyy', locale).format(item.date).toLocaleDigits;
                      return Padding(
                        padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(AppSpacing.lg),
                          decoration: BoxDecoration(
                            color: context.colors.surface1,
                            borderRadius: AppRadius.cardAll,
                            border: Border.all(color: context.colors.line),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      item.listingTitle,
                                      style: AppTextStyle.sectionTitle(color: context.colors.text),
                                    ),
                                  ),
                                  Text(
                                    item.givenByMe
                                        ? Translate.s.account_reviews_given
                                        : Translate.s.account_reviews_received,
                                    style: AppTextStyle.caption(color: context.colors.text3),
                                  ),
                                ],
                              ),
                              Gaps.vGap6,
                              Text(
                                '${item.shopName} · $date',
                                style: AppTextStyle.caption(color: context.colors.text2),
                              ),
                              Gaps.vGap9,
                              AppRating(value: item.rating, count: 0),
                              Gaps.vGap9,
                              Text(
                                item.comment,
                                style: AppTextStyle.body(color: context.colors.text),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                ],
              );
            },
          );
        },
      ),
    );
  }
}
