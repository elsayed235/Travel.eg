part of 'account_addresses_imports.dart';

@RoutePage(name: 'AccountAddressesRoute')
class AccountAddresses extends StatelessWidget {
  const AccountAddresses({super.key});

  static const _items = [
    AccountAddress(
      id: 'a1',
      title: 'البيت',
      details: 'دمياط الجديدة، الحي الأول، شارع النيل',
      isDefault: true,
    ),
    AccountAddress(
      id: 'a2',
      title: 'الشغل',
      details: 'دمياط، وسط البلد، برج التجارة',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colors.bg,
      appBar: DefaultAppBar(title: Translate.s.account_addresses),
      body: ListView(
        padding: const EdgeInsetsDirectional.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        ),
        children: [
          Text(
            Translate.s.account_addresses_subtitle,
            style: AppTextStyle.body(color: context.colors.text2),
          ),
          Gaps.vGap18,
          ..._items.map((address) {
            return Padding(
              padding: const EdgeInsetsDirectional.only(bottom: AppSpacing.md),
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: context.colors.surface1,
                  borderRadius: AppRadius.cardAll,
                  border: Border.all(color: context.colors.line),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: context.colors.surface2,
                        borderRadius: AppRadius.buttonAll,
                      ),
                      child: Icon(
                        Icons.location_on_outlined,
                        size: 18,
                        color: context.colors.text2,
                      ),
                    ),
                    Gaps.hGap13,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                address.id == 'a1'
                                    ? Translate.s.account_address_home
                                    : address.id == 'a2'
                                        ? Translate.s.account_address_work
                                        : address.title,
                                style: AppTextStyle.sectionTitle(color: context.colors.text),
                              ),
                              if (address.isDefault) ...[
                                Gaps.hGap6,
                                AppChip(
                                  label: Translate.s.account_address_default,
                                  kind: AppChipKind.available,
                                ),
                              ],
                            ],
                          ),
                          Gaps.vGap4,
                          Text(
                            address.details,
                            style: AppTextStyle.body(color: context.colors.text2),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
