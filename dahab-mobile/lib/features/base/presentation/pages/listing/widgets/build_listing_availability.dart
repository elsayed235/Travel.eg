part of 'listing_widgets_imports.dart';

class BuildListingAvailability extends StatelessWidget {
  final ListingDetailDomainModel detail;
  final ListingController controller;

  const BuildListingAvailability({
    super.key,
    required this.detail,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    final monthLabel = DateFormat.MMMM('ar').format(detail.month);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                Translate.s.listing_availability(monthLabel),
                style: AppTextStyle.sectionTitle(color: context.colors.text),
              ),
            ),
            Text(
              Translate.s.listing_stock(
                detail.stockAvailable.toArabicDigits,
                detail.stockTotal.toArabicDigits,
              ),
              style: AppTextStyle.caption(color: context.colors.text2),
            ),
          ],
        ),
        Gaps.vGap13,
        ObsValueConsumer(
          observable: controller.selectedDateObs,
          builder: (context, selected) {
            return AppAvailabilityCalendar(
              month: detail.month,
              data: detail.availability,
              selected: selected,
              onPick: controller.onPickDate,
            );
          },
        ),
      ],
    );
  }
}
