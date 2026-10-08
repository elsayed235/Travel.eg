part of 'account_help_imports.dart';

@RoutePage(name: 'AccountHelpRoute')
class AccountHelp extends StatelessWidget {
  const AccountHelp({super.key});

  @override
  Widget build(BuildContext context) {
    final faqs = [
      (Translate.s.account_faq_1_q, Translate.s.account_faq_1_a),
      (Translate.s.account_faq_2_q, Translate.s.account_faq_2_a),
      (Translate.s.account_faq_3_q, Translate.s.account_faq_3_a),
      (Translate.s.account_faq_4_q, Translate.s.account_faq_4_a),
    ];

    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_help),
      body: ListView(
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          Text(
            Translate.s.account_help_hint,
            style: AppTextStyle.body(color: context.colors.text2),
          ),
          Gaps.vGap18,
          ...faqs.map((faq) {
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
                    Text(faq.$1, style: AppTextStyle.sectionTitle(color: context.colors.text)),
                    Gaps.vGap6,
                    Text(faq.$2, style: AppTextStyle.body(color: context.colors.text2)),
                  ],
                ),
              ),
            );
          }),
          Gaps.vGap9,
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: context.colors.surface2,
              borderRadius: AppRadius.cardAll,
              border: Border.all(color: context.colors.line),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  Translate.s.account_contact_title,
                  style: AppTextStyle.sectionTitle(color: context.colors.text),
                ),
                Gaps.vGap6,
                Text(
                  Translate.s.account_contact_body,
                  style: AppTextStyle.body(color: context.colors.text2),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
