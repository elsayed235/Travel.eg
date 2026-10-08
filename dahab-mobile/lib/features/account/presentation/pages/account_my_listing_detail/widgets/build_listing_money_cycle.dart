part of '../account_my_listing_detail_imports.dart';

class BuildListingMoneyCycle extends StatelessWidget {
  final AccountListingMoneyCycle cycle;

  const BuildListingMoneyCycle({super.key, required this.cycle});

  String _payerLabel() {
    return switch (cycle.insurancePayer) {
      AccountListingInsurancePayer.requester =>
        Translate.s.create_request_insurance_payer_requester,
      AccountListingInsurancePayer.owner =>
        Translate.s.create_request_insurance_payer_owner,
    };
  }

  String _paymentLabel() {
    return switch (cycle.paymentMethod) {
      AccountListingPaymentMethod.online =>
        Translate.s.create_request_payment_online,
      AccountListingPaymentMethod.cash =>
        Translate.s.create_request_payment_cash,
    };
  }

  String _money(num amount) => '${amount.toArabicDigits} ${Translate.s.offers_currency}';

  String _percent(double value) => '${value.toArabicDigits}٪';

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            Translate.s.create_request_cycle_title,
            style: AppTextStyle.sectionTitle(color: context.colors.text),
          ),
          Gaps.vGap6,
          Text(
            Translate.s.account_listing_cycle_hint,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap13,
          Text(
            Translate.s.create_request_payment_title,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap4,
          Text(
            _paymentLabel(),
            style: AppTextStyle.body(color: context.colors.text),
          ),
          Gaps.vGap13,
          _CycleRow(
            index: '١',
            title: Translate.s.create_request_cycle_insurance,
            subtitle: Translate.s.create_request_cycle_insurance_sub(
              _payerLabel(),
              '${_percent(cycle.insurancePercent)} · ${_money(cycle.insuranceAmount)}',
            ),
            editable: true,
            active: cycle.currentStepIndex == 0,
            done: cycle.currentStepIndex > 0,
          ),
          Gaps.vGap9,
          _CycleRow(
            index: '٢',
            title: Translate.s.create_request_cycle_deposit,
            subtitle: Translate.s.create_request_cycle_deposit_sub(
              _percent(cycle.depositPercent),
              _money(cycle.depositAmount),
            ),
            editable: false,
            active: cycle.currentStepIndex == 1,
            done: cycle.currentStepIndex > 1,
          ),
          Gaps.vGap9,
          _CycleRow(
            index: '٣',
            title: Translate.s.create_request_cycle_late_fee,
            subtitle: Translate.s.create_request_cycle_late_fee_sub(
              _percent(cycle.lateFeePercent),
              _money(cycle.lateFeeAmount),
            ),
            editable: false,
            active: cycle.currentStepIndex == 2,
            done: cycle.currentStepIndex > 2,
          ),
        ],
      ),
    );
  }
}

class _CycleRow extends StatelessWidget {
  final String index;
  final String title;
  final String subtitle;
  final bool editable;
  final bool active;
  final bool done;

  const _CycleRow({
    required this.index,
    required this.title,
    required this.subtitle,
    required this.editable,
    required this.active,
    required this.done,
  });

  @override
  Widget build(BuildContext context) {
    final Color badgeColor;
    if (active) {
      badgeColor = context.colors.button;
    } else if (done) {
      badgeColor = context.colors.green;
    } else {
      badgeColor = context.colors.surface3;
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 28,
          height: 28,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: badgeColor,
            borderRadius: AppRadius.chipAll,
          ),
          child: Text(
            index,
            style: AppTextStyle.caption(
              color: active ? context.colors.onButton : context.colors.text,
            ),
          ),
        ),
        Gaps.hGap9,
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(title, style: AppTextStyle.body(color: context.colors.text)),
                  ),
                  Text(
                    editable
                        ? Translate.s.create_request_editable
                        : Translate.s.create_request_admin_locked,
                    style: AppTextStyle.micro(
                      color: editable ? context.colors.green : context.colors.text3,
                    ),
                  ),
                ],
              ),
              Gaps.vGap4,
              Text(subtitle, style: AppTextStyle.caption(color: context.colors.text2)),
            ],
          ),
        ),
      ],
    );
  }
}
