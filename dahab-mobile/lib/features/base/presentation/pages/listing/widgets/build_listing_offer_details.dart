part of 'listing_widgets_imports.dart';

class BuildListingOfferDetails extends StatelessWidget {
  final ListingDetailDomainModel detail;

  const BuildListingOfferDetails({super.key, required this.detail});

  String _dealLabel() {
    return switch (detail.dealType) {
      ListingDealType.rent => Translate.s.listing_rent,
      ListingDealType.buy => Translate.s.listing_buy,
      ListingDealType.both => Translate.s.create_request_deal_both,
    };
  }

  String _payerLabel() {
    return switch (detail.moneyCycle.insurancePayer) {
      ListingInsurancePayer.requester =>
        Translate.s.create_request_insurance_payer_requester,
      ListingInsurancePayer.owner =>
        Translate.s.create_request_insurance_payer_owner,
    };
  }

  String _paymentLabel() {
    return switch (detail.moneyCycle.paymentMethod) {
      ListingPaymentMethod.online => Translate.s.create_request_payment_online,
      ListingPaymentMethod.cash => Translate.s.create_request_payment_cash,
    };
  }

  String _money(num amount) => '${amount.toArabicDigits} ${Translate.s.offers_currency}';

  String _percent(double value) => '${value.toArabicDigits}٪';

  @override
  Widget build(BuildContext context) {
    final cycle = detail.moneyCycle;
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
            detail.isRequest
                ? Translate.s.listing_request_details_title
                : Translate.s.listing_offer_details_title,
            style: AppTextStyle.sectionTitle(color: context.colors.text),
          ),
          Gaps.vGap6,
          Text(
            detail.isRequest
                ? Translate.s.listing_request_details_hint
                : Translate.s.listing_offer_details_hint,
            style: AppTextStyle.caption(color: context.colors.text2),
          ),
          Gaps.vGap13,
          Wrap(
            spacing: AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              AppMarketSideBadge(side: detail.side, compact: true),
              _InfoChip(label: _dealLabel()),
              _InfoChip(label: detail.categoryName),
              if (detail.ownerVerified)
                _InfoChip(label: Translate.s.offers_verified, emphasis: true),
              _InfoChip(label: detail.city),
            ],
          ),
          Gaps.vGap13,
          _MetaRow(
            label: detail.isRequest
                ? Translate.s.market_side_requester_prefix
                : Translate.s.listing_owner_label,
            value: detail.shopName,
          ),
          Gaps.vGap9,
          _MetaRow(
            label: Translate.s.create_request_payment_title,
            value: _paymentLabel(),
          ),
          Gaps.vGap9,
          _MetaRow(
            label: Translate.s.create_request_delivery_title,
            value: detail.deliveryLabel,
          ),
          Gaps.vGap9,
          _MetaRow(
            label: Translate.s.listing_min_qty_label,
            value: '${detail.minQuantity.toArabicDigits} ${detail.quantityUnit}',
          ),
          Gaps.vGap18,
          Text(
            Translate.s.create_request_cycle_title,
            style: AppTextStyle.body(color: context.colors.text),
          ),
          Gaps.vGap9,
          _CycleLine(
            title: Translate.s.create_request_cycle_insurance,
            subtitle: Translate.s.create_request_cycle_insurance_sub(
              _payerLabel(),
              '${_percent(cycle.insurancePercent)} · ${_money(cycle.insuranceAmount)}',
            ),
            editable: true,
          ),
          Gaps.vGap9,
          _CycleLine(
            title: Translate.s.create_request_cycle_deposit,
            subtitle: Translate.s.create_request_cycle_deposit_sub(
              _percent(cycle.depositPercent),
              _money(cycle.depositAmount),
            ),
            editable: false,
          ),
          Gaps.vGap9,
          _CycleLine(
            title: Translate.s.create_request_cycle_late_fee,
            subtitle: Translate.s.create_request_cycle_late_fee_sub(
              _percent(cycle.lateFeePercent),
              _money(cycle.lateFeeAmount),
            ),
            editable: false,
          ),
          if (detail.hashtags.isNotEmpty) ...[
            Gaps.vGap13,
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                for (final tag in detail.hashtags) _InfoChip(label: tag),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final String label;
  final bool emphasis;

  const _InfoChip({required this.label, this.emphasis = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: emphasis ? context.colors.amberBg : context.colors.surface2,
        borderRadius: AppRadius.chipAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Text(
        label,
        style: AppTextStyle.caption(
          color: emphasis ? context.colors.amber : context.colors.text2,
        ),
      ),
    );
  }
}

class _MetaRow extends StatelessWidget {
  final String label;
  final String value;

  const _MetaRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 2,
          child: Text(label, style: AppTextStyle.caption(color: context.colors.text2)),
        ),
        Expanded(
          flex: 3,
          child: Text(value, style: AppTextStyle.body(color: context.colors.text)),
        ),
      ],
    );
  }
}

class _CycleLine extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool editable;

  const _CycleLine({
    required this.title,
    required this.subtitle,
    required this.editable,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
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
    );
  }
}
