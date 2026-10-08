part of 'listing_widgets_imports.dart';

/// Typical accepted price for similar deals nearby, from the AI gateway.
/// Hidden until there is enough data.
class BuildListingAiPrice extends StatelessWidget {
  final ObsValue<PriceGuidanceDomainModel?> guidanceObs;

  const BuildListingAiPrice({super.key, required this.guidanceObs});

  @override
  Widget build(BuildContext context) {
    return ObsValueConsumer(
      observable: guidanceObs,
      builder: (context, guidance) {
        return AnimatedSize(
          duration: const Duration(milliseconds: 260),
          curve: Curves.easeOutCubic,
          alignment: AlignmentDirectional.topStart,
          child: guidance == null
              ? const SizedBox(width: double.infinity)
              : Padding(
                  padding: const EdgeInsets.only(top: AppSpacing.md),
                  child: _AiPriceCard(guidance: guidance),
                ),
        );
      },
    );
  }
}

class _AiPriceCard extends StatelessWidget {
  final PriceGuidanceDomainModel guidance;

  const _AiPriceCard({required this.guidance});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: colors.greenBg,
        borderRadius: const BorderRadius.all(Radius.circular(14)),
      ),
      child: Row(
        children: [
          Icon(Icons.auto_awesome, size: 18, color: colors.green),
          Gaps.hGap9,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  Translate.s.ai_price_range(
                    guidance.min.toArabicDigits,
                    guidance.max.toArabicDigits,
                    Translate.s.offers_currency,
                  ),
                  style: AppTextStyle.s13_w500(color: colors.text),
                ),
                Gaps.vGap4,
                Text(
                  Translate.s.ai_price_based_on(guidance.sampleSize.toArabicDigits),
                  style: AppTextStyle.micro(color: colors.text2),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
