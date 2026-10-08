part of 'user_public_profile_imports.dart';

@RoutePage(name: 'UserPublicProfileRoute')
class UserPublicProfile extends StatefulWidget {
  final String userId;

  const UserPublicProfile({super.key, required this.userId});

  @override
  State<UserPublicProfile> createState() => _UserPublicProfileState();
}

class _UserPublicProfileState extends State<UserPublicProfile> {
  late final PublicUserRequester requester;
  final ObsValue<ReviewSummaryDomainModel?> reviewSummaryObs = ObsValue.withInit(null);

  @override
  void initState() {
    super.initState();
    requester = PublicUserRequester(widget.userId);
    requester.request();
    defaultAiRepository()
        .getReviewSummary(widget.userId)
        .then((result) => reviewSummaryObs.setValue(result.data));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.chat_user_profile_title),
      body: RequesterConsumer<PublicUserDomainModel>(
        requester: requester,
        loadingBuilder: (_) => AppScreenShimmer.list(),
        failureBuilder: (context, error, callback) => Center(
          child: TextButton(onPressed: callback, child: Text(Translate.s.retry)),
        ),
        successBuilder: (context, user, _) {
          return ListView(
            padding: const EdgeInsetsDirectional.symmetric(
              horizontal: AppSpacing.xl,
              vertical: AppSpacing.lg,
            ),
            children: [
              Row(
                children: [
                  SizedBox(
                    width: 64,
                    height: 64,
                    child: user.avatarUrl != null
                        ? CachedImage(
                            url: user.avatarUrl!,
                            width: 64,
                            height: 64,
                            fit: BoxFit.cover,
                            borderRadius: AppRadius.buttonAll,
                            bgColor: context.colors.surface3,
                          )
                        : Container(
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: context.colors.surface3,
                              borderRadius: AppRadius.buttonAll,
                            ),
                            child: Text(
                              user.avatarInitial,
                              style: AppTextStyle.screenTitle(color: context.colors.text2),
                            ),
                          ),
                  ),
                  Gaps.hGap13,
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                user.name,
                                style: AppTextStyle.screenTitle(color: context.colors.text),
                              ),
                            ),
                            if (user.verified) ...[
                              Gaps.hGap6,
                              AppChip(
                                label: Translate.s.account_verified,
                                kind: AppChipKind.verified,
                              ),
                            ],
                          ],
                        ),
                        Gaps.vGap6,
                        Text(
                          user.city,
                          style: AppTextStyle.caption(color: context.colors.text2),
                        ),
                        if (user.rating != null) ...[
                          Gaps.vGap6,
                          AppRating(value: user.rating!, count: user.ratingCount),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
              Gaps.vGap18,
              Text(
                user.bio,
                style: AppTextStyle.body(color: context.colors.text),
              ),
              ObsValueConsumer(
                observable: reviewSummaryObs,
                builder: (context, summary) {
                  if (summary == null || summary.basedOnCount == 0) {
                    return const SizedBox.shrink();
                  }
                  return Padding(
                    padding: const EdgeInsets.only(top: AppSpacing.xl),
                    child: BuildReviewSummaryCard(summary: summary),
                  );
                },
              ),
              Gaps.vGap18,
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: context.colors.surface1,
                  borderRadius: AppRadius.cardAll,
                  border: Border.all(color: context.colors.line),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            user.completedDeals.toLocaleDigits,
                            style: AppTextStyle.sectionTitle(color: context.colors.text),
                          ),
                          Gaps.vGap4,
                          Text(
                            Translate.s.chat_user_completed_deals,
                            style: AppTextStyle.caption(color: context.colors.text2),
                          ),
                        ],
                      ),
                    ),
                    Container(width: 1, height: 40, color: context.colors.line),
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            user.listingTitles.length.toLocaleDigits,
                            style: AppTextStyle.sectionTitle(color: context.colors.text),
                          ),
                          Gaps.vGap4,
                          Text(
                            Translate.s.chat_user_listings_count,
                            style: AppTextStyle.caption(color: context.colors.text2),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Gaps.vGap18,
              Text(
                Translate.s.chat_user_contacts_title,
                style: AppTextStyle.sectionTitle(color: context.colors.text),
              ),
              Gaps.vGap6,
              Text(
                Translate.s.chat_user_contacts_hint,
                style: AppTextStyle.caption(color: context.colors.text2),
              ),
              Gaps.vGap13,
              if (!user.contacts.showPhone && !user.contacts.showWhatsapp)
                Text(
                  Translate.s.chat_user_contacts_hidden,
                  style: AppTextStyle.body(color: context.colors.text3),
                )
              else ...[
                if (user.contacts.showPhone && user.contacts.phone != null)
                  _ContactTile(
                    icon: Icons.phone_outlined,
                    title: Translate.s.chat_contact_phone,
                    value: user.contacts.phone!,
                    onTap: () => ShareServices.instance.callPhone(phone: user.contacts.phone!),
                  ),
                if (user.contacts.showWhatsapp && user.contacts.whatsapp != null) ...[
                  Gaps.vGap9,
                  _ContactTile(
                    icon: Icons.chat_outlined,
                    title: Translate.s.chat_contact_whatsapp,
                    value: user.contacts.whatsapp!,
                    onTap: () => ShareServices.instance.launchWhatsApp(user.contacts.whatsapp),
                  ),
                ],
              ],
              if (user.listingTitles.isNotEmpty) ...[
                Gaps.vGap18,
                Text(
                  Translate.s.chat_user_listings_title,
                  style: AppTextStyle.sectionTitle(color: context.colors.text),
                ),
                Gaps.vGap13,
                ...user.listingTitles.map(
                  (title) => Padding(
                    padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.sm),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(AppSpacing.lg),
                      decoration: BoxDecoration(
                        color: context.colors.surface1,
                        borderRadius: AppRadius.cardAll,
                        border: Border.all(color: context.colors.line),
                      ),
                      child: Text(title, style: AppTextStyle.body(color: context.colors.text)),
                    ),
                  ),
                ),
              ],
              Gaps.vGap24,
            ],
          );
        },
      ),
    );
  }
}

class _ContactTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final VoidCallback onTap;

  const _ContactTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: context.colors.surface1,
      borderRadius: AppRadius.cardAll,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.cardAll,
        splashFactory: NoSplash.splashFactory,
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            borderRadius: AppRadius.cardAll,
            border: Border.all(color: context.colors.line),
          ),
          child: Row(
            children: [
              Icon(icon, size: 20, color: context.colors.text),
              Gaps.hGap13,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: AppTextStyle.caption(color: context.colors.text2)),
                    Gaps.vGap4,
                    Text(value, style: AppTextStyle.body(color: context.colors.text)),
                  ],
                ),
              ),
              Icon(Icons.chevron_left, size: 18, color: context.colors.text3),
            ],
          ),
        ),
      ),
    );
  }
}
