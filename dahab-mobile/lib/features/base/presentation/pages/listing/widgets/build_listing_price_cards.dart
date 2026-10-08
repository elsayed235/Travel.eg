part of 'listing_widgets_imports.dart';

class BuildListingPriceCards extends StatelessWidget {
  final ListingDetailDomainModel detail;
  final ListingController controller;

  const BuildListingPriceCards({
    super.key,
    required this.detail,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: controller.modeIndexObs,
      builder: (context, mode) {
        final children = <Widget>[];
        if (detail.allowsRent) {
          children.add(
            Expanded(
              child: _PriceCard(
                label: Translate.s.listing_rent,
                amount: detail.rentPrice,
                unit: detail.rentUnit,
                selected: mode == 0,
                onTap: () => controller.onModeChanged(0),
              ),
            ),
          );
        }
        if (detail.allowsRent && detail.allowsBuy) {
          children.add(Gaps.hGap9);
        }
        if (detail.allowsBuy) {
          children.add(
            Expanded(
              child: _PriceCard(
                label: Translate.s.listing_buy,
                amount: detail.buyPrice,
                unit: detail.buyUnit,
                selected: mode == 1 || !detail.allowsRent,
                onTap: () => controller.onModeChanged(detail.allowsRent ? 1 : 0),
              ),
            ),
          );
        }
        return Row(children: children);
      },
    );
  }
}

class _PriceCard extends StatelessWidget {
  final String label;
  final num amount;
  final String unit;
  final bool selected;
  final VoidCallback onTap;

  const _PriceCard({
    required this.label,
    required this.amount,
    required this.unit,
    required this.selected,
    required this.onTap,
  });

  static const _radius = BorderRadius.all(Radius.circular(14));

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Semantics(
      selected: selected,
      button: true,
      child: Material(
        color: colors.surface1,
        borderRadius: _radius,
        child: InkWell(
          onTap: onTap,
          borderRadius: _radius,
          splashFactory: NoSplash.splashFactory,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOutCubic,
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              borderRadius: _radius,
              border: Border.all(
                color: selected ? colors.text : colors.line,
                width: selected ? 1.5 : 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(label, style: AppTextStyle.s13_w500(color: colors.text2)),
                    ),
                    AnimatedScale(
                      scale: selected ? 1 : 0,
                      duration: const Duration(milliseconds: 200),
                      curve: Curves.easeOutBack,
                      child: Icon(Icons.check_circle_rounded, size: 18, color: colors.text),
                    ),
                  ],
                ),
                Gaps.vGap6,
                AppPrice(
                  amount: amount,
                  unit: unit,
                  alignment: CrossAxisAlignment.start,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
