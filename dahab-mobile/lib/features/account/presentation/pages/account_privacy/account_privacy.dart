part of 'account_privacy_imports.dart';

@RoutePage(name: 'AccountPrivacyRoute')
class AccountPrivacy extends StatelessWidget {
  const AccountPrivacy({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_privacy),
      body: ListView(
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          Text(
            Translate.s.account_privacy_body,
            style: AppTextStyle.body(color: context.colors.text2),
          ),
          Gaps.vGap18,
          Text(
            Translate.s.account_privacy_point_1,
            style: AppTextStyle.body(color: context.colors.text),
          ),
          Gaps.vGap9,
          Text(
            Translate.s.account_privacy_point_2,
            style: AppTextStyle.body(color: context.colors.text),
          ),
          Gaps.vGap9,
          Text(
            Translate.s.account_privacy_point_3,
            style: AppTextStyle.body(color: context.colors.text),
          ),
        ],
      ),
    );
  }
}
