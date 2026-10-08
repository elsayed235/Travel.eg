part of '../account_my_listing_detail_imports.dart';

class BuildListingTimeline extends StatelessWidget {
  final List<OrderTimelineStepLite> steps;

  const BuildListingTimeline({super.key, required this.steps});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var i = 0; i < steps.length; i++)
          _ListingTimelineTile(
            step: steps[i],
            isLast: i == steps.length - 1,
          ),
      ],
    );
  }
}

class _ListingTimelineTile extends StatelessWidget {
  final OrderTimelineStepLite step;
  final bool isLast;

  const _ListingTimelineTile({required this.step, required this.isLast});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final Color dotColor;
    if (step.current) {
      dotColor = colors.button;
    } else if (step.done) {
      dotColor = colors.green;
    } else {
      dotColor = colors.line2;
    }

    final timeText = step.at == null
        ? null
        : DateFormat('d MMM · h:mm a', 'ar').format(step.at!).toArabicDigits;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 22,
            child: Column(
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: step.done || step.current ? dotColor : colors.bg,
                    shape: BoxShape.circle,
                    border: Border.all(color: dotColor, width: 2),
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      margin: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
                      color: step.done ? colors.green.withValues(alpha: 0.35) : colors.line,
                    ),
                  ),
              ],
            ),
          ),
          Gaps.hGap13,
          Expanded(
            child: Padding(
              padding: EdgeInsetsDirectional.only(bottom: isLast ? 0 : AppSpacing.xl),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    step.title,
                    style: AppTextStyle.itemTitle(
                      color: step.done || step.current ? colors.text : colors.text3,
                    ),
                  ),
                  if (step.subtitle != null) ...[
                    Gaps.vGap4,
                    Text(
                      step.subtitle!,
                      style: AppTextStyle.caption(color: colors.text2),
                    ),
                  ],
                  if (timeText != null) ...[
                    Gaps.vGap4,
                    Text(
                      timeText,
                      style: AppTextStyle.micro(color: colors.text3),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
