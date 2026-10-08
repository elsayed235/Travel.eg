part of 'listing_widgets_imports.dart';

/// Suggested offer price from accepted offers nearby, under the price field.
class BuildListingPriceSuggestion extends StatelessWidget {
  final ObsValue<PriceGuidanceDomainModel?> guidanceObs;
  final ValueChanged<num> onApply;

  const BuildListingPriceSuggestion({
    super.key,
    required this.guidanceObs,
    required this.onApply,
  });

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: guidanceObs,
      builder: (context, guidance) {
        if (guidance == null) return const SizedBox.shrink();
        return Padding(
          padding: const EdgeInsets.only(top: AppSpacing.sm),
          child: Row(
            children: [
              Icon(Icons.auto_awesome_outlined, size: 14, color: context.colors.green),
              Gaps.hGap6,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      Translate.s.ai_price_suggest(
                        guidance.min.toArabicDigits,
                        guidance.max.toArabicDigits,
                        Translate.s.offers_currency,
                      ),
                      style: AppTextStyle.caption(color: context.colors.text),
                    ),
                    Text(
                      Translate.s.ai_price_based_on(guidance.sampleSize.toArabicDigits),
                      style: AppTextStyle.micro(color: context.colors.text3),
                    ),
                  ],
                ),
              ),
              TextButton(
                onPressed: () => onApply(guidance.suggested),
                child: Text(
                  Translate.s.ai_price_apply(guidance.suggested.toArabicDigits),
                  style: AppTextStyle.caption(color: context.colors.green),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
