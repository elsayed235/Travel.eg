part of '../user_public_profile_imports.dart';

/// AI summary of a user's reviews (generated overnight on the backend).
class BuildReviewSummaryCard extends StatelessWidget {
  final ReviewSummaryDomainModel summary;

  const BuildReviewSummaryCard({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: context.colors.surface1,
        borderRadius: AppRadius.cardAll,
        border: Border.all(color: context.colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.auto_awesome, size: 16, color: context.colors.green),
              Gaps.hGap6,
              Text(
                Translate.s.ai_review_summary_title,
                style: AppTextStyle.itemTitle(color: context.colors.text),
              ),
            ],
          ),
          Gaps.vGap9,
          Text(summary.summary, style: AppTextStyle.body(color: context.colors.text)),
          if (summary.highlights.isNotEmpty) ...[
            Gaps.vGap9,
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: [
                for (final h in summary.highlights)
                  AppChip(label: h, kind: AppChipKind.available),
              ],
            ),
          ],
          Gaps.vGap9,
          Text(
            Translate.s.ai_review_summary_based_on(summary.basedOnCount.toLocaleDigits),
            style: AppTextStyle.micro(color: context.colors.text3),
          ),
        ],
      ),
    );
  }
}
