part of '../experiences_imports.dart';

/// "Today in Dahab" rail card: the photo, what it is, how long, the price.
class BuildExperienceCard extends StatelessWidget {
  final Experience experience;
  final double width;

  const BuildExperienceCard({super.key, required this.experience, this.width = 232});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final arabic = context.isArabic;
    final e = experience;
    final meta = [
      ExperienceFit.duration(e.durationMinutes),
      if (e.place != null) e.place!.name(arabic),
    ].where((s) => s.isNotEmpty).join(' · ');
    return XpPressable(
      onTap: () => openExperience(context, e),
      child: SizedBox(
        width: width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: AppRadius.cardAll,
              child: SizedBox(
                height: 148,
                width: width,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    RehlaPhoto(webPath: e.webPhoto, asset: e.assetPhoto),
                    if (e.bookable.cancellationHours != null)
                      PositionedDirectional(
                        top: AppSpacing.md,
                        start: AppSpacing.md,
                        child: XpChip(label: Translate.s.xp_free_cancel, onImage: true),
                      ),
                  ],
                ),
              ),
            ),
            Gaps.vGap8,
            Text(
              e.title(arabic),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: AppTextStyle.s14_w600(color: colors.text).copyWith(height: 1.3),
            ),
            Gaps.vGap4,
            Text(meta, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppTextStyle.caption(color: colors.text3)),
            Gaps.vGap4,
            XpPrice(experience: e, size: 15),
          ],
        ),
      ),
    );
  }
}
