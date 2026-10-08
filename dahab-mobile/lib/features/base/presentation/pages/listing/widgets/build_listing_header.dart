part of 'listing_widgets_imports.dart';

/// Title, the key facts as icon chips, and who posted it.
class BuildListingHeader extends StatelessWidget {
  final ListingDetailDomainModel detail;
  final VoidCallback? onOwnerTap;

  const BuildListingHeader({
    super.key,
    required this.detail,
    this.onOwnerTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final facts = [
      (Icons.inventory_2_outlined, '${detail.quantity.toArabicDigits} ${detail.quantityUnit}'),
      (Icons.auto_awesome_mosaic_outlined, detail.condition),
      (Icons.location_on_outlined, detail.city),
      (Icons.local_shipping_outlined, detail.deliveryLabel),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            AppMarketSideBadge(side: detail.side, compact: true),
            Gaps.hGap8,
            Text(detail.categoryName, style: AppTextStyle.caption(color: colors.text2)),
          ],
        ),
        Gaps.vGap9,
        Text(
          detail.title,
          style: AppTextStyle.h3(color: colors.text).copyWith(fontWeight: FontWeight.w700),
        ),
        Gaps.vGap13,
        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: [
            for (final (icon, label) in facts)
              if (label.trim().isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs + 1),
                  decoration: BoxDecoration(
                    color: colors.surface2,
                    borderRadius: const BorderRadius.all(Radius.circular(20)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(icon, size: 14, color: colors.text2),
                      Gaps.hGap4,
                      Text(label, style: AppTextStyle.caption(color: colors.text)),
                    ],
                  ),
                ),
          ],
        ),
        Gaps.vGap16,
        _OwnerRow(detail: detail, onTap: onOwnerTap),
      ],
    );
  }
}

class _OwnerRow extends StatelessWidget {
  final ListingDetailDomainModel detail;
  final VoidCallback? onTap;

  const _OwnerRow({required this.detail, this.onTap});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final name = detail.shopName.trim();
    final initial = name.isEmpty ? '؟' : name.characters.first;
    return Material(
      color: colors.surface1,
      shape: RoundedRectangleBorder(
        borderRadius: const BorderRadius.all(Radius.circular(14)),
        side: BorderSide(color: colors.line),
      ),
      child: InkWell(
        onTap: onTap,
        customBorder: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(14)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                alignment: Alignment.center,
                decoration: BoxDecoration(color: colors.surface3, shape: BoxShape.circle),
                child: Text(initial, style: AppTextStyle.h4(color: colors.text)),
              ),
              Gaps.hGap12,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      detail.isRequest ? Translate.s.market_side_requester_prefix : Translate.s.listing_owner_label,
                      style: AppTextStyle.micro(color: colors.text2),
                    ),
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            name,
                            style: AppTextStyle.s14_w500(color: colors.text),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (detail.ownerVerified) ...[
                          Gaps.hGap4,
                          Icon(Icons.verified_rounded, size: 15, color: colors.green),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              if (detail.isOffer && detail.ratingCount > 0) ...[
                AppRating(value: detail.rating, count: detail.ratingCount),
                Gaps.hGap8,
              ],
              if (onTap != null)
                Icon(Icons.chevron_right_rounded, size: 20, color: colors.text3),
            ],
          ),
        ),
      ),
    );
  }
}
