part of 'account_my_requests_imports.dart';

@RoutePage(name: 'AccountMyRequestsRoute')
class AccountMyRequests extends StatefulWidget {
  const AccountMyRequests({super.key});

  @override
  State<AccountMyRequests> createState() => _AccountMyRequestsState();
}

class _AccountMyRequestsState extends State<AccountMyRequests> {
  final AccountRequester requester = AccountRequester();

  @override
  void initState() {
    super.initState();
    requester.request();
  }

  String _statusLabel(AccountRequestStatus status) {
    return switch (status) {
      AccountRequestStatus.open => Translate.s.account_request_status_open,
      AccountRequestStatus.closed => Translate.s.account_request_status_closed,
      AccountRequestStatus.cancelled => Translate.s.account_request_status_cancelled,
    };
  }

  AppChipKind _chipKind(AccountRequestStatus status) {
    return switch (status) {
      AccountRequestStatus.open => AppChipKind.available,
      AccountRequestStatus.closed => AppChipKind.verified,
      AccountRequestStatus.cancelled => AppChipKind.ad,
    };
  }

  @override
  Widget build(BuildContext context) {
    final locale = Localizations.localeOf(context).toString();
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_my_requests_title),
      body: RequesterConsumer<AccountProfileDomainModel>(
        requester: requester,
        loadingBuilder: (_) => AppScreenShimmer.list(),
        failureBuilder: (context, error, callback) => Center(
          child: TextButton(onPressed: callback, child: Text(Translate.s.retry)),
        ),
        successBuilder: (context, profile, _) {
          final items = profile.searchRequests;
          if (items.isEmpty) {
            return Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    Translate.s.account_requests_empty_title,
                    style: AppTextStyle.sectionTitle(color: context.colors.text),
                    textAlign: TextAlign.center,
                  ),
                  Gaps.vGap9,
                  Text(
                    Translate.s.account_requests_empty_subtitle,
                    style: AppTextStyle.body(color: context.colors.text2),
                    textAlign: TextAlign.center,
                  ),
                  Gaps.vGap18,
                  AppTextButton.maxPrimary(
                    text: Translate.s.explore_empty_request,
                    onPressed: () => AutoRouter.of(context).push(CreateRequestRoute()),
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
                Translate.s.account_my_requests_subtitle,
                style: AppTextStyle.body(color: context.colors.text2),
              ),
              Gaps.vGap18,
              ...items.map((item) {
                final needBy = DateFormat('d MMM', locale).format(item.needBy).toLocaleDigits;
                return Padding(
                  padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
                  child: Material(
                    color: context.colors.surface1,
                    borderRadius: AppRadius.cardAll,
                    child: InkWell(
                      onTap: item.status == AccountRequestStatus.open
                          ? () => AutoRouter.of(context).push(const OffersRoute())
                          : null,
                      borderRadius: AppRadius.cardAll,
                      splashFactory: NoSplash.splashFactory,
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        decoration: BoxDecoration(
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
                                    item.title,
                                    style: AppTextStyle.sectionTitle(color: context.colors.text),
                                  ),
                                ),
                                AppChip(
                                  label: _statusLabel(item.status),
                                  kind: _chipKind(item.status),
                                ),
                              ],
                            ),
                            Gaps.vGap9,
                            Text(
                              Translate.s.account_request_meta(
                                '${item.quantity.toLocaleDigits} ${item.quantityUnit}',
                                needBy,
                                item.budget.toLocaleDigits,
                              ),
                              style: AppTextStyle.caption(color: context.colors.text2),
                            ),
                            Gaps.vGap6,
                            Text(
                              Translate.s.account_request_offers(
                                item.offersCount.toLocaleDigits,
                                item.radiusKm.toLocaleDigits,
                              ),
                              style: AppTextStyle.caption(color: context.colors.text3),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              }),
              Gaps.vGap9,
              AppTextButton.maxPrimary(
                text: Translate.s.explore_empty_request,
                onPressed: () => AutoRouter.of(context).push(CreateRequestRoute()),
              ),
            ],
          );
        },
      ),
    );
  }
}
