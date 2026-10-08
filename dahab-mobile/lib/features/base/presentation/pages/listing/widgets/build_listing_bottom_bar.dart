part of 'listing_widgets_imports.dart';

class BuildListingBottomBar extends StatelessWidget {
  final ListingDetailDomainModel detail;
  final ListingController controller;

  const BuildListingBottomBar({
    super.key,
    required this.detail,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsetsDirectional.only(
        start: AppSpacing.xl,
        end: AppSpacing.xl,
        top: AppSpacing.lg,
        bottom: MediaQuery.paddingOf(context).bottom + AppSpacing.lg,
      ),
      decoration: BoxDecoration(
        color: context.colors.bg,
        border: Border(top: BorderSide(color: context.colors.line)),
      ),
      child: ObsValueConsumer(
        observable: controller.modeIndexObs,
        builder: (context, _) {
          final total = controller.totalFor(detail);
          return Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    Translate.s.listing_listed_total,
                    style: AppTextStyle.caption(color: context.colors.text2),
                  ),
                  Gaps.vGap4,
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 220),
                    transitionBuilder: (child, anim) => FadeTransition(
                      opacity: anim,
                      child: SlideTransition(
                        position: Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero)
                            .animate(anim),
                        child: child,
                      ),
                    ),
                    child: Text(
                      '${total.toArabicDigits} ${Translate.s.offers_currency}',
                      key: ValueKey(total),
                      style: AppTextStyle.price(color: context.colors.text),
                    ),
                  ),
                ],
              ),
              Gaps.hGap13,
              Expanded(
                child: Material(
                  color: context.colors.button,
                  borderRadius: const BorderRadius.all(Radius.circular(14)),
                  child: InkWell(
                    onTap: () => controller.openOfferSheet(context, detail),
                    borderRadius: const BorderRadius.all(Radius.circular(14)),
                    splashFactory: NoSplash.splashFactory,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg + 3),
                      child: Text(
                        detail.isRequest
                            ? Translate.s.listing_fulfill_cta
                            : Translate.s.listing_offer_cta,
                        textAlign: TextAlign.center,
                        style: AppTextStyle.sectionTitle(color: context.colors.onButton),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
